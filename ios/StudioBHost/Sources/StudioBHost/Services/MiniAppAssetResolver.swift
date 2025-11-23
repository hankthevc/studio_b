import Foundation

struct MiniAppAssetResolver {
    enum Mode {
        case bundled
        case fileSystem(root: URL)
    }

    private let mode: Mode
    private let bundle: Bundle

    init(mode: Mode = .bundled, bundle: Bundle = .main) {
        self.mode = mode
        self.bundle = bundle
    }

    static func runtimeDefault(bundle: Bundle = .main) -> MiniAppAssetResolver {
        if let path = ProcessInfo.processInfo.environment["MINIAPP_DEV_ROOT"] {
            let url = URL(fileURLWithPath: path)
            print("🔧 MiniAppAssetResolver: Using FILESYSTEM mode with root: \(path)")
            return MiniAppAssetResolver(mode: .fileSystem(root: url), bundle: bundle)
        }
        print("🔧 MiniAppAssetResolver: Using BUNDLED mode")
        return MiniAppAssetResolver(mode: .bundled, bundle: bundle)
    }

    func url(for miniApp: MiniApp) -> URL? {
        print("🔍 Resolving URL for: \(miniApp.slug)")
        switch mode {
        case .bundled:
            guard let subdir = miniApp.asset?.bundleSubdirectory else {
                print("❌ No bundle subdirectory for \(miniApp.slug)")
                return nil
            }
            let url = bundle.url(forResource: miniApp.asset?.entrypoint ?? "index", withExtension: "html", subdirectory: subdir)
            if let url = url {
                print("✅ Found bundled URL: \(url)")
            } else {
                print("❌ Could not find resource '\(miniApp.asset?.entrypoint ?? "index").html' in subdirectory '\(subdir)'")
                // Debug: List contents of bundle root to see where we are
                if let resourcePath = bundle.resourcePath {
                    print("📂 Bundle Resource Path: \(resourcePath)")
                    do {
                        let contents = try FileManager.default.contentsOfDirectory(atPath: resourcePath)
                        print("📂 Bundle Contents: \(contents.prefix(10))") // Print first 10 items
                    } catch {
                        print("❌ Failed to list bundle contents: \(error)")
                    }
                }
            }
            return url
        case let .fileSystem(root):
            let relativePath = miniApp.asset?.bundleSubdirectory ?? miniApp.slug
            let url = root.appendingPathComponent(relativePath)
            let entrypoint = (miniApp.asset?.entrypoint ?? "index") + ".html"
            return url.appendingPathComponent(entrypoint)
        }
    }
}

