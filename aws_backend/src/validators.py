from pymongo import MongoClient
import os

client = MongoClient(os.environ["ATLAS_URI"])
db = client["attendance"]

def apply_validator(collection_name, validator):
    try:
        db.command({
            "collMod": collection_name,
            "validator": validator,
            "validationLevel": "moderate",
            "validationAction": "error"
        })
        print(f"Updated validator on {collection_name}")
    except Exception:
        # If collection doesn't exist yet, create it with validator
        db.create_collection(
            collection_name,
            validator=validator,
            validationLevel="moderate",
            validationAction="error"
        )
        print(f"Created collection {collection_name} with validator")

# User Validation Schema
user_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["email"],
        "properties": {
            "admin": {
                "bsonType": "bool",
                "description": "whether a user is admin or not"
            },
            "email": {
                "bsonType": "string",
                "description": "'email' must be a string and is required"
            },
            "name": {
                "bsonType": "string",
                "description": "'name' must be a string"
            },
            "img": {
                "bsonType": "string",
                "description": "'img' must be a string"
            },
            "points": {
                "bsonType": "int",
                "minimum": 0,
                "description": "must be an integer 0 or greater"
            },
            "position": {
                "bsonType": "string"
            }
        }
    }
}
# Event Validation Schema
event_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name", "date", "points"],
        "properties": {
            "name": {
                "bsonType": "string",
                "description": "'name' must be a string and is required"
            },
            "location": {
                "bsonType": "string"
            },
            "date": {
                "bsonType": "date"
            },
            "points": {
                "bsonType": "int",
                "minimum": 0,
                "description": "must be an integer 0 or greater and is required"
            },
            "leads": {
                "bsonType": "array",
                "description": "must be an array",
                "maxItems": 25,
                "items": {
                    "bsonType": "string"
                }
            },
            "sponsor": {
                "bsonType": "string"
            }
        }
    }
}

# Check In Validation Schema
checkin_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["user_id", "event_id", "points"],
        "properties": {
            "user_id": {
                "bsonType": "objectId",
                "description": "id of the user who checked in"
            },
            "event_id": {
                "bsonType": "objectId",
                "description": "id of the event to check in to"
            },
            "points": {
                "bsonType": "int",
                "minimum": 0,
                "description": "must be an integer 0 or greater and is required"
            },
            "timestamp":
              {
                "description": "check-in time; can be a date or null (N/A)",
                "oneOf": [
                    {"bsonType": "date"},
                    {"bsonType": "null"}
                ]
            },
        }
    }
}

apply_validator("user", user_validator)
apply_validator("events", event_validator)
apply_validator("check", checkin_validator)

# make unique indexes
db["user"].create_index("email", unique=True)

# allow only one check in per user at event
db["check"].create_index([("user_id", 1), ("event_id", 1)], unique=True)