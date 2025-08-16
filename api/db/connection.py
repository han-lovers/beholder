from dotenv import load_dotenv
import os

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

def connect():
    uri = str(os.getenv("MONGO_CONN_STRING"))

    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))

    return client