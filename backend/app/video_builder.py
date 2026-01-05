# app/video_builder.py

import cv2
import numpy as np
import os

def frames_to_video(
    frames,
    output_dir,
    video_name="plant_growth_video.mp4",
    fps=24,
    pause_seconds=10,
    num_stages=8
):
    """
    Convert frames into a video, adding pause at the end of each stage.
    
    Args:
        frames: list of numpy arrays (RGB, float [0,1])
        output_dir: folder to save video
        video_name: output file name
        fps: frames per second
        pause_seconds: duration of pause per stage
        num_stages: total biological stages
    """
    os.makedirs(output_dir, exist_ok=True)
    video_path = os.path.join(output_dir, video_name)

    pause_frames = int(fps * pause_seconds)
    frame_height, frame_width, _ = frames[0].shape

    # Use mp4 codec for wide compatibility
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    video_writer = cv2.VideoWriter(video_path, fourcc, fps, (frame_width, frame_height))

    frames_per_stage = len(frames) // num_stages

    for stage in range(num_stages):
        stage_start = stage * frames_per_stage
        stage_end = (stage + 1) * frames_per_stage
        stage_frames = frames[stage_start:stage_end]

        # Write normal frames
        for frame in stage_frames:
            frame_uint8 = (frame * 255).astype(np.uint8)
            bgr_frame = cv2.cvtColor(frame_uint8, cv2.COLOR_RGB2BGR)
            video_writer.write(bgr_frame)

        # Freeze last frame for pause
        freeze_frame = stage_frames[-1]
        freeze_uint8 = (freeze_frame * 255).astype(np.uint8)
        freeze_bgr = cv2.cvtColor(freeze_uint8, cv2.COLOR_RGB2BGR)
        for _ in range(pause_frames):
            video_writer.write(freeze_bgr)

    video_writer.release()
    return video_path
