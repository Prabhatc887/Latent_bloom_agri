
import torch
import gc
import os
import numpy as np
from diffusers import AutoencoderKL
from PIL import Image
from torchvision import transforms

device = "cuda" if torch.cuda.is_available() else "cpu"

vae = AutoencoderKL.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    subfolder="vae",
    torch_dtype=torch.float16 if device == "cuda" else torch.float32
).to(device)

vae.eval()


def preprocess(image_path: str):
    image = Image.open(image_path).convert("RGB").resize((512, 512))
    tensor = transforms.ToTensor()(image)
    tensor = tensor.unsqueeze(0) * 2 - 1   # [-1, 1]
    return tensor.to(device=device, dtype=vae.dtype)


def interpolate_latents(z1, z2, num_frames=24):
    return [
        (1 - t) * z1 + t * z2
        for t in torch.linspace(0, 1, num_frames, device=device)
    ]



def generate_interpolated_frames(
    stage_image_paths: list,
    output_dir: str,
    frames_per_stage: int = 24
):
    os.makedirs(output_dir, exist_ok=True)

    # 1. Preprocess images
    images = [preprocess(p) for p in stage_image_paths]

    # 2. Encode to latents
    with torch.no_grad():
        latents = [
            0.18215 * vae.encode(img).latent_dist.sample()
            for img in images
        ]

    # 3. Interpolate latents
    interpolated_latents = []
    for i in range(len(latents) - 1):
        interpolated_latents.extend(
            interpolate_latents(
                latents[i],
                latents[i + 1],
                frames_per_stage
            )
        )

    # 4. Decode frames
    frame_paths = []
    with torch.no_grad():
        for idx, latent in enumerate(interpolated_latents):
            image = vae.decode(latent / 0.18215).sample
            image = (image / 2 + 0.5).clamp(0, 1)

            frame = image.permute(0, 2, 3, 1).cpu().numpy()[0]
            frame = (frame * 255).astype(np.uint8)

            save_path = os.path.join(output_dir, f"frame_{idx:05d}.png")
            Image.fromarray(frame).save(save_path)
            frame_paths.append(save_path)

            # cleanup
            del image, latent
            torch.cuda.empty_cache()
            gc.collect()

    return frame_paths
