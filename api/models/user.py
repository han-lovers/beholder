from pydantic import BaseModel

class RegisterUser(BaseModel):
    email: str
    password: str
    password_confirmation : str

class User(BaseModel):
    email: str
    password: str

    def __init__(self, **data):
        super().__init__(**data)
