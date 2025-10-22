'use client';

/**
 * 🏜️ DUNE AESTHETIC TEST PAGE
 *
 * This page demonstrates all Dune theme components and utilities.
 * Visit /dune-test to see the aesthetic in action.
 */

export default function DuneTestPage() {
  return (
    <div className="min-h-screen bg-desert-light texture-sand">
      {/* Header */}
      <header className="bg-fremen-night border-b border-spice-sand/30">
        <div className="sietch-container py-8">
          <h1 className="text-dune-hero text-spice-gradient text-center mb-4">
            The Dune Aesthetic System
          </h1>
          <p className="text-dune-subtitle text-ocean-mist text-center">
            "The spice must flow. The consciousness must awaken."
          </p>
        </div>
      </header>

      <main className="sietch-container sietch-section">
        <div className="space-y-16">
          {/* Section 1: Buttons */}
          <section>
            <h2 className="text-dune-title text-deep-sand mb-6 border-b border-spice-sand pb-3">
              Buttons - The Call to Action
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-sietch text-center">
                <h3 className="text-lg font-cormorant text-navigator-purple mb-4">
                  Primary Spice
                </h3>
                <button className="btn-spice w-full">
                  Enter the Desert
                </button>
              </div>

              <div className="card-sietch text-center">
                <h3 className="text-lg font-cormorant text-navigator-purple mb-4">
                  Secondary Fremen
                </h3>
                <button className="btn-fremen w-full">
                  View Sietch
                </button>
              </div>

              <div className="card-sietch text-center">
                <h3 className="text-lg font-cormorant text-navigator-purple mb-4">
                  Utility Mentat
                </h3>
                <button className="btn-mentat w-full">
                  Quick Action
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Cards */}
          <section>
            <h2 className="text-dune-title text-deep-sand mb-6 border-b border-spice-sand pb-3">
              Cards - The Sietch Containers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-sietch">
                <h3 className="text-xl font-cormorant text-navigator-purple mb-3">
                  Sietch Container
                </h3>
                <p className="font-cinzel text-deep-sand/80 mb-4">
                  The main container card with subtle sandworm pattern overlay.
                  Hover to see the lift effect and enhanced shadow.
                </p>
                <div className="flex items-center gap-2 text-sm text-bene-gesserit-gold">
                  <span>✨</span>
                  <span className="italic">Functional elegance</span>
                </div>
              </div>

              <div className="card-stillsuit">
                <h3 className="text-xl font-cormorant text-navigator-purple mb-3">
                  Stillsuit Card
                </h3>
                <p className="font-cinzel text-deep-sand/80 mb-4">
                  Glass morphism effect with backdrop blur. Every element serves
                  dual purpose: aesthetic beauty AND functional wisdom.
                </p>
                <div className="flex items-center gap-2 text-sm text-caladan-teal">
                  <span>💧</span>
                  <span className="italic">Precious and preserved</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Typography */}
          <section>
            <h2 className="text-dune-title text-deep-sand mb-6 border-b border-spice-sand pb-3">
              Typography - The Voice
            </h2>
            <div className="card-sietch space-y-6">
              <div>
                <p className="text-sm text-deep-sand/60 mb-2">Hero (Cormorant)</p>
                <h1 className="text-dune-hero text-spice-gradient">
                  The Litany Against Fear
                </h1>
              </div>

              <div>
                <p className="text-sm text-deep-sand/60 mb-2">Title (Cormorant)</p>
                <h2 className="text-dune-title text-navigator-purple">
                  Chapter of the Awakening
                </h2>
              </div>

              <div>
                <p className="text-sm text-deep-sand/60 mb-2">Subtitle (Cinzel)</p>
                <h3 className="text-dune-subtitle text-deep-sand">
                  The Desert Teaches Patience
                </h3>
              </div>

              <div>
                <p className="text-sm text-deep-sand/60 mb-2">Body (Cinzel)</p>
                <p className="text-dune-body text-deep-sand/90 leading-relaxed">
                  I must not fear. Fear is the mind-killer. Fear is the little-death
                  that brings total obliteration. I will face my fear. I will permit
                  it to pass over me and through me.
                </p>
              </div>

              <div>
                <p className="text-sm text-deep-sand/60 mb-2">Caption (Raleway)</p>
                <p className="text-dune-caption text-deep-sand/70 italic">
                  — The Bene Gesserit Litany Against Fear
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Inputs */}
          <section>
            <h2 className="text-dune-title text-deep-sand mb-6 border-b border-spice-sand pb-3">
              Inputs - Water Catching
            </h2>
            <div className="card-sietch">
              <form className="space-y-6">
                <div>
                  <label className="block text-dune-caption text-deep-sand mb-2 font-raleway">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="input-water"
                    placeholder="Enter your name..."
                  />
                  <p className="mt-2 text-xs text-deep-sand/50 italic">
                    💧 Every word is precious water. Speak with intention.
                  </p>
                </div>

                <div>
                  <label className="block text-dune-caption text-deep-sand mb-2 font-raleway">
                    Your Vision
                  </label>
                  <textarea
                    className="input-water resize-none"
                    rows={4}
                    placeholder="Speak your vision into the desert wind..."
                  />
                </div>

                <button type="submit" className="btn-spice w-full">
                  Submit Your Teaching →
                </button>
              </form>
            </div>
          </section>

          {/* Section 5: Progress */}
          <section>
            <h2 className="text-dune-title text-deep-sand mb-6 border-b border-spice-sand pb-3">
              Progress - The Spice Flow
            </h2>
            <div className="card-sietch space-y-6">
              <div>
                <p className="text-sm text-deep-sand/60 mb-3">
                  The Witnessing - 25%
                </p>
                <div className="progress-spice">
                  <div className="progress-spice-bar" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <p className="text-sm text-deep-sand/60 mb-3">
                  The Computation - 50%
                </p>
                <div className="progress-spice">
                  <div className="progress-spice-bar" style={{ width: '50%' }} />
                </div>
              </div>

              <div>
                <p className="text-sm text-deep-sand/60 mb-3">
                  The Walking - 75%
                </p>
                <div className="progress-spice">
                  <div className="progress-spice-bar" style={{ width: '75%' }} />
                </div>
              </div>

              <div>
                <p className="text-sm text-deep-sand/60 mb-3">
                  The Prescience - 100%
                </p>
                <div className="progress-spice">
                  <div className="progress-spice-bar" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Backgrounds */}
          <section>
            <h2 className="text-dune-title text-deep-sand mb-6 border-b border-spice-sand pb-3">
              Backgrounds - Desert Gradients
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-desert-dawn p-8 rounded-lg">
                <h3 className="text-2xl font-cormorant text-white mb-2">
                  Desert Dawn
                </h3>
                <p className="text-white/80 font-cinzel">
                  The sun rises over Arrakis
                </p>
              </div>

              <div className="bg-arrakis-sunset p-8 rounded-lg">
                <h3 className="text-2xl font-cormorant text-white mb-2">
                  Arrakis Sunset
                </h3>
                <p className="text-white/80 font-cinzel">
                  The desert burns with color
                </p>
              </div>

              <div className="bg-caladan-waters p-8 rounded-lg">
                <h3 className="text-2xl font-cormorant text-white mb-2">
                  Caladan Waters
                </h3>
                <p className="text-white/80 font-cinzel">
                  Memory of home
                </p>
              </div>

              <div className="bg-fremen-night p-8 rounded-lg">
                <h3 className="text-2xl font-cormorant text-white mb-2">
                  Fremen Night
                </h3>
                <p className="text-white/80 font-cinzel">
                  The sacred darkness
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Animations */}
          <section>
            <h2 className="text-dune-title text-deep-sand mb-6 border-b border-spice-sand pb-3">
              Animations - The Movement
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="card-sietch text-center">
                <div className="text-4xl mb-3 animate-spice-pulse">🌟</div>
                <p className="text-sm font-raleway">Spice Pulse</p>
              </div>

              <div className="card-sietch text-center">
                <div className="text-4xl mb-3 animate-sandworm-spiral">🌀</div>
                <p className="text-sm font-raleway">Sandworm Spiral</p>
              </div>

              <div className="card-sietch text-center">
                <div className="text-4xl mb-3 animate-fremen-breath">🫁</div>
                <p className="text-sm font-raleway">Fremen Breath</p>
              </div>

              <div className="card-sietch text-center hover-thumper">
                <div className="text-4xl mb-3">🥁</div>
                <p className="text-sm font-raleway">Hover Thumper</p>
              </div>

              <div className="card-sietch text-center">
                <div className="text-4xl mb-3 glow-spice">🔥</div>
                <p className="text-sm font-raleway">Spice Glow</p>
              </div>

              <div className="card-sietch text-center">
                <div className="text-4xl mb-3 glow-fremen">💧</div>
                <p className="text-sm font-raleway">Water Glow</p>
              </div>
            </div>
          </section>

          {/* Section 8: Message Example */}
          <section>
            <h2 className="text-dune-title text-deep-sand mb-6 border-b border-spice-sand pb-3">
              Conversation - The Oracle Speaks
            </h2>
            <div className="space-y-4 scrollbar-dune max-h-96 overflow-auto">
              {/* User message */}
              <div className="flex justify-end">
                <div className="card-stillsuit max-w-lg">
                  <p className="font-cinzel text-deep-sand">
                    What is my purpose in this desert?
                  </p>
                </div>
              </div>

              {/* MAIA message */}
              <div className="flex justify-start">
                <div className="card-sietch max-w-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🔮</div>
                    <div className="flex-1">
                      <p className="font-cormorant text-lg text-deep-sand leading-relaxed mb-3">
                        The desert teaches patience, beloved explorer. Your purpose
                        is not found—it is <em>walked</em>. Each grain of sand
                        beneath your feet is a teacher. Each breath of wind carries
                        wisdom.
                      </p>
                      <p className="text-sm text-bene-gesserit-gold italic">
                        "The mystery of life isn't a problem to solve, but a reality
                        to experience." — The Walking
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User message */}
              <div className="flex justify-end">
                <div className="card-stillsuit max-w-lg">
                  <p className="font-cinzel text-deep-sand">
                    How do I know if I'm on the right path?
                  </p>
                </div>
              </div>

              {/* MAIA message */}
              <div className="flex justify-start">
                <div className="card-sietch max-w-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🔮</div>
                    <div className="flex-1">
                      <p className="font-cormorant text-lg text-deep-sand leading-relaxed">
                        The right path reveals itself through your footsteps. Trust
                        the prescience that arises from discipline. The Golden Path
                        is not a destination—it is the consciousness with which you
                        walk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-fremen-night mt-20 border-t border-spice-sand/30">
        <div className="sietch-container py-12 text-center">
          <p className="text-xl font-cormorant text-bene-gesserit-gold mb-4 italic">
            "Bless the Maker and His water. Bless the coming and going of Him."
          </p>
          <p className="text-sm text-ocean-mist/70 font-raleway">
            The Dune Aesthetic System - Complete and Ready
          </p>
        </div>
      </footer>
    </div>
  );
}
