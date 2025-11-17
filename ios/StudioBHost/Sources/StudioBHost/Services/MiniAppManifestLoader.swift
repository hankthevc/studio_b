import Foundation

protocol MiniAppManifestLoading {
    func loadManifest() async throws -> MiniAppManifest
}

struct MiniAppManifestLoader: MiniAppManifestLoading {
    enum LoaderError: LocalizedError {
        case manifestMissing
        case failedDecoding(Error)

        var errorDescription: String? {
            switch self {
            case .manifestMissing:
                return "miniapps-manifest.json not found in bundle."
            case let .failedDecoding(error):
                return "Unable to decode manifest: \(error.localizedDescription)"
            }
        }
    }

    private let bundle: Bundle
    private let decoder: JSONDecoder

    init(bundle: Bundle = .main, decoder: JSONDecoder = MiniAppManifestLoader.makeDecoder()) {
        self.bundle = bundle
        self.decoder = decoder
    }

    func loadManifest() async throws -> MiniAppManifest {
        guard let url = bundle.url(forResource: "miniapps-manifest", withExtension: "json") else {
            throw LoaderError.manifestMissing
        }
        do {
            let data = try Data(contentsOf: url)
            return try decoder.decode(MiniAppManifest.self, from: data)
        } catch {
            throw LoaderError.failedDecoding(error)
        }
    }

    private static func makeDecoder() -> JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return decoder
    }
}

