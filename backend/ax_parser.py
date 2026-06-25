from typing import List, Dict, Any
import json
import logging

logger = logging.getLogger(__name__)

def parse_ax_tree(raw_json_str: str) -> str:
    """
    Parses the pre-processed JSON array of actionable elements sent from content.js.
    Formats it into a clean, token-efficient semantic representation for the LLM.
    """
    logger.debug(f"Parsing raw JSON string of length {len(raw_json_str)}")
    
    if not raw_json_str:
        return "Empty Page Context"
        
    try:
        data = json.loads(raw_json_str)
        elements = data.get("elements", [])
        page_title = data.get("pageTitle", "Unknown Title")
        
        if not elements:
            return f"Page Title: {page_title}\nNo actionable elements found."
            
        semantic_tree = [f"Page Title: {page_title}", "Actionable Elements:"]
        for el in elements:
            # Format: [ID: jodo-1] <button> "Submit"
            semantic_tree.append(f"[ID: {el['id']}] <{el['tagName']}> \"{el['text']}\"")
            
        return "\n".join(semantic_tree)
        
    except json.JSONDecodeError:
        logger.warning("Failed to decode JSON context, falling back to raw string limit.")
        return f"Raw Context: {raw_json_str[:1000]}"
