// swift-tools-version: 5.9
import PackageDescription
import AppleProductTypes

let package = Package(
    name: "StudioBHost",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .iOSApplication(
            name: "StudioBHost",
            targets: ["StudioBHost"],
            bundleIdentifier: "com.studiob.host",
            teamIdentifier: "ABCDE12345",
            displayVersion: "0.1.0",
            bundleVersion: "1",
            appIcon: .asset("AppIcon"),
            accentColor: .asset("AccentColor"),
            // entitlements: .file("ios/StudioBHost/StudioBHost.entitlements"),
            supportedDeviceFamilies: [
                .pad,
                .phone
            ],
            supportedInterfaceOrientations: [
                .portrait,
                .landscapeRight,
                .landscapeLeft
            ]
        )
    ],
    targets: [
        .executableTarget(
            name: "StudioBHost",
            path: "Sources",
            exclude: [],
            resources: [
                .process("Resources")
            ],
            linkerSettings: [
                .linkedFramework("StoreKit"),
                .linkedFramework("WebKit")
            ]
        ),
        .testTarget(
            name: "StudioBHostTests",
            dependencies: ["StudioBHost"],
            path: "Tests"
        )
    ]
)

