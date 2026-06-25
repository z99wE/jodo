# Jodo

**The Professional Equalizer.**  
*Agentic accessibility middleware for the digital workplace.*

---

## The Inclusivity Gap

Visual interfaces block talent. Modern professional software assumes a single type of user: one who can see, point, and click rapidly across complex, dense dashboards. When companies force applicants and employees through these non-accessible digital interfaces, they filter out top talent based on navigation speed, not actual skill.

This structural barrier costs the global economy millions and keeps diverse talent locked out.

## The Solution

Jodo equalizes the digital workplace. 

It functions as an Agentic OS—an autonomous workflow execution engine that sits between the professional and the software. Jodo parses the browser's Accessibility Tree (AXTree), analyzes the user's intent, and executes actions on their behalf. 

You command. Jodo navigates.

## Core Infrastructure

### Logic Trace Transparency
Verify every action. Jodo generates a transparent trace of its reasoning. We moved AI out of the black box, so you know exactly why and how an action was taken.

### Predictive Pathing
Time your engagement. The forecasting engine analyzes systemic trends to suggest optimal action windows for networking, application submission, and follow-ups.

### Multimodal Access
Navigate your way. Jodo translates standard visual interfaces for Deaf, Hard of Hearing, and visually impaired professionals in real-time.

---

## Quick Start

Jodo operates as a Chrome Extension backed by a local execution server. We have provided a single automated script to boot the entire environment.

### 1. Launch the Environment

Run the automated boot script from the root directory. This script will automatically create Python virtual environments, install all dependencies, and boot both the FastAPI execution server and the Next.js dashboard concurrently.

```bash
# Make the script executable if it isn't already
chmod +x start.sh

# Run the environment
./start.sh
```

*Note: The script requires Python 3.11+ and Node.js to be installed on your machine.*

### 2. Install the Extension

The browser extension reads the AXTree and streams it to the execution server.

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the `extension/` directory from this repository.

### 3. Access the Dashboard

Once `./start.sh` is running, visit `http://localhost:3000` to access the Jodo control panel. The backend execution server runs invisibly on port 8000.

---

## Architecture

- **Extension (`content.js`)**: Captures the Chrome Accessibility Tree and sends it via WebSocket.
- **Backend (`ax_parser.py`)**: Compresses the massive AXTree into a dense, semantic payload for the LLM.
- **Brain (`agent.py`)**: LangGraph workflow that processes the context, generates a Logic Trace, and decides the next action.
- **Frontend (`page.tsx`)**: The control interface and visualization hub.

## License

Jodo is built to open the doors. Open-source and MIT Licensed.
