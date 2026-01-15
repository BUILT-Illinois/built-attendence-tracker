import json
from bson.objectid import ObjectId
from bson.errors import InvalidId
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

def update_event(event_id: str, data: dict):
    # Validate ObjectId
    try:
        _id = ObjectId(event_id)
    except (InvalidId, TypeError):
        return 400, {"error": "Invalid event_id"}

    if not isinstance(data, dict) or not data:
        return 400, {"error": "Missing update data"}

    # Whitelist fields you allow updates for
    allowed = {"name", "location", "date", "points", "leads", "sponsor"}

    update_fields = {}
    for key in allowed:
        if key in data:
            update_fields[key] = data[key]

    if not update_fields:
        return 400, {"error": "No valid fields to update"}

    # Type coercion to satisfy your Mongo validators
    try:
        if "name" in update_fields:
            update_fields["name"] = str(update_fields["name"]).strip()

        if "location" in update_fields:
            update_fields["location"] = str(update_fields["location"]).strip()

        if "sponsor" in update_fields:
            update_fields["sponsor"] = str(update_fields["sponsor"]).strip()

        if "points" in update_fields:
            update_fields["points"] = int(update_fields["points"])

        if "date" in update_fields:
            update_fields["date"] = _parse_date(update_fields["date"])

        if "leads" in update_fields:
            # Expect list of strings, match your schema
            leads = update_fields["leads"]
            if not isinstance(leads, list):
                return 400, {"error": "leads must be an array of strings"}
            update_fields["leads"] = [str(x).strip() for x in leads if str(x).strip()]
    except (ValueError, TypeError) as e:
        return 400, {"error": str(e)}

    col = collections()["events"]
    result = col.update_one({"_id": _id}, {"$set": update_fields})

    if result.matched_count == 0:
        return 404, {"error": "Event not found"}

    # Return the updated doc (nice for frontend)
    updated = col.find_one({"_id": _id})
    return 200, {"ok": True, "event": updated}