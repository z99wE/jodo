// Inject Host Element
const host = document.createElement('div');
host.id = 'jodo-overlay-host';
document.body.appendChild(host);

// Create Shadow DOM
const shadowRoot = host.attachShadow({ mode: 'open' });

// Add styles to Shadow DOM
const style = document.createElement('style');
style.textContent = `
  #jodo-container {
    width: 360px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 20px;
    padding: 20px;
    color: #0f172a;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 16px;
    pointer-events: auto;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  .header-title {
    font-weight: 700;
    font-size: 15px;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .live-indicator {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
    animation: pulse 2s infinite;
  }
  .trace-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 350px;
    overflow-y: auto;
  }
  .trace-section {
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    padding: 12px;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.01);
  }
  .label {
    font-size: 11px;
    font-weight: 600;
    color: #6366f1;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }
  .value {
    font-size: 13px;
    line-height: 1.5;
    color: #334155;
  }
  #lottie-container {
    width: 100%;
    height: 140px;
    background: #f1f5f9;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }
`;
shadowRoot.appendChild(style);

// Add Overlay Container
const container = document.createElement('div');
container.id = 'jodo-container';
container.innerHTML = `
  <div class="header" role="heading" aria-level="2">
    <div class="header-title">
      <div class="live-indicator" aria-hidden="true"></div>
      Jodo Agentic Trace
    </div>
  </div>
  <div class="trace-list" role="region" aria-live="polite" aria-atomic="false">
    <div class="trace-section">
      <div class="label" id="obs-label">Observation</div>
      <div class="value" id="obs-val" aria-labelledby="obs-label">Waiting for page context...</div>
    </div>
    <div class="trace-section">
      <div class="label" id="rea-label">Reasoning</div>
      <div class="value" id="rea-val" aria-labelledby="rea-label">Analyzing accessibility tree...</div>
    </div>
    <div class="trace-section">
      <div class="label" id="dec-label">Decision</div>
      <div class="value" id="dec-val" aria-labelledby="dec-label">Standby</div>
    </div>
    <div class="trace-section">
      <div class="label" id="act-label">Action</div>
      <div class="value" id="act-val" aria-labelledby="act-label">None</div>
    </div>
  </div>
  <div id="lottie-container" aria-hidden="true"></div>
`;
shadowRoot.appendChild(container);

let currentAnimation = null;

function playLottie(signId) {
    const lottieContainer = shadowRoot.getElementById('lottie-container');
    lottieContainer.innerHTML = ''; // Clear previous
    
    if (currentAnimation) {
        currentAnimation.destroy();
    }

    // Determine path to the asset
    const assetUrl = chrome.runtime.getURL(`assets/placeholder.json`);
    
    // Check if lottie is available globally (it should be due to manifest injection)
    if (typeof lottie !== 'undefined') {
        currentAnimation = lottie.loadAnimation({
            container: lottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: assetUrl
        });
    } else {
        lottieContainer.innerText = "Lottie library not loaded.";
    }
}

// Connect to WebSocket Server
function connectWebSocket() {
    try {
        const ws = new WebSocket('ws://localhost:8000/ws');
        
        ws.onopen = () => {
            console.log("Jodo Extension connected to Agent Backend.");
            shadowRoot.getElementById('obs-val').innerText = "Connected to backend engine.";
        };
        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                // Expected schema
                const trace = data.thought_trace || {};
                
                shadowRoot.getElementById('obs-val').innerText = trace.observation || 'N/A';
                shadowRoot.getElementById('rea-val').innerText = trace.reasoning || 'N/A';
                shadowRoot.getElementById('dec-val').innerText = trace.decision || 'N/A';
                shadowRoot.getElementById('act-val').innerText = data.action || 'N/A';
                
                // Map some arbitrary string to a SignID for the inclusivity module demo
                playLottie('S-101');
                
            } catch (e) {
                console.error("Failed to parse Jodo trace:", e);
                shadowRoot.getElementById('obs-val').innerText = "Error parsing backend trace data.";
            }
        };
        
        ws.onerror = (error) => {
            console.error("Jodo WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("Jodo WebSocket closed. Reconnecting in 5s...");
            shadowRoot.getElementById('obs-val').innerText = "Disconnected. Retrying...";
            setTimeout(connectWebSocket, 5000);
        };
    } catch (e) {
        console.error("Jodo WebSocket initialization failed:", e);
        setTimeout(connectWebSocket, 5000);
    }
}

connectWebSocket();
