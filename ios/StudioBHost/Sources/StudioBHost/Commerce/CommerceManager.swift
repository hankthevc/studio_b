import Foundation
import StoreKit

@MainActor
final class CommerceManager {
    enum Mode {
        case storeKit
        case mock
    }

    enum CommerceError: LocalizedError {
        case productUnavailable(String)
        case userCancelled
        case unknown

        var errorDescription: String? {
            switch self {
            case let .productUnavailable(productId):
                return "Product \(productId) is not available."
            case .userCancelled:
                return "User cancelled purchase."
            case .unknown:
                return "Unknown purchase failure."
            }
        }
    }

    static let shared = CommerceManager()

    private let catalog: ProductCatalog
    private let subscriptionController: SubscriptionController
    private let serverAPI: AppStoreServerAPIClient
    private let mode: Mode
    private let backendClient: AdvancedCommerceBackendClient?
    private var cachedProducts: [String: Product] = [:]

    init(
        catalog: ProductCatalog = ProductCatalog.loadDefault(),
        subscriptionController: SubscriptionController = .shared,
        serverAPI: AppStoreServerAPIClient = .shared,
        mode: Mode = CommerceManager.resolveMode(),
        backendClient: AdvancedCommerceBackendClient? = AdvancedCommerceBackendClient.makeDefault()
    ) {
        self.catalog = catalog
        self.subscriptionController = subscriptionController
        self.serverAPI = serverAPI
        self.mode = mode
        self.backendClient = backendClient
    }

    func requestSubscription(for slug: String, metadata: [String: Any] = [:]) async throws -> SubscriptionController.Result {
        if let backendClient {
            do {
                return try await backendClient.requestSubscription(slug: slug, metadata: metadata)
            } catch {
                #if DEBUG
                print("[Commerce] Backend request failed: \(error)")
                #endif
                throw error
            }
        }

        switch mode {
        case .mock:
            try await Task.sleep(nanoseconds: 300_000_000)
            return await subscriptionController.markActive(
                slug: slug,
                productId: "mock.\(slug).pro",
                transactionId: UInt64(Date().timeIntervalSince1970)
            )
        case .storeKit:
            let entry = try catalog.sku(for: slug)
            let product = try await loadProduct(productId: entry.productId)
            let result = try await product.purchase()
            switch result {
            case let .success(verificationResult):
                let transaction = try verify(verificationResult)
                await serverAPI.sendConsumptionInfo(
                    slug: slug,
                    productId: product.id,
                    transactionId: transaction.id
                )
                await transaction.finish()
                return await subscriptionController.markActive(
                    slug: slug,
                    productId: product.id,
                    transactionId: transaction.id
                )
            case .pending:
                return await subscriptionController.markPending(slug: slug, productId: product.id)
            case .userCancelled:
                throw CommerceError.userCancelled
            @unknown default:
                throw CommerceError.unknown
            }
        }
    }

    private func loadProduct(productId: String) async throws -> Product {
        if let cached = cachedProducts[productId] {
            return cached
        }
        let products = try await Product.products(for: [productId])
        guard let product = products.first else {
            throw CommerceError.productUnavailable(productId)
        }
        cachedProducts[productId] = product
        return product
    }

    private func verify(_ result: VerificationResult<Transaction>) throws -> Transaction {
        switch result {
        case let .verified(transaction):
            return transaction
        case let .unverified(_, error):
            throw error
        }
    }

    private static func resolveMode() -> Mode {
        let env = ProcessInfo.processInfo.environment["STUDIOB_COMMERCE_MODE"]?.lowercased()
        if env == "storekit" {
            return .storeKit
        }
#if targetEnvironment(simulator)
        return .mock
#else
        return .storeKit
#endif
    }
}

