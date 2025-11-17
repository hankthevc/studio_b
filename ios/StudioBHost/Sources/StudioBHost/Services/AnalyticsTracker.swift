import Foundation

final class AnalyticsTracker {
    static let shared = AnalyticsTracker()

    func track(eventName: String, props: [String: Any], slug: String) {
        guard !eventName.isEmpty else { return }
        #if DEBUG
        print("[Analytics] \(slug) -> \(eventName) \(props)")
        #endif
    }
}

