// ABOUTME: Draws the Lazy Eye Blocks app icon (the site's 2x2 brand mark) as PNG files for an .iconset.
// ABOUTME: Run by macos/build.sh with the output .iconset folder as the only argument; iconutil makes the .icns.
import AppKit

func color(_ hex: UInt32) -> NSColor {
    NSColor(
        srgbRed: CGFloat((hex >> 16) & 0xff) / 255,
        green: CGFloat((hex >> 8) & 0xff) / 255,
        blue: CGFloat(hex & 0xff) / 255,
        alpha: 1
    )
}

func drawIcon(pixels: Int) -> Data {
    let rep = NSBitmapImageRep(
        bitmapDataPlanes: nil, pixelsWide: pixels, pixelsHigh: pixels,
        bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
        colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0
    )!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)

    // Layout follows Apple's icon grid: an 824/1024 rounded square inside the canvas.
    let s = CGFloat(pixels) / 1024
    let plate = NSRect(x: 100 * s, y: 100 * s, width: 824 * s, height: 824 * s)
    let platePath = NSBezierPath(roundedRect: plate, xRadius: 185 * s, yRadius: 185 * s)
    color(0x101216).setFill()
    platePath.fill()
    color(0x3b414b).setStroke()
    platePath.lineWidth = max(1, 12 * s)
    platePath.stroke()

    // 2x2 blocks: gray, blue / red, gray (same order as the site header mark).
    let gap = 36 * s
    let inset = 150 * s
    let cell = (plate.width - 2 * inset - gap) / 2
    let colors: [UInt32] = [0x9299a2, 0x123cff, 0xfa1018, 0x9299a2]
    for (index, hex) in colors.enumerated() {
        let column = CGFloat(index % 2)
        let row = CGFloat(index / 2)
        let rect = NSRect(
            x: plate.minX + inset + column * (cell + gap),
            y: plate.maxY - inset - cell - row * (cell + gap),
            width: cell, height: cell
        )
        color(hex).setFill()
        NSBezierPath(roundedRect: rect, xRadius: 28 * s, yRadius: 28 * s).fill()
    }

    NSGraphicsContext.restoreGraphicsState()
    return rep.representation(using: .png, properties: [:])!
}

let iconset = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
try FileManager.default.createDirectory(at: iconset, withIntermediateDirectories: true)
for points in [16, 32, 128, 256, 512] {
    try drawIcon(pixels: points).write(to: iconset.appendingPathComponent("icon_\(points)x\(points).png"))
    try drawIcon(pixels: points * 2).write(to: iconset.appendingPathComponent("icon_\(points)x\(points)@2x.png"))
}
