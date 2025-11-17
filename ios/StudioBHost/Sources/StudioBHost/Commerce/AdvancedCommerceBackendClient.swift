import Foundation

struct AdvancedCommerceBackendClient {
    enum BackendError: LocalizedError {
        case missingBaseURL
        case invalidResponse
        case server(String)

        var errorDescription: String? {
            switch self {
            case .missingBaseURL:
                return "Advanced Commerce backend URL missing."
            case .invalidResponse:
                return "Backend returned an invalid response."
            case let .server(message):
                return message
            }
        }
    }

    struct PurchaseResponse: Decodable {
        let slug: String
        let status: String
        let productId: String
        let transactionId: UInt64
    }

    private let baseURL: URL
    private let urlSession: URLSession

    init(baseURL: URL, urlSession: URLSession = .shared) {
        self.baseURL = baseURL
        self.urlSession = urlSession
    }

    func requestSubscription(slug: String, metadata: [String: Any]) async throws -> SubscriptionController.Result {
        var request = URLRequest(url: baseURL.appendingPathComponent("/api/commerce/purchase"))
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let payload: [String: Any] = [
            "slug": slug,
            "metadata": metadata
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: payload, options: [])

        let (data, response) = try await urlSession.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw BackendError.invalidResponse
        }
        guard 200..<300 ~= httpResponse.statusCode else {
            let message = String(data: data, encoding: .utf8) ?? "Unknown backend error"
            throw BackendError.server(message)
        }
        let decoded = try JSONDecoder().decode(PurchaseResponse.self, from: data)
        let status = SubscriptionController.Result.Status(rawValue: decoded.status) ?? .active
        let result = SubscriptionController.Result(
            slug: decoded.slug,
            status: status,
            activatedAt: Date(),
            productId: decoded.productId,
            transactionId: decoded.transactionId
        )
        return result
    }

    static func makeDefault(from processInfo: ProcessInfo = .processInfo) -> AdvancedCommerceBackendClient? {
        guard
            let rawURL = processInfo.environment["STUDIOB_COMMERCE_BACKEND_URL"],
            let url = URL(string: rawURL)
        else {
            return nil
        }
        return AdvancedCommerceBackendClient(baseURL: url)
    }
}

