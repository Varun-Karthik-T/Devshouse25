from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from stock import predict_multiple_stocks
from db import db, ping_database
from chatbot import chat_prompt

app = FastAPI()

collection = db["stock_predictions"]

class ChatRequest(BaseModel):
    user_prompt: str

@app.on_event("startup")
async def startup_event():
    # Ensure the collection exists and ping the database
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


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}


@app.get("/predict")
async def get_predictions():
    symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA"]
    cutoff_time = datetime.utcnow() - timedelta(hours=12)

    # Check if predictions for all symbols are cached
    cached_predictions_cursor = collection.find({"predicted_on": {"$gte": cutoff_time}})
    cached_predictions = await cached_predictions_cursor.to_list(length=None)
    cached_symbols = {doc["symbol"] for doc in cached_predictions}

    if len(cached_symbols) == len(symbols):
        return {"cached": True, "predictions": {doc["symbol"]: doc["predictions"] for doc in cached_predictions}}

    # Generate predictions for missing symbols
    missing_symbols = [symbol for symbol in symbols if symbol not in cached_symbols]
    new_predictions = predict_multiple_stocks(missing_symbols)

    # Update the database with new predictions
    for symbol, predictions in new_predictions.items():
    # Convert integer keys in predictions to strings
        predictions_with_string_keys = {str(key): value for key, value in predictions.items()}
    
        await collection.update_one({"symbol": symbol},{"$set": {"predicted_on": datetime.utcnow(),"predictions": predictions_with_string_keys}},upsert=True)

    # Combine cached and new predictions
    all_predictions = {doc["symbol"]: doc["predictions"] for doc in cached_predictions}
    all_predictions.update(new_predictions)

    return {"cached": False, "predictions": all_predictions}

@app.post("/chat/{userId}")
async def chat_with_bot(userId: str, request: ChatRequest):
    try:
        response = chat_prompt(request.user_prompt, userId)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot error: {e}")
