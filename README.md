# Jodo: The Digital Bridge for Everyday India 🇮🇳

[![Jodo Agentic OS](https://img.shields.io/badge/Jodo-Agentic_OS-a855f7?style=for-the-badge)](http://localhost:3000)
[![Hackathon](https://img.shields.io/badge/Challenge_3-Everyday_AI_Innovator-blue?style=for-the-badge)](#)

> **The internet wasn't built for everyone.** Jodo is an AI co-pilot that navigates complex Indian websites—from IRCTC to local government portals—so anyone can participate in Digital India, regardless of technical skill, language barrier, or visual ability.

---

![Jodo User Journey Storyboard](./assets/storyboard.png)

## 🚀 The Problem

Everyday life in India requires navigating a maze of complex digital infrastructure. Booking a Tatkal train ticket on IRCTC, filing GST, checking EPFO balances, or paying a BESCOM electricity bill on a confusing portal are daunting tasks. For millions of Indians facing digital literacy barriers, language barriers, or visual impairments, these poorly designed interfaces are impossible to use.

## 💡 The Solution

Jodo is an **agentic accessibility middleware** that sits between the user and the web. 
It replaces visual navigation with conversational, semantic execution. 

Instead of struggling to find the tiny "Book Now" button on a cluttered UI, Jodo reads the Accessibility Tree of the website, understands your intent, and autonomously clicks, types, and navigates for you.

### 🌟 Key Features

1. **Tame Complex Portals:** Point Jodo at any confusing website, and it autonomously handles the dense UI for you.
2. **Logic Trace Transparency:** Jodo isn't a black box. It displays a real-time "Thought Trace" (Observation -> Reasoning -> Decision -> Action) so you know exactly what it's doing on your behalf.
3. **Bundled Local AI (Zero Friction):** Don't have an OpenAI or Gemini API key? No problem. Jodo falls back to a lightning-fast, bundled local AI model (`SmolLM2`) that runs directly on your machine.

---

## ⚡ Quick Start (One-Click Boot)

We have provided a single automated script to boot the entire environment. This script installs dependencies, sets up the Python backend, and starts the Next.js dashboard concurrently.

```bash
# Make the script executable
chmod +x start.sh

# Boot the Jodo ecosystem
./start.sh
```

*Note: Requires Python 3.11+ and Node.js.*

### Install the Chrome Extension
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the `extension/` directory from this repository.
5. Navigate to any website (e.g., irctc.co.in) to see the Jodo overlay in action!

---

## 🧠 Architecture (How it works)

Jodo operates as a Chrome Extension backed by a local execution server.

1. **The Scraper (`content.js`):** Injects a secure Shadow DOM into the webpage. It reads the raw DOM text and streams it via WebSockets to the backend.
2. **The Brain (`agent.py`):** A FastAPI server running a **LangGraph** workflow. It receives the DOM context, queries the LLM (GPT-4o-mini, Gemini, or the bundled Local SmolLM2), and generates an actionable trace.
3. **The Executor:** The backend streams the decision back to the extension, which executes the action (click/type) on the page and displays the reasoning trace to the user.

---

### Built for "The Everyday AI Innovator" Hackathon

This project was built to address **Challenge 3: Life, Made Better**. It delivers a single, simple, AI-powered feature that truly enriches the everyday rhythm of life in India by removing the friction from our most essential digital services.
