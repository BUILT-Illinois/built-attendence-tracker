import json
from bson.objectid import ObjectId
from bson.errors import InvalidId
from db import collections
from datetime import datetime


# -------------------------------
# Helpers
# -------------------------------

def _parse_date(value):
    """
    Accepts:
    - ISO string (with or without Z)
    - datetime
    Returns datetime
    """
    if isinstance(value, datetime):
        return value

    if isinstance(value, str):
        # handle trailing Z
        v = value.replace("Z", "+00:00")
        return datetime.fromisoformat(v)

    raise ValueError("date must be an ISO string")


def _serialize_event(doc):
    """
    Normalizes Mongo document for frontend:
    - ObjectId -> string
    - datetime -> ISO string
    """
    if not doc:
        return doc

    doc["_id"] = str(doc["_id"])

    if isinstance(doc.get("date"), datetime):
        doc["date"] = doc["date"].isoformat()

    return doc


# -------------------------------
# Routes
# -------------------------------

def list_events():
    col = collections()["events"]
    docs = list(col.find({}))

    for d in docs:
        _serialize_event(d)

    return 200, docs


def get_event(event_id: str):
    try:
        _id = ObjectId(event_id)
    except (InvalidId, TypeError):
        return 400, {"error": "Invalid event_id"}

    col = collections()["events"]
    doc = col.find_one({"_id": _id})

    if not doc:
        return 404, {"error": "Event not found"}

    _serialize_event(doc)
    return 200, doc


def delete_event(event_id: str):
    try:
        _id = ObjectId(event_id)
    except (InvalidId, TypeError):
        return 400, {"error": "Invalid event_id"}

    col = collections()["events"]
    result = col.delete_one({"_id": _id})

    if result.deleted_count == 0:
        return 404, {"error": "Event not found"}

    return 200, {"ok": True}


def create_event(data: dict):
    try:
        doc = {
            "name": str(data["name"]).strip(),
            "location": str(data.get("location", "")).strip(),
            "date": _parse_date(data["date"]),
            "points": int(data["points"]),
            "leads": data.get("leads", []),
            "sponsor": str(data.get("sponsor", "")).strip(),
        }
    except (KeyError, ValueError, TypeError) as e:
        return 400, {"error": str(e)}

    col = collections()["events"]
    result = col.insert_one(doc)

    created = col.find_one({"_id": result.inserted_id})
    _serialize_event(created)

    return 201, created


def update_event(event_id: str, data: dict):
    try:
        _id = ObjectId(event_id)
    except (InvalidId, TypeError):
        return 400, {"error": "Invalid event_id"}

    if not isinstance(data, dict) or not data:
        return 400, {"error": "Missing update data"}

    allowed = {"name", "location", "date", "points", "leads", "sponsor"}
    update_fields = {}

    for key in allowed:
        if key in data:
            update_fields[key] = data[key]

    if not update_fields:
        return 400, {"error": "No valid fields to update"}

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
            if not isinstance(update_fields["leads"], list):
                return 400, {"error": "leads must be an array"}
            update_fields["leads"] = [
                str(x).strip() for x in update_fields["leads"] if str(x).strip()
            ]
    except (ValueError, TypeError) as e:
        return 400, {"error": str(e)}

    col = collections()["events"]
    result = col.update_one({"_id": _id}, {"$set": update_fields})

    if result.matched_count == 0:
        return 404, {"error": "Event not found"}

    updated = col.find_one({"_id": _id})
    _serialize_event(updated)

    return 200, updated
