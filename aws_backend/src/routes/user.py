from bson.objectid import ObjectId

# function to find a specific user by id
def find_one_user(user_id):
    _id = ObjectId(event_id)

    result = user_collection.find({"_id": _id})

# function to get all users
def find_all_users():
    result = user_collection.find()

# function to delete specific user
def delete_user_by_id(user_id):
    _id = ObjectId(user_id)

    user_collection.delete_one({"_id": _id})