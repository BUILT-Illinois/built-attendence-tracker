import json
from bson.objectid import ObjectId
from db import collections

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
