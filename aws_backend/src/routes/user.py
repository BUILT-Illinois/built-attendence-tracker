from bson.objectid import ObjectId
from bson.errors import InvalidId
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
    return 200, {
    "ok": True,
    "user_id": str(user["_id"]),
    "admin": bool(user.get("admin", False)),
    "points": int(user.get("points", 0)),
    "position": user.get("position", "Member"),
    "name": user.get("name", ""),
    "img": user.get("img", ""),
    }

# function to delete specific user
def delete_user(user_id: str):
    col = collections()["users"]
    result = col.delete_one({"_id" : ObjectId(user_id)})
    if result.deleted_count == 0:
        return 404, {"error": "Event not found"}
    return 200, {"ok": True}

def update_user(user_id: str, data: dict):
    # Validate ObjectId
    try:
        _id = ObjectId(user_id)
    except (InvalidId, TypeError):
        return 400, {"error": "Invalid user_id"}

    if not isinstance(data, dict) or not data:
        return 400, {"error": "Missing update data"}

    # Whitelist fields you allow updates for
    allowed = {"admin", "img", "points", "position"}

    update_fields = {}
    for key in allowed:
        if key in data:
            update_fields[key] = data[key]

    if not update_fields:
        return 400, {"error": "No valid fields to update"}

    # Coerce types to satisfy your schema
    try:
        if "admin" in update_fields:
            # JSON will usually send true/false (bool), but handle strings too
            val = update_fields["admin"]
            if isinstance(val, bool):
                update_fields["admin"] = val
            elif isinstance(val, str) and val.strip().lower() in ("true", "false"):
                update_fields["admin"] = val.strip().lower() == "true"
            else:
                return 400, {"error": "admin must be a boolean"}

        if "img" in update_fields:
            update_fields["img"] = str(update_fields["img"]).strip()

        if "points" in update_fields:
            update_fields["points"] = int(update_fields["points"])
            if update_fields["points"] < 0:
                return 400, {"error": "points must be >= 0"}

        if "position" in update_fields:
            update_fields["position"] = str(update_fields["position"]).strip()

    except (ValueError, TypeError) as e:
        return 400, {"error": str(e)}

    col = collections()["users"]
    result = col.update_one({"_id": _id}, {"$set": update_fields})

    if result.matched_count == 0:
        return 404, {"error": "User not found"}

    updated = col.find_one({"_id": _id})
    return 200, {"ok": True, "user": updated}