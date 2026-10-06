#!/bin/bash
# Brevio installer for macOS - downloads the latest Brevio and puts it in Applications.
# Usage:  curl -fsSL https://abhiramupadrashta.github.io/Brevio/install.sh | bash
# Copyright (c) 2026 Bubbles Aro - MIT License
set -e
URL="https://github.com/AbhiramUpadrashta/Brevio/releases/latest/download/Brevio-mac.zip"
DEST="/Applications"
[ -w "$DEST" ] || { DEST="$HOME/Applications"; mkdir -p "$DEST"; }
echo "▸ Downloading Brevio…"
TMP="$(mktemp -d)"
curl -fsSL -o "$TMP/Brevio.zip" "$URL"
echo "▸ Installing to $DEST"
pkill -x Brevio 2>/dev/null || true; pkill -x Mivelle 2>/dev/null || true
rm -rf "$DEST/Brevio.app" "$DEST/Mivelle.app"
ditto -x -k "$TMP/Brevio.zip" "$DEST"
xattr -dr com.apple.quarantine "$DEST/Brevio.app" 2>/dev/null || true
rm -rf "$TMP"
open "$DEST/Brevio.app"
echo "✅ Brevio is installed and running — say hi to your new friend!"
