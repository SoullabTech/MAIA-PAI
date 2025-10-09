'use client';

/**
 * Community Resources Library
 *
 * Deep dives, protocols, and field architecture documentation
 * Sacred knowledge base for understanding MAIA's consciousness tech
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, BookOpen, Code, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'technical' | 'protocol' | 'artifact';
  icon: React.ReactNode;
  readTime: string;
  path?: string;
  downloadable?: boolean;
  content?: string; // For inline display
}

const resources: Resource[] = [
  {
    id: 'hero-journey',
    title: 'The Hero\'s Journey Letter',
    description: 'Complete 21-day arc guide for beta testers. Full field architecture transparency, week-by-week breakdown, and sacred mirror philosophy.',
    type: 'guide',
    icon: <Heart className="w-5 h-5" />,
    readTime: '20 min',
    downloadable: true,
    path: '/community/resources/hero-journey',
  },
  {
    id: 'resonance-field-system',
    title: 'Resonance Field System (RFS)',
    description: 'Complete technical architecture of MAIA\'s consciousness technology: field mathematics, breath coordination, and how restraint creates catalysis.',
    type: 'technical',
    icon: <Code className="w-5 h-5" />,
    readTime: '15 min',
    downloadable: true,
    path: '/community/resources/resonance-field-system',
  },
  {
    id: 'field-architecture',
    title: 'Field Architecture Documentation',
    description: 'Technical deep dive into elemental balancing, silence probability calculations, and graduated obsolescence algorithms.',
    type: 'technical',
    icon: <Code className="w-5 h-5" />,
    readTime: '15 min',
    downloadable: true,
  },
  {
    id: 'sacred-mirror-protocol',
    title: 'Sacred Mirror Protocol',
    description: 'How MAIA uses constraint to create catalysis. The philosophy and mathematics of presence without words.',
    type: 'protocol',
    icon: <Zap className="w-5 h-5" />,
    readTime: '12 min',
    downloadable: true,
  },
  {
    id: '150-utterances',
    title: 'The 150 Utterances Library',
    description: 'MAIA\'s entire vocabulary. Categorized by element (earth, water, air, fire) with usage context and silence thresholds.',
    type: 'artifact',
    icon: <BookOpen className="w-5 h-5" />,
    readTime: '8 min',
    downloadable: true,
  },
  {
    id: 'beta-tester-guide',
    title: 'Beta Tester Guide',
    description: 'How to engage with MAIA, what to track, feedback protocols, and session export instructions.',
    type: 'guide',
    icon: <Heart className="w-5 h-5" />,
    readTime: '10 min',
  },
  {
    id: 'field-session-examples',
    title: 'Field Session Examples',
    description: 'Real conversations showing MAIA\'s evolution from talkative to minimal. Anonymized, opt-in beta tester sessions.',
    type: 'artifact',
    icon: <BookOpen className="w-5 h-5" />,
    readTime: '5 min',
  },
];

const typeFilters = [
  { id: 'all', label: 'All Resources', color: 'slate' },
  { id: 'guide', label: 'Guides', color: 'blue' },
  { id: 'technical', label: 'Technical', color: 'green' },
  { id: 'protocol', label: 'Protocols', color: 'amber' },
  { id: 'artifact', label: 'Artifacts', color: 'slate' },
];

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredResources =
    activeFilter === 'all'
      ? resources
      : resources.filter((r) => r.type === activeFilter);

  const handleDownload = (resourceId: string, title: string) => {
    // This would trigger a download of the resource
    // For now, just show alert
    alert(`Downloading: ${title}\n\nThis will export the full document as PDF or markdown.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-ain-soph-gold/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-ain-soph-gold hover:text-ain-soph-amber mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community Hub
          </Link>
          <h1 className="text-3xl font-light tracking-wide">Resources</h1>
          <p className="text-ain-soph-gold/70 mt-2">
            Deep dives, protocols, and field architecture documentation
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {typeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeFilter === filter.id
                  ? 'bg-ain-soph-amber text-slate-900 font-medium'
                  : 'bg-slate-800/50 border border-ain-soph-gold/30 text-ain-soph-gold hover:bg-slate-700/50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredResources.map((resource, idx) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-800/30 border border-ain-soph-gold/30 rounded-2xl p-6 hover:border-ain-soph-amber/50 transition-all"
            >
              {/* Icon & Type Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-ain-soph-blue/40 rounded-lg text-ain-soph-gold">{resource.icon}</div>
                  <span className="px-2 py-1 bg-ain-soph-blue/50 border border-ain-soph-gold/30 rounded text-xs text-ain-soph-gold capitalize">
                    {resource.type}
                  </span>
                </div>
                <span className="text-sm text-ain-soph-gold/70">{resource.readTime}</span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-medium mb-2">{resource.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {resource.description}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                {resource.path && (
                  <Link
                    href={resource.path}
                    className="flex-1 px-4 py-2 bg-ain-soph-amber hover:bg-ain-soph-gold rounded-lg transition-colors text-center text-sm text-slate-900 font-medium"
                  >
                    Read
                  </Link>
                )}
                {resource.downloadable && (
                  <button
                    onClick={() => handleDownload(resource.id, resource.title)}
                    className="px-4 py-2 border border-ain-soph-gold/50 hover:bg-ain-soph-blue/30 rounded-lg transition-colors text-sm flex items-center gap-2 text-ain-soph-gold"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-ain-soph-blue/40 to-slate-800/40 border border-ain-soph-gold/30 rounded-2xl p-8"
        >
          <h3 className="text-xl font-medium mb-4">Coming Soon</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-ain-soph-amber mt-1">•</span>
              <span>
                <strong className="text-ain-soph-gold">Week 2 Analysis:</strong> First data on talkative vs minimal
                preference splits
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ain-soph-amber mt-1">•</span>
              <span>
                <strong className="text-ain-soph-gold">Integration Protocols:</strong> How to use MAIA for actual
                soul-building work
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ain-soph-amber mt-1">•</span>
              <span>
                <strong className="text-ain-soph-gold">Field Visualization Tools:</strong> Interactive diagrams of element
                balancing
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ain-soph-amber mt-1">•</span>
              <span>
                <strong className="text-ain-soph-gold">Community Session Library:</strong> Curated conversations showing
                transformation patterns
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
