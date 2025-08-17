import pymongo
import base64
from bson.binary import Binary

from .connection import connect

def add_to_blacklist_db(denuncia):
    client = connect()
    db = client.Cluster0

    denuncias_collection = db["denuncias"]

    denuncia_doc = {
        "name_tag": denuncia.name_tag,
        "app": denuncia.app,
        "description": denuncia.descripcion,
        "img": Binary(denuncia.image_base64.encode("utf-8"))
    }

    try:
        result = denuncias_collection.insert_one(denuncia_doc)
    except Exception as e:
        raise

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

def get_from_blacklist_db():
    client = connect()

    db = client.Cluster0

    denuncias_collection = db["denuncias"]

    sex_offenders = list(denuncias_collection.find({}, {"img": 0}))

    return [serialize_doc(doc) for doc in sex_offenders]