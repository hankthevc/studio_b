import Foundation

struct DeclaredAgeRange: Codable, Equatable {
    let min: Int
    let max: Int?

    var readableLabel: String {
        if let max {
            return "\(min)+ – \(max)"
        }
        return "\(min)+"
    }

    var category: AgeCategory {
        switch min {
        case ..<13:
            return .kids
        case 13..<18:
            return .teen
        case 18..<21:
            return .general
        default:
            return .mature
        }
    }
}

@MainActor
final class DeclaredAgeRangeProvider: ObservableObject {
    @Published private(set) var currentRange: DeclaredAgeRange

    private let storage: UserDefaults
    private let storageKey = "com.studiob.declaredAgeRange"

    init(storage: UserDefaults = .standard) {
        self.storage = storage
        if let data = storage.data(forKey: storageKey),
           let range = try? JSONDecoder().decode(DeclaredAgeRange.self, from: data) {
            currentRange = range
        } else {
            currentRange = DeclaredAgeRange(min: 18, max: nil)
        }
    }

    func refreshFromSystem() async {
        if let overrideRange = Self.environmentOverride() {
            update(range: overrideRange)
            return
        }
        if let systemRange = await Self.dynamicDeclaredAgeRange() {
            update(range: systemRange)
        }
    }

    func update(range: DeclaredAgeRange) {
        guard currentRange != range else { return }
        currentRange = range
        if let data = try? JSONEncoder().encode(range) {
            storage.set(data, forKey: storageKey)
        }
    }
}

private extension DeclaredAgeRangeProvider {
    static func environmentOverride() -> DeclaredAgeRange? {
        guard let raw = ProcessInfo.processInfo.environment["STUDIOB_FAKE_AGE_RANGE"] else {
            return nil
        }
        let components = raw
            .split(separator: "-")
            .map { String($0).trimmingCharacters(in: .whitespacesAndNewlines) }
        guard let min = Int(components.first ?? "") else {
            return nil
        }
        let max = components.count > 1 ? Int(components[1]) : nil
        return DeclaredAgeRange(min: min, max: max)
    }

    static func dynamicDeclaredAgeRange() async -> DeclaredAgeRange? {
        guard #available(iOS 18, *) else { return nil }
        return await withCheckedContinuation { continuation in
            DispatchQueue.global().async {
                guard
                    let managerClass = NSClassFromString("DARDeclaredAgeRangeCenter") as? NSObject.Type,
                    let shared = managerClass.perform(NSSelectorFromString("sharedCenter"))?.takeUnretainedValue()
                else {
                    continuation.resume(returning: nil)
                    return
                }

                if let selector = NSSelectorFromString("currentDeclaredAgeRange"),
                   shared.responds(to: selector),
                   let value = shared.perform(selector)?.takeUnretainedValue() {
                    let min = (value.value(forKey: "minimumAge") as? Int) ?? 0
                    let max = value.value(forKey: "maximumAge") as? Int
                    continuation.resume(returning: DeclaredAgeRange(min: min, max: max))
                    return
                }

                continuation.resume(returning: nil)
            }
        }
    }
}

