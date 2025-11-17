import Foundation

struct MiniAppManifest: Decodable {
    let version: Int
    let generatedAt: Date
    let apps: [MiniApp]

    var categories: [String] {
        Array(Set(apps.map(\.category))).sorted()
    }
}

