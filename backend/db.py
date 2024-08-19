import os
from pymongo import MongoClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DB_NAME = "pretarouler"

class Database:
    def __init__(self):
        self.client = MongoClient(MONGO_URL)
        self.db = self.client[DB_NAME]

    def get_collection(self, collection_name):
        return self.db[collection_name]

db = Database()
