from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.user import RegisterUser, User
from db.users import *
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