from pymongo import MongoClient
import os

def get_db_connection():
    db_uri = os.getenv("DB_URI")
    client = MongoClient(db_uri)
    return client.get_default_database()  # Returns the default database from the URI

# Example usage:
# db = get_db_connection()