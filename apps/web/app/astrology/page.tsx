'use client';

/**
 * Astrology - Traditional Chart Analysis
 *
 * Professional astrological chart calculations and interpretation.
 * Supports multiple house systems and astrological traditions.
 *
 * Features:
 * - Porphyry house system (default)
 * - Western tropical astrology
 * - Expandable to sidereal, Mayan, and other systems
 * - Precise planetary positions and aspects
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Globe, Calendar, Clock, MapPin, Calculator } from 'lucide-react';
import { BirthDataForm } from '@/components/astrology/BirthDataForm';
import { TraditionalChartWheel } from '@/components/astrology/TraditionalChartWheel';
import { calculateHouses, HouseSystemCalculation, getPlanetHouse } from '@/lib/astrology/houseSystems';

interface AstrologyChart {
  houseSystem: HouseSystemCalculation;
  planets: Array<{
    name: string;
    longitude: number;
    latitude: number;
    house: number;
    sign: string;
    degree: number;
    retrograde: boolean;
  }>;
  aspects: Array<{
    planet1: string;
    planet2: string;
    type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx';
    orb: number;
    exact: boolean;
  }>;
  metadata: {
    system: 'western' | 'sidereal' | 'mayan';
    coordinates: { lat: number; lng: number };
    timezone: string;
    datetime: Date;
  };
}

const astrologySystem = {
  western: {
    name: 'Western Tropical',
    description: 'Traditional western astrology using the tropical zodiac',
    houseSystems: ['porphyry', 'placidus', 'whole-sign', 'equal', 'koch']
  },
  sidereal: {
    name: 'Sidereal Astrology',
    description: 'Star-based astrology using actual constellation positions',
    houseSystems: ['porphyry', 'placidus', 'whole-sign', 'equal']
  },
  mayan: {
    name: 'Mayan Astrology',
    description: 'Ancient Mayan calendar and celestial wisdom',
    houseSystems: ['daykeeper', 'tonalamatl']
  }
};

const houseSystems = {
  porphyry: {
    name: 'Porphyry',
    description: 'Divides houses by trisecting quadrants - excellent for psychological work'
  },
  placidus: {
    name: 'Placidus',
    description: 'Time-based system - most popular in modern astrology'
  },
  'whole-sign': {
    name: 'Whole Sign',
    description: 'Ancient system where each house equals one zodiac sign'
  },
  equal: {
    name: 'Equal House',
    description: 'Each house is exactly 30 degrees from the ascendant'
  },
  koch: {
    name: 'Koch',
    description: 'Birthplace-based system emphasizing local coordinates'
  }
};

export default function AstrologyPage() {
  const [selectedSystem, setSelectedSystem] = useState<'western' | 'sidereal' | 'mayan'>('western');
  const [selectedHouseSystem, setSelectedHouseSystem] = useState('porphyry');
  const [chartData, setChartData] = useState<AstrologyChart | null>(null);
  const [birthData, setBirthData] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleBirthDataSubmit = async (data: any) => {
    setIsCalculating(true);
    setBirthData(data);

    try {
      // Call the real birth chart API
      console.log('Birth data received:', data);

      // Extract location data properly
      const location = data.location || data;
      const lat = location.lat || data.latitude || data.lat;
      const lng = location.lng || location.lon || data.longitude || data.lng;
      const timezone = location.timezone || data.timezone;

      console.log('Extracted coordinates:', { lat, lng, timezone });

      if (!lat || !lng) {
        throw new Error('Location coordinates are missing. Please select a valid location.');
      }

      const apiPayload = {
        date: data.date,
        time: data.time,
        location: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          timezone: timezone || 'UTC',
        },
      };

      console.log('API payload being sent:', apiPayload);

      const response = await fetch('/api/astrology/birth-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      console.log('API response status:', response.status);

      const result = await response.json();
      console.log('API response:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to calculate chart');
      }

      const chartApiData = result.data;

      // Convert API data to astrology page format
      const planets = [
        {
          name: 'Sun',
          longitude: chartApiData.sun.degree + (getSignOffset(chartApiData.sun.sign)),
          latitude: 0,
          sign: chartApiData.sun.sign,
          degree: chartApiData.sun.degree,
          house: chartApiData.sun.house,
          retrograde: false
        },
        {
          name: 'Moon',
          longitude: chartApiData.moon.degree + (getSignOffset(chartApiData.moon.sign)),
          latitude: 0,
          sign: chartApiData.moon.sign,
          degree: chartApiData.moon.degree,
          house: chartApiData.moon.house,
          retrograde: false
        },
        {
          name: 'Mercury',
          longitude: chartApiData.mercury.degree + (getSignOffset(chartApiData.mercury.sign)),
          latitude: 0,
          sign: chartApiData.mercury.sign,
          degree: chartApiData.mercury.degree,
          house: chartApiData.mercury.house,
          retrograde: false
        },
        {
          name: 'Venus',
          longitude: chartApiData.venus.degree + (getSignOffset(chartApiData.venus.sign)),
          latitude: 0,
          sign: chartApiData.venus.sign,
          degree: chartApiData.venus.degree,
          house: chartApiData.venus.house,
          retrograde: false
        },
        {
          name: 'Mars',
          longitude: chartApiData.mars.degree + (getSignOffset(chartApiData.mars.sign)),
          latitude: 0,
          sign: chartApiData.mars.sign,
          degree: chartApiData.mars.degree,
          house: chartApiData.mars.house,
          retrograde: false
        },
        {
          name: 'Jupiter',
          longitude: chartApiData.jupiter.degree + (getSignOffset(chartApiData.jupiter.sign)),
          latitude: 0,
          sign: chartApiData.jupiter.sign,
          degree: chartApiData.jupiter.degree,
          house: chartApiData.jupiter.house,
          retrograde: false
        },
        {
          name: 'Saturn',
          longitude: chartApiData.saturn.degree + (getSignOffset(chartApiData.saturn.sign)),
          latitude: 0,
          sign: chartApiData.saturn.sign,
          degree: chartApiData.saturn.degree,
          house: chartApiData.saturn.house,
          retrograde: false
        },
      ];

      // Add outer planets and points if available
      if (chartApiData.uranus) {
        planets.push({
          name: 'Uranus',
          longitude: chartApiData.uranus.degree + getSignOffset(chartApiData.uranus.sign),
          latitude: 0,
          sign: chartApiData.uranus.sign,
          degree: chartApiData.uranus.degree,
          house: chartApiData.uranus.house,
          retrograde: false
        });
      }

      if (chartApiData.neptune) {
        planets.push({
          name: 'Neptune',
          longitude: chartApiData.neptune.degree + getSignOffset(chartApiData.neptune.sign),
          latitude: 0,
          sign: chartApiData.neptune.sign,
          degree: chartApiData.neptune.degree,
          house: chartApiData.neptune.house,
          retrograde: false
        });
      }

      if (chartApiData.pluto) {
        planets.push({
          name: 'Pluto',
          longitude: chartApiData.pluto.degree + getSignOffset(chartApiData.pluto.sign),
          latitude: 0,
          sign: chartApiData.pluto.sign,
          degree: chartApiData.pluto.degree,
          house: chartApiData.pluto.house,
          retrograde: false
        });
      }

      if (chartApiData.chiron) {
        planets.push({
          name: 'Chiron',
          longitude: chartApiData.chiron.degree + getSignOffset(chartApiData.chiron.sign),
          latitude: 0,
          sign: chartApiData.chiron.sign,
          degree: chartApiData.chiron.degree,
          house: chartApiData.chiron.house,
          retrograde: false
        });
      }

      if (chartApiData.northNode) {
        planets.push({
          name: 'North Node',
          longitude: chartApiData.northNode.degree + getSignOffset(chartApiData.northNode.sign),
          latitude: 0,
          sign: chartApiData.northNode.sign,
          degree: chartApiData.northNode.degree,
          house: chartApiData.northNode.house,
          retrograde: false
        });
      }

      if (chartApiData.southNode) {
        planets.push({
          name: 'South Node',
          longitude: chartApiData.southNode.degree + getSignOffset(chartApiData.southNode.sign),
          latitude: 0,
          sign: chartApiData.southNode.sign,
          degree: chartApiData.southNode.degree,
          house: chartApiData.southNode.house,
          retrograde: false
        });
      }

      // Calculate ascendant and midheaven longitudes from API data
      const ascendantLong = chartApiData.ascendant.degree + getSignOffset(chartApiData.ascendant.sign);
      const midheavenLong = chartApiData.midheaven.degree + getSignOffset(chartApiData.midheaven.sign);

      // Calculate houses using selected system
      const houseSystem = calculateHouses(
        selectedHouseSystem as any,
        ascendantLong,
        midheavenLong,
        {
          datetime: new Date(`${data.date}T${data.time}`),
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          timezone: timezone || 'UTC'
        }
      );

      setChartData({
        houseSystem,
        planets,
        aspects: chartApiData.aspects || [],
        metadata: {
          system: selectedSystem,
          coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
          timezone: timezone || 'UTC',
          datetime: new Date(`${data.date}T${data.time}`)
        }
      });

    } catch (error) {
      console.error('Chart calculation error:', error);
      alert('Failed to calculate chart. Please check your birth data and try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  // Helper function to get zodiac sign offset in longitude
  const getSignOffset = (sign: string): number => {
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    return signs.indexOf(sign) * 30;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
        <div className="relative z-10 px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Astrological Chart Analysis
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Professional chart calculations and traditional astrological interpretation
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">

            {/* Astrology System Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Astrological System</h3>
              </div>

              <div className="space-y-3">
                {Object.entries(astrologySystem).map(([key, system]) => (
                  <motion.button
                    key={key}
                    onClick={() => setSelectedSystem(key as any)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedSystem === key
                        ? 'bg-blue-600/20 border border-blue-500/30'
                        : 'bg-slate-700/50 hover:bg-slate-700/70'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-medium">{system.name}</div>
                    <div className="text-sm text-slate-400 mt-1">{system.description}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* House System Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">House System</h3>
              </div>

              <div className="space-y-2">
                {astrologySystem[selectedSystem].houseSystems.map((system) => (
                  <motion.button
                    key={system}
                    onClick={() => setSelectedHouseSystem(system)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedHouseSystem === system
                        ? 'bg-purple-600/20 border border-purple-500/30'
                        : 'bg-slate-700/50 hover:bg-slate-700/70'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-medium">{houseSystems[system as keyof typeof houseSystems]?.name || system}</div>
                    <div className="text-sm text-slate-400 mt-1">
                      {houseSystems[system as keyof typeof houseSystems]?.description || 'Traditional house system'}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Birth Data Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold">Birth Information</h3>
              </div>

              <BirthDataForm onSubmit={handleBirthDataSubmit} />
            </motion.div>

          </div>

          {/* Chart Display */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 h-full"
            >
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-gold-400" />
                <h3 className="text-xl font-semibold">Astrological Chart</h3>
                {selectedSystem && selectedHouseSystem && (
                  <div className="text-sm text-slate-400 ml-auto">
                    {astrologySystem[selectedSystem].name} • {houseSystems[selectedHouseSystem as keyof typeof houseSystems]?.name}
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {isCalculating ? (
                  <motion.div
                    key="calculating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-96 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full mx-auto mb-4"
                      />
                      <p className="text-slate-300">Calculating chart positions...</p>
                      <p className="text-sm text-slate-400 mt-2">
                        Using {astrologySystem[selectedSystem].name} with {houseSystems[selectedHouseSystem as keyof typeof houseSystems]?.name} houses
                      </p>
                    </div>
                  </motion.div>
                ) : chartData ? (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="h-96 flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="mb-6">
                        <TraditionalChartWheel
                          houseSystem={chartData.houseSystem}
                          planets={chartData.planets}
                          aspects={chartData.aspects}
                          size={400}
                          showAspects={true}
                          showHouseNumbers={true}
                          showDegrees={false}
                        />
                      </div>

                      <div className="text-center">
                        <p className="text-slate-300 text-lg mb-2">
                          Chart calculated for {birthData?.city}, {birthData?.country}
                        </p>
                        <p className="text-sm text-slate-400 mb-4">
                          {new Date(birthData?.datetime).toLocaleDateString()} • {chartData.houseSystem.system.toUpperCase()} houses
                        </p>

                        {/* Planet summary */}
                        <div className="grid grid-cols-2 gap-3 max-w-lg text-sm">
                          {chartData.planets.slice(0, 6).map((planet) => (
                            <div key={planet.name} className="flex justify-between bg-slate-700/30 px-3 py-1 rounded">
                              <span className="text-slate-300">{planet.name}</span>
                              <span className="text-slate-400">{planet.sign} {Math.round(planet.degree)}°</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-96 flex items-center justify-center"
                  >
                    <div className="text-center text-slate-400">
                      <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Enter birth data to generate your chart</p>
                      <p className="text-sm mt-2">
                        Select your preferred system and house method, then provide birth details
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}