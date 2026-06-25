import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import run_agent
from forecaster import JobTimingForecaster

app = FastAPI(title="Jodo Agentic Backend")

# Allow CORS for Chrome Extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Failed to send message: {e}")

manager = ConnectionManager()
forecaster = JobTimingForecaster(use_mock=True)

class RunAgentRequest(BaseModel):
    timestamps: list[str] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # In a real scenario, the extension might send page context here
            # We ignore incoming data for this prototype and just keep connection alive
            pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/trigger-agent")
async def trigger_agent(request: RunAgentRequest):
    """
    Endpoint to manually trigger the agent workflow.
    """
    # 1. Predict Timing
    forecast = forecaster.predict_optimal_window(request.timestamps)
    score = forecast.get("score", 0.5)

    # Callback to broadcast the trace
    async def broadcast_trace(trace: dict):
        await manager.broadcast(trace)

    # 2. Run Agent
    # In a background task or await directly
    trace = await run_agent(score=score, callback=broadcast_trace)

    return {"status": "success", "trace": trace, "forecast": forecast}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
