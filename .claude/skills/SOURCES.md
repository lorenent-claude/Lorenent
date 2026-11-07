# Skill sources

Copied verbatim from upstream repositories (see their licenses):

- `remotion-*` — https://github.com/remotion-dev/remotion, `packages/skills/skills/` @ 5dee2b6
- `hyperframes*`, `figma`, `media-use`, `remotion-to-hyperframes`, `reverse-any-video`, `slideshow`, `style-sampling` — https://github.com/heygen-com/hyperframes, `skills/` @ 7b1d9cc

FFmpeg, whisper.cpp and yt-dlp do not ship agent skills. These were written for this repo
from their official docs:

- `ffmpeg` — https://github.com/FFmpeg/FFmpeg (recipes tested with ffmpeg 6.x)
- `whisper-subtitles` — https://github.com/ggml-org/whisper.cpp (`examples/cli/README.md`)
- `yt-dlp` — https://github.com/yt-dlp/yt-dlp (README options)
To update: re-copy those folders from the latest upstream.
