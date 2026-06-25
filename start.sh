#!/bin/bash

# Jodo Agentic OS - Local Development Boot Script
# This script automates the setup and parallel startup of both the backend and frontend.

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Jodo OS Local Environment...${NC}"

# 1. Prerequisite Checks
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 is not installed. Please install Python 3.11+.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install Node.js.${NC}"
    exit 1
fi

# 2. Backend Setup
echo -e "${GREEN}==> Setting up Backend (FastAPI)...${NC}"
cd backend || exit

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate venv and install requirements
source venv/bin/activate
pip install -r requirements.txt --quiet
echo "Backend dependencies verified."

# Start backend in the background
echo -e "${BLUE}Starting FastAPI server on port 8000...${NC}"
uvicorn server:app --reload --port 8000 &
BACKEND_PID=$!

# Move back to root
cd ..

# 3. Frontend Setup
echo -e "${GREEN}==> Setting up Frontend (Next.js)...${NC}"
cd landing || exit

# Install npm dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install --silent
fi

# Start frontend in the background
echo -e "${BLUE}Starting Next.js server on port 3000...${NC}"
npm run dev -- -p 3000 &
FRONTEND_PID=$!

# Move back to root
cd ..

# 4. Process Management
echo -e "${GREEN}==============================================${NC}"
echo -e "${GREEN}Jodo OS is running!${NC}"
echo -e "Dashboard: http://localhost:3000"
echo -e "API Server: http://localhost:8000"
echo -e "${BLUE}Press Ctrl+C to stop all servers.${NC}"
echo -e "${GREEN}==============================================${NC}"

# Cleanup function to kill background processes when script exits
cleanup() {
    echo -e "\n${RED}Shutting down Jodo OS...${NC}"
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT SIGTERM

# Wait indefinitely so the script doesn't exit and the trap catches signals
wait $BACKEND_PID $FRONTEND_PID
