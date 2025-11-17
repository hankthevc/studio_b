import Foundation

enum AgeCategory: String, CaseIterable, Codable, Identifiable {
    case kids
    case teen
    case general
    case mature

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .kids: return "Kids"
        case .teen: return "Teen"
        case .general: return "General"
        case .mature: return "Mature"
        }
    }
}

@MainActor
final class AgeCategoryProvider: ObservableObject {
    @Published private(set) var currentRange: DeclaredAgeRange
    private let declaredProvider: DeclaredAgeRangeProvider

    init(declaredProvider: DeclaredAgeRangeProvider = DeclaredAgeRangeProvider()) {
        self.declaredProvider = declaredProvider
        self.currentRange = declaredProvider.currentRange
    }

    var current: AgeCategory {
        currentRange.category
    }

    func refresh() async {
        await declaredProvider.refreshFromSystem()
        currentRange = declaredProvider.currentRange
    }

    func overrideForDebug(_ category: AgeCategory) {
        #if DEBUG
        let mappedRange: DeclaredAgeRange
        switch category {
        case .kids:
            mappedRange = DeclaredAgeRange(min: 4, max: 12)
        case .teen:
            mappedRange = DeclaredAgeRange(min: 13, max: 17)
        case .general:
            mappedRange = DeclaredAgeRange(min: 18, max: 20)
        case .mature:
            mappedRange = DeclaredAgeRange(min: 21, max: nil)
        }
        declaredProvider.update(range: mappedRange)
        currentRange = mappedRange
        #endif
    }
}

