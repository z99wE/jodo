from pydantic import BaseModel, Field

class ThoughtTrace(BaseModel):
    """The structured Cognitive Insight trace representing the LLM's inner monologue."""
    observation: str = Field(..., description="What the agent sees on the page (AXTree interpretation).")
    reasoning: str = Field(..., description="Why it matters to the user, referencing their constraints and needs.")
    decision: str = Field(..., description="What the agent decides to do based on the observation and reasoning.")

class AgentDecision(BaseModel):
    """The final structured output from the LangGraph agent for each step."""
    thought_trace: ThoughtTrace
    action: str = Field(..., description="The action to take, e.g., 'CLICK', 'TYPE', 'SCROLL', 'NONE'.")
    element_id: str = Field(..., description="The DOM ID or selector of the element to interact with, or empty if none.")
    prediction_score: float = Field(0.0, description="The Lag-Llama predicted success score for timing.")
    accessibility_feedback: str = Field(..., description="A short summary of what was done, useful for screen readers.")
