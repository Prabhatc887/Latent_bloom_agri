import os
import torch
import gc
import cv2
from PIL import Image
from typing import List

from diffusers import StableDiffusionImg2ImgPipeline, AutoencoderKL
from torchvision import transforms
from fastapi import FastAPI, UploadFile, File
from .tts.tts_generator import generate_stage_advice, text_to_speech
from app.video_audio_sync import sync_audio_with_video

app = FastAPI(title="Plant Growth Video Generator")

BASE_DIR = "app_data"
STAGE_IMG_DIR = os.path.join(BASE_DIR, "stage_images")
FRAMES_DIR = os.path.join(BASE_DIR, "frames")
STAGE_AUDIO_DIR = os.path.join(BASE_DIR, "stage_audio")
FINAL_VIDEO_DIR = os.path.join(BASE_DIR, "final_video")

os.makedirs(STAGE_IMG_DIR, exist_ok=True)
os.makedirs(FRAMES_DIR, exist_ok=True)
os.makedirs(STAGE_AUDIO_DIR, exist_ok=True)
os.makedirs(FINAL_VIDEO_DIR, exist_ok=True)

STAGES = [
    "seedling", "early_seedling", "vegetative", "late_vegetative",
    "pre_flowering", "flowering", "early_fruiting", "fruiting"
]

BASE_PROMPT = (
    "high-resolution realistic photograph of the same plant, detailed leaves and stems, "
    "natural outdoor farm environment, sunlight and shadows, realistic texture, same camera angle, same field, "
    "natural growth progression, outdoor lighting"
)
NEGATIVE_PROMPT = (
    "mutation, extra leaves, extra stems, deformed, unrealistic, cartoon, illustration, blurry, duplicated plant"
)

# ---------------- DEVICE ----------------
if torch.backends.mps.is_available():
    device = "mps"
elif torch.cuda.is_available():
    device = "cuda"
else:
    device = "cpu"

print("Using device:", device)

# ---------------- VAE (FIXED) ----------------
vae = AutoencoderKL.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    subfolder="vae",
    torch_dtype=torch.float32   # ✅ FORCE FLOAT32
).to(device)

vae.eval()

# ---------------- PIPELINE (FIXED) ----------------
sd_pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    safety_checker=None,
    torch_dtype=torch.float32   # ✅ FORCE FLOAT32
)

sd_pipe.enable_attention_slicing()
sd_pipe.enable_vae_slicing()
sd_pipe.to(device)

# ---------------- PREPROCESS ----------------
def preprocess_image(image_path: str):
    image = Image.open(image_path).convert("RGB").resize((250, 250))
    tensor = transforms.ToTensor()(image).unsqueeze(0)
    tensor = tensor * 2 - 1
    return tensor.to(device=device, dtype=torch.float32)  # ✅ ENSURE FLOAT32

def interpolate_latents(z1, z2, num_frames=6):
    return [(1 - t) * z1 + t * z2 for t in torch.linspace(0, 1, num_frames, device=device)]

# ---------------- API ----------------
@app.post("/generate_video/")
async def generate_video(file: UploadFile = File(...)):

    input_image_path = os.path.join(BASE_DIR, "input.png")
    with open(input_image_path, "wb") as f:
        f.write(await file.read())

    init_image = Image.open(input_image_path).convert("RGB").resize((250, 250))

    stage_images = []
    generator = torch.Generator(device=device).manual_seed(42)
    stage_strengths = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]

    # -------- STAGE IMAGE GENERATION --------
    for stage, strength in zip(STAGES, stage_strengths):
        prompt = f"{BASE_PROMPT}, {stage}"
        with torch.no_grad():
            img = sd_pipe(
                prompt=prompt,
                negative_prompt=NEGATIVE_PROMPT,
                image=init_image,
                strength=strength,
                guidance_scale=7.5,
                num_inference_steps=30,
                generator=generator
            ).images[0]

        save_path = os.path.join(STAGE_IMG_DIR, f"{stage}.png")
        img.save(save_path)
        stage_images.append(save_path)

    # -------- LATENT ENCODING (FIXED) --------
    preprocessed = [preprocess_image(p) for p in stage_images]

    with torch.no_grad():
        latents = [
            0.18215 * vae.encode(img.float()).latent_dist.sample()  # ✅ FIX
            for img in preprocessed
        ]

    # -------- INTERPOLATION --------
    all_frames = []
    for i in range(len(latents) - 1):
        inter_latents = interpolate_latents(latents[i], latents[i + 1], num_frames=24)
        with torch.no_grad():
            for latent in inter_latents:
                img = vae.decode(latent / 0.18215).sample
                img = (img / 2 + 0.5).clamp(0, 1)
                frame = img.permute(0, 2, 3, 1).cpu().numpy()[0]
                all_frames.append(frame)

                del img, latent
                gc.collect()

    # -------- VIDEO WRITE --------
    frame_height, frame_width, _ = all_frames[0].shape
    video_path = os.path.join(FINAL_VIDEO_DIR, "plant_growth_video.avi")
    fps = 24
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    video_writer = cv2.VideoWriter(video_path, fourcc, fps, (frame_width, frame_height))

    for frame in all_frames:
        frame_uint8 = (frame * 255).astype("uint8")
        bgr_frame = cv2.cvtColor(frame_uint8, cv2.COLOR_RGB2BGR)
        video_writer.write(bgr_frame)
    video_writer.release()

    # # -------- AUDIO --------
    # stage_audio_files = []
    # for stage, img_path in zip(STAGES, stage_images):
    #     print(f"Generating advice for stage: {stage}")
    #     advice_dict = generate_stage_advice(img_path, stage)
    #     advice_text = advice_dict["advice"]
    #     print(f"Generated advice for {stage}: {advice_text}")
    #     audio_file = os.path.join(STAGE_AUDIO_DIR, f"{stage}.wav")
    #     text_to_speech(advice_text, output_file=audio_file)
    #     stage_audio_files.append(audio_file)

    final_video_path = os.path.join(FINAL_VIDEO_DIR, "plant_growth_video_final.mp4")
    sync_audio_with_video(
        video_path=video_path,
        audio_dir=STAGE_AUDIO_DIR,
        stages=STAGES,
        output_path=final_video_path
    )

    return {"final_video": final_video_path}
