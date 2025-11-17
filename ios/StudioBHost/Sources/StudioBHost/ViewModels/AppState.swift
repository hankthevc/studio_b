import Foundation

@MainActor
final class AppState: ObservableObject {
    @Published private(set) var manifest: MiniAppManifest?
    @Published private(set) var isLoading: Bool = false
    @Published private(set) var loadError: String?
    @Published var selectedCategory: String?
    @Published private(set) var pendingDeepLinkSlug: String?

    private let manifestLoader: MiniAppManifestLoading

    init(manifestLoader: MiniAppManifestLoading = MiniAppManifestLoader()) {
        self.manifestLoader = manifestLoader
    }

    func loadManifest() async {
        guard !isLoading else { return }
        isLoading = true
        loadError = nil
        do {
            manifest = try await manifestLoader.loadManifest()
        } catch {
            loadError = error.localizedDescription
        }
        isLoading = false
    }

    func handleIncomingURL(_ url: URL) {
        guard let slug = slug(from: url) else { return }
        pendingDeepLinkSlug = slug
    }

    func consumePendingDeepLink() -> MiniApp? {
        guard let slug = pendingDeepLinkSlug,
              let target = miniApp(for: slug) else {
            return nil
        }
        pendingDeepLinkSlug = nil
        return target
    }

    func miniApp(for slug: String) -> MiniApp? {
        manifest?.apps.first(where: { $0.slug == slug })
    }

    private func slug(from url: URL) -> String? {
        var components = url.pathComponents.filter { $0 != "/" }
        if components.isEmpty, let host = url.host {
            components.append(host)
        }
        return components.last
    }
}

