#!/bin/sh
# ABOUTME: Builds the offline macOS app (universal arm64 + x86_64) and its .dmg installer from the docs/ web build.
# ABOUTME: Runs on macOS with Xcode command line tools; set SIGN_IDENTITY / NOTARY_PROFILE to sign and notarize.
set -eu

ROOT=$(cd "$(dirname "$0")/.." && pwd)
OUT="$ROOT/dist-mac"
APP_NAME="Lazy Eye Blocks"
EXECUTABLE=LazyEyeBlocks
VERSION=$(sed -n 's/^ *"version": *"\([^"]*\)".*/\1/p' "$ROOT/package.json" | head -n 1)
MIN_MACOS=12.0
SIGN_IDENTITY=${SIGN_IDENTITY:--}
DMG="$OUT/LazyEyeBlocks-$VERSION.dmg"

if [ "$(uname -s)" != Darwin ]; then
    echo "build.sh must run on macOS (see macos/build-remote.sh)" >&2
    exit 1
fi
if [ ! -f "$ROOT/docs/index.html" ] || [ ! -f "$ROOT/docs/js/main.js" ]; then
    echo "Missing web build; run 'npm run build:prod' first" >&2
    exit 1
fi

WORK=$(mktemp -d "${TMPDIR:-/tmp}/lazyeyeblocks-build.XXXXXX")
trap 'rm -rf "$WORK"' EXIT INT TERM

APP="$OUT/$APP_NAME.app"
rm -rf "$APP" "$DMG"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources/Web"

echo "Compiling $EXECUTABLE $VERSION"
for ARCH in arm64 x86_64; do
    xcrun swiftc -O -swift-version 5 \
        -target "$ARCH-apple-macos$MIN_MACOS" \
        -o "$WORK/$EXECUTABLE-$ARCH" \
        "$ROOT"/macos/LazyEyeBlocks/*.swift
done
lipo -create "$WORK/$EXECUTABLE-arm64" "$WORK/$EXECUTABLE-x86_64" -output "$APP/Contents/MacOS/$EXECUTABLE"

sed "s/__VERSION__/$VERSION/g" "$ROOT/macos/Info.plist" > "$APP/Contents/Info.plist"
plutil -lint "$APP/Contents/Info.plist" >/dev/null

echo "Drawing app icon"
xcrun swiftc -O -swift-version 5 -o "$WORK/make-icon" "$ROOT/macos/make-icon.swift"
"$WORK/make-icon" "$WORK/AppIcon.iconset"
iconutil -c icns -o "$APP/Contents/Resources/AppIcon.icns" "$WORK/AppIcon.iconset"

# Copy only the web build (docs/ also holds other documentation).
cp "$ROOT"/docs/*.html "$ROOT/docs/icon.ico" "$APP/Contents/Resources/Web/"
cp -R "$ROOT/docs/css" "$ROOT/docs/js" "$APP/Contents/Resources/Web/"

echo "Signing with identity '$SIGN_IDENTITY'"
if [ "$SIGN_IDENTITY" = "-" ]; then
    codesign --force --sign - "$APP"
else
    codesign --force --options runtime --timestamp --sign "$SIGN_IDENTITY" "$APP"
fi
codesign --verify --strict "$APP"

echo "Creating $DMG"
STAGE="$WORK/dmg"
mkdir -p "$STAGE"
cp -R "$APP" "$STAGE/"
ln -s /Applications "$STAGE/Applications"
hdiutil create -quiet -volname "$APP_NAME" -srcfolder "$STAGE" -fs HFS+ -format UDZO "$DMG"

if [ -n "${NOTARY_PROFILE:-}" ]; then
    codesign --force --timestamp --sign "$SIGN_IDENTITY" "$DMG"
    xcrun notarytool submit "$DMG" --keychain-profile "$NOTARY_PROFILE" --wait
    xcrun stapler staple "$DMG"
fi

echo "Done: $DMG"
