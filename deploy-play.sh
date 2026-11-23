#!/bin/sh
# Puts the latest test version of the game on https://avecaesar.org/play in one step:
# builds it, copies it to the server and moves it into place. Run it on the Mac, from anywhere:
#   ./deploy-play.sh
# It uses your SSH key, as when you log in to the server yourself. Nothing on the server needs restarting.
set -e
cd "$(dirname "$0")/prototypes/age-of-kings"

NODE=$(command -v node || echo /opt/homebrew/opt/node@22/bin/node)
echo "1/3  Building the game..."
"$NODE" build.mjs

# One connection for all three steps, so the key's passphrase is asked only once
SOCK="${TMPDIR:-/tmp}/ave-play-ssh-$$"
SSHO="-o ControlMaster=auto -o ControlPath=$SOCK -o ControlPersist=60"
trap 'ssh -o ControlPath="$SOCK" -O exit root@45.55.34.96 2>/dev/null || true' EXIT

echo "2/3  Copying it to the server..."
scp $SSHO dist/manifest.webmanifest dist/icon-180.png dist/icon-192.png dist/icon-512.png root@45.55.34.96:/root/ave-play/site/   # what lets a phone install it as an app
scp $SSHO dist/play.html root@45.55.34.96:/root/ave-play-site.html

echo "3/3  Putting it in place..."
ssh $SSHO root@45.55.34.96 'mv /root/ave-play-site.html /root/ave-play/site/index.html'

echo "Done: https://avecaesar.org/play is updated (reload the page)."
