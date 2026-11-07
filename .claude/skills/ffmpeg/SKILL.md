---
name: ffmpeg
description: Inspect, convert, compress, trim, cut, join, resize, crop, rotate, speed up, extract audio or frames, make GIFs, add music/watermarks/subtitles, normalize loudness and fix video/audio files with ffmpeg and ffprobe. Use for "перекодируй", "сожми видео", "обрежь видео", "склей", "конвертируй в mp4", "вытащи звук", "сделай gif", "convert/compress/trim this video", or any media file processing.
---

# ffmpeg recipes

Upstream: https://github.com/FFmpeg/FFmpeg - docs https://ffmpeg.org/ffmpeg.html,
filters https://ffmpeg.org/ffmpeg-filters.html. Check `ffmpeg -version`;
install with the OS package manager (`apt-get install -y ffmpeg`, `brew install ffmpeg`).

## Rules

1. **Inspect first**, never guess codecs, duration, rotation or audio streams:
   ```bash
   ffprobe -v error -show_entries format=duration,size,bit_rate:stream=index,codec_type,codec_name,width,height,r_frame_rate,channels,sample_rate -of compact input.mp4
   ```
2. **Never overwrite the input.** Write to a new file; use `-y` only for your own outputs.
3. Prefer **stream copy** (`-c copy`) when only container/trim changes - instant and lossless.
   Re-encode only when filters, codec or size must change.
4. Default delivery: MP4, `-c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart`.
   (`yuv420p` + `faststart` = plays everywhere, starts streaming fast.)
5. Option order matters: options before `-i` apply to that input, after it to the output.
6. Verify the result with ffprobe (duration, streams) and, for visual edits, grab a
   frame: `ffmpeg -y -ss 5 -i out.mp4 -frames:v 1 check.jpg`, then look at it.

## Convert and compress

```bash
# Any -> universal MP4 (H.264/AAC)
ffmpeg -i in.mov -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart out.mp4

# Smaller file: raise CRF (18 visually lossless ... 28 small); H.265 ~40% smaller
ffmpeg -i in.mp4 -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 128k -movflags +faststart small.mp4
ffmpeg -i in.mp4 -c:v libx265 -crf 26 -preset medium -tag:v hvc1 -c:a aac -b:a 128k small_hevc.mp4

# Hit a target size (e.g. 25 MB for messengers): video kbps = 25*8192/duration_s - audio kbps
ffmpeg -y -i in.mp4 -c:v libx264 -b:v 1800k -pass 1 -an -f null /dev/null && \
ffmpeg -i in.mp4 -c:v libx264 -b:v 1800k -pass 2 -c:a aac -b:a 128k out.mp4

# Change container only (mkv -> mp4), no re-encode
ffmpeg -i in.mkv -map 0 -c copy -c:s mov_text out.mp4

# WebM for the web
ffmpeg -i in.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -c:a libopus out.webm
```

## Cut, trim, join

```bash
# Fast trim without re-encoding (cuts land on keyframes)
ffmpeg -ss 00:01:00 -to 00:02:30 -i in.mp4 -c copy clip.mp4
# Frame-accurate trim (re-encode)
ffmpeg -ss 00:01:00 -i in.mp4 -t 90 -c:v libx264 -crf 20 -c:a aac clip.mp4

# Join files with identical codecs/params
printf "file '%s'\n" part1.mp4 part2.mp4 part3.mp4 > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy joined.mp4
# Join different files (re-encode via concat filter)
ffmpeg -i a.mp4 -i b.mp4 -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -crf 20 -c:a aac joined.mp4
```

## Resize, crop, rotate, speed

```bash
ffmpeg -i in.mp4 -vf "scale=-2:720" -c:v libx264 -crf 22 -c:a copy 720p.mp4          # keep aspect, even width
ffmpeg -i in.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 -crf 20 -c:a copy vertical.mp4   # 16:9 -> 9:16 center crop
ffmpeg -i in.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" -c:a copy fit_9x16.mp4  # letterbox
ffmpeg -i in.mp4 -vf "transpose=1" -c:a copy rotated.mp4                              # 90° clockwise
ffmpeg -i in.mp4 -vf "setpts=PTS/2" -af "atempo=2.0" fast2x.mp4                        # 2x speed
ffmpeg -i in.mp4 -vf "fps=30" -c:a copy 30fps.mp4
```

