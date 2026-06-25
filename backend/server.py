import asyncio
import json
import logging
from typing import Dict, Any, List, Optional
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import run_agent
from forecaster import JobTimingForecaster

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Jodo Agentic Backend")

# Allow CORS for Chrome Extension and local development
# Use regex to safely allow the specific local domain and any chrome-extension origin
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^chrome-extension://.*$|^http://localhost:3000$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple Rate Limiter
class RateLimiter:
    """Basic in-memory rate limiter to prevent abuse."""
    def __init__(self, max_requests: int = 5, window_seconds: int = 60) -> None:
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.clients: Dict[str, List[float]] = {}
        
    def check_rate_limit(self, request: Request) -> None:
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        # Clean up old timestamps
        if client_ip in self.clients:
            self.clients[client_ip] = [t for t in self.clients[client_ip] if now - t < self.window_seconds]
        else:
            self.clients[client_ip] = []
            
        if len(self.clients[client_ip]) >= self.max_requests:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
            
        self.clients[client_ip].append(now)

rate_limiter = RateLimiter()

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
            # Receive DOM context from the extension
            data = await websocket.receive_text()
            logger.debug(f"Received from client: {data[:100]}...") # Log first 100 chars
            
            # Extract DOM or default to empty
            page_context = data if data else ""
            
            # Predict timing (mock timestamps for now)
            forecast = forecaster.predict_optimal_window([])
            score = forecast.get("score", 0.5)
            
            # Callback to send trace back to this specific client
            async def send_trace(trace: Dict[str, Any]) -> None:
                await websocket.send_json(trace)
                
            # Run the agent with the received page context
            try:
                await run_agent(score=score, page_context=page_context, callback=send_trace)
            except Exception as agent_err:
                logger.error(f"Agent failed on incoming WS data: {agent_err}")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"Unexpected WebSocket error: {e}")
        manager.disconnect(websocket)

@app.post("/trigger-agent")
async def trigger_agent(request: RunAgentRequest, req: Request) -> Dict[str, Any]:
    """
    Endpoint to manually trigger the agent workflow.
    Predicts optimal interaction timing and runs the langgraph agent.
    Includes basic rate limiting.
    """
    # Enforce Rate Limiting
    rate_limiter.check_rate_limit(req)
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
