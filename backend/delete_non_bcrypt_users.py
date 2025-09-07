import os
from dotenv import load_dotenv
from pymongo import MongoClient
from passlib.hash import bcrypt

load_dotenv()
client = MongoClient(os.getenv("DB_URI"))
db = client[os.getenv("DB_NAME")]
users = db.users

def is_bcrypt_hash(pw):
    if not pw or not isinstance(pw, str):
        return False
    try:
        return bcrypt.identify(pw)
    except Exception:
        return False

# Find users with invalid bcrypt password
invalid_users = list(users.find({}))
to_delete = []
for user in invalid_users:
    pw = user.get("password", "")
    if not is_bcrypt_hash(pw):
        to_delete.append(user["_id"])

if to_delete:
    result = users.delete_many({"_id": {"$in": to_delete}})
    print(f"Deleted {result.deleted_count} users with invalid passwords.")
else:
    print("No users with invalid passwords found.")
