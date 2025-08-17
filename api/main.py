from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from bson.errors import InvalidId

import pymongo
import json

from models.user import RegisterUser, User
from models.key_logger import Connector
from models.denuncia import Denuncia
from models.alerts import Alert, UserId
from db.users import *
from db.blacklist import *
from db.logs import *
from utils.passwords import *


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/v1/web/register")
def register_user(user: RegisterUser):

    # Return error if passwords do not match
    if not user.password == user.password_confirmation:
        return {"error": "Passwords do not match"}

    # Hash user password
    hashed_password = hash_password(user.password)

    db_user = User(email=user.email, password=hashed_password)

    db_error = add_user(db_user.dict())
    
    if db_error:
        return {"error": f"{db_error}"}

    return {"error": ""}

@app.post("/v1/web/login")
def login_user(user: User):
    if not existing_user(user.email):
        return {"error": f"Email {user.email} is not registered"}
    
    hash = get_user_password(user.email)

    if not validate_password(hash, user.password):
        return {"error": f"Incorrect password"}

    user_id = get_user_id(user.email)

    return {"user_id": f"{user_id}"}

@app.post("/v1/key_logger/connect")
def connect_keylogger(connector: Connector):
    try:
        updated_user = add_children_addresses(connector)
        
        if not updated_user:
            raise HTTPException(
                status_code=404,
                detail="User not found or MAC address already exists"
            )
            
        return {"error": ""}
        
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid user ID format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/v1/web/blacklist/add")
def add_to_blacklist(denuncia: Denuncia):
    error = add_to_blacklist_db(denuncia)

    return {"error": f"{error}"}

@app.get("/v1/web/blacklist/get")
def get_from_blacklist():
    sex_offenders = get_from_blacklist_db()

    return {"sex_offenders": sex_offenders}

channels = {}

@app.websocket("/v1/ws/{key}")
async def alerts_websocket(websocket: WebSocket, key: str):
    await websocket.accept()
    if key not in channels:
        channels[key] = []
    channels[key].append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast to all other clients in this channel
            for conn in channels[key]:
                if conn != websocket:
                    await conn.send_text(data)
    except WebSocketDisconnect:
        channels[key].remove(websocket)

@app.post("/v1/key_logger/warning")
def post_alerts(alert: Alert):
    add_logs(alert)

    return alert

@app.get("/v1/key_logger/warning/{id}")
def get_alert_logs(id: str):
    alerts = get_alerts(id)

    return {"warnings": alerts}