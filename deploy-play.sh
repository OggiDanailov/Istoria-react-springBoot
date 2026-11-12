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

echo "2/3  Copying it to the server..."
scp -q dist/play.html root@45.55.34.96:/root/ave-play-site.html

echo "3/3  Putting it in place..."
ssh root@45.55.34.96 'mv /root/ave-play-site.html /root/ave-play/site/index.html'

echo "Done: https://avecaesar.org/play is updated (reload the page)."
