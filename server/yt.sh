#! /usr/bin/env bash

echo "'$1'"

ID=$(python server/geturl.py "$1")

if [ -f "audio/${ID}.mp3" ]; then
    echo "file downloaded"
    echo "[ffmpeg] Post-process file ${ID}.mp3"
else
    cd audio
    youtube-dl -f bestaudio --no-progress -w -o "%(id)s.%(ext)s" --no-post-overwrites --extract-audio --audio-format mp3 --audio-quality 7 -- "https://youtube.com/watch?v=${ID}" 2>&1
fi
