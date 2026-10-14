#!/bin/sh
# ABOUTME: Runs the app's built-in --self-test twice on macOS and fails if any check fails.
# ABOUTME: The second run proves saved storage survives a restart; snapshots go to the printed output folder.
set -eu

APP=${1:-/Applications/Lazy Eye Blocks.app}
OUT=$(mktemp -d "${TMPDIR:-/tmp}/lazyeyeblocks-selftest.XXXXXX")
echo "Output: $OUT"

for RUN in 1 2; do
    echo "== run $RUN"
    open -W -n --stdout "$OUT/run$RUN.log" --stderr "$OUT/run$RUN.err" "$APP" --args --self-test "$OUT/run$RUN"
    cat "$OUT/run$RUN.log"
    grep -q '"passed":true,"test":"summary"' "$OUT/run$RUN.log" || { echo "Self-test run $RUN failed" >&2; exit 1; }
done
if grep -q '"detail":"<null>","passed":true,"test":"previous storage marker"' "$OUT/run2.log"; then
    echo "Local storage did not persist between runs" >&2
    exit 1
fi
echo "All self-test checks passed"
