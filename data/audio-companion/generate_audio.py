"""Generate MP3 audio for CPHL Audio Companion episodes using OpenAI TTS.

Usage:
    export OPENAI_API_KEY=sk-...
    python generate_audio.py scripts/S1-biologie-essentiels.md audio/S1-biologie-essentiels.mp3

Dependencies:
    pip install openai

The script strips markdown formatting, chunks the text to stay under the
TTS character limit, synthesizes each chunk, and concatenates the MP3 bytes.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

from openai import OpenAI

MODEL = "gpt-4o-mini-tts"
VOICE = "alloy"
CHUNK_CHARS = 3500


def strip_markdown(text: str) -> str:
    text = re.sub(r"^---+$", "", text, flags=re.MULTILINE)
    text = re.sub(r"^#+\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\*(.+?)\*", r"\1", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def chunk_text(text: str, limit: int = CHUNK_CHARS) -> list[str]:
    paragraphs = text.split("\n\n")
    chunks: list[str] = []
    buf = ""
    for p in paragraphs:
        if len(buf) + len(p) + 2 <= limit:
            buf = f"{buf}\n\n{p}" if buf else p
        else:
            if buf:
                chunks.append(buf)
            buf = p
    if buf:
        chunks.append(buf)
    return chunks


def synthesize(client: OpenAI, text: str) -> bytes:
    response = client.audio.speech.create(
        model=MODEL,
        voice=VOICE,
        input=text,
        response_format="mp3",
    )
    return response.read()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("script", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not set", file=sys.stderr)
        return 1

    raw = args.script.read_text(encoding="utf-8")
    text = strip_markdown(raw)
    chunks = chunk_text(text)

    client = OpenAI(api_key=api_key)
    args.output.parent.mkdir(parents=True, exist_ok=True)

    with args.output.open("wb") as f:
        for i, chunk in enumerate(chunks, 1):
            print(f"Synthesizing chunk {i}/{len(chunks)} ({len(chunk)} chars)")
            f.write(synthesize(client, chunk))

    print(f"Wrote {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
