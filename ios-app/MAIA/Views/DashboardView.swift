//
//  DashboardView.swift
//  MAIA
//
//  Main dashboard showing elemental coherence
//

import SwiftUI

struct DashboardView: View {
    // Mock data for now - will connect to HealthKit later
    @State private var coherence = ElementalCoherence.mock()

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Header
                Text("MAIA")
                    .font(.system(size: 48, weight: .bold))
                    .foregroundColor(.white)

                Text("Consciousness Tracking")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.7))

                // Unified Coherence (Big Circle)
                UnifiedCoherenceView(coherence: coherence)

                // Five Elements
                ElementalGaugesView(coherence: coherence)

                // Kairos Indicator
                if coherence.isKairosWindow {
                    KairosIndicatorView()
                }

                // Insights
                InsightsView(coherence: coherence)

                Spacer()
            }
            .padding()
        }
        .background(
            LinearGradient(
                colors: [Color.blue.opacity(0.3), Color.purple.opacity(0.3)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
        )
    }
}

// MARK: - Unified Coherence Circle

struct UnifiedCoherenceView: View {
    let coherence: ElementalCoherence

    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                // Background circle
                Circle()
                    .stroke(Color.white.opacity(0.2), lineWidth: 12)
                    .frame(width: 180, height: 180)

                // Progress circle
                Circle()
                    .trim(from: 0, to: coherence.unified)
                    .stroke(
                        AngularGradient(
                            colors: [.blue, .purple, .pink, .blue],
                            center: .center
                        ),
                        style: StrokeStyle(lineWidth: 12, lineCap: .round)
                    )
                    .frame(width: 180, height: 180)
                    .rotationEffect(.degrees(-90))

                // Percentage text
                VStack {
                    Text("\(coherence.unifiedPercentage)%")
                        .font(.system(size: 48, weight: .bold))
                        .foregroundColor(.white)

                    Text("UNIFIED")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.7))
                }
            }

            Text("💫 Field Coherence")
                .font(.headline)
                .foregroundColor(.white)
        }
        .padding()
    }
}

// MARK: - Elemental Gauges

struct ElementalGaugesView: View {
    let coherence: ElementalCoherence

    var body: some View {
        VStack(spacing: 16) {
            ElementGauge(name: "Air", emoji: "💨", value: coherence.air, color: .cyan)
            ElementGauge(name: "Fire", emoji: "🔥", value: coherence.fire, color: .orange)
            ElementGauge(name: "Water", emoji: "🌊", value: coherence.water, color: .blue)
            ElementGauge(name: "Earth", emoji: "🌍", value: coherence.earth, color: .green)
            ElementGauge(name: "Aether", emoji: "✨", value: coherence.aether, color: .purple)
        }
        .padding()
        .background(Color.white.opacity(0.1))
        .cornerRadius(16)
    }
}

struct ElementGauge: View {
    let name: String
    let emoji: String
    let value: Double
    let color: Color

    var body: some View {
        HStack {
            Text(emoji)
                .font(.title2)

            Text(name)
                .font(.headline)
                .foregroundColor(.white)
                .frame(width: 80, alignment: .leading)

            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    // Background bar
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.white.opacity(0.2))

                    // Progress bar
                    RoundedRectangle(cornerRadius: 8)
                        .fill(color)
                        .frame(width: geometry.size.width * value)
                }
            }
            .frame(height: 12)

            Text("\(Int(value * 100))%")
                .font(.subheadline)
                .foregroundColor(.white)
                .frame(width: 50, alignment: .trailing)
        }
    }
}

// MARK: - Kairos Window Indicator

struct KairosIndicatorView: View {
    var body: some View {
        HStack {
            Image(systemName: "star.fill")
                .foregroundColor(.yellow)

            Text("KAIROS WINDOW OPEN")
                .font(.headline)
                .foregroundColor(.white)

            Image(systemName: "star.fill")
                .foregroundColor(.yellow)
        }
        .padding()
        .background(Color.yellow.opacity(0.3))
        .cornerRadius(12)
    }
}

// MARK: - Insights

struct InsightsView: View {
    let coherence: ElementalCoherence

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("🎯 Insights")
                .font(.headline)
                .foregroundColor(.white)

            HStack {
                Text("Dominant:")
                    .foregroundColor(.white.opacity(0.7))

                Text("\(coherence.dominantElement.emoji) \(coherence.dominantElement.rawValue)")
                    .foregroundColor(.white)
                    .fontWeight(.bold)
            }

            HStack {
                Text("Deficient:")
                    .foregroundColor(.white.opacity(0.7))

                Text("\(coherence.deficientElement.emoji) \(coherence.deficientElement.rawValue)")
                    .foregroundColor(.white)
                    .fontWeight(.bold)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white.opacity(0.1))
        .cornerRadius(12)
    }
}

// MARK: - Preview

struct DashboardView_Previews: PreviewProvider {
    static var previews: some View {
        DashboardView()
    }
}
