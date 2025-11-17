import Foundation

actor SubscriptionController {
    struct Result {
        enum Status: String {
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

    private struct Record {
        var status: Result.Status
        var productId: String?
        var transactionId: UInt64?
        var updatedAt: Date
    }

    static let shared = SubscriptionController()

    private var records: [String: Record] = [:]

    func isSubscribed(slug: String) -> Bool {
        records[slug]?.status == .active
    }

    func markActive(slug: String, productId: String, transactionId: UInt64) -> Result {
        let now = Date()
        let record = Record(status: .active, productId: productId, transactionId: transactionId, updatedAt: now)
        records[slug] = record
        return Result(slug: slug, status: .active, activatedAt: now, productId: productId, transactionId: transactionId)
    }

    func markPending(slug: String, productId: String?) -> Result {
        let now = Date()
        records[slug] = Record(status: .pending, productId: productId, transactionId: nil, updatedAt: now)
        return Result(slug: slug, status: .pending, activatedAt: now, productId: productId, transactionId: nil)
    }

    func markRevoked(slug: String) -> Result {
        let now = Date()
        records[slug] = Record(status: .revoked, productId: nil, transactionId: nil, updatedAt: now)
        return Result(slug: slug, status: .revoked, activatedAt: now, productId: nil, transactionId: nil)
    }
}

