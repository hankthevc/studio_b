import SwiftUI

struct MiniAppRow: View {
    let miniApp: MiniApp

    var body: some View {
        HStack(spacing: 16) {
            preview
            VStack(alignment: .leading, spacing: 4) {
                Text(miniApp.title)
                    .font(.headline)
                if let subtitle = miniApp.subtitle {
                    Text(subtitle)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                Text(miniApp.ageBand.readable)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            if miniApp.isFeatured {
                Label("Featured", systemImage: "star.fill")
                    .labelStyle(.iconOnly)
                    .foregroundStyle(.yellow)
            }
        }
        .padding(.vertical, 8)
    }

    @ViewBuilder
    private var preview: some View {
        let placeholder = RoundedRectangle(cornerRadius: 8)
            .fill(Color.gray.opacity(0.2))
            .frame(width: 54, height: 54)

        if let asset = miniApp.previewImageName,
           let image = UIImage(named: asset) {
            Image(uiImage: image)
                .resizable()
                .scaledToFill()
                .frame(width: 54, height: 54)
                .clipShape(RoundedRectangle(cornerRadius: 8))
        } else {
            placeholder
        }
    }
}

