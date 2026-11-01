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
- `scripts/storyboard/`: builds the storyboard and timeline

Never commit API keys or client videos to this repo. It is public.