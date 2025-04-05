from fastapi import APIRouter, HTTPException
from bson import ObjectId
from pydantic import BaseModel
from db import users_collection

router = APIRouter()

class BalanceResponse(BaseModel):
    balance: int

@router.get("/users/{user_id}/balance", response_model=BalanceResponse)
async def get_user_balance(user_id: str):
    """
    Fetch the balance of a specific user by their user_id.
    """
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"balance": user.get("balance", 0)}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

@router.get("/users/balances")
async def get_all_user_balances():
    """
    Fetch the balances of all users in the database.
    """
    try:
        users = users_collection.find()
        balances = [{"user_id": str(user["_id"]), "balance": user.get("balance", 0)} for user in users]
        return {"balances": balances}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching balances: {str(e)}")