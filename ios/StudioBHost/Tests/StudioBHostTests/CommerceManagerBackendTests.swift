import XCTest
@testable import StudioBHost

@MainActor
final class CommerceManagerBackendTests: XCTestCase {
    func testBackendPersistsSubscriptionState() async throws {
        let slug = "tripspark"
        let subscriptionController = SubscriptionController()
        let backendResult = SubscriptionController.Result(
            slug: slug,
            status: .active,
            activatedAt: Date(),
            productId: "com.studiob.tripspark.pro",
            transactionId: 12345
        )
        let backendClient = MockBackendClient(result: backendResult)

        let manager = CommerceManager(
            catalog: ProductCatalog(items: []),
            subscriptionController: subscriptionController,
            serverAPI: AppStoreServerAPIClient(configuration: nil),
            mode: .mock,
            backendClient: backendClient
        )

        let result = try await manager.requestSubscription(for: slug, metadata: [:])

        XCTAssertEqual(result.status, .active)
        let isSubscribed = await subscriptionController.isSubscribed(slug: slug)
        XCTAssertTrue(isSubscribed)
    }
}

private struct MockBackendClient: CommerceBackendClient {
    let result: SubscriptionController.Result

    func requestSubscription(slug: String, metadata: [String: Any]) async throws -> SubscriptionController.Result {
        result
    }

    func fetchSubscriptions() async throws -> [SubscriptionController.Result] {
        [result]
    }
}

