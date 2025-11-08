import os
import requests

# --- AI Chatbot helpers ---
try:
    # Prefer the new SDK if available
    from openai import OpenAI  # type: ignore
    _HAS_OPENAI_V1 = True
except Exception:
    OpenAI = None  # type: ignore
    _HAS_OPENAI_V1 = False


def get_ai_reply(message: str, history):
    """Return AI-generated reply if OPENAI/AIMLAPI key is configured; otherwise None.
    Uses a concise, safe system prompt with site context (Polish by default).
    """
    # Prefer AIMLAPI creds if provided, fall back to OPENAI_API_KEY for compatibility
    api_key = os.getenv('AIMLAPI_API_KEY') or os.getenv('OPENAI_API_KEY')
    base_url = os.getenv('AIMLAPI_BASE_URL', 'https://api.aimlapi.com/v1')
    if not api_key:
        return None

    # Cap history for token safety
    trimmed = []
    try:
        # convert history [[role, content], ...] to OpenAI format
        for role, content in history[-8:]:
            if role in ("user", "assistant") and isinstance(content, str):
                trimmed.append({"role": role, "content": content[:2000]})
    except Exception:
        trimmed = []

    system_prompt = (
        "You're an expert AI engineer collaborating in the Arc hackathon."
        " Your focus: build intelligent, real-world payment systems where AI drives decisions and Arc executes them using USDC."
        " Your mission: design and prototype an AI-powered payment solution built on Arc that uses USDC for transactions."
        " Projects must deliver functional, working prototypes within the following innovation tracks:"
        " - AI-driven automation: Smart agents making real-time financial or business decisions."
        " - Dynamic payments: Adaptive pricing, subscriptions, or incentives based on AI insights."
        " - Data intelligence: Predictive models enhancing trust, credit, or financial forecasting."
        " - User experience: Seamless, secure, and human-centered payment interactions."
        " Respond clearly, professionally, and in English unless the user switches language."
        " Keep answers practical and technically grounded — focus on architecture, integration, and real-world use cases."
    )

    # Domyślnie użyj modelu gpt-4 (zgodnie z przykładem AIML API); można nadpisać przez ENV
    model = os.getenv('AIMLAPI_MODEL', os.getenv('OPENAI_MODEL', 'gpt-4'))

    messages = [{"role": "system", "content": system_prompt}] + trimmed + [
        {"role": "user", "content": message[:4000]}
    ]

    # Najpierw spróbuj SDK kompatybilnego z OpenAI, jeśli dostępny
    if _HAS_OPENAI_V1:
        try:
            client = OpenAI(api_key=api_key, base_url=base_url)
            resp = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.3,
                max_tokens=512
            )
            return resp.choices[0].message.content.strip() if resp and resp.choices else None
        except Exception as e:
            print(f"[AI] OpenAI SDK error (fallback to requests): {e}")

    # Fallback: bezpośrednie wywołanie AIML API przez requests
    try:
        try:
            import requests as _requests  # lokalny import na wypadek braku globalnego
        except Exception:
            _requests = requests  # użyj modułu importowanego globalnie
        if _requests is None:
            return None

        resp = _requests.post(
            f"{base_url}/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
            json={
                "model": model,
                "messages": messages,
                "temperature": 0.3,
                "max_tokens": 512,
            },
            timeout=30,
        )
        data = resp.json()
        choices = data.get("choices") or []
        if choices:
            msg = choices[0].get("message") or {}
            content = msg.get("content") or ""
            return content.strip() if content else None
        return None
    except Exception as e:
        print(f"[AI] AIML API error: {e}")
        return None
