import requests
from PIL import Image
import base64
import io
import requests
from PIL import Image
import base64
import io
import os
import wave
from typing import Dict, List
from typing import Dict, List
from google import genai
from google.genai import types

import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")
HF_MODEL = "Salesforce/blip-image-captioning-base"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print(f"Hugging Face API Key: {HF_API_KEY}")
print(f"Gemini API Key: {GEMINI_API_KEY}")

if GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        print("Gemini client initialized successfully")
    except Exception as e:
        print(f"Failed to initialize Gemini client: {e}")
        client = None
else:
    print("GEMINI_API_KEY not found. TTS will be disabled.")


# --------------------------------------------------------------------------
# Image to Text (Stage Advice Generation)
# --------------------------------------------------------------------------

def pil_image_to_base64(image: Image.Image) -> str:
    """Convert PIL image to base64 string for API call."""
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str

def generate_stage_advice(image_path: str, stage_name: str) -> Dict[str, str]:
    """
    Generate farmer-friendly advice for a given stage image via API.
    Improved with error handling for main.py integration.

    Args:
        image_path: Path to stage image
        stage_name: Name of biological stage

    Returns:
        Dict: { "stage": stage_name, "advice": "..." }
    """
    try:
        # Load and resize image
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
            timeout=30  # Added timeout
        )

        if response.status_code != 200:
            # Don't crash, return fallback advice
            print(f"Warning: API error for {stage_name}: {response.status_code}")
            # Return stage-specific fallback advice
            fallback_advice = get_fallback_advice(stage_name)
            return {
                "stage": stage_name,
                "advice": fallback_advice
            }

        result = response.json()
        print(f"API response for {stage_name}: {result}")

        # Handle different response formats
        if isinstance(result, list) and len(result) > 0:
            advice_text = result[0].get("generated_text", "")
        elif isinstance(result, dict):
            advice_text = result.get("generated_text", "")
        else:
            advice_text = str(result)

        # Clean up and ensure we have valid text
        if not advice_text or advice_text == "No advice returned":
            advice_text = get_fallback_advice(stage_name)

        # Ensure text is suitable for TTS
        advice_text = advice_text.strip()
        if not advice_text.endswith(('.', '!', '?')):
            advice_text += '.'

        return {
            "stage": stage_name,
            "advice": advice_text
        }

    except Exception as e:
        # Catch all exceptions to prevent main.py from crashing
        print(f"Error generating advice for {stage_name}: {str(e)}")
        return {
            "stage": stage_name,
            "advice": get_fallback_advice(stage_name)
        }

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

# --------------------------------------------------------------------------
# Text to Audio (TTS) - Modified for main.py integration
# --------------------------------------------------------------------------

def save_wave_file(filename: str, pcm: bytes, channels=1, rate=24000, sample_width=2):
    """
    Save PCM bytes from Gemini TTS to a .wav file
    """
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
def text_to_speech(advice_text: str, output_file: str, voice_name: str = "Kore") -> bool:
    """
    Generate TTS audio from text and save to file.
    This function is called from main.py for each stage.
    
    Generate TTS audio from text and save to file.
    This function is called from main.py for each stage.
    
    Args:
        advice_text: Text to convert to speech
        output_file: Path where to save the WAV file
        voice_name: TTS voice to use
        
        advice_text: Text to convert to speech
        output_file: Path where to save the WAV file
        voice_name: TTS voice to use
        
    Returns:
        bool: True if successful, False otherwise
    """
    if not client:
        print("Gemini TTS not available. Please set GEMINI_API_KEY.")
        return False
    
    try:
        print(f"Generating audio for {os.path.basename(output_file)}...")
        bool: True if successful, False otherwise
    """
    if not client:
        print("Gemini TTS not available. Please set GEMINI_API_KEY.")
        return False
    
    try:
        print(f"Generating audio for {os.path.basename(output_file)}...")
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",  # Use stable model instead of preview
            model="gemini-2.0-flash-exp",  # Use stable model instead of preview
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
            if save_wave_file(output_file, pcm_data):
                print(f"✓ Audio saved: {output_file}")
                return True
            else:
                print(f"✗ Failed to save audio: {output_file}")
                return False
        else:
            print(f"✗ No audio data returned for {output_file}")
            return False
            
    except Exception as e:
        print(f"✗ Error generating audio: {str(e)}")
        return False

def generate_stage_audios(stage_advice_list: List[str], output_dir="stage_audio", voice_name="Kore"):
    """
    Generate TTS audio files from a list of stage advice strings.
    Modified to handle the list format from main.py.
    
    Args:
        stage_advice_list: List of strings (or dicts with advice text), one per stage
        output_dir: Directory to save WAV files
        voice_name: TTS voice
        
    Returns:
        List of generated audio file paths (same order as input)
    """
    os.makedirs(output_dir, exist_ok=True)
    audio_files = []

    for idx, item in enumerate(stage_advice_list):
        # Extract text from either string or dict
        if isinstance(item, dict) and "stage" in item:
            stage_name = item["stage"]
            text_content = item["advice"]
            output_path = os.path.join(output_dir, f"{stage_name}.wav")
        else:
            stage_name = f"stage_{idx+1}"
            text_content = str(item)
            output_path = os.path.join(output_dir, f"{stage_name}.wav")
        
        # Generate audio
        success = text_to_speech(text_content, output_path, voice_name)
        if success or os.path.exists(output_path):  # Add even if failed to maintain sequence
            audio_files.append(output_path)
        else:
            # Create empty file as placeholder to maintain sequence
            with open(output_path, "wb") as f:
                pass
            audio_files.append(output_path)
            print(f"Created placeholder file: {output_path}")
        if response.candidates and response.candidates[0].content.parts:
            pcm_data = response.candidates[0].content.parts[0].inline_data.data
            if save_wave_file(output_file, pcm_data):
                print(f"✓ Audio saved: {output_file}")
                return True
            else:
                print(f"✗ Failed to save audio: {output_file}")
                return False
        else:
            print(f"✗ No audio data returned for {output_file}")
            return False
            
    except Exception as e:
        print(f"✗ Error generating audio: {str(e)}")
        return False

def generate_stage_audios(stage_advice_list: List[str], output_dir="stage_audio", voice_name="Kore"):
    """
    Generate TTS audio files from a list of stage advice strings.
    Modified to handle the list format from main.py.
    
    Args:
        stage_advice_list: List of strings (or dicts with advice text), one per stage
        output_dir: Directory to save WAV files
        voice_name: TTS voice
        
    Returns:
        List of generated audio file paths (same order as input)
    """
    os.makedirs(output_dir, exist_ok=True)
    audio_files = []

    for idx, item in enumerate(stage_advice_list):
        # Extract text from either string or dict
        if isinstance(item, dict) and "stage" in item:
            stage_name = item["stage"]
            text_content = item["advice"]
            output_path = os.path.join(output_dir, f"{stage_name}.wav")
        else:
            stage_name = f"stage_{idx+1}"
            text_content = str(item)
            output_path = os.path.join(output_dir, f"{stage_name}.wav")
        
        # Generate audio
        success = text_to_speech(text_content, output_path, voice_name)
        if success or os.path.exists(output_path):  # Add even if failed to maintain sequence
            audio_files.append(output_path)
        else:
            # Create empty file as placeholder to maintain sequence
            with open(output_path, "wb") as f:
                pass
            audio_files.append(output_path)
            print(f"Created placeholder file: {output_path}")

    return audio_files