from pydantic import BaseModel

class Alert(BaseModel):
    type: str
    importance: str
    parent_id: str
    description: str
    image: str