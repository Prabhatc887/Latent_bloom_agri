import requests
from PIL import Image
import base64
import io
import os
import wave
from typing import Dict, List
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load .env file
load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")
HF_MODEL = "Salesforce/blip-image-captioning-base"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print(f"Hugging Face API Key: {HF_API_KEY}")
print(f"Gemini API Key: {GEMINI_API_KEY}")

# Initialize Gemini client if API key exists
if GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        print("Gemini client initialized successfully")
    except Exception as e:
        print(f"Failed to initialize Gemini client: {e}")
        client = None
else:
    print("GEMINI_API_KEY not found. TTS will be disabled.")
    client = None

# --------------------------------------------------------------------------
# Image to Text (Stage Advice Generation)
# --------------------------------------------------------------------------

def pil_image_to_base64(image: Image.Image) -> str:
    """Convert PIL image to base64 string for API call."""
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

def get_fallback_advice(stage_name: str) -> str:
    """Return sensible fallback advice if API fails."""
    fallback_advice_map = {
        "seedling": "The seedling needs gentle watering and protection from direct sunlight. Avoid overwatering and keep in partial shade.",
        "early_seedling": "Young seedlings require consistent moisture. Space them properly and watch for early pests. Do not fertilize heavily yet.",
        "vegetative": "During vegetative growth, provide balanced fertilizer and ensure adequate sunlight. Water deeply but less frequently. Avoid waterlogging.",
        "late_vegetative": "Plants need support as they grow taller. Continue with nitrogen-rich fertilizer. Prune lower leaves for better air circulation.",
        "pre_flowering": "Reduce nitrogen and increase phosphorus for flower development. Maintain consistent moisture. Avoid stressing the plant.",
        "flowering": "Flowering stage requires careful watering - keep soil moist but not wet. Provide support for flower clusters. Avoid moving the plant.",
        "early_fruiting": "Fruits are developing - ensure consistent watering and calcium supply. Support heavy branches. Do not overwater.",
        "fruiting": "Harvest ripe fruits regularly to encourage more production. Reduce watering slightly. Monitor for pests on mature fruits."
    }
    return fallback_advice_map.get(stage_name, "Monitor plant health and maintain proper watering schedule.")

def generate_stage_advice(image_path: str, stage_name: str) -> Dict[str, str]:
    """
    Generate farmer-friendly advice for a given stage image via Hugging Face API.

    Args:
        image_path: Path to stage image
        stage_name: Name of biological stage

    Returns:
        Dict: { "stage": stage_name, "advice": "..." }
    """
    try:
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
            json=payload,
            timeout=30
        )

        if response.status_code != 200:
            print(f"Warning: API error for {stage_name}: {response.status_code}")
            return {"stage": stage_name, "advice": get_fallback_advice(stage_name)}

        result = response.json()
        advice_text = ""
        if isinstance(result, list) and len(result) > 0:
            advice_text = result[0].get("generated_text", "")
        elif isinstance(result, dict):
            advice_text = result.get("generated_text", "")
        else:
            advice_text = str(result)

        if not advice_text:
            advice_text = get_fallback_advice(stage_name)

        advice_text = advice_text.strip()
        if not advice_text.endswith(('.', '!', '?')):
            advice_text += '.'

        return {"stage": stage_name, "advice": advice_text}

    except Exception as e:
        print(f"Error generating advice for {stage_name}: {str(e)}")
        return {"stage": stage_name, "advice": get_fallback_advice(stage_name)}

# --------------------------------------------------------------------------
# Text to Speech (TTS)
# --------------------------------------------------------------------------

def save_wave_file(filename: str, pcm: bytes, channels=1, rate=24000, sample_width=2) -> bool:
    """Save PCM bytes from Gemini TTS to a .wav file."""
    try:
        with wave.open(filename, "wb") as wf:
            wf.setnchannels(channels)
            wf.setsampwidth(sample_width)
            wf.setframerate(rate)
            wf.writeframes(pcm)
        return True
    except Exception as e:
        print(f"Error saving audio file {filename}: {str(e)}")
        return False

def text_to_speech(advice_text: str, output_file: str, voice_name: str = "Kore") -> bool:
    """
    Generate TTS audio from text and save to WAV file.
    
    Args:
        advice_text: Text to convert to speech
        output_file: Path to save WAV file
        voice_name: TTS voice
    
    Returns:
        bool: True if successful
    """
    if not client:
        print("Gemini TTS not available. Please set GEMINI_API_KEY.")
        return False

    try:
        print(f"Generating audio for {os.path.basename(output_file)}...")
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=advice_text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=voice_name
                        )
                    )
                ),
            )
        )

        if response.candidates and response.candidates[0].content.parts:
            pcm_data = response.candidates[0].content.parts[0].inline_data.data
            return save_wave_file(output_file, pcm_data)
        else:
            print(f"No audio data returned for {output_file}")
            return False

    except Exception as e:
        print(f"Error generating audio: {str(e)}")
        return False

def generate_stage_audios(stage_advice_list: List[Dict[str, str]], output_dir="stage_audio", voice_name="Kore") -> List[str]:
    """
    Generate TTS audio files for a list of stage advice dicts.
    
    Args:
        stage_advice_list: List of dicts with "stage" and "advice"
        output_dir: Directory to save WAV files
        voice_name: TTS voice
    
    Returns:
        List of paths to generated WAV files
    """
    os.makedirs(output_dir, exist_ok=True)
    audio_files = []

    for item in stage_advice_list:
        stage_name = item.get("stage", "stage_unknown")
        text_content = item.get("advice", "")
        output_path = os.path.join(output_dir, f"{stage_name}.wav")

        success = text_to_speech(text_content, output_path, voice_name)
        if not success:
            # Create empty placeholder file to maintain sequence
            with open(output_path, "wb") as f:
                pass
            print(f"Created placeholder audio: {output_path}")

        audio_files.append(output_path)

    return audio_files
