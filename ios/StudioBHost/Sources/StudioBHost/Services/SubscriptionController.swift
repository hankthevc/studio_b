import Foundation

actor SubscriptionController {
    struct Result {
        enum Status: String, Codable {
            case active
            case pending
            case failed
            case revoked
        }

        let slug: String
        let status: Status
        let activatedAt: Date
        let productId: String?
        let transactionId: UInt64?

        var bridgePayload: [String: Any] {
            var payload: [String: Any] = [
                "slug": slug,
                "status": status.rawValue,
                "activatedAt": ISO8601DateFormatter().string(from: activatedAt),
                "isSubscribed": status == .active
            ]
            if let productId {
                payload["productId"] = productId
            }
            if let transactionId {
                payload["transactionId"] = String(transactionId)
            }
            return payload
        }
    }

    private struct Record: Codable {
        var status: Result.Status
        var productId: String?
        var transactionId: UInt64?
        var updatedAt: Date
    }

    static let shared = SubscriptionController()

    private var records: [String: Record] = [:]
    private let storage: UserDefaults
    private let storageKey = "com.studiob.subscriptionRecords"

    init(storage: UserDefaults = .standard) {
        self.storage = storage
        if let data = storage.data(forKey: storageKey),
           let decoded = try? JSONDecoder().decode([String: Record].self, from: data) {
            records = decoded
        }
    }

    func isSubscribed(slug: String) -> Bool {
        records[slug]?.status == .active
    }

    func apply(result: Result) {
        let record = Record(
            status: result.status,
            productId: result.productId,
            transactionId: result.transactionId,
            updatedAt: result.activatedAt
        )
        records[result.slug] = record
        persist()
    }

    func markActive(slug: String, productId: String, transactionId: UInt64) -> Result {
        let now = Date()
        let record = Record(status: .active, productId: productId, transactionId: transactionId, updatedAt: now)
        records[slug] = record
        persist()
        return Result(slug: slug, status: .active, activatedAt: now, productId: productId, transactionId: transactionId)
    }

    func markPending(slug: String, productId: String?) -> Result {
        let now = Date()
        records[slug] = Record(status: .pending, productId: productId, transactionId: nil, updatedAt: now)
        persist()
        return Result(slug: slug, status: .pending, activatedAt: now, productId: productId, transactionId: nil)
    }

    func markRevoked(slug: String) -> Result {
        let now = Date()
        records[slug] = Record(status: .revoked, productId: nil, transactionId: nil, updatedAt: now)
        persist()
        return Result(slug: slug, status: .revoked, activatedAt: now, productId: nil, transactionId: nil)
    }

    func replace(with results: [Result]) {
        var next: [String: Record] = [:]
        for result in results {
            let record = Record(
                status: result.status,
                productId: result.productId,
                transactionId: result.transactionId,
                updatedAt: result.activatedAt
            )
            next[result.slug] = record
        }
        records = next
        persist()
    }

    private func persist() {
        guard let data = try? JSONEncoder().encode(records) else { return }
        storage.set(data, forKey: storageKey)
    }
}