## Audio

```bash
ffmpeg -i in.mp4 -vn -c:a copy audio.m4a                     # extract as is (AAC source)
ffmpeg -i in.mp4 -vn -c:a libmp3lame -q:a 2 audio.mp3        # to MP3
ffmpeg -i in.mp4 -vn -ar 16000 -ac 1 -c:a pcm_s16le speech.wav   # for whisper.cpp
ffmpeg -i in.mp4 -an -c:v copy silent.mp4                    # remove audio
ffmpeg -i in.mp4 -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:v copy norm.mp4   # loudness normalize (-14 for YouTube-style)
# Replace soundtrack / add background music at 20% under voice
ffmpeg -i video.mp4 -i music.mp3 -map 0:v -map 1:a -c:v copy -shortest newaudio.mp4
ffmpeg -i video.mp4 -i music.mp3 -filter_complex "[1:a]volume=0.2[m];[0:a][m]amix=inputs=2:duration=first[a]" -map 0:v -map "[a]" -c:v copy -c:a aac mixed.mp4
```

## Images, GIFs, overlays, text

```bash
ffmpeg -ss 10 -i in.mp4 -frames:v 1 -q:v 2 thumb.jpg                     # one frame
ffmpeg -i in.mp4 -vf "fps=1" frames/%04d.png                              # 1 frame per second
ffmpeg -framerate 30 -i frames/%04d.png -c:v libx264 -pix_fmt yuv420p video.mp4   # image sequence -> video
ffmpeg -loop 1 -i cover.jpg -i audio.mp3 -c:v libx264 -tune stillimage -pix_fmt yuv420p -c:a aac -shortest podcast.mp4
# Good-quality GIF (palette)
ffmpeg -ss 5 -t 4 -i in.mp4 -vf "fps=12,scale=480:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" out.gif
# Watermark/logo in top-right corner
ffmpeg -i in.mp4 -i logo.png -filter_complex "overlay=W-w-20:20" -c:a copy marked.mp4
# Text (needs a font file with Cyrillic; find one: fc-match -f '%{file}' sans)
FONT=$(fc-match -f '%{file}' sans)
ffmpeg -i in.mp4 -vf "drawtext=fontfile=$FONT:text='Привет':fontsize=48:fontcolor=white:box=1:boxcolor=black@0.5:x=(w-tw)/2:y=h-th-60" -c:a copy titled.mp4
# Fade in/out (1 s) for a 30 s clip
ffmpeg -i in.mp4 -vf "fade=in:0:d=1,fade=out:st=29:d=1" -af "afade=in:d=1,afade=out:st=29:d=1" faded.mp4
```

Subtitles (soft/burned): see the `whisper-subtitles` skill.

## Hardware and speed

- `-preset ultrafast|veryfast|medium|slow` trades speed for size. `-threads 0` = auto.
- GPU encoders if present (`ffmpeg -encoders | grep -E "nvenc|qsv|videotoolbox|vaapi"`):
  `-c:v h264_nvenc -cq 23`, `-c:v h264_videotoolbox -q:v 60`.

## Common errors

| Error | Fix |
|---|---|
| `width/height not divisible by 2` | `scale=-2:720` or `pad=ceil(iw/2)*2:ceil(ih/2)*2` |
| Plays in VLC but not on phone/browser | `-pix_fmt yuv420p -movflags +faststart`, H.264/AAC |
| Audio out of sync after `-c copy` trim | re-encode the trim, or `-ss` after `-i` |
| `Unknown encoder 'libx264'` | ffmpeg built without it - install full ffmpeg package |
| `Non-monotonous DTS` on concat | inputs differ - use the concat filter (re-encode) |
| `Unable to find a suitable output format` | missing/odd extension - add `-f mp4` |
