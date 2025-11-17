'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/lib/services/languageService';

interface LanguageSelectorProps {
  compact?: boolean;
  showFlag?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  compact = false,
  showFlag = true,
  className = ''
}) => {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentLang = SUPPORTED_LANGUAGES[language];

  // Filter languages based on search
  const filteredLanguages = availableLanguages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group languages by availability
  const stableLanguages = filteredLanguages.filter(l => !l.beta);
  const betaLanguages = filteredLanguages.filter(l => l.beta);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);
    setSearchQuery('');

    // Play a subtle sound effect
    const audio = new Audio('/sounds/soft-click.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-black/20 border border-white/10
                     hover:bg-black/30 transition-all ${className}`}
          title="Change Language"
        >
          {showFlag && <span className="text-lg">{currentLang.flag}</span>}
          <span className="text-sm text-white/80">{currentLang.code.toUpperCase()}</span>
          <ChevronDown className={`w-3 h-3 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 right-0 w-64 max-h-96 overflow-y-auto
                         bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl
                         shadow-2xl z-50"
              >
                {/* Search */}
                <div className="sticky top-0 p-3 border-b border-white/10 bg-gray-900/95 backdrop-blur-xl">
                  <input
                    type="text"
                    placeholder="Search languages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-white/40 text-sm
                             focus:outline-none focus:border-purple-500/50"
                    autoFocus
                  />
                </div>

                <div className="py-2">
                  {/* Stable Languages */}
                  {stableLanguages.length > 0 && (
                    <>
                      <div className="px-3 py-1 text-xs text-white/40 uppercase tracking-wider">
                        Available
                      </div>
                      {stableLanguages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-white/10
                                   transition-colors ${language === lang.code ? 'bg-purple-500/20' : ''}`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <div className="flex-1 text-left">
                            <div className="text-sm text-white">{lang.name}</div>
                            <div className="text-xs text-white/60">{lang.nativeName}</div>
                          </div>
                          {language === lang.code && (
                            <Check className="w-4 h-4 text-purple-400" />
                          )}
                        </button>
                      ))}
                    </>
                  )}

                  {/* Beta Languages */}
                  {betaLanguages.length > 0 && (
                    <>
                      <div className="px-3 py-1 mt-2 text-xs text-white/40 uppercase tracking-wider">
                        Beta
                      </div>
                      {betaLanguages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-white/10
                                   transition-colors ${language === lang.code ? 'bg-purple-500/20' : ''}`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <div className="flex-1 text-left">
                            <div className="text-sm text-white flex items-center gap-2">
                              {lang.name}
                              <span className="text-xs px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                                Beta
                              </span>
                            </div>
                            <div className="text-xs text-white/60">{lang.nativeName}</div>
                          </div>
                          {language === lang.code && (
                            <Check className="w-4 h-4 text-purple-400" />
                          )}
                        </button>
                      ))}
                    </>
                  )}

                  {filteredLanguages.length === 0 && (
                    <div className="px-3 py-4 text-center text-white/40 text-sm">
                      No languages found
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full version for settings panel
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-medium text-white">Language Settings</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {availableLanguages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`relative p-3 rounded-lg border transition-all
                     ${language === lang.code
                ? 'bg-purple-500/20 border-purple-500/50'
                : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          >
            {lang.beta && (
              <span className="absolute top-1 right-1 text-xs px-1.5 py-0.5
                           bg-amber-500/20 text-amber-400 rounded">
                Beta
              </span>
            )}
            <div className="text-2xl mb-1">{lang.flag}</div>
            <div className="text-sm text-white font-medium">{lang.name}</div>
            <div className="text-xs text-white/60">{lang.nativeName}</div>
            {language === lang.code && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-2 right-2"
              >
                <Check className="w-4 h-4 text-purple-400" />
              </motion.div>
            )}
          </button>
        ))}
      </div>

      {/* Cultural Preferences Note */}
      <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <p className="text-xs text-purple-300">
          MAIA adapts her personality and communication style to match your cultural preferences.
          She'll use appropriate greetings, formality levels, and metaphors for your selected language.
        </p>
      </div>
    </div>
  );
};