from pydantic import BaseModel
from typing import Optional


class Denuncia(BaseModel):
    name_tag: str
    app: str
    descripcion: str
    image_base64: str
