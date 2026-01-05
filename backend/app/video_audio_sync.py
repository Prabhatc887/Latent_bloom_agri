import os
from moviepy.editor import (
    VideoFileClip,
    AudioFileClip,
    ImageClip,
    concatenate_videoclips
)

def sync_audio_with_video(
    video_path: str,
    audio_dir: str,
    stages: list,
    output_path: str,
    fps: int = 24
):
    """
    Syncs stage audio files with the video frames to produce final video.

    Args:
        video_path: Path to input video (generated from frames)
        audio_dir: Directory containing stage audio files (WAV/MP3)
        stages: List of stage names (stage_1, stage_2, ...)
        output_path: Path to save the final video
        fps: Frame rate for output video
    """

    # Load the generated video
    video = VideoFileClip(video_path)
    total_duration = video.duration
    stage_video_duration = total_duration / len(stages)

    final_clips = []

    for i, stage in enumerate(stages):
        audio_path_wav = os.path.join(audio_dir, f"{stage}.wav")
        audio_path_mp3 = os.path.join(audio_dir, f"{stage}.mp3")

        # Use WAV first, fallback to MP3
        audio_path = audio_path_wav if os.path.exists(audio_path_wav) else audio_path_mp3
        if not os.path.exists(audio_path):
            print(f"Warning: Audio not found for stage {stage}")
            continue

        audio = AudioFileClip(audio_path)

        start = i * stage_video_duration
        end = min((i + 1) * stage_video_duration, video.duration - 0.05)

        stage_video = video.subclip(start, end)

        # If narration longer → freeze last frame
        if audio.duration > stage_video.duration:
            last_frame = stage_video.get_frame(stage_video.duration - 0.04)
            freeze_clip = ImageClip(last_frame).set_duration(
                audio.duration - stage_video.duration
            )
            stage_video = concatenate_videoclips([stage_video, freeze_clip])

        # Set stage audio and exact duration
        stage_video = stage_video.set_audio(audio)
        stage_video = stage_video.set_duration(audio.duration)

        final_clips.append(stage_video)

    # Concatenate all stage clips
    final_video = concatenate_videoclips(final_clips, method="compose")

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Write final video
    final_video.write_videofile(
        output_path,
        codec="libx264",
        audio_codec="aac",
        fps=fps,
        preset="medium",
        threads=4
    )

    return output_path
