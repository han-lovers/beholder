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
        "img": Binary(base64.denuncia.image_base64)
    }

    try:
        result = denuncias_collection.insert_one(denuncia_doc)
    except Exception as e:
        raise