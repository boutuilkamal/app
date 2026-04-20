# CPHL Audio Companion

Scripts and audio files for the coach-onboarding audio series.

## Layout

- `scripts/` — Markdown episode scripts, source of truth.
- `audio/` — Generated MP3 output (gitignored; regenerate on demand).
- `generate_audio.py` — OpenAI TTS synthesis script.

## Generate an episode

```bash
pip install openai
export OPENAI_API_KEY=sk-...
python data/audio-companion/generate_audio.py \
    data/audio-companion/scripts/S1-biologie-essentiels.md \
    data/audio-companion/audio/S1-biologie-essentiels.mp3
```

The script strips markdown, chunks the text under the TTS character limit,
and concatenates MP3 chunks. Voice and model are configured at the top of
`generate_audio.py` (default: `gpt-4o-mini-tts`, voice `alloy`). For a
French-native voice, try `nova` or `shimmer`.

## Alternative providers

- ElevenLabs (higher-quality French): swap the `synthesize()` body for an
  ElevenLabs SDK call — the chunking and concat logic is identical.
- Local `espeak-ng` (no API key, robotic quality):
  `espeak-ng -v fr -f script.txt -w out.wav`.

## Episodes

| ID | Title | Duration |
|----|-------|----------|
| S1 | Essentiels de Biologie pour les Conversations avec les Clients | 9–11 min |
