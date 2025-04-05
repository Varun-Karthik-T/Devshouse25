from fastapi import HTTPException
from db import db
from bson.objectid import ObjectId

async def get_months():
    """
    Returns all the months for which reports have been generated, sorted by the most recent.
    """
    try:
        months = await db.reports.find({}, {"month_id": 1, "_id": 0}).sort("month_id", -1).to_list(length=None)
        return [month["month_id"] for month in months]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching months: {str(e)}")


async def get_report(month_id: str):
    """
    Returns the report corresponding to the given month_id.
    """
    try:
        report = await db.reports.find_one({"month_id": month_id})
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching report: {str(e)}")


async def get_month_summary():
    """
    Returns a summary of all months, including the total number of reports and the most recent month.
    """
    try:
        months = await db.reports.find({}, {"month_id": 1, "_id": 0}).sort("month_id", -1).to_list(length=None)
        if not months:
            return {"total_reports": 0, "most_recent_month": None}
        most_recent_month = months[0]["month_id"]
        return {"total_reports": len(months), "most_recent_month": most_recent_month}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching month summary: {str(e)}")


async def get_latest_month_report(user_id: str):
    """
    Returns the latest report for the given user_id.
    """
    try:
        user_reports = await db.reports.find_one({"user_id": user_id})
        if not user_reports or not user_reports.get("reports"):
            raise HTTPException(status_code=404, detail="No reports found for the user")
        
        latest_report = max(
            user_reports["reports"],
            key=lambda report: (report["year"], report["month"])
        )
        
        if "_id" in latest_report and isinstance(latest_report["_id"], ObjectId):
            latest_report["_id"] = str(latest_report["_id"])
        
        return latest_report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching latest month report: {str(e)}")
    
async def get_user_goals(user_id: str):
    """
    Fetch all goals for a specific user.
    """
    try:
        user_goals = await db.user_goals.find_one({"user_id": user_id})
        if not user_goals:
            raise HTTPException(status_code=404, detail="User goals not found")
        return user_goals["goals"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user goals: {str(e)}")


async def get_goal_by_id(user_id: str, goal_id: str):
    """
    Fetch a specific goal by its ID for a user.
    """
    try:
        user_goals = await db.user_goals.find_one({"user_id": user_id})
        if not user_goals:
            raise HTTPException(status_code=404, detail="User goals not found")
        goal = next((goal for goal in user_goals["goals"] if goal["goal_id"] == goal_id), None)
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        return goal
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching goal: {str(e)}")


async def get_active_goals(user_id: str):
    """
    Fetch all active (not met) goals for a user.
    """
    try:
        user_goals = await db.user_goals.find_one({"user_id": user_id})
        if not user_goals:
            raise HTTPException(status_code=404, detail="User goals not found")
        active_goals = [goal for goal in user_goals["goals"] if goal["status"] == "notmet"]
        return active_goals
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching active goals: {str(e)}")


async def get_goal_summary(user_id: str):
    """
    Fetch a summary of goals for a user, including total goals and active goals.
    """
    try:
        user_goals = await db.user_goals.find_one({"user_id": user_id})
        if not user_goals:
            return {"total_goals": 0, "active_goals": 0}
        total_goals = len(user_goals["goals"])
        active_goals = len([goal for goal in user_goals["goals"] if goal["status"] == "notmet"])
        return {"total_goals": total_goals, "active_goals": active_goals}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching goal summary: {str(e)}")