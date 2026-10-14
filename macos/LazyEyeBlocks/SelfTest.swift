// ABOUTME: Smoke test run with `--self-test <output-dir>`: drives the bundled pages and reports results as JSON lines.
// ABOUTME: Checks offline loading, game start, keyboard input and storage persistence; saves snapshots, then quits.
import AppKit
import WebKit

/// Same key as LOCAL_STORAGE_SETTINGS_KEY in src/config.js.
private let settingsStorageKey = "c8d6669b-2153-4780-b345-9be69d36fc9d"

@MainActor
final class SelfTest {
    private let webView: WKWebView
    private let outputDir: URL
    private var failures = 0

    init(webView: WKWebView, outputDir: URL) {
        self.webView = webView
        self.outputDir = outputDir
    }

    func run() async {
        try? FileManager.default.createDirectory(at: outputDir, withIntermediateDirectories: true)

        await open("index.html")
        await check("home page title", "document.title", equals: "Lazy Eye Blocks")
        await check("site CSS applied", "getComputedStyle(document.body).backgroundColor !== 'rgba(0, 0, 0, 0)'", equals: true)
        await check(
            "all resources served from app bundle",
            "performance.getEntriesByType('resource').every(e => e.name.startsWith('\(appScheme)://'))",
            equals: true
        )
        await snapshot("1-home.png")

        await open("help.html")
        await check("help page has controls section", "document.getElementById('controls') !== null", equals: true)

        await open("exercise.html")
        await check("game menu rendered", "document.querySelectorAll('#root *').length > 0", equals: true)
        await snapshot("2-game-menu.png")
        await check(
            "new game starts",
            """
            (() => {
                const items = [...document.querySelectorAll('#root *')]
                    .filter(e => e.children.length === 0 && /new game|play|start/i.test(e.textContent));
                if (items.length === 0) return false;
                items[0].click();
                return true;
            })()
            """,
            equals: true
        )
        try? await Task.sleep(nanoseconds: 1_500_000_000)
        await check("game canvas visible", "document.querySelector('canvas') !== null", equals: true)
        await snapshot("3-game-running.png")

        // Native key events must reach the page's keydown listener through the window.
        _ = try? await webView.evaluateJavaScript(
            "window.__keys = []; document.addEventListener('keydown', e => window.__keys.push(e.keyCode))"
        )
        sendKey(keyCode: 123, characters: String(UnicodeScalar(NSLeftArrowFunctionKey)!))
        sendKey(keyCode: 49, characters: " ")
        try? await Task.sleep(nanoseconds: 500_000_000)
        await check("native keys reach the game", "window.__keys.join(',')", equals: "37,32")

        // Run twice: the second run must see the marker written by the first.
        let previous = try? await webView.evaluateJavaScript("localStorage.getItem('lazyeyeblocks-self-test')")
        report("previous storage marker", passed: true, detail: "\(previous ?? "none")")
        _ = try? await webView.evaluateJavaScript("localStorage.setItem('lazyeyeblocks-self-test', new Date().toISOString())")
        let settings = try? await webView.evaluateJavaScript("localStorage.getItem('\(settingsStorageKey)')")
        report("saved game settings (informational)", passed: true, detail: "\(settings ?? "none")")

        report("summary", passed: failures == 0, detail: "\(failures) failure(s)")
        // Give WebKit time to flush local storage to disk before quitting.
        try? await Task.sleep(nanoseconds: 1_000_000_000)
        exit(failures == 0 ? 0 : 1)
    }

    private func open(_ page: String) async {
        webView.load(URLRequest(url: URL(string: "\(appScheme)://app/\(page)")!))
        for _ in 0..<100 {
            try? await Task.sleep(nanoseconds: 100_000_000)
            let state = try? await webView.evaluateJavaScript("document.readyState")
            if !webView.isLoading, webView.url?.lastPathComponent == page, state as? String == "complete" {
                try? await Task.sleep(nanoseconds: 300_000_000)
                report("load \(page)", passed: true, detail: "")
                return
            }
        }
        report("load \(page)", passed: false, detail: "timed out")
    }

    private func check(_ name: String, _ script: String, equals expected: AnyHashable) async {
        do {
            let value = try await webView.evaluateJavaScript(script)
            let actual: AnyHashable? = (value as? Bool).map(AnyHashable.init) ?? (value as? String).map(AnyHashable.init)
            report(name, passed: actual == expected, detail: "\(value ?? "nil")")
        } catch {
            report(name, passed: false, detail: error.localizedDescription)
        }
    }

    private func sendKey(keyCode: UInt16, characters: String) {
        guard let window = webView.window else { return }
        window.makeFirstResponder(webView)
        for type in [NSEvent.EventType.keyDown, .keyUp] {
            let event = NSEvent.keyEvent(
                with: type, location: .zero, modifierFlags: [], timestamp: ProcessInfo.processInfo.systemUptime,
                windowNumber: window.windowNumber, context: nil, characters: characters,
                charactersIgnoringModifiers: characters, isARepeat: false, keyCode: keyCode
            )!
            window.sendEvent(event)
        }
    }

    private func snapshot(_ fileName: String) async {
        do {
            let image = try await webView.takeSnapshot(configuration: nil)
            let rep = NSBitmapImageRep(data: image.tiffRepresentation!)!
            try rep.representation(using: .png, properties: [:])!.write(to: outputDir.appendingPathComponent(fileName))
            report("snapshot \(fileName)", passed: true, detail: "")
        } catch {
            report("snapshot \(fileName)", passed: false, detail: error.localizedDescription)
        }
    }

    private func report(_ name: String, passed: Bool, detail: String) {
        if !passed { failures += 1 }
        let line: [String: Any] = ["test": name, "passed": passed, "detail": detail]
        let data = try! JSONSerialization.data(withJSONObject: line, options: [.sortedKeys])
        print(String(data: data, encoding: .utf8)!)
        fflush(stdout)
    }
}
