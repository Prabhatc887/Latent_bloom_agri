import os
import wave
from google import genai
from google.genai import types


API_KEY = "AIzaSyBsVXa-iG1YBZPbGDkvuR56cZKtebJ1ej8"
client = genai.Client(api_key=API_KEY)


def save_wave_file(filename: str, pcm: bytes, channels=1, rate=24000, sample_width=2):
    """
    Save PCM bytes from Gemini TTS to a .wav file
    """
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)


def generate_stage_audios(stage_advice_list: list[str], output_dir="stage_audio", voice_name="Kore"):
    """
    Generate TTS audio files from a list of stage advice strings.

    Args:
        stage_advice_list: List of strings, one per stage
        output_dir: Directory to save WAV files
        voice_name: TTS voice
    Returns:
        List of generated audio file paths
    """
    os.makedirs(output_dir, exist_ok=True)
    audio_files = []

    for idx, advice_text in enumerate(stage_advice_list):
        stage_name = f"stage_{idx+1}"
        output_path = os.path.join(output_dir, f"{stage_name}.wav")

        print(f"Generating audio for {stage_name}...")
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
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

        pcm_data = response.candidates[0].content.parts[0].inline_data.data
        save_wave_file(output_path, pcm_data)
        print(f"Saved audio: {output_path}")

        audio_files.append(output_path)

    return audio_files
