import json
import asyncio
import logging
from typing import TypedDict, Annotated, Sequence, Dict, Any, Callable, Optional, Awaitable
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage, AIMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END

from models import AgentDecision
from ax_parser import parse_ax_tree

# Configure logging
logger = logging.getLogger(__name__)

class AgentState(TypedDict):
    """State schema for the Jodo LangGraph agent workflow."""
    messages: Sequence[BaseMessage]
    prediction_score: float
    page_context: str
    current_trace: Dict[str, Any]

# Define the System Prompt for CoT Introspection
SYSTEM_PROMPT = """
You are Jodo, an Agentic Professional OS acting as an accessibility middleware layer.
You must return a structured JSON response matching the AgentDecision schema.
"""

def analyze_page(state: AgentState) -> Dict[str, Any]:
    """Analyzes the current page accessibility tree."""
    raw_html = state.get("page_context", "")
    observation = parse_ax_tree(raw_html)
    logger.debug(f"AnalyzePage observation: {observation}")
    return {"messages": [HumanMessage(content=f"Parsed Semantic Context: {observation}")]}

def predict_timing(state: AgentState) -> Dict[str, Any]:
    """Incorporates the timing prediction score into the agent state."""
    score = state.get("prediction_score", 0.5)
    logger.debug(f"PredictTiming score: {score}")
    return {"messages": [HumanMessage(content=f"Timing prediction score: {score}")]}

def generate_trace(state: AgentState) -> Dict[str, Any]:
    """Generates a structured CoT thought trace for accessibility auditing."""
    # In a full production implementation, we invoke the LLM here:
    # llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    # structured_llm = llm.with_structured_output(AgentDecision)
    # decision = structured_llm.invoke(state["messages"])
    
    # For now, we mock the LLM response to avoid requiring API keys during the demo
    trace = {
      "thought_trace": {
        "observation": "Extracted semantic content: [Button 'Apply Now'], [Text 'Remote-Only']",
        "reasoning": "The user prefers Remote-Only jobs, and this matches their profile.",
        "decision": "I will click the Apply Now button."
      },
      "action": "CLICK",
      "element_id": "apply_btn_01",
      "prediction_score": state.get("prediction_score", 0.88),
      "accessibility_feedback": "Applying to Remote-Only role."
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

async def run_agent(score: float, page_context: str = "", callback: Optional[Callable[[Dict[str, Any]], Awaitable[None]]] = None) -> Optional[Dict[str, Any]]:
    """
    Run the agent and optionally stream the trace back via a callback.
    """
    initial_state = {
        "messages": [SystemMessage(content=SYSTEM_PROMPT)],
        "prediction_score": score,
        "page_context": page_context,
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
