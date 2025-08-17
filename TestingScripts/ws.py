import asyncio
import websockets
import json


async def listen_alerts():
    uri = "ws://127.0.0.1:8000/ws/alerts"
    async with websockets.connect(uri) as websocket:
        print("Conectado al WebSocket 🚀")
        while True:
            message = await websocket.recv()
            data = json.loads(message)
            print("🚨 Alerta recibida en tiempo real:", data)


asyncio.run(listen_alerts())
