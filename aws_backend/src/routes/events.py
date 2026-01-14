import json
from bson.objectid import ObjectId
from db import collections
from datetime import datetime

def list_events():
    col = collections()["events"]
    docs = list(col.find({}))
    for d in docs:
        d["_id"] = str(d["_id"])
    return 200, docs

def get_event(event_id: str):
    col = collections()["events"]
    doc = col.find_one({"_id": ObjectId(event_id)})
    if not doc:
        return 404, {"error": "Event not found"}
    doc["_id"] = str(doc["_id"])
    return 200, doc

def delete_event(event_id: str):
    col = collections()["events"]
    result = col.delete_one({"_id": ObjectId(event_id)})
    if result.deleted_count == 0:
        return 404, {"error": "Event not found"}
    return 200, {"ok": True}

def _parse_date(value):
    # Expect ISO string like "2026-01-15T01:00:00Z"
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        v = value.replace("Z", "+00:00")
        return datetime.fromisoformat(v)
    raise ValueError("date must be an ISO string")

def create_event(data : dict):
    try:
        doc = {
            "name": str(data["name"]).strip(),
            "location": str(data.get("location", "")).strip() if data.get("location") else "",
            "date": _parse_date(data["date"]),
            "points": int(data["points"]),
            "leads": data.get("leads", []),
            "sponsor": data.get("sponsor", ""),
        }
    except (ValueError, TypeError) as e:
        return 400, {"error": str(e)}
    
    col = collections()["events"]
    result = col.insert_one(doc)

    return 201, {"ok": True, "event_id": str(result.inserted_id)}