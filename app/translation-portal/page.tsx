export default function TranslationPortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F9F9] via-[#E0F2F1] to-[#B2DFDB]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extralight text-[#004D40] mb-4">
              The Consciousness Translation Portal
            </h1>
            <p className="text-[#00695C]/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Experience the Rosetta Stone of consciousness technology.
              Translate archetypal patterns between different wisdom systems
              and discover the underlying unity of all consciousness languages.
            </p>
          </div>

          {/* Portal Status */}
          <div className="bg-white/60 rounded-3xl p-8 backdrop-blur-sm text-center">
            <h2 className="text-2xl font-light text-[#004D40] mb-4">
              Portal Active
            </h2>
            <p className="text-[#00695C]/80 mb-6">
              "The door is round and open. Don't go back to sleep."
            </p>
            <div className="text-6xl mb-4">🌀</div>
            <p className="text-sm text-[#00695C]/60 italic">
              Translation engine loading...
            </p>
          </div>

          {/* About the Portal */}
          <div className="bg-white/60 rounded-3xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-light text-[#004D40] mb-6 text-center">
              How the Translation Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#26A69A] to-[#4DB6AC] rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                  🌀
                </div>
                <h3 className="text-lg font-medium text-[#004D40] mb-2">
                  Universal Essence
                </h3>
                <p className="text-[#00695C]/80 text-sm">
                  Each archetypal pattern contains a universal signature that transcends any single system
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#26A69A] to-[#4DB6AC] rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                  🔄
                </div>
                <h3 className="text-lg font-medium text-[#004D40] mb-2">
                  Intelligent Translation
                </h3>
                <p className="text-[#00695C]/80 text-sm">
                  Our engine maps universal essences to system-specific languages while preserving core meaning
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#26A69A] to-[#4DB6AC] rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                  🎯
                </div>
                <h3 className="text-lg font-medium text-[#004D40] mb-2">
                  Practical Integration
                </h3>
                <p className="text-[#00695C]/80 text-sm">
                  Discover new insights by seeing familiar patterns through different consciousness lenses
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}