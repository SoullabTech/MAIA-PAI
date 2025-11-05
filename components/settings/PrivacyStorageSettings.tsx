/**
 * PRIVACY & STORAGE SETTINGS
 *
 * User control over where their soul data lives
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, HardDrive, Cloud, Lock, Download, Upload, AlertCircle } from 'lucide-react';
import {
  getStoragePreferences,
  setStoragePreferences,
  exportAllLocalData,
  type StoragePreferences
} from '@/lib/consciousness/LocalFirstMemory';

export function PrivacyStorageSettings() {
  const [prefs, setPrefs] = useState<StoragePreferences>({
    localOnly: true,
    encryptLocal: true,
    enableCloudBackup: false,
    autoSync: false
  });

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const currentPrefs = getStoragePreferences();
    setPrefs(currentPrefs);
  }, []);

  const handleToggle = (key: keyof StoragePreferences) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };

    // Logic: If cloud backup is disabled, also disable auto-sync
    if (key === 'enableCloudBackup' && !newPrefs.enableCloudBackup) {
      newPrefs.autoSync = false;
    }

    setPrefs(newPrefs);
    setStoragePreferences(newPrefs);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportAllLocalData();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `maia-soul-memory-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-amber-950/20 to-orange-950/10 rounded-lg border border-amber-900/20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-amber-400" />
        <div>
          <h3 className="text-lg font-semibold text-amber-100">Privacy & Storage</h3>
          <p className="text-sm text-amber-300/70">Your soul data, your control</p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-amber-900/10 border border-amber-800/30 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-200/90">
          <p className="font-medium mb-1">Local-first by default</p>
          <p className="text-amber-300/70">
            All conversations and soul memories are stored on your device. Cloud backup is optional and encrypted end-to-end.
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        {/* Local Storage Only */}
        <SettingToggle
          icon={<HardDrive className="w-5 h-5" />}
          label="Store on Device Only"
          description="Keep all data on this device (most private)"
          enabled={prefs.localOnly}
          onToggle={() => handleToggle('localOnly')}
          recommended={true}
        />

        {/* Encrypt Local Data */}
        <SettingToggle
          icon={<Lock className="w-5 h-5" />}
          label="Encrypt Local Storage"
          description="Encrypt data on your device with device-specific key"
          enabled={prefs.encryptLocal}
          onToggle={() => handleToggle('encryptLocal')}
          recommended={true}
        />

        {/* Cloud Backup */}
        <SettingToggle
          icon={<Cloud className="w-5 h-5" />}
          label="Enable Cloud Backup"
          description="Encrypted backup to Supabase (optional, for cross-device sync)"
          enabled={prefs.enableCloudBackup}
          onToggle={() => handleToggle('enableCloudBackup')}
          disabled={prefs.localOnly}
        />

        {/* Auto Sync */}
        <SettingToggle
          icon={<Cloud className="w-5 h-5" />}
          label="Auto-Sync to Cloud"
          description="Automatically sync changes when online"
          enabled={prefs.autoSync}
          onToggle={() => handleToggle('autoSync')}
          disabled={!prefs.enableCloudBackup || prefs.localOnly}
        />
      </div>

      {/* Data Export/Import */}
      <div className="border-t border-amber-900/20 pt-4 space-y-3">
        <h4 className="text-sm font-medium text-amber-200">Data Portability</h4>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-800/40 rounded-lg text-amber-200 text-sm transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export All Data'}
          </button>

          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-800/40 rounded-lg text-amber-200 text-sm transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Import Backup
            <input type="file" accept=".json" className="hidden" />
          </label>
        </div>

        <p className="text-xs text-amber-300/60">
          Export your data anytime for backup or migration. All exports are in standard JSON format.
        </p>
      </div>

      {/* Storage Info */}
      <div className="border-t border-amber-900/20 pt-4">
        <h4 className="text-sm font-medium text-amber-200 mb-2">Current Setup</h4>
        <div className="text-xs text-amber-300/70 space-y-1">
          <p>✓ Data encrypted: {prefs.encryptLocal ? 'Yes (AES-256-GCM)' : 'No'}</p>
          <p>✓ Storage: {prefs.localOnly ? 'Device only' : 'Device + Cloud'}</p>
          <p>✓ Zero-knowledge: Server cannot read your data</p>
        </div>
      </div>
    </div>
  );
}

// Toggle Component
interface SettingToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  recommended?: boolean;
  disabled?: boolean;
}

function SettingToggle({
  icon,
  label,
  description,
  enabled,
  onToggle,
  recommended,
  disabled
}: SettingToggleProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
        disabled
          ? 'opacity-50 cursor-not-allowed bg-amber-950/10 border-amber-900/10'
          : 'bg-amber-950/20 border-amber-900/20 hover:bg-amber-950/30'
      }`}
    >
      <div className="text-amber-400 mt-0.5">{icon}</div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-amber-100">{label}</h4>
          {recommended && (
            <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full">
              Recommended
            </span>
          )}
        </div>
        <p className="text-xs text-amber-300/70 mt-1">{description}</p>
      </div>

      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          disabled
            ? 'bg-gray-700 cursor-not-allowed'
            : enabled
            ? 'bg-amber-500'
            : 'bg-amber-900/40'
        }`}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full"
          animate={{
            left: enabled ? '1.75rem' : '0.25rem'
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
