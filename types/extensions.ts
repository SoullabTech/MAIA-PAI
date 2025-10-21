/**
 * Type definitions for the extension system
 */

import { DirectionalPanel } from '@/lib/extensions/registry';

/**
 * User's extension configuration stored in database
 */
export interface UserExtensionConfig {
  userId: string;
  extensions: {
    [extensionId: string]: {
      enabled: boolean;
      settings: Record<string, any>;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Extension panel component props
 * All extension components receive these props
 */
export interface ExtensionPanelProps {
  userId: string;
  settings: Record<string, any>;
  onNavigate?: (direction: DirectionalPanel) => void;
  onClose?: () => void;
}

/**
 * Sacred Compass navigation state
 */
export interface CompassState {
  currentPanel: 'center' | DirectionalPanel;
  previousPanel?: 'center' | DirectionalPanel;
  suggestions: DirectionalPanel[]; // Which directions MAIA suggests
  available: DirectionalPanel[]; // Which directions have content
}

/**
 * Contextual navigation hint from MAIA
 * These appear inline during conversation
 */
export interface NavigationHint {
  id: string;
  direction: DirectionalPanel;
  label: string; // e.g., "See the framework", "Explore myth"
  reason?: string; // Why this is suggested now
  priority: 'low' | 'medium' | 'high';
}
