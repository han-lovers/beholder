import pymongo
from .connection import connect

def add_user(user):
    client = connect()

    db = client.Cluster0

    users_collection = db["users"]

    # Verify for existing user
    if existing_user(user["email"]):
        error = "Error: User already exists"
        return error

    try:
        users_collection.insert_one(user)
    except pymongo.errors.OperationFailure:
        error = "Error while inserting user into the collection"
        return error
    else:
        return None

def existing_user(email):
    client = connect()

    db = client.Cluster0

    users_collection = db["users"]
    existing_user = users_collection.find_one({"email": email})

    if existing_user:
        return True
    
    return False
