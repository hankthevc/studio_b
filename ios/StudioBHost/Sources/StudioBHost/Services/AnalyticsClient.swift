import Foundation

struct AnalyticsClient {
    private let baseURL: URL?
    private let session: URLSession
    private let dateFormatter: ISO8601DateFormatter

    init(processInfo: ProcessInfo = .processInfo, session: URLSession = .shared) {
        self.session = session
        if let rawURL = processInfo.environment["STUDIOB_COMMERCE_BACKEND_URL"],
           let url = URL(string: rawURL) {
            baseURL = url
        } else {
            baseURL = nil
        }
        dateFormatter = ISO8601DateFormatter()
    }

    func send(eventName: String, slug: String, props: [String: Any]) async {
        guard let baseURL else {
            return
        }
        var request = URLRequest(url: baseURL.appendingPathComponent("/api/analytics/track"))
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let payload: [String: Any] = [
            "eventName": eventName,
            "slug": slug,
            "properties": props,
            "timestamp": dateFormatter.string(from: Date())
        ]
        guard let body = try? JSONSerialization.data(withJSONObject: payload, options: []) else {
            return
        }
        request.httpBody = body
        do {
            _ = try await session.data(for: request)
        } catch {
            #if DEBUG
            print("[Analytics] upload failed: \(error)")
            #endif
        }
    }
}

