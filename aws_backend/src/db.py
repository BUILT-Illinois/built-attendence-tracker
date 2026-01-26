import os
from pymongo import MongoClient

_client = None

def get_client():
    global _client
    if _client is None:
        _client = MongoClient(os.environ["ATLAS_URI"])
    return _client

def get_db():
    return get_client()["attendance"]

def collections():
    db = get_db()
    return {
        "users": db["user"],
        "events": db["events"],
        "checkins": db["check"],
    }
