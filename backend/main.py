from fastapi import FastAPI
from datetime import datetime, timedelta
from stock import predict_multiple_stocks, fetch_current_stock_values
from db import db, ping_database

app = FastAPI()

collection = db["stock_predictions"]

@app.on_event("startup")
async def startup_event():
    try:
        await ping_database()
        collections = await db.list_collection_names()
        if "stock_predictions" not in collections:
            await db.create_collection("stock_predictions")
    except Exception as e:
        raise RuntimeError(f"Startup failed: {e}")

@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI!"}

@app.get("/predict")
async def get_predictions():
    symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA"]
    cutoff_time = datetime.utcnow() - timedelta(hours=12)

    cached_predictions_cursor = collection.find({"predicted_on": {"$gte": cutoff_time}})
    cached_predictions = await cached_predictions_cursor.to_list(length=None)
    cached_symbols = {doc["symbol"] for doc in cached_predictions}

    if len(cached_symbols) == len(symbols):
        current_values = fetch_current_stock_values(symbols)
        return {
            "cached": True,
            "predictions": {
                doc["symbol"]: {
                    "predictions": doc["predictions"],
                    "current_value": current_values.get(doc["symbol"])
                }
                for doc in cached_predictions
            }
        }

    missing_symbols = [symbol for symbol in symbols if symbol not in cached_symbols]
    new_predictions = predict_multiple_stocks(missing_symbols)

    for symbol, predictions in new_predictions.items():
        predictions_with_string_keys = {str(key): value for key, value in predictions.items()}
        await collection.update_one(
            {"symbol": symbol},
            {"$set": {"predicted_on": datetime.utcnow(), "predictions": predictions_with_string_keys}},
            upsert=True
        )

    all_predictions = {doc["symbol"]: doc["predictions"] for doc in cached_predictions}
    all_predictions.update(new_predictions)

    current_values = fetch_current_stock_values(symbols)

    return {
        "cached": False,
        "predictions": {
            symbol: {
                "predictions": all_predictions[symbol],
                "current_value": current_values.get(symbol)
            }
            for symbol in symbols
        }
    }