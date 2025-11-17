import CryptoKit
import Foundation

struct AppStoreServerAPIClient {
    enum Environment: String {
        case sandbox = "https://api.storekit-sandbox.itunes.apple.com"
        case production = "https://api.storekit.itunes.apple.com"
    }

    struct Configuration {
        let keyID: String
        let issuerID: String
        let bundleID: String
        let privateKeyPEM: String
        let environment: Environment

        static func fromEnvironment(_ processInfo: ProcessInfo = .processInfo) -> Configuration? {
            guard
                let keyID = processInfo.environment["APPLE_AC_KEY_ID"],
                let issuerID = processInfo.environment["APPLE_AC_ISSUER_ID"],
                let bundleID = processInfo.environment["APPLE_APP_BUNDLE_ID"],
                let privateKey = processInfo.environment["APPLE_AC_PRIVATE_KEY"]
            else {
                return nil
            }
            let envRaw = processInfo.environment["APPLE_AC_ENV"]?.lowercased() ?? "sandbox"
            let environment: Environment = envRaw == "production" ? .production : .sandbox
            return Configuration(
                keyID: keyID,
                issuerID: issuerID,
                bundleID: bundleID,
                privateKeyPEM: privateKey,
                environment: environment
            )
        }
    }

    static let shared = AppStoreServerAPIClient(configuration: Configuration.fromEnvironment())

    private let configuration: Configuration?
    private let session: URLSession

    init(configuration: Configuration?, session: URLSession = .shared) {
        self.configuration = configuration
        self.session = session
    }

    func sendConsumptionInfo(slug: String, productId: String, transactionId: UInt64) async {
        guard let configuration else {
            #if DEBUG
            print("[ServerAPI] Missing configuration; skipping Send Consumption Information for \(slug).")
            #endif
            return
        }
        let url = URL(string: "\(configuration.environment.rawValue)/inApps/v1/subscriptions/consumption")!
        let payload: [String: Any] = [
            "transactionId": String(transactionId),
            "bundleId": configuration.bundleID,
            "appAccountToken": slug,
            "consumptionStatus": 0,
            "activeEngagement": true,
            "lifetimeDollarsPurchased": 0,
            "lifetimeDollarsRefunded": 0,
            "userStatus": 0,
            "platform": 0,
            "sampleContentProvided": false
        ]
        guard
            let body = try? JSONSerialization.data(withJSONObject: payload),
            let jwt = try? makeJWT(configuration: configuration)
        else {
            return
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.httpBody = body
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(jwt)", forHTTPHeaderField: "Authorization")

        do {
            let (data, response) = try await session.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse else {
                return
            }
            if httpResponse.statusCode >= 300 {
                let bodyText = String(data: data, encoding: .utf8) ?? ""
                print("[ServerAPI] Consumption info failed (\(httpResponse.statusCode)): \(bodyText)")
            }
        } catch {
            print("[ServerAPI] Consumption info error: \(error)")
        }
    }

    private func makeJWT(configuration: Configuration) throws -> String {
        let header: [String: Any] = [
            "alg": "ES256",
            "kid": configuration.keyID,
            "typ": "JWT"
        ]
        let now = Date()
        let claims: [String: Any] = [
            "iss": configuration.issuerID,
            "iat": Int(now.timeIntervalSince1970),
            "exp": Int(now.addingTimeInterval(20 * 60).timeIntervalSince1970),
            "aud": "appstoreconnect-v1",
            "bid": configuration.bundleID
        ]

        let headerData = try JSONSerialization.data(withJSONObject: header)
        let claimsData = try JSONSerialization.data(withJSONObject: claims)
        let signingInput = "\(headerData.base64URLEncodedString()).\(claimsData.base64URLEncodedString())"

        let privateKey = try P256.Signing.PrivateKey(pemRepresentation: configuration.privateKeyPEM)
        let signature = try privateKey.signature(for: Data(signingInput.utf8)).derRepresentation
        let token = "\(signingInput).\(signature.base64URLEncodedString())"
        return token
    }
}

private extension Data {
    func base64URLEncodedString() -> String {
        base64EncodedString()
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "=", with: "")
    }
}

