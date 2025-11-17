import Foundation

struct MiniApp: Identifiable, Decodable, Hashable {
    struct AgeBand: Decodable {
        let min: Int
        let max: Int?

        var readable: String {
            if let max = max {
                return "\(min)+ - \(max)"
            }
            return "\(min)+"
        }
    }

    struct AssetDescriptor: Decodable {
        let bundleSubdirectory: String
        let entrypoint: String
    }

    struct SKU: Decodable, Identifiable {
        let id: String
        let displayName: String
        let priceDescription: String
    }

    let slug: String
    let title: String
    let subtitle: String?
    let category: String
    let keywords: [String]
    let isFeatured: Bool
    let ageBand: AgeBand
    let universalLink: URL?
    let asset: AssetDescriptor?
    let skuIds: [String]
    let previewImageName: String?

    var id: String { slug }

    func isAllowed(for range: DeclaredAgeRange) -> Bool {
        guard range.min >= ageBand.min else { return false }
        if let bandMax = ageBand.max {
            guard let userMax = range.max else { return false }
            return userMax <= bandMax
        }
        return true
    }
}

