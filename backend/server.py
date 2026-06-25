import asyncio
import json
import logging
from typing import Dict, Any, List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import run_agent
from forecaster import JobTimingForecaster

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

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
    """Manages active WebSocket connections for broadcasting traces."""
    
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        """Accepts and tracks a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"Client connected. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket) -> None:
        """Removes a disconnected WebSocket from active connections."""
        self.active_connections.remove(websocket)
        logger.info(f"Client disconnected. Total active: {len(self.active_connections)}")

    async def broadcast(self, message: Dict[str, Any]) -> None:
        """Broadcasts a JSON message to all active WebSocket clients."""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to send message to client: {e}")

manager = ConnectionManager()
forecaster = JobTimingForecaster(use_mock=True)

class RunAgentRequest(BaseModel):
    timestamps: list[str] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """Handles WebSocket connections for real-time Jodo trace streaming."""
    await manager.connect(websocket)
    try:
        while True:
            # Wait for client messages (could be page DOM contexts in the future)
            data = await websocket.receive_text()
            logger.debug(f"Received from client: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"Unexpected WebSocket error: {e}")
        manager.disconnect(websocket)

@app.post("/trigger-agent")
async def trigger_agent(request: RunAgentRequest) -> Dict[str, Any]:
    """
    Endpoint to manually trigger the agent workflow.
    Predicts optimal interaction timing and runs the langgraph agent.
    """
    # 1. Predict Timing
    forecast = forecaster.predict_optimal_window(request.timestamps)
    score = forecast.get("score", 0.5)
    logger.info(f"Predicted timing score: {score}")

    # Callback to broadcast the trace
    async def broadcast_trace(trace: Dict[str, Any]) -> None:
        await manager.broadcast(trace)

    # 2. Run Agent
    # In a background task or await directly
    try:
        trace = await run_agent(score=score, callback=broadcast_trace)
        return {"status": "success", "trace": trace, "forecast": forecast}
    except Exception as e:
        logger.error(f"Agent execution failed: {e}")
        return {"status": "error", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
