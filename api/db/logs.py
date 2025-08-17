from .connection import connect
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException

def add_logs(alert):
    client = connect()

    db = client.Cluster0

    logs_collection = db["logs"]

    alert_dict = alert.dict()
    alert_dict["created_at"] = datetime.utcnow()

    result = logs_collection.insert_one(alert_dict)
    return str(result.inserted_id)

def get_alerts(id):
    client = connect()

    db = client.Cluster0

    logs_collection = db["logs"]

    try:
        obj_id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    logs_cursor = logs_collection.find({"parent_id": id}, {"parent_id": 0})

    logs = list(logs_cursor)

    if not logs:
        return []
    for log in logs:
        log["_id"] = str(log["_id"])
        if "created_at" in log:
            log["created_at"] = log["created_at"].isoformat()

    return logs


