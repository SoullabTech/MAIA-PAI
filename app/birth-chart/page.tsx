'use client';

/**
 * Birth Chart Entry Form
 *
 * Dune meets Blade Runner aesthetic:
 * - Desert mysticism: Warm amber/sand tones, organic textures
 * - Cyberpunk sophistication: Sharp edges, glowing accents, tech precision
 * - Future-primitive: Ancient wisdom meets advanced interface
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Clock, Calendar, Sparkles, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationData {
  lat: number;
  lng: number;
  name: string;
  timezone?: string;
}

export default function BirthChartPage() {
  const router = useRouter();
  const [step, setStep] = useState<'date' | 'time' | 'location' | 'processing'>('date');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: null as LocationData | null,
  });
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  // Load saved birth data if exists
  useEffect(() => {
    const saved = localStorage.getItem('birthChartData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFormData(data);
      } catch (e) {
        console.error('Failed to load saved birth data:', e);
      }
    }
  }, []);

  // Search for location using geocoding API
  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setLocationResults([]);
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      // Using OpenStreetMap Nominatim for geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      const data = await response.json();

      const results: LocationData[] = data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        name: item.display_name,
      }));

      setLocationResults(results);
    } catch (err) {
      console.error('Location search error:', err);
      setError('Failed to search locations. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced location search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationQuery) {
        searchLocation(locationQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [locationQuery]);

  const handleSubmit = async () => {
    if (!formData.date || !formData.time || !formData.location) {
      setError('Please complete all fields');
      return;
    }

    setStep('processing');
    setError('');

    try {
      // Save to localStorage
      localStorage.setItem('birthChartData', JSON.stringify(formData));

      // Submit to backend
      const response = await fetch('/api/astrology/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          time: formData.time,
          location: formData.location,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to astrology dashboard
        router.push('/astrology');
      } else {
        setError(data.error || 'Failed to calculate birth chart');
        setStep('location');
      }
    } catch (err) {
      console.error('Birth chart calculation error:', err);
      setError('Failed to calculate birth chart. Please try again.');
      setStep('location');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'date':
        return formData.date !== '';
      case 'time':
        return formData.time !== '';
      case 'location':
        return formData.location !== null;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (step === 'date') setStep('time');
    else if (step === 'time') setStep('location');
    else if (step === 'location') handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]">
      {/* Cosmic ambient background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 text-amber-400/80 mb-4">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm uppercase tracking-wider font-light">Sacred Cartography</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-200 via-orange-200 to-amber-300 bg-clip-text text-transparent mb-4">
              Your Cosmic Blueprint
            </h1>
            <p className="text-blue-200/60 text-lg max-w-xl mx-auto">
              Map the stellar architecture of your birth moment through Spiralogic astrology
            </p>
          </motion.div>

          {/* Progress indicators */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {['date', 'time', 'location'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                    step === s
                      ? 'border-amber-400 bg-amber-400 shadow-lg shadow-amber-400/50'
                      : ['date', 'time', 'location'].indexOf(step) > i
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-indigo-900/40'
                  }`}
                />
                {i < 2 && (
                  <div
                    className={`w-12 h-0.5 transition-all duration-500 ${
                      ['date', 'time', 'location'].indexOf(step) > i
                        ? 'bg-indigo-500'
                        : 'bg-indigo-900/40'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Main form card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-blue-950/60 backdrop-blur-xl border border-indigo-700/30 rounded-2xl p-8 shadow-2xl"
            style={{
              boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Date Step */}
            {step === 'date' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                    <Calendar className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-amber-100">Birth Date</h2>
                    <p className="text-blue-200/50 text-sm">When did you enter this world?</p>
                  </div>
                </div>

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-4 bg-indigo-950/60 border border-indigo-600/30 rounded-lg text-blue-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  max={new Date().toISOString().split('T')[0]}
                />
              </motion.div>
            )}

            {/* Time Step */}
            {step === 'time' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-amber-100">Birth Time</h2>
                    <p className="text-blue-200/50 text-sm">Precision matters for house positions</p>
                  </div>
                </div>

                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-4 bg-indigo-950/60 border border-indigo-600/30 rounded-lg text-blue-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />

                <p className="text-indigo-300/40 text-xs mt-3">
                  If you don't know your exact birth time, use 12:00 PM as an approximation
                </p>
              </motion.div>
            )}

            {/* Location Step */}
            {step === 'location' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                    <MapPin className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-amber-100">Birth Location</h2>
                    <p className="text-blue-200/50 text-sm">Where on Earth were you born?</p>
                  </div>
                </div>

                {!formData.location ? (
                  <>
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="Search city or location..."
                      className="w-full px-4 py-4 bg-indigo-950/60 border border-indigo-600/30 rounded-lg text-blue-100 placeholder-indigo-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    />

                    {isSearching && (
                      <div className="mt-4 text-center text-amber-400/60 text-sm flex items-center justify-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        Scanning Earth coordinates...
                      </div>
                    )}

                    {locationResults.length > 0 && (
                      <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                        {locationResults.map((loc, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setFormData({ ...formData, location: loc });
                              setLocationResults([]);
                              setLocationQuery('');
                            }}
                            className="w-full text-left px-4 py-3 bg-indigo-950/60 hover:bg-indigo-900/40 border border-indigo-700/30 hover:border-amber-500/50 rounded-lg text-blue-200 text-sm transition-all"
                          >
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="font-medium">{loc.name.split(',')[0]}</div>
                                <div className="text-indigo-300/50 text-xs">
                                  {loc.lat.toFixed(4)}°, {loc.lng.toFixed(4)}°
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-indigo-900/20 border border-indigo-600/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-amber-100 font-medium">
                          {formData.location.name.split(',').slice(0, 2).join(', ')}
                        </div>
                        <div className="text-indigo-300/60 text-sm">
                          {formData.location.lat.toFixed(4)}°, {formData.location.lng.toFixed(4)}°
                        </div>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, location: null })}
                        className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Processing Step */}
            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="inline-block p-4 bg-indigo-900/30 rounded-full mb-6 border border-indigo-600/30">
                  <Loader className="w-12 h-12 text-amber-400 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-amber-100 mb-2">
                  Calculating Stellar Positions
                </h2>
                <p className="text-blue-200/60">
                  Mapping planetary alignments at your birth moment...
                </p>
              </motion.div>
            )}

            {/* Error Display */}
            {error && step !== 'processing' && (
              <div className="mt-6 px-4 py-3 bg-red-950/30 border border-red-700/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Navigation */}
            {step !== 'processing' && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-indigo-700/20">
                {step !== 'date' ? (
                  <button
                    onClick={() => {
                      if (step === 'time') setStep('date');
                      else if (step === 'location') setStep('time');
                    }}
                    className="text-indigo-300 hover:text-amber-400 transition-colors"
                  >
                    ← Back
                  </button>
                ) : (
                  <Link
                    href="/astrology"
                    className="text-indigo-400/60 hover:text-indigo-300 transition-colors text-sm"
                  >
                    Cancel
                  </Link>
                )}

                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-indigo-900/30 disabled:to-indigo-900/30 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-amber-900/30 hover:shadow-amber-600/30 transition-all duration-300 flex items-center gap-2"
                >
                  {step === 'location' ? 'Calculate Chart' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Skip link */}
          {step !== 'processing' && (
            <div className="text-center mt-8">
              <Link
                href="/astrology"
                className="text-indigo-400/50 hover:text-amber-400 text-sm transition-colors"
              >
                View sample chart instead →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
