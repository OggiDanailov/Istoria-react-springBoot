#!/bin/bash
# Rebuilds the printed documents from the current app and game, and saves them as PDFs.
#   ./tools/print/make-pdfs.sh            → to the Desktop
#   ./tools/print/make-pdfs.sh some/dir   → to that folder
# Needs Node 22 and Playwright with Chrome (as the test scripts do).
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(cd "$HERE/../.." && pwd)"
OUT="${1:-$HOME/Desktop}"; TMP="$(mktemp -d)"
NODE="$(command -v node)"; [ -x /opt/homebrew/opt/node@22/bin/node ] && NODE=/opt/homebrew/opt/node@22/bin/node
( cd "$ROOT/prototypes/hold-the-line" && "$NODE" build.mjs >/dev/null )
( cd "$ROOT/prototypes/age-of-kings" && "$NODE" build.mjs >/dev/null )
wrap() { { echo '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'; cat "$1"; echo '</body></html>'; } > "$2"; }
wrap "$ROOT/prototypes/age-of-kings/index.html" "$TMP/app.html"
wrap "$ROOT/prototypes/hold-the-line/index.html" "$TMP/game.html"
cd "$HERE"
MODE=book PAGE="$TMP/app.html" LANG_=en OUT="$TMP/book-en.json" "$NODE" collect.mjs
MODE=book PAGE="$TMP/app.html" LANG_=bg OUT="$TMP/book-bg.json" "$NODE" collect.mjs
MODE=battles PAGE="$TMP/app.html" OUT="$TMP/battles.json" "$NODE" collect.mjs
MODE=pieces PAGE="$TMP/game.html" OUT="$TMP/pieces.json" "$NODE" collect.mjs
python3 build.py book en "$TMP/book-en.json" "$TMP/book-en.html"
python3 build.py book bg "$TMP/book-bg.json" "$TMP/book-bg.html"
python3 build.py battles "$TMP/battles.json" "$TMP/battles.html"
python3 build.py pieces "$TMP/pieces.json" "$TMP/pieces.html"
python3 build.py kingdom-bg "$TMP/kingdom-bg.html"
pdf() { SRC="$TMP/$1" OUT="$OUT/$2" "$NODE" pdf.mjs && echo "  $2"; }
echo "Saved to $OUT:"
pdf book-en.html "Ave Caesar - the history of Rome.pdf"
pdf book-bg.html "Ave Caesar - историята на Рим (БГ).pdf"
pdf battles.html "Ave Caesar - chapters and battles.pdf"
pdf pieces.html "Hold the Line - soldiers to cut out.pdf"
pdf kingdom-bg.html "Ave Caesar - Римското царство (БГ).pdf"
rm -rf "$TMP"
