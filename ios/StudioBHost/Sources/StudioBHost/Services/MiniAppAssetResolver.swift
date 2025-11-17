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
            return MiniAppAssetResolver(mode: .fileSystem(root: url), bundle: bundle)
        }
        return MiniAppAssetResolver(mode: .bundled, bundle: bundle)
    }

    func url(for miniApp: MiniApp) -> URL? {
        switch mode {
        case .bundled:
            guard let subdir = miniApp.asset?.bundleSubdirectory else { return nil }
            return bundle.url(forResource: miniApp.asset?.entrypoint ?? "index", withExtension: "html", subdirectory: subdir)
        case let .fileSystem(root):
            let relativePath = miniApp.asset?.bundleSubdirectory ?? miniApp.slug
            let url = root.appendingPathComponent(relativePath)
            let entrypoint = (miniApp.asset?.entrypoint ?? "index") + ".html"
            return url.appendingPathComponent(entrypoint)
        }
    }
}

