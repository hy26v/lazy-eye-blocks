#!/bin/sh
# ABOUTME: Builds the macOS app on a remote Mac over SSH and copies the .dmg back to dist-mac/.
# ABOUTME: Usage: macos/build-remote.sh user@mac-host (for example over Tailscale SSH); run 'npm run build:prod' first.
set -eu

HOST=${1:?usage: macos/build-remote.sh user@mac-host}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
REMOTE_DIR=$(ssh "$HOST" 'mktemp -d "${TMPDIR:-/tmp}/lazyeyeblocks-src.XXXXXX"')
trap 'ssh "$HOST" "rm -rf \"$REMOTE_DIR\""' EXIT INT TERM

# The Mac build only needs the web build, the macOS sources and package.json (for the version).
rsync -a --exclude archive "$ROOT/package.json" "$ROOT/docs" "$ROOT/macos" "$HOST:$REMOTE_DIR/"
ssh "$HOST" "SIGN_IDENTITY='${SIGN_IDENTITY:--}' NOTARY_PROFILE='${NOTARY_PROFILE:-}' sh '$REMOTE_DIR/macos/build.sh'"

mkdir -p "$ROOT/dist-mac"
rsync -a "$HOST:$REMOTE_DIR/dist-mac/" "$ROOT/dist-mac/"
ls -l "$ROOT"/dist-mac/*.dmg
