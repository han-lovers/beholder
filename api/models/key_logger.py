from pydantic import BaseModel

class Connector(BaseModel):
    id: str
    mac: str