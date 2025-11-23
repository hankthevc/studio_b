import SwiftUI
import WebKit

struct MiniAppWebView: UIViewRepresentable {
    let miniApp: MiniApp
    let resolver: MiniAppAssetResolver
    let ageProvider: AgeCategoryProvider

    private let subscriptionController = SubscriptionController.shared
    private let analyticsTracker = AnalyticsTracker.shared
    private let commerceManager = CommerceManager.shared

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.limitsNavigationsToAppBoundDomains = false
        
        // Allow local files to load other local files (needed for ES6 modules)
        config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        
        context.coordinator.installBridge(into: config.userContentController)
        let webView = WKWebView(frame: .zero, configuration: config)
        #if DEBUG
        if #available(iOS 16.4, *) {
            webView.isInspectable = true
        }
        #endif
        context.coordinator.webView = webView
        webView.navigationDelegate = context.coordinator
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        guard let url = resolver.url(for: miniApp) else {
            return
        }

        if url.isFileURL {
            // Allow read access to the entire repo root so mini-apps can load shared resources
            let repoRoot = url.deletingLastPathComponent()
                .deletingLastPathComponent() // up from app folder
                .deletingLastPathComponent() // up from category folder  
                .deletingLastPathComponent() // up from apps folder (now at repo root)
            uiView.loadFileURL(url, allowingReadAccessTo: repoRoot)
        } else {
            uiView.load(URLRequest(url: url))
        }
    }

    static func dismantleUIView(_ uiView: WKWebView, coordinator: Coordinator) {
        coordinator.teardown()
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(
            miniApp: miniApp,
            subscriptionController: subscriptionController,
            commerceManager: commerceManager,
            ageProvider: ageProvider,
            analyticsTracker: analyticsTracker
        )
    }

    final class Coordinator: NSObject, WKNavigationDelegate, MiniHostBridgeDelegate {
        private let miniApp: MiniApp
        private let subscriptionController: SubscriptionController
        private let commerceManager: CommerceManager
        private let ageProvider: AgeCategoryProvider
        private let analyticsTracker: AnalyticsTracker
        private let bridge = MiniHostBridge()

        weak var webView: WKWebView?

        init(
            miniApp: MiniApp,
            subscriptionController: SubscriptionController,
            commerceManager: CommerceManager,
            ageProvider: AgeCategoryProvider,
            analyticsTracker: AnalyticsTracker
        ) {
            self.miniApp = miniApp
            self.subscriptionController = subscriptionController
            self.commerceManager = commerceManager
            self.ageProvider = ageProvider
            self.analyticsTracker = analyticsTracker
            super.init()
            bridge.delegate = self
        }

        func installBridge(into controller: WKUserContentController) {
            bridge.attach(to: controller)
        }

        func teardown() {
            bridge.detach()
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            print("MiniApp load failed \(miniApp.slug): \(error)")
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            print("MiniApp loaded \(miniApp.slug)")
        }

        func miniHostBridge(
            _ bridge: MiniHostBridge,
            didReceive action: MiniHostBridge.Action,
            payload: [String: Any],
            webView: WKWebView?,
            reply: @escaping (Result<[String: Any], Error>) -> Void
        ) {
            print("🔔 MiniHostBridge received action: \(action)")
            switch action {
            case .requestSubscription:
                print("💰 Starting requestSubscription for \(miniApp.slug)")
                Task { @MainActor in
                    print("💰 Task started on MainActor")
                    do {
                        print("💰 Calling commerceManager.requestSubscription...")
                        let result = try await commerceManager.requestSubscription(
                            for: miniApp.slug,
                            metadata: payload["metadata"] as? [String: Any] ?? [:]
                        )
                        print("💰 Request successful, replying with status: \(result.status)")
                        reply(.success(result.bridgePayload))
                        if result.status == .active {
                            bridge.dispatchEvent(
                                name: "MiniHostBridge:subscriptionUpdate",
                                detail: ["slug": miniApp.slug, "isSubscribed": true],
                                in: webView ?? self.webView
                            )
                        }
                    } catch {
                        print("💰 Request failed with error: \(error)")
                        reply(.failure(error))
                    }
                }
            case .isSubscribed:
                Task { @MainActor in
                    let active = await subscriptionController.isSubscribed(slug: miniApp.slug)
                    reply(.success(["isSubscribed": active]))
                }
            case .getAgeCategory:
                reply(.success(["category": ageProvider.current.rawValue]))
            case .getAgeRange:
                let range = ageProvider.currentRange
                var payload: [String: Any] = ["min": range.min]
                if let max = range.max {
                    payload["max"] = max
                }
                reply(.success(payload))
            case .track:
                if let eventName = payload["eventName"] as? String {
                    let props = payload["props"] as? [String: Any] ?? [:]
                    analyticsTracker.track(eventName: eventName, props: props, slug: miniApp.slug)
                }
                reply(.success([:]))
            }
        }
    }
}
