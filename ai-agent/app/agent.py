import requests
from typing import Dict, Any, Optional

# Base URL for the existing Vertex Market Node.js Backend
BACKEND_URL = "http://localhost:5000/api/v1"

async def run_agent(
    message: str, 
    conversation_id: Optional[str] = None, 
    user_context: Optional[Dict[str, Any]] = None, 
    page_context: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Main entry point for the AI Agent without external LLM API.
    Uses robust rule-based intent matching for Roman Urdu and English.
    """
    msg_lower = message.lower().strip()
    
    # 1. Greetings in Roman Urdu / English
    greeting_keywords = ["salam", "assalam", "hello", "hi", "hey"]
    if any(kw in msg_lower for kw in greeting_keywords):
        return {"text": "Walaikum assalam! Main Vertex Market ka AI assistant hoon. Main aapki kya madad kar sakta hoon?"}
    
    how_are_you_keywords = ["kaise ho", "kese ho", "theek ho", "how are you", "kya haal"]
    if any(kw in msg_lower for kw in how_are_you_keywords):
        return {"text": "Main bilkul theek hoon, shukriya! Aap batayen main aaj aapke liye kya dhoond sakta hoon?"}
        
    # 2. Product Search Intent (with common typos)
    # Mapping common typos to actual backend search keywords
    keyword_map = {
        "laptop": ["laptop", "leptop", "leptab", "lptp"],
        "gaming": ["gaming", "gamin", "game"],
        "mobile": ["mobile", "mobil", "mobal", "phone", "phon", "fon"],
        "shoes": ["shoes", "shoe", "shous", "shos", "joote", "jooty"],
        "watch": ["watch", "wach", "ghari", "watches"],
        "shirt": ["shirt", "shart", "kameez"],
        "bag": ["bag", "beg"],
    }
    
    search_term = None
    for correct_kw, variants in keyword_map.items():
        if any(variant in msg_lower for variant in variants):
            search_term = correct_kw
            break
            
    search_action_keywords = ["pata karke do", "dikhao", "show", "search", "dhoondo", "lene", "leni", "chahiye", "need", "want"]
    wants_to_search = any(kw in msg_lower for kw in search_action_keywords)
    
    if search_term or wants_to_search:
        # If they asked to search but didn't specify what, or specified a keyword we know
        query = search_term if search_term else "laptop" # fallback default
        
        try:
            res = requests.get(f"{BACKEND_URL}/products?keyword={query}&limit=5")
            if res.status_code == 200:
                products = res.json().get("data", {}).get("products", [])
                if products:
                    return {
                        "text": f"Ji zaroor, mujhe '{query}' ke mutaliq kuch behtareen results mile hain. Yeh check karein:",
                        "action": {
                            "type": "SHOW_PRODUCTS",
                            "data": products
                        }
                    }
                else:
                    return {"text": f"Maazrat, mujhe abhi '{query}' se mutaliq koi product nahi mili."}
        except Exception:
            pass
        return {"text": "Maaf kijiyega, mujhe abhi catalog search karne mein masla aa raha hai."}
            
    # 3. Contextual Question (e.g., asking about the current product)
    context_keywords = ["this", "it", "yeh", "is ki", "iska", "iske"]
    if any(kw in msg_lower for kw in context_keywords):
        if page_context and page_context.get("type") == "product":
            product_id = page_context.get("id")
            if product_id:
                try:
                    res = requests.get(f"{BACKEND_URL}/products/{product_id}")
                    if res.status_code == 200:
                        product = res.json().get("data", {})
                        title = product.get("title", "Yeh product")
                        price = product.get("price", "Unknown")
                        return {"text": f"{title} ki qeemat Rs. {price} hai. Yeh ek behtareen choice ho sakti hai!"}
                except Exception:
                    pass
        return {"text": "Mujhe theek se samajh nahi aaya aap kis product ki baat kar rahe hain. Kya aap tafseel bata sakte hain?"}

    # 4. Default Fallback
    return {
        "text": "Hello! Main Vertex Market ka AI Assistant hoon. Aap mujhse products (jaise shoes, mobile, laptop) search karwa sakte hain."
    }
