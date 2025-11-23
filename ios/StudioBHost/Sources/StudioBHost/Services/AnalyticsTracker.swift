import Foundation

final class AnalyticsTracker {
    static let shared = AnalyticsTracker()

    private let client = AnalyticsClient()

    func track(eventName: String, props: [String: Any], slug: String) {
        guard !eventName.isEmpty else { return }
        #if DEBUG
        print("[Analytics] \(slug) -> \(eventName) \(props)")
        #endif
        Task {
            await client.send(eventName: eventName, slug: slug, props: props)
        }
    }
}

