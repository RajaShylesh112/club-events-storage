import os
from dotenv import load_dotenv
from pymongo import MongoClient
from passlib.hash import bcrypt
from datetime import datetime

load_dotenv()
client = MongoClient(os.getenv("DB_URI"))
db = client[os.getenv("DB_NAME")]
users = db.users

now = datetime.utcnow().isoformat()

sample_users = [
    {
        "name": "Member One",
        "email": "member1@example.com",
        "role": "member",
        "google_sub": "",
        "created_at": now,
        "updated_at": now,
        "password": bcrypt.hash("memberpassword1"),
        "picture": "https://example.com/member1.png"
    },
    {
        "name": "Member Two",
        "email": "member2@example.com",
        "role": "member",
        "google_sub": "",
        "created_at": now,
        "updated_at": now,
        "password": bcrypt.hash("memberpassword2"),
        "picture": "https://example.com/member2.png"
    },
    {
        "name": "Core Member",
        "email": "coremember@example.com",
        "role": "core_member",
        "google_sub": "",
        "created_at": now,
        "updated_at": now,
        "password": bcrypt.hash("corepassword"),
        "picture": "https://example.com/coremember.png"
    },
    {
        "name": "Admin One",
        "email": "admin1@example.com",
        "role": "admin",
        "google_sub": "",
        "created_at": now,
        "updated_at": now,
        "password": bcrypt.hash("adminpassword1"),
        "picture": "https://example.com/admin1.png"
    },
    {
        "name": "Admin Two",
        "email": "admin2@example.com",
        "role": "admin",
        "google_sub": "",
        "created_at": now,
        "updated_at": now,
        "password": bcrypt.hash("adminpassword2"),
        "picture": "https://example.com/admin2.png"
    }
]

result = users.insert_many(sample_users)
print(f"Inserted user IDs: {result.inserted_ids}")
