from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from db import db

router = APIRouter()

# Access the user_goals collection
user_goals_collection = db["user_goals"]

# Pydantic model for a goal
class Goal(BaseModel):
    user_id: str
    goal_name: str
    goal_cost: float
    total_months: int
    monthly_requirement: float
    savings: float = 0.0
    status: str = "notmet"

# Pydantic model for updating savings
class UpdateSavings(BaseModel):
    goal_id: str
    savings: float

@router.post("/goals")
async def add_goal(goal: Goal):
    try:
        # Calculate the time of submission
        submission_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Create a unique goal_id
        goal_id = f"{goal.user_id}_{int(datetime.now().timestamp())}"

        # Prepare the goal document
        goal_document = {
            "goal_id": goal_id,
            "goal_name": goal.goal_name,
            "goal_cost": goal.goal_cost,
            "total_months": goal.total_months,
            "monthly_requirement": goal.monthly_requirement,
            "savings": goal.savings,
            "submission_time": submission_time,
            "status": goal.status,
        }

        # Check if the user already exists in the collection
        user = await user_goals_collection.find_one({"user_id": goal.user_id})
        if user:
            # Append the new goal to the user's goals array
            await user_goals_collection.update_one(
                {"user_id": goal.user_id},
                {"$push": {"goals": goal_document}}
            )
        else:
            # Create a new user document with the goal
            await user_goals_collection.insert_one({
                "user_id": goal.user_id,
                "goals": [goal_document]
            })

        return {"message": "Goal added successfully", "goal_id": goal_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/goals/{user_id}")
async def get_user_goals(user_id: str):
    try:
        # Fetch the user's goals from the database
        user = await user_goals_collection.find_one({"user_id": user_id})
        if not user:
            return {"message": "No goals found for this user", "goals": []}

        return {"message": "Goals fetched successfully", "goals": user.get("goals", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/goals/update-savings")
async def update_goal_savings(update: UpdateSavings):
    try:
        # Find the user document containing the goal
        user = await user_goals_collection.find_one({"goals.goal_id": update.goal_id})
        if not user:
            raise HTTPException(status_code=404, detail="Goal not found")

        # Update the savings for the specific goal
        await user_goals_collection.update_one(
            {"goals.goal_id": update.goal_id},
            {"$set": {"goals.$.savings": update.savings}}
        )

        return {"message": "Savings updated successfully", "goal_id": update.goal_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str):
    try:
        # Find the user document containing the goal
        user = await user_goals_collection.find_one({"goals.goal_id": goal_id})
        if not user:
            raise HTTPException(status_code=404, detail="Goal not found")

        # Remove the goal from the user's goals array
        await user_goals_collection.update_one(
            {"goals.goal_id": goal_id},
            {"$pull": {"goals": {"goal_id": goal_id}}}
        )

        return {"message": "Goal deleted successfully", "goal_id": goal_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))