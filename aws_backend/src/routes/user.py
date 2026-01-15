from bson.objectid import ObjectId
from db import collections
from pymongo.errors import DuplicateKeyError

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

def create_user(data: dict):
    email = data.get("email")
    if not email or not isinstance(email, str):
        return 400, {"error": "Missing or invalid email"}

    email = email.strip().lower()

    name = data.get("name")
    img = data.get("img")

    col = collections()["users"]

    # Defaults only on first create
    set_on_insert = {
        "admin": False,
        "email": email,
        "points": 0,
        "position": "Member",
        # IMPORTANT: don't put name/img here if you're also $set-ing them
    }

    # Updates on every login (only if provided)
    set_updates = {}
    if isinstance(name, str) and name.strip():
        set_updates["name"] = name.strip()
    if isinstance(img, str) and img.strip():
        set_updates["img"] = img.strip()

    update_doc = {"$setOnInsert": set_on_insert}
    if set_updates:
        update_doc["$set"] = set_updates

    col.update_one({"email": email}, update_doc, upsert=True)

    user = col.find_one({"email": email})
    return 200, {"ok": True, "user_id": str(user["_id"])}

# function to delete specific user
def delete_user(user_id: str):
    col = collections()["users"]
    result = col.delete_one({"_id" : ObjectId(user_id)})
    if result.deleted_count == 0:
        return 404, {"error": "Event not found"}
    return 200, {"ok": True}
