'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { EXTENSION_REGISTRY } from '@/lib/extensions/registry';
import { useExtensionConfig } from '@/hooks/useExtensionConfig';

interface ExtensionSettingsProps {
  userId: string;
}

/**
 * Extension Settings Page
 *
 * Allows users to enable/disable extensions and configure their settings
 */
export function ExtensionSettings({ userId }: ExtensionSettingsProps) {
  const { config, loading, updateExtension, updateExtensionSettings } = useExtensionConfig(userId);
  const [expandedExtension, setExpandedExtension] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white/80" />
          <p className="text-sm text-white/60 mt-4">Loading extensions...</p>
        </div>
      </div>
    );
  }

  const extensions = Object.values(EXTENSION_REGISTRY);

  // Group by category
  const byCategory = extensions.reduce((acc, ext) => {
    const cat = ext.metadata.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ext);
    return acc;
  }, {} as Record<string, typeof extensions>);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white mb-2">Extensions</h1>
        <p className="text-white/60">
          Choose which archetypal systems enrich your soul work.
        </p>
        <p className="text-white/40 text-sm mt-2">
          Spiralogic is always the foundation. Extensions add depth and dimension.
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(byCategory).map(([category, exts]) => (
          <div key={category}>
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
              {category}
            </h2>

            <div className="space-y-3">
              {exts.map(ext => {
                const isEnabled = config?.extensions[ext.metadata.id]?.enabled ?? ext.enabled;
                const extSettings = config?.extensions[ext.metadata.id]?.settings ?? {};

                return (
                  <ExtensionCard
                    key={ext.metadata.id}
                    extension={ext}
                    enabled={isEnabled}
                    settings={extSettings}
                    isExpanded={expandedExtension === ext.metadata.id}
                    onToggle={async () => {
                      await updateExtension(ext.metadata.id, !isEnabled);
                    }}
                    onExpand={() => {
                      setExpandedExtension(
                        expandedExtension === ext.metadata.id ? null : ext.metadata.id
                      );
                    }}
                    onUpdateSettings={async (settings) => {
                      await updateExtensionSettings(ext.metadata.id, settings);
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Future: Community Extensions */}
      <div className="mt-12 p-6 border border-white/10 rounded-lg bg-white/5">
        <h3 className="text-lg font-serif text-white mb-2">Community Extensions</h3>
        <p className="text-sm text-white/60 mb-4">
          Soon, Spiralogic practitioners will be able to build and share custom extensions.
        </p>
        <button
          disabled
          className="px-4 py-2 bg-white/10 text-white/40 rounded-lg text-sm cursor-not-allowed"
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
}

interface ExtensionCardProps {
  extension: typeof EXTENSION_REGISTRY[keyof typeof EXTENSION_REGISTRY];
  enabled: boolean;
  settings: Record<string, any>;
  isExpanded: boolean;
  onToggle: () => Promise<void>;
  onExpand: () => void;
  onUpdateSettings: (settings: Record<string, any>) => Promise<void>;
}

function ExtensionCard({
  extension,
  enabled,
  settings,
  isExpanded,
  onToggle,
  onExpand,
  onUpdateSettings,
}: ExtensionCardProps) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle();
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className={`
        border rounded-lg transition-all
        ${enabled ? 'border-white/30 bg-white/5' : 'border-white/10 bg-black/20'}
      `}
    >
      {/* Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{extension.metadata.icon}</span>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">{extension.metadata.name}</h3>
            <p className="text-sm text-white/60 mt-1">{extension.metadata.description}</p>

            {/* Panel badges */}
            <div className="flex gap-2 mt-3">
              {extension.panels.map(panel => {
                const colors = {
                  right: 'bg-blue-500/20 text-blue-400',
                  left: 'bg-purple-500/20 text-purple-400',
                  up: 'bg-red-500/20 text-red-400',
                  down: 'bg-amber-500/20 text-amber-400',
                };
                return (
                  <span
                    key={panel.panel}
                    className={`text-xs px-2 py-1 rounded ${colors[panel.panel]}`}
                  >
                    {panel.panel === 'right' && '→ Analytical'}
                    {panel.panel === 'left' && '← Imaginal'}
                    {panel.panel === 'up' && '↑ Depths'}
                    {panel.panel === 'down' && '↓ Transcendent'}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleToggle}
            disabled={toggling || extension.metadata.core}
            className={`
              relative w-12 h-6 rounded-full transition-colors
              ${enabled ? 'bg-green-500' : 'bg-white/20'}
              ${extension.metadata.core ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <motion.div
              animate={{ x: enabled ? 24 : 0 }}
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
            />
          </button>
          <span className="text-xs text-white/60 w-8">
            {enabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Settings (expandable) */}
      {extension.settings && enabled && (
        <div className="border-t border-white/10">
          <button
            onClick={onExpand}
            className="w-full px-4 py-2 flex items-center justify-between text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>Settings</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {isExpanded && (
            <div className="px-4 py-4 space-y-4 bg-black/20">
              {Object.entries(extension.settings.schema).map(([key, schema]: [string, any]) => (
                <SettingControl
                  key={key}
                  name={key}
                  schema={schema}
                  value={settings[key] ?? extension.settings!.defaults[key]}
                  onChange={(value) => {
                    onUpdateSettings({ ...settings, [key]: value });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface SettingControlProps {
  name: string;
  schema: any;
  value: any;
  onChange: (value: any) => void;
}

function SettingControl({ name, schema, value, onChange }: SettingControlProps) {
  if (schema.type === 'boolean') {
    return (
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm text-white/80">{schema.label}</span>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4"
        />
      </label>
    );
  }

  if (schema.type === 'select') {
    return (
      <div>
        <label className="block text-sm text-white/80 mb-2">{schema.label}</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white"
        >
          {schema.options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (schema.type === 'multiselect') {
    return (
      <div>
        <label className="block text-sm text-white/80 mb-2">{schema.label}</label>
        <div className="space-y-2">
          {schema.options.map((opt: string) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.includes(opt)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...value, opt]);
                  } else {
                    onChange(value.filter((v: string) => v !== opt));
                  }
                }}
                className="w-4 h-4"
              />
              <span className="text-sm text-white/70">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
