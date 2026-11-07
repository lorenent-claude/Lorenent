---
name: whisper-subtitles
description: Transcribe speech and make subtitles (SRT, VTT, TXT, JSON with word timestamps) locally and offline with whisper.cpp, then optionally burn or embed them into the video with ffmpeg; also translate speech to English. Use for "сделай субтитры", "расшифруй аудио", "транскрипция", "распознай речь", "transcribe", "captions", "subtitles for this video".
---

# Subtitles and transcripts with whisper.cpp

Upstream: https://github.com/ggml-org/whisper.cpp (CLI reference:
`examples/cli/README.md`, or `whisper-cli -h`). Runs fully on the local CPU/GPU;
no API key, the audio never leaves the machine.

## 1. Get whisper-cli and a model

Check first: `command -v whisper-cli || ls ~/whisper.cpp/build/bin/whisper-cli`.
Otherwise (ask before building third-party code if the environment requires it):

```bash
git clone --depth 1 https://github.com/ggml-org/whisper.cpp ~/whisper.cpp
cd ~/whisper.cpp
cmake -B build -DCMAKE_BUILD_TYPE=Release        # add -DGGML_CUDA=1 for NVIDIA, Metal is auto on macOS
cmake --build build -j --config Release --target whisper-cli
sh ./models/download-ggml-model.sh large-v3-turbo   # downloads models/ggml-large-v3-turbo.bin from Hugging Face
# macOS alternative: brew install whisper-cpp
```

Models come only from Hugging Face (`huggingface.co`, redirects to
`cas-bridge.xethub.hf.co`). If the script prints `Failed to download ggml model`
in a sandbox, check `curl -sI https://huggingface.co` - a proxy 403 means the
network policy must allow those hosts (or the person copies a `ggml-*.bin` file in).
`models/for-tests-ggml-*.bin` are empty stubs for CI: they run but transcribe nothing.

Choosing a model (multilingual unless it ends with `.en`):

| Model | Size | When |
|---|---|---|
| `tiny`, `base` | 75-142 MB | quick drafts, weak CPU |
| `small` | 466 MB | decent quality for Russian on CPU |
| `medium` | 1.5 GB | good quality, slower |
| `large-v3-turbo` (`-q5_0` ~550 MB) | 1.6 GB | **default choice**: near large-v3 quality, much faster |
| `large-v3` | 2.9 GB | max quality |

For Russian or any non-English speech never use `*.en` models.

## 2. Prepare audio (16 kHz mono 16-bit WAV)

whisper-cli reads wav/mp3/flac/ogg, but convert to be safe and to pull audio out of video:

```bash
ffmpeg -y -i input.mp4 -vn -ar 16000 -ac 1 -c:a pcm_s16le audio.wav
```

## 3. Transcribe

```bash
W=~/whisper.cpp/build/bin/whisper-cli
M=~/whisper.cpp/models/ggml-large-v3-turbo.bin

# SRT + VTT + plain text, Russian, output files audio.srt / audio.vtt / audio.txt
$W -m $M -f audio.wav -l ru -osrt -ovtt -otxt -of out/audio -t $(nproc) -pp

# Auto-detect language (pin it with -l whenever you know it - more accurate)
$W -m $M -f audio.wav -l auto -osrt -of out/audio

# Translate any speech to English subtitles
$W -m $M -f audio.wav -l ru -tr -osrt -of out/audio.en

# Short subtitle lines (~42 chars) split on words - better for video
$W -m $M -f audio.wav -l ru -osrt -ml 42 -sow -of out/audio

# Word-level timestamps for animated/karaoke captions (Remotion, HyperFrames)
$W -m $M -f audio.wav -l ru -ojf -of out/audio     # out/audio.json with per-token offsets
```

Accuracy helpers:
- `--prompt "Имена: Лоренент, Remotion, HyperFrames."` - spelling of names/terms.
- Music, silence or noise produce hallucinated text (repeats, random language).
  Pin `-l`, add `-sns -nf`, and/or use VAD:
  `sh ./models/download-vad-model.sh silero-v6.2.0` then
  `--vad -vm models/ggml-silero-v6.2.0.bin`.
- Long files: just run; `-pp` shows progress. `-ot/-d` (ms) process a slice.
- Stereo interview with one speaker per channel: `-di` (diarization by channel).

## 4. Put subtitles into the video

```bash
# Soft subtitles (switchable track, no re-encode). MP4 needs mov_text; MKV keeps SRT as is.
ffmpeg -y -i input.mp4 -i out/audio.srt -map 0 -map 1 -c copy -c:s mov_text \
  -metadata:s:s:0 language=rus output.mp4

# Burned-in (hardcoded) subtitles - re-encodes video
ffmpeg -y -i input.mp4 -vf "subtitles=out/audio.srt:force_style='FontName=DejaVu Sans,FontSize=22,Outline=2,MarginV=40'" \
  -c:v libx264 -crf 20 -preset medium -c:a copy output_burned.mp4
```

Burning requires ffmpeg built with libass (`ffmpeg -filters | grep subtitles`).
Escape `:` `'` `,` in the subtitle path or copy the .srt to a simple name first.

## 5. Check and report

- Open the .srt, read the first and last few cues: timing sane, language right,
  no repeated lines. Fix obvious name typos by hand or rerun with `--prompt`.
- Report output paths, model used, language, duration.
- For styled animated captions inside a composition use `remotion-captions` or
  the HyperFrames skills with the JSON output; for downloading the source media
  use the `yt-dlp` skill; for other conversions the `ffmpeg` skill.
