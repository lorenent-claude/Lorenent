---
name: yt-dlp
description: Download video, audio, subtitles, thumbnails or metadata from YouTube and ~1800 other sites with yt-dlp - pick quality/format, extract MP3/M4A, grab only a time range, download playlists or channels, use cookies for logged-in content. Use for "скачай видео", "скачать с YouTube", "вытащи аудио", "скачай субтитры", "download this video/playlist", or any media URL the person wants saved locally.
---

# yt-dlp: download media

Upstream: https://github.com/yt-dlp/yt-dlp (options: `yt-dlp --help`, README "USAGE AND OPTIONS").

## 0. Respect rights

Download only what the person may save: their own uploads, public-domain or
Creative Commons media, or content the site's terms allow. Do not help bypass
DRM or paywalls - yt-dlp does not support DRM-protected streams anyway.

## 1. Setup (check before installing)

```bash
yt-dlp --version || python3 -m pip install -U "yt-dlp[default]"
ffmpeg -version | head -1      # needed to merge video+audio and convert audio
```

- `yt-dlp[default]` pulls in `yt-dlp-ejs`. Full YouTube support also needs a JS
  runtime: **deno** (recommended) or node. Without one, YouTube may offer only a
  few formats or fail - warn the person, install deno if allowed.
- Sites change often: on an extractor error, first `pip install -U yt-dlp`
  (or `yt-dlp -U` for the binary build), then retry.
- In a sandbox / cloud container the site's host may be blocked by the network
  policy: say so plainly instead of guessing.

## 2. Look before downloading

```bash
yt-dlp -F URL                         # list formats (id, ext, resolution, codec, size)
yt-dlp --list-subs URL                # available subtitles (manual + auto)
yt-dlp -J --no-playlist URL > info.json   # full metadata as JSON (title, duration, chapters...)
yt-dlp --print "%(title)s | %(duration_string)s | %(uploader)s" URL
yt-dlp --flat-playlist --print "%(playlist_index)s %(title)s %(url)s" PLAYLIST_URL
```

## 3. Recipes

Always pass an output template so files land where expected; quote URLs.

```bash
OUT='-P downloads -o %(title).150B [%(id)s].%(ext)s'

# Best quality, merged into MP4 (H.264/AAC preferred for compatibility)
yt-dlp $OUT -S "res,ext:mp4:m4a" --merge-output-format mp4 URL

# Cap resolution at 1080p
yt-dlp $OUT -S "res:1080,ext:mp4:m4a" --merge-output-format mp4 URL

# Audio only -> MP3 (or m4a / opus / wav / flac)
yt-dlp $OUT -x --audio-format mp3 --audio-quality 0 URL

# Audio for transcription with whisper.cpp: 16 kHz mono WAV directly
yt-dlp $OUT -x --audio-format wav --postprocessor-args "ffmpeg:-ar 16000 -ac 1" URL

# Only a fragment (time range or chapter); add --force-keyframes-at-cuts for exact cuts
yt-dlp $OUT --download-sections "*00:01:30-00:02:45" URL
yt-dlp $OUT --download-sections "intro" URL

# Subtitles only (manual + auto-generated), converted to SRT
yt-dlp $OUT --skip-download --write-subs --write-auto-subs --sub-langs "ru,en.*" --convert-subs srt URL

# Video with embedded subs, thumbnail, metadata and chapters
yt-dlp $OUT --embed-subs --sub-langs "ru,en" --embed-thumbnail --embed-metadata --embed-chapters URL

# Playlist / channel into numbered files, resumable
yt-dlp -P downloads -o "%(playlist_title)s/%(playlist_index)03d - %(title)s.%(ext)s" \
  --download-archive downloads/archive.txt -S "res:1080" URL
yt-dlp $OUT -I 1:5 PLAYLIST_URL       # only items 1-5
yt-dlp $OUT --no-playlist URL         # a video URL that also carries &list=...

# Split by chapters into separate files
yt-dlp $OUT --split-chapters URL
```

Useful extras: `--restrict-filenames` (ASCII-only names), `--limit-rate 5M`,
`-N 4` (parallel fragments), `--write-thumbnail`, `--write-info-json`,
`--print after_move:filepath` (print the final path - use it to chain the next
step), `--cookies cookies.txt` or `--cookies-from-browser firefox` for content
that needs the person's login (only with their consent; never ask them to paste
cookies into chat).

## 4. Format selection cheat sheet

- `-f` picks explicitly: `-f "bv*+ba/b"` (default), `-f 137+140`, `-f "ba"`.
- `-S` sorts preferences and is usually better: `res:720`, `vcodec:h264`,
  `acodec:aac`, `filesize~50M`, `+size` (smallest), `fps`.
- `--merge-output-format mp4|mkv|webm`; `--remux-video mp4` changes container
  without re-encoding; `--recode-video mp4` re-encodes (slow).

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| `Sign in to confirm you're not a bot` / 403 | update yt-dlp; install deno; try `--cookies-from-browser` with consent |
| Only low formats on YouTube | missing JS runtime / yt-dlp-ejs |
| `ffmpeg not found`, separate .f137/.f140 files | install ffmpeg or pass `--ffmpeg-location` |
| `Requested format is not available` | run `-F`, relax `-f`, prefer `-S` |
| Filename errors | `--restrict-filenames` or shorter template (`%(title).80B`) |

After downloading, report the saved path(s), size, duration and format
(`ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height -of compact FILE`).
For further processing hand off to the `ffmpeg` skill; for transcripts/subtitles
to the `whisper-subtitles` skill.
