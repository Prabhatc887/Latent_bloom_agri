

import torch
import os
from diffusers import StableDiffusionImg2ImgPipeline
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"

STAGES = [
    "tomato plant seedling stage, 1-2 true leaves, delicate stem",
    "tomato plant early vegetative stage, 3-4 leaves",
    "young tomato plant vegetative stage, 5-6 leaves",
    "developing tomato plant vegetative stage, side branches forming",
    "mature tomato plant vegetative stage, dense foliage",
    "tomato plant pre-flowering stage, buds forming",
    "tomato plant flowering stage, yellow flowers",
    "tomato plant early fruiting stage, small green fruits",
    "tomato plant mature fruiting stage, red ripe tomatoes"
]

BASE_PROMPT = (
    "high-resolution realistic photo of the same tomato plant, "
    "natural outdoor farm environment, sunlight, same camera angle"
)

NEGATIVE_PROMPT = (
    "mutation, extra stems, deformed, unrealistic, cartoon, blurry"
)

pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    safety_checker=None,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32
).to(device)

pipe.enable_attention_slicing()


def generate_stage_images(
    init_image_path: str,
    output_dir: str,
    strengths=None
):
    os.makedirs(output_dir, exist_ok=True)

    if strengths is None:
        strengths = [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95]

    init_image = (
        Image.open(init_image_path)
        .convert("RGB")
        .resize((512, 512))
    )

    generator = torch.Generator(device=device).manual_seed(42)

    image_paths = []

    for idx, (stage, strength) in enumerate(zip(STAGES, strengths)):
        prompt = f"{BASE_PROMPT}, {stage}"

        with torch.no_grad():
            image = pipe(
                prompt=prompt,
                negative_prompt=NEGATIVE_PROMPT,
                image=init_image,
                strength=strength,
                guidance_scale=7.5,
                num_inference_steps=30,
                generator=generator
            ).images[0]

        save_path = os.path.join(output_dir, f"stage_{idx}.png")
        image.save(save_path)
        image_paths.append(save_path)

    return image_paths
