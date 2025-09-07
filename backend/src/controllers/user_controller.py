from bson import ObjectId
from config.db import get_db_connection

def get_all_users():
    db = get_db_connection()
    users = list(db.users.find({}, {"password": 0}))
    for u in users:
        u["id"] = str(u["_id"])
        u.pop("_id", None)
    return users

def update_user_role(user_id: str, role: str):
    db = get_db_connection()
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return None
    if user.get("role") == "admin":
        # Prevent changing admin role
        return "admin_locked"
    result = db.users.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": {"role": role}},
        return_document=True
    )
    if not result:
        return None
    result["id"] = str(result["_id"])
    result.pop("_id", None)
    result.pop("password", None)
    return result
