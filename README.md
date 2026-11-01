# Kakashi Minja

AI video editing rendered in GitHub Actions: Remotion draws the edit, Whisper makes the captions, FFmpeg masters the audio.

## How it runs

1. Put the raw video in Google Drive.
2. **Prep video**: makes the transcript and preview.
3. **Grab clean frames**: frames, voice track, silences and audio levels for the storyboard.
4. **Render from Google Drive**: `draft` for a quick test, `final` for full quality. The final video is uploaded to Drive.

## Needs these repository secrets

`GDRIVE_CLIENT_ID`, `GDRIVE_CLIENT_SECRET`, `GDRIVE_REFRESH_TOKEN`

## Main files

- `src/compositions/proedit/`: the Pro Edit template and its timeline
- `.claude/skills/`: `pro-edit-0-1` (whaleyxbt/claude-motion, MIT) and `pro-edit` (Barty-Bart/motion-graphics, MIT)
- `.claude/skills/hyperframes*`, `media-use`: HyperFrames skills (heygen-com/hyperframes, Apache-2.0)
- `scripts/install-remotion-skills.sh`: installs the official Remotion skills on demand
- `scripts/storyboard/`: builds the storyboard and timeline

## Extra tools (installed inside the workflows)

- yt-dlp 2026.10.26: downloads reference reels to Drive
- auto-editor 29.3.1: removes silence
- PySceneDetect 0.7.2: finds scene cuts
- whisperX 3.8.6: more exact word timing

Never commit API keys or client videos to this repo. It is public.