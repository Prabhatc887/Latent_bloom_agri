import requests
from PIL import Image
import base64
import io

HF_API_KEY = "hf_your_huggingface_api_key"
HF_MODEL = "Salesforce/blip-image-captioning-base" 

def pil_image_to_base64(image: Image.Image) -> str:
    """Convert PIL image to base64 string for API call."""
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str

def generate_stage_advice(image_path: str, stage_name: str):
    """
    Generate farmer-friendly advice for a given stage image via API.

    Args:
        image_path: Path to stage image
        stage_name: Name of biological stage

    Returns:
        Dict: { "stage": stage_name, "advice": "..." }
    """
    image = Image.open(image_path).convert("RGB").resize((512, 512))
    img_base64 = pil_image_to_base64(image)

    prompt = (
        f"You are an expert agricultural advisor. Analyze this plant at the '{stage_name}' stage.\n"
        "1. Describe plant condition (Good, Needs attention, or Bad)\n"
        "2. Give actionable advice for the farmer (what to do)\n"
        "3. Mention what should NOT be done at this stage\n"
        "Keep response short and suitable for audio narration (2-3 sentences)."
    )

    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": {
            "image": img_base64,
            "text": prompt
        }
    }

    response = requests.post(
        f"https://api-inference.huggingface.co/models/{HF_MODEL}",
        headers=headers,
        json=payload
    )

    if response.status_code != 200:
        raise ValueError(f"API error: {response.status_code}, {response.text}")

    result = response.json()

    # The text output is usually in result["generated_text"] for HF API
    advice_text = result.get("generated_text", "No advice returned")

    return {
        "stage": stage_name,
        "advice": advice_text
    }
