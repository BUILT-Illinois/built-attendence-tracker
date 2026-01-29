from bson.objectid import ObjectId
from bson.errors import InvalidId
from pymongo.errors import DuplicateKeyError
from datetime import datetime, timezone

from db import collections

def create_checkin(data: dict):
    user_id = data.get("user_id")
    event_id = data.get("event_id")

    if not user_id or not event_id:
        return 400, {"error": "user_id and event_id are required"}

    try:
        user_oid = ObjectId(user_id)
        event_oid = ObjectId(event_id)
    except (InvalidId, TypeError):
        return 400, {"error": "Invalid user_id or event_id"}

    cols = collections()
    users = cols["users"]
    events = cols["events"]
    checkins = cols["checkins"]

    # verify user + event exist
    user = users.find_one({"_id": user_oid})
    if not user:
        return 404, {"error": "User not found"}

    event = events.find_one({"_id": event_oid})
    if not event:
        return 404, {"error": "Event not found"}

    points = int(event.get("points", 0))
    timestamp = datetime.now(timezone.utc)

    doc = {
        "user_id": user_oid,
        "event_id": event_oid,
        "points": points,
        "timestamp": timestamp,
    }

    try:
        result = checkins.insert_one(doc)
    except DuplicateKeyError:
        return 409, {"error": "User already checked into this event"}

    # increment points on the user
    users.update_one({"_id": user_oid}, {"$inc": {"points": points}})

    return 201, {
        "ok": True,
        "checkin_id": str(result.inserted_id),
        "user_id": str(user_oid),
        "event_id": str(event_oid),
        "points": points,
        "timestamp": timestamp,
    }
