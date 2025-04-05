from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from stock import predict_multiple_stocks, fetch_current_stock_values
from db import db, ping_database
from goals import router as goals_router
from fastapi.middleware.cors import CORSMiddleware
from chatbot import chat_prompt, classification_prompt
from services import *
from transactions import router as transactions_router  

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(goals_router, prefix="/api", tags=["goals"])

app.include_router(transactions_router, prefix="/api", tags=["transactions"])

collection = db["stock_predictions"]

class ChatRequest(BaseModel):
    user_prompt: str

class ClassificationRequest(BaseModel):
    transactions: list

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
    return {"cached": False, "predictions": all_predictions}

@app.post("/chat/{userId}")
async def chat_with_bot(userId: str, request: ChatRequest):
    try:
        response = await chat_prompt(request.user_prompt, userId)
        return {"response": response}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Chatbot error: {e}")

@app.post("/classify-transactions")
async def classify_transactions(request: ClassificationRequest):
    """
    Endpoint to classify transactions as essential payments or impulsive spending.
    """
    try:
        classified_data = await classification_prompt(request.transactions)
        return {"classified_data": classified_data}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error classifying transactions: {e}")

@app.get("/reports/latest/{userId}")
async def get_latest_report(userId: str):
    try:
        latest_report = await get_latest_month_report(userId)
        return {"latest_report": latest_report}
    except HTTPException as e:
        print(f"HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching latest report: {e}")

@app.get("/reports/{userId}/{year}/{month}")
async def get_report(userId: str, year: int, month: int):
    """
    Endpoint to fetch a specific report for a user by year and month.
    """
    try:
        report = await get_report_by_month_and_year(userId, year, month)
        return {"report": report}
    except HTTPException as e:
        print(f"HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching report: {e}")

@app.get("/reports/all/{userId}")
async def get_all_user_reports(userId: str):
    """
    Endpoint to fetch all reports for a user.
    """
    try:
        reports = await get_all_reports(userId)
        return {"reports": reports}
    except HTTPException as e:
        print(f"HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching all reports: {e}")
