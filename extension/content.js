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
  <div id="jodo-input-area">
    <input type="text" id="jodo-intent-input" placeholder="Type or speak your intent..." aria-label="User intent">
    <button id="jodo-mic-btn" aria-label="Speak intent" title="Click to speak">🎤</button>
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
        
        let activeWebSocket = null;

        ws.onopen = () => {
            console.log("Jodo Extension connected to Agent Backend.");
            shadowRoot.getElementById('obs-val').innerText = "Connected. Waiting for intent...";
            activeWebSocket = ws;
        };

        let intentTimeout = null;
        const sendIntent = (intent) => {
            if (intentTimeout) clearTimeout(intentTimeout);
            intentTimeout = setTimeout(() => {
                if (!activeWebSocket || activeWebSocket.readyState !== WebSocket.OPEN) return;
            // 1. Tag actionable elements
            let elementCounter = 1;
            const actionableElements = [];
            const elements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"]');
            
            elements.forEach(el => {
                // Ignore the extension's own elements
                if (el.closest('#jodo-overlay-host')) return;
                
                const id = \`jodo-\${elementCounter++}\`;
                el.setAttribute('data-jodo-id', id);
                
                // Get visible text or aria-label
                const text = el.innerText || el.getAttribute('aria-label') || el.value || el.placeholder || '';
                if (text.trim()) {
                    actionableElements.push({
                        id: id,
                        tagName: el.tagName.toLowerCase(),
                        type: el.type || '',
                        text: text.trim().substring(0, 100)
                    });
                }
            });

            const contextData = JSON.stringify({
                pageTitle: document.title,
                elements: actionableElements
            });
            
            const payload = JSON.stringify({
                intent: intent.trim().substring(0, 500), // Sanitize string length
                page_context: contextData
            });
            activeWebSocket.send(payload);
            shadowRoot.getElementById('obs-val').textContent = "Sending intent and context...";
            }, 300); // 300ms debounce
        };

        // UI Event Listeners
        const intentInput = shadowRoot.getElementById('jodo-intent-input');
        const micBtn = shadowRoot.getElementById('jodo-mic-btn');

        intentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && intentInput.value.trim()) {
                sendIntent(intentInput.value.trim());
            }
        });

        // Web Speech API (STT)
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onstart = () => {
                micBtn.classList.add('listening');
                intentInput.placeholder = 'Listening...';
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                intentInput.value = transcript;
                sendIntent(transcript);
            };
            
            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                micBtn.classList.remove('listening');
                intentInput.placeholder = 'Type or speak your intent...';
            };
            
            recognition.onend = () => {
                micBtn.classList.remove('listening');
                intentInput.placeholder = 'Type or speak your intent...';
            };
            
            micBtn.addEventListener('click', () => {
                if (micBtn.classList.contains('listening')) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            });
        } else {
            micBtn.style.display = 'none';
        }

        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                // Expected schema
                const trace = data.thought_trace || {};
                
                shadowRoot.getElementById('obs-val').textContent = trace.observation || 'N/A';
                shadowRoot.getElementById('rea-val').textContent = trace.reasoning || 'N/A';
                shadowRoot.getElementById('dec-val').textContent = trace.decision || 'N/A';
                shadowRoot.getElementById('act-val').textContent = data.action || 'N/A';
                
                // Web Speech API (TTS)
                if (trace.decision && 'speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(trace.decision);
                    // Cancel any ongoing speech to prioritize the latest decision
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(utterance);
                }

                // EXECUTION ENGINE
                if (data.action && data.element_id) {
                    const targetEl = document.querySelector(`[data-jodo-id="${data.element_id}"]`);
                    if (targetEl) {
                        console.log(`Jodo executing ${data.action} on`, targetEl);
                        if (data.action === 'CLICK') {
                            // Flash element briefly to show interaction
                            const oldOutline = targetEl.style.outline;
                            targetEl.style.outline = '3px solid #6366f1';
                            setTimeout(() => {
                                targetEl.style.outline = oldOutline;
                                targetEl.click();
                            }, 500);
                        } else if (data.action === 'TYPE' && data.text_value) {
                            targetEl.value = data.text_value;
                            targetEl.dispatchEvent(new Event('input', { bubbles: true }));
                            targetEl.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    } else {
                        console.warn(`Jodo could not find element with ID: ${data.element_id}`);
                    }
                }

                // Map some arbitrary string to a SignID for the inclusivity module demo
                playLottie('S-101');
                
            } catch (e) {
                console.error("Failed to parse Jodo trace:", e);
                shadowRoot.getElementById('obs-val').textContent = "Error parsing backend trace data.";
            }
        };
        
        ws.onerror = (error) => {
            console.error("Jodo WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("Jodo WebSocket closed. Reconnecting in 5s...");
            shadowRoot.getElementById('obs-val').textContent = "Disconnected. Retrying...";
            activeWebSocket = null;
            setTimeout(connectWebSocket, 5000);
        };
    } catch (e) {
        console.error("Jodo WebSocket initialization failed:", e);
        setTimeout(connectWebSocket, 5000);
    }
}

connectWebSocket();
