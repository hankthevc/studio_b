import SwiftUI

@main
struct StudioBHostApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var ageProvider = AgeCategoryProvider()

    var body: some Scene {
        WindowGroup {
            MiniAppCatalogView()
                .environmentObject(appState)
                .environmentObject(ageProvider)
                .task {
                    async let manifestTask = appState.loadManifest()
                    async let ageTask = ageProvider.refresh()
                    _ = await (manifestTask, ageTask)
                }
                .onOpenURL { url in
                    appState.handleIncomingURL(url)
                }
        }
    }
}

