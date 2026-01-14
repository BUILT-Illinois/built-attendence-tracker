from bson.objectid import ObjectId
from db import collections

# function to get all users
def list_users():
    col = collections()["users"]
    docs = list(col.find({}))
    for d in docs:
        d["_id"] = str(d["_id"])
    return 200, docs

# function to find a specific user by id
def get_user(user_id: str):
    col = collections()["users"]
    doc = col.find_one({"_id" : ObjectId(user_id)})
    if not doc:
        return 404, {"error": "User not found"}
    doc["_id"] = str(doc["_id"])
    return 200, doc

# function to delete specific user
def delete_user(user_id: str):
    col = collections()["users"]
    result = col.delete_one({"_id" : ObjectId(user_id)})
    if result.deleted_count == 0:
        return 404, {"error": "Event not found"}
    return 200, {"ok": True}