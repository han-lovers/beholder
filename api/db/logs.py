from .connection import connect
from datetime import datetime

def add_logs(alert):
    client = connect()

    db = client.Cluster0

    logs_collection = db["logs"]

    alert_dict = alert.dict()
    alert_dict["created_at"] = datetime.utcnow()

    result = logs_collection.insert_one(alert_dict)
    return str(result.inserted_id)