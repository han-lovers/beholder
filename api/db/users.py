import pymongo
from pymongo import ReturnDocument
from bson import ObjectId
from bson.errors import InvalidId
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

def get_user_id(email):
    client = connect()

    db = client.Cluster0

    users_collection = db["users"]
    user = users_collection.find_one({"email": email})

    return str(user["_id"])

def get_user_password(email):
    client = connect()

    db = client.Cluster0

    users_collection = db["users"]
    user = users_collection.find_one({"email": email})

    return str(user["password"])

def add_children_addresses(connector):
    try:
        client = connect()

        db = client.Cluster0
        users_collection = db["users"]

        obj_id = ObjectId(connector.id)

        updated_user = users_collection.find_one_and_update(
            {"_id": obj_id},
            {"$addToSet": {"children_addresses": connector.mac}},
            return_document = ReturnDocument.AFTER
        )

        return updated_user
    except InvalidId:
        raise
    except Exception as e:
        raise