from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from db import db

router = APIRouter()

user_transactions_collection = db["transactions"]
user_goals_collection = db["user_goals"]

class Transaction(BaseModel):
    user_id: str
    transaction_id: str
    date: str
    category: str
    amount: float
    notes: str
    to: str = None  
    roundUpValue: float
    spent: float

@router.post("/transactions")
async def add_transaction(transaction: Transaction):
    """
    Add a new transaction for a user and update user goals.
    """
    try:
        transaction_id = transaction.transaction_id or f"{transaction.user_id}_{int(datetime.now().timestamp())}"

        transaction_document = {
            "transaction_id": transaction_id,
            "date": transaction.date,
            "category": transaction.category,
            "amount": transaction.amount,
            "notes": transaction.notes,
            "to": transaction.to,
        }

        user = await user_transactions_collection.find_one({"userId": transaction.user_id})
        if user:
            await user_transactions_collection.update_one(
                {"userId": transaction.user_id},
                {"$push": {"transactions": transaction_document}}
            )
        else:
            await user_transactions_collection.insert_one({
                "userId": transaction.user_id,
                "transactions": [transaction_document]
            })

        user_goals = await user_goals_collection.find_one({"userId": transaction.user_id})
        if not user_goals:
            raise HTTPException(status_code=404, detail="User goals not found")

        updated_roundUpSavings = user_goals.get("roundUpSavings", 0) + transaction.roundUpValue
        updated_totalSavings = user_goals.get("totalSavings", 0) + transaction.roundUpValue
        updated_balance = user_goals.get("balance", 0) - transaction.spent

        await user_goals_collection.update_one(
            {"userId": transaction.user_id},
            {
                "$set": {
                    "roundUpSavings": updated_roundUpSavings,
                    "totalSavings": updated_totalSavings,
                    "balance": updated_balance,
                }
            }
        )

        return {
            "message": "Transaction added successfully and user goals updated",
            "transaction_id": transaction_id,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions/{user_id}")
async def get_user_transactions(user_id: str):
    """
    Fetch all transactions for a specific user.
    """
    try:
        user = await user_transactions_collection.find_one({"userId": user_id})
        if not user:
            return {"message": "No transactions found for this user", "transactions": []}

        return {"message": "Transactions fetched successfully", "transactions": user.get("transactions", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))