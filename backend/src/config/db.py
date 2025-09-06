from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    db_uri = os.getenv("DB_URI")
    if not db_uri:
        raise ValueError("DB_URI environment variable not set")
    
    client = MongoClient(db_uri)
    # Use specific database name instead of default
    db_name = os.getenv("DB_NAME", "file-system")
    return client[db_name]

# Example usage:
# db = get_db_connection()