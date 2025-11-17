import SwiftUI

struct MiniAppCatalogView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var ageProvider: AgeCategoryProvider
    @State private var searchText: String = ""
    @State private var navigationPath: [MiniApp] = []
#if DEBUG
    @State private var debugAgeCategory: AgeCategory = .general
#endif

    var body: some View {
        NavigationStack(path: $navigationPath) {
            content
                .navigationTitle("Studio B")
                .searchable(text: $searchText, placement: .navigationBarDrawer(displayMode: .always))
                .toolbar {
                    ToolbarItem(placement: .navigationBarLeading) {
                        Menu {
                            Button("All Categories") {
                                appState.selectedCategory = nil
                            }
                            Divider()
                            ForEach(appState.manifest?.categories ?? [], id: \.self) { category in
                                Button(category) {
                                    appState.selectedCategory = category
                                }
                            }
                        } label: {
                            Label(appState.selectedCategory ?? "All", systemImage: "line.3.horizontal.decrease.circle")
                        }
                    }
                    ToolbarItem(placement: .navigationBarTrailing) {
#if DEBUG
                        Menu {
                            Picker("Age Range", selection: $debugAgeCategory) {
                                ForEach(AgeCategory.allCases) { category in
                                    Text(category.displayName).tag(category)
                                }
                            }
                            .onChange(of: debugAgeCategory) { newValue in
                                ageProvider.overrideForDebug(newValue)
                            }
                        } label: {
                            Label(ageProvider.current.displayName, systemImage: "person.crop.circle")
                        }
#else
                        Label(ageProvider.currentRange.readableLabel, systemImage: "person.crop.circle")
#endif
                    }
                }
                .navigationDestination(for: MiniApp.self) { miniApp in
                    MiniAppDetailView(miniApp: miniApp)
                }
                .onChange(of: appState.pendingDeepLinkSlug) { _ in
                    navigateToPendingDeepLink()
                }
                .onChange(of: appState.manifest?.apps.count ?? 0) { _ in
                    navigateToPendingDeepLink()
                }
                .task {
                    await ageProvider.refresh()
                }
        }
    }

    @ViewBuilder
    private var content: some View {
        if appState.isLoading {
            ProgressView("Loading mini-apps…")
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else if let manifest = appState.manifest {
            let apps = filteredApps(from: manifest.apps)
            if apps.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "lock.fill")
                        .font(.system(size: 40))
                        .foregroundStyle(.secondary)
                    Text("No mini-apps available")
                        .font(.headline)
                    Text("Your declared age range or filters hide all catalog entries.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                List(apps) { miniApp in
                    NavigationLink(value: miniApp) {
                        MiniAppRow(miniApp: miniApp)
                    }
                }
                .listStyle(.plain)
            }
        } else if let error = appState.loadError {
            VStack(spacing: 12) {
                Text(error).foregroundStyle(.red)
                Button("Retry") {
                    Task {
                        await appState.loadManifest()
                    }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else {
            EmptyView()
        }
    }

    private func filteredApps(from apps: [MiniApp]) -> [MiniApp] {
        var filtered = apps
        if let category = appState.selectedCategory {
            filtered = filtered.filter { $0.category == category }
        }
        if !searchText.isEmpty {
            let query = searchText.lowercased()
            filtered = filtered.filter { candidate in
                candidate.title.lowercased().contains(query)
                    || (candidate.subtitle?.lowercased().contains(query) ?? false)
                    || candidate.keywords.contains(where: { $0.lowercased().contains(query) })
            }
        }
        filtered = filtered.filter { $0.isAllowed(for: ageProvider.currentRange) }
        return filtered.sorted { lhs, rhs in
            if lhs.isFeatured != rhs.isFeatured {
                return lhs.isFeatured && !rhs.isFeatured
            }
            return lhs.title < rhs.title
        }
    }

    private func navigateToPendingDeepLink() {
        guard let deepLinked = appState.consumePendingDeepLink() else { return }
        navigationPath = [deepLinked]
    }
}

