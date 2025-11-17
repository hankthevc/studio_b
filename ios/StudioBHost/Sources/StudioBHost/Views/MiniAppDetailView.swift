import SwiftUI

struct MiniAppDetailView: View {
    let miniApp: MiniApp
    @EnvironmentObject private var ageProvider: AgeCategoryProvider
    @State private var resolver = MiniAppAssetResolver.runtimeDefault()

    var body: some View {
        VStack(spacing: 0) {
            if miniApp.isAllowed(for: ageProvider.currentRange) {
                MiniAppWebView(miniApp: miniApp, resolver: resolver, ageProvider: ageProvider)
                    .background(Color.black.opacity(0.05))
            } else {
                AgeRestrictedView(
                    title: miniApp.title,
                    requiredBand: miniApp.ageBand.readable,
                    currentRangeLabel: ageProvider.currentRange.readableLabel
                )
            }
        }
        .navigationTitle(miniApp.title)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Menu {
                    if let link = miniApp.universalLink {
                        ShareLink(item: link)
                    }
                    Button("Reload") {
                        resolver = MiniAppAssetResolver.runtimeDefault()
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                }
            }
        }
    }
}

private struct AgeRestrictedView: View {
    let title: String
    let requiredBand: String
    let currentRangeLabel: String

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "hand.raised.fill")
                .font(.system(size: 44))
                .foregroundStyle(.orange)
            Text("\(title) is unavailable")
                .font(.headline)
            Text("This mini-app requires \(requiredBand). Your declared age range (\(currentRangeLabel)) blocks access.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.black.opacity(0.03))
    }
}

