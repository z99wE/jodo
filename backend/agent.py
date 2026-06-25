import json
import asyncio
import logging
from typing import TypedDict, Annotated, Sequence, Dict, Any, Callable, Optional, Awaitable
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage, AIMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END

# Configure logging
logger = logging.getLogger(__name__)

class AgentState(TypedDict):
    """State schema for the Jodo LangGraph agent workflow."""
    messages: Sequence[BaseMessage]
    prediction_score: float
    current_trace: Dict[str, Any]

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

def analyze_page(state: AgentState) -> Dict[str, Any]:
    """Analyzes the current page accessibility tree."""
    observation = "Page contains high density of 'On-site' requirements."
    logger.debug(f"AnalyzePage observation: {observation}")
    return {"messages": [HumanMessage(content=f"Current page state: {observation}")]}

def predict_timing(state: AgentState) -> Dict[str, Any]:
    """Incorporates the timing prediction score into the agent state."""
    score = state.get("prediction_score", 0.5)
    logger.debug(f"PredictTiming score: {score}")
    return {"messages": [HumanMessage(content=f"Timing prediction score: {score}")]}

def generate_trace(state: AgentState) -> Dict[str, Any]:
    """Generates a structured CoT thought trace for accessibility auditing."""
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
    logger.info("Generated accessibility trace successfully.")
    return {"current_trace": trace, "messages": [AIMessage(content=json.dumps(trace))]}

def execute_action(state: AgentState) -> Dict[str, Any]:
    """Executes the determined action via the simulated browser environment."""
    trace = state.get("current_trace", {})
    action = trace.get("action", "NONE")
    logger.debug(f"Executing action: {action}")
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

async def run_agent(score: float, callback: Optional[Callable[[Dict[str, Any]], Awaitable[None]]] = None) -> Optional[Dict[str, Any]]:
    """
    Run the agent and optionally stream the trace back via a callback.
    
    Args:
        score: The prediction score from the forecaster.
        callback: Async function to call with the generated trace.
        
    Returns:
        The generated trace dictionary, or None if generation fails.
    """
    initial_state = {
        "messages": [SystemMessage(content=SYSTEM_PROMPT)],
        "prediction_score": score,
        "current_trace": {}
    }
    
    # Run the graph
    try:
        result = await app.ainvoke(initial_state)
        trace = result.get("current_trace")
        
        if callback and trace:
            await callback(trace)
            
        return trace
    except Exception as e:
        logger.error(f"Error during graph execution: {e}")
        return None

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    async def print_callback(trace: Dict[str, Any]) -> None:
        logger.info(f"Generated Trace: {json.dumps(trace, indent=2)}")
        
    asyncio.run(run_agent(0.88, print_callback))
