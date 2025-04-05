from fastapi import HTTPException
from db import db
from bson.objectid import ObjectId

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

async def get_report_by_month_and_year(user_id: str, year: int, month: int):
    """
    Fetches a specific report for the given user_id, year, and month.
    """
    try:
        user_reports = await db.reports.find_one({"user_id": user_id})
        if not user_reports or not user_reports.get("reports"):
            raise HTTPException(status_code=404, detail="No reports found for the user")
        
        report = next(
            (r for r in user_reports["reports"] if r["year"] == year and r["month"] == month),
            None
        )
        
        if not report:
            raise HTTPException(status_code=404, detail="Report not found for the specified month and year")
        
        if "_id" in report and isinstance(report["_id"], ObjectId):
            report["_id"] = str(report["_id"])
        
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching report: {str(e)}")

async def get_all_reports(user_id: str):
    """
    Fetches all reports for the given user_id.
    """
    try:
        user_reports = await db.reports.find_one({"user_id": user_id})
        if not user_reports or not user_reports.get("reports"):
            raise HTTPException(status_code=404, detail="No reports found for the user")
        
        reports = user_reports["reports"]
        
        # Convert ObjectId to string if present
        for report in reports:
            if "_id" in report and isinstance(report["_id"], ObjectId):
                report["_id"] = str(report["_id"])
        
        return reports
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching all reports: {str(e)}")
