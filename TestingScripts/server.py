from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pathlib import Path
import base64
import datetime
from typing import Optional

app = FastAPI()
VALID_PARENTS = {"papa123", "papa456", "admin001"}


# =======================
# MODELOS
# =======================
class GroomingAlertRequest(BaseModel):
    type: str
    importance: str
    parent_id: str
    description: str
    image: Optional[str] = None  # Base64 del screenshot, puede ser None


class ScreenshotPayload(BaseModel):
    screenshot: str


# =======================
# ENDPOINTS REST
# =======================
@app.get("/api/check_parent/{parent_id}")
async def check_parent(parent_id: str):
    if parent_id in VALID_PARENTS:
        return {"valid": True, "id": parent_id}
    return {"valid": False}


@app.post("/api/get_screenshot/")
async def get_screenshot(payload: ScreenshotPayload):
    img_bytes = base64.b64decode(payload.screenshot)
    base_dir = Path("screenshots")
    base_dir.mkdir(exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = base_dir / f"screenshot_{timestamp}.png"
    with open(file_path, "wb") as f:
        f.write(img_bytes)
    print(f"Screenshot guardado en {file_path}")
    return {"valid": True}


# =======================
# WEBSOCKET MANAGER
# =======================
connections = []


@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # Mantener la conexión viva
    except WebSocketDisconnect:
        connections.remove(websocket)


async def broadcast_alert(alert: dict):
    """Manda la alerta a todos los clientes WS conectados"""
    disconnected = []
    for conn in connections:
        try:
            await conn.send_json(alert)
        except Exception:
            disconnected.append(conn)
    for conn in disconnected:
        connections.remove(conn)


# =======================
# ENDPOINT GROOMING ALERT
# =======================
@app.post("/api/grooming_alerts/")
async def receive_grooming_alert(alert: GroomingAlertRequest):
    print("📌 Alerta de grooming recibida:")
    print(alert.dict())

    # 🔹 Aquí va el broadcast a los clientes WS
    await broadcast_alert(alert.dict())

    return JSONResponse({"status": "success", "message": "Alerta recibida"})
