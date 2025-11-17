import Foundation

struct ProductCatalog: Decodable {
    struct Entry: Decodable {
        let slug: String
        let productId: String
        let displayName: String
        let family: String?
    }

    let items: [Entry]
    private let lookup: [String: Entry]

    init(items: [Entry]) {
        self.items = items
        self.lookup = Dictionary(uniqueKeysWithValues: items.map { ($0.slug, $0) })
    }

    static func loadDefault(bundle: Bundle = .main) -> ProductCatalog {
        guard let url = bundle.url(forResource: "miniapp-products", withExtension: "json", subdirectory: "commerce") else {
            return ProductCatalog(items: [])
        }
        do {
            let data = try Data(contentsOf: url)
            let catalog = try JSONDecoder().decode(ProductCatalog.self, from: data)
            return ProductCatalog(items: catalog.items)
        } catch {
            print("Failed to decode product catalog: \(error)")
            return ProductCatalog(items: [])
        }
    }

    func sku(for slug: String) throws -> Entry {
        guard let entry = lookup[slug] else {
            throw CatalogError.missingSKU(slug)
        }
        return entry
    }

    enum CatalogError: LocalizedError {
        case missingSKU(String)

        var errorDescription: String? {
            switch self {
            case let .missingSKU(slug):
                return "No SKU configured for \(slug)"
            }
        }
    }
}

