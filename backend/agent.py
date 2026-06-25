import json
import asyncio
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage, AIMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
# Note: In a full implementation we would integrate browser_use properly here
# For the prototype, we mock the browser interaction layer to focus on the 
# Jodo Agentic Protocol (thought_trace).

class AgentState(TypedDict):
    messages: Sequence[BaseMessage]
    prediction_score: float
    current_trace: dict

# Define the System Prompt for CoT Introspection
SYSTEM_PROMPT = """
You are Jodo, an Agentic Professional OS acting as an accessibility middleware layer.
Before executing any interaction, output a JSON object with a thought_trace containing:
- Observation: What you see on the page.
- Reasoning: Why it matters to the user (considering preferences/needs).
- Decision: What you will do next.

Your trace MUST match the following JSON schema exactly, and be parsable:
{
  "thought_trace": {
    "observation": "...",
    "reasoning": "...",
    "decision": "..."
  },
  "action": "...",
  "element_id": "...",
  "prediction_score": 0.0,
  "accessibility_feedback": "..."
}
"""

def analyze_page(state: AgentState):
    # Mocking reading the accessibility tree
    observation = "Page contains high density of 'On-site' requirements."
    return {"messages": [HumanMessage(content=f"Current page state: {observation}")]}

def predict_timing(state: AgentState):
    # Use the mock score passed in or default
    score = state.get("prediction_score", 0.5)
    return {"messages": [HumanMessage(content=f"Timing prediction score: {score}")]}

def generate_trace(state: AgentState):
    # Mocking the LLM generation based on the CoT prompt
    # In a real implementation this would call an LLM with the structured output instructions
    trace = {
      "thought_trace": {
        "observation": "Page contains high density of 'On-site' requirements.",
        "reasoning": "User has 'Remote-Only' preference in profile. Risk: High.",
        "decision": "Filter out job card."
      },
      "action": "TOGGLE_VISIBILITY",
      "element_id": "job_card_42",
      "prediction_score": state.get("prediction_score", 0.88),
      "accessibility_feedback": "Hidden non-matching job: 'Role Name'."
    }
    return {"current_trace": trace, "messages": [AIMessage(content=json.dumps(trace))]}

def execute_action(state: AgentState):
    # Here browser-use would take the action defined in the trace
    trace = state.get("current_trace", {})
    action = trace.get("action", "NONE")
    return {"messages": [SystemMessage(content=f"Executed action: {action}")]}

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("AnalyzePage", analyze_page)
workflow.add_node("PredictTiming", predict_timing)
workflow.add_node("GenerateTrace", generate_trace)
workflow.add_node("ExecuteAction", execute_action)

workflow.add_edge(START, "AnalyzePage")
workflow.add_edge("AnalyzePage", "PredictTiming")
workflow.add_edge("PredictTiming", "GenerateTrace")
workflow.add_edge("GenerateTrace", "ExecuteAction")
workflow.add_edge("ExecuteAction", END)

app = workflow.compile()

async def run_agent(score: float, callback=None):
    """
    Run the agent and optionally stream the trace back via a callback.
    """
    initial_state = {
        "messages": [SystemMessage(content=SYSTEM_PROMPT)],
        "prediction_score": score,
        "current_trace": {}
    }
    
    # Run the graph
    result = await app.ainvoke(initial_state)
    trace = result.get("current_trace")
    
    if callback and trace:
        await callback(trace)
        
    return trace

if __name__ == "__main__":
    async def print_callback(trace):
        print("Generated Trace:", json.dumps(trace, indent=2))
        
    asyncio.run(run_agent(0.88, print_callback))
