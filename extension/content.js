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
    width: 350px;
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    color: #f8fafc;
    font-family: system-ui, -apple-system, sans-serif;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: auto; /* Allow interactions inside the box if needed */
  }
  .header {
    font-weight: 600;
    font-size: 14px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 8px;
    margin-bottom: 4px;
  }
  .trace-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .label {
    font-size: 11px;
    color: #64748b;
    text-transform: uppercase;
  }
  .value {
    font-size: 13px;
    line-height: 1.4;
  }
  #lottie-container {
    width: 100%;
    height: 150px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 8px;
  }
`;
shadowRoot.appendChild(style);

// Add Overlay Container
const container = document.createElement('div');
container.id = 'jodo-container';
container.innerHTML = `
  <div class="header">Jodo CoT Trace</div>
  <div class="trace-section">
    <div class="label">Observation</div>
    <div class="value" id="obs-val">Waiting...</div>
  </div>
  <div class="trace-section">
    <div class="label">Reasoning</div>
    <div class="value" id="rea-val">Waiting...</div>
  </div>
  <div class="trace-section">
    <div class="label">Decision</div>
    <div class="value" id="dec-val">Waiting...</div>
  </div>
  <div class="trace-section">
    <div class="label">Action</div>
    <div class="value" id="act-val">Waiting...</div>
  </div>
  <div id="lottie-container"></div>
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
    const ws = new WebSocket('ws://localhost:8000/ws');
    
    ws.onopen = () => {
        console.log("Jodo Extension connected to Agent Backend.");
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
            // In reality, the backend would send a specific 'SignID'
            playLottie('S-101');
            
        } catch (e) {
            console.error("Failed to parse Jodo trace:", e);
        }
    };
    
    ws.onclose = () => {
        console.log("Jodo WebSocket closed. Reconnecting in 5s...");
        setTimeout(connectWebSocket, 5000);
    };
}

connectWebSocket();
