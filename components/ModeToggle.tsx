'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * ModeToggle - Switch between Sesame Hybrid and Field System
 *
 * Week 2 Beta Component - Allows users to toggle between:
 * - Classic Mode (Sesame Hybrid): Always responds, reliable
 * - Field Mode (Experimental): Sometimes silent, emergent
 */

export type SystemMode = 'sesame' | 'field' | 'auto'

interface ModeToggleProps {
  userId: string
  initialMode?: SystemMode
  onModeChange?: (mode: SystemMode) => void
  isBetaUser?: boolean
}

export function ModeToggle({
  userId,
  initialMode = 'sesame',
  onModeChange,
  isBetaUser = false
}: ModeToggleProps) {
  const [mode, setMode] = useState<SystemMode>(initialMode)
  const [showExplanation, setShowExplanation] = useState(false)

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem(`maia-mode-${userId}`)
    if (saved && (saved === 'sesame' || saved === 'field' || saved === 'auto')) {
      setMode(saved as SystemMode)
    }
  }, [userId])

  // Save preference and notify parent
  const handleModeChange = (newMode: SystemMode) => {
    setMode(newMode)
    localStorage.setItem(`maia-mode-${userId}`, newMode)

    if (onModeChange) {
      onModeChange(newMode)
    }

    // Track mode switch in monitoring
    fetch('/api/beta/mode-switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        from: mode,
        to: newMode,
        timestamp: new Date().toISOString()
      })
    }).catch(err => console.error('Failed to track mode switch:', err))
  }

  // Non-beta users shouldn't see this
  if (!isBetaUser) {
    return null
  }

  return (
    <div className="mode-toggle-container">
      {/* Main Toggle */}
      <div className="mode-toggle-buttons">
        <button
          onClick={() => handleModeChange('sesame')}
          className={`mode-button ${mode === 'sesame' ? 'active' : ''}`}
          aria-label="Classic Mode"
        >
          <span className="mode-icon">💬</span>
          <span className="mode-label">Classic</span>
        </button>

        <button
          onClick={() => handleModeChange('field')}
          className={`mode-button ${mode === 'field' ? 'active' : ''}`}
          aria-label="Field Mode (Experimental)"
        >
          <span className="mode-icon">🌊</span>
          <span className="mode-label">Field</span>
          <span className="beta-badge">Beta</span>
        </button>

        <button
          onClick={() => handleModeChange('auto')}
          className={`mode-button ${mode === 'auto' ? 'active' : ''}`}
          aria-label="Auto Mode"
        >
          <span className="mode-icon">🎯</span>
          <span className="mode-label">Auto</span>
        </button>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="info-button"
          aria-label="Learn about modes"
        >
          ℹ️
        </button>
      </div>

      {/* Current Mode Indicator */}
      <div className="current-mode-indicator">
        {mode === 'sesame' && (
          <p className="mode-description">
            💬 Classic Mode: Always responds, reliable assistance
          </p>
        )}
        {mode === 'field' && (
          <p className="mode-description">
            🌊 Field Mode: Emergent responses, sometimes silent
          </p>
        )}
        {mode === 'auto' && (
          <p className="mode-description">
            🎯 Auto Mode: System chooses based on your question
          </p>
        )}
      </div>

      {/* Explanation Panel */}
      {showExplanation && (
        <motion.div
          className="explanation-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3>Understanding MAIA's Modes</h3>

          <div className="mode-explanation">
            <h4>💬 Classic Mode</h4>
            <p>Traditional AI assistance enhanced by Claude & GPT.</p>
            <ul>
              <li>Always provides a response</li>
              <li>Reliable and predictable</li>
              <li>Best for practical questions</li>
            </ul>
          </div>

          <div className="mode-explanation">
            <h4>🌊 Field Mode (Experimental)</h4>
            <p>Emergent responses from 11 archetypal agents.</p>
            <ul>
              <li>Sometimes silent (intentionally)</li>
              <li>More restrained responses</li>
              <li>Best for depth and reflection</li>
            </ul>
            <div className="beta-results">
              <strong>Beta Results:</strong>
              <ul>
                <li>+291% transformational breakthroughs</li>
                <li>+161% conversational restraint</li>
                <li>+40% perceived authenticity</li>
              </ul>
            </div>
          </div>

          <div className="mode-explanation">
            <h4>🎯 Auto Mode</h4>
            <p>System intelligently chooses based on context.</p>
            <ul>
              <li>Deep questions → Field Mode</li>
              <li>Practical questions → Classic Mode</li>
              <li>Crisis situations → Classic Mode (always)</li>
            </ul>
          </div>

          <button
            onClick={() => setShowExplanation(false)}
            className="close-explanation"
          >
            Got it
          </button>
        </motion.div>
      )}

      <style jsx>{`
        .mode-toggle-container {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .mode-toggle-buttons {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .mode-button {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .mode-button:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .mode-button.active {
          background: rgba(79, 70, 229, 0.2);
          border-color: rgba(79, 70, 229, 0.5);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .mode-icon {
          font-size: 1.5rem;
        }

        .mode-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }

        .beta-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          font-size: 0.625rem;
          padding: 2px 6px;
          background: rgba(249, 115, 22, 0.8);
          color: white;
          border-radius: 4px;
          font-weight: 600;
        }

        .info-button {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.25rem;
          transition: all 0.2s ease;
        }

        .info-button:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.1);
        }

        .current-mode-indicator {
          margin-top: 0.75rem;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          text-align: center;
        }

        .mode-description {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .explanation-panel {
          margin-top: 1rem;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          overflow: hidden;
        }

        .explanation-panel h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.95);
        }

        .mode-explanation {
          margin-bottom: 1.5rem;
        }

        .mode-explanation h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .mode-explanation p {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .mode-explanation ul {
          margin: 0.5rem 0;
          padding-left: 1.25rem;
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.65);
        }

        .mode-explanation li {
          margin-bottom: 0.25rem;
        }

        .beta-results {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: rgba(79, 70, 229, 0.15);
          border-left: 3px solid rgba(79, 70, 229, 0.5);
          border-radius: 4px;
        }

        .beta-results strong {
          display: block;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.95);
          font-size: 0.875rem;
        }

        .beta-results ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .close-explanation {
          width: 100%;
          padding: 0.75rem;
          background: rgba(79, 70, 229, 0.3);
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-explanation:hover {
          background: rgba(79, 70, 229, 0.4);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}

/**
 * Compact Mode Toggle (for mobile or condensed layouts)
 */
export function CompactModeToggle({
  userId,
  initialMode = 'sesame',
  onModeChange,
  isBetaUser = false
}: ModeToggleProps) {
  const [mode, setMode] = useState<SystemMode>(initialMode)

  useEffect(() => {
    const saved = localStorage.getItem(`maia-mode-${userId}`)
    if (saved && (saved === 'sesame' || saved === 'field' || saved === 'auto')) {
      setMode(saved as SystemMode)
    }
  }, [userId])

  const handleModeChange = (newMode: SystemMode) => {
    setMode(newMode)
    localStorage.setItem(`maia-mode-${userId}`, newMode)
    if (onModeChange) onModeChange(newMode)
  }

  if (!isBetaUser) return null

  return (
    <div className="compact-toggle">
      <select
        value={mode}
        onChange={(e) => handleModeChange(e.target.value as SystemMode)}
        className="mode-select"
      >
        <option value="sesame">💬 Classic</option>
        <option value="field">🌊 Field (Beta)</option>
        <option value="auto">🎯 Auto</option>
      </select>

      <style jsx>{`
        .compact-toggle {
          display: inline-block;
        }

        .mode-select {
          padding: 0.5rem 2rem 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: white;
          font-size: 0.875rem;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1rem;
        }

        .mode-select:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  )
}

/**
 * Mode Badge (shows current mode in chat interface)
 */
interface ModeBadgeProps {
  mode: SystemMode
  responseSource?: 'sesame_hybrid' | 'field_system'
}

export function ModeBadge({ mode, responseSource }: ModeBadgeProps) {
  const getLabel = () => {
    if (mode === 'auto') {
      return responseSource === 'field_system' ? '🌊 Field' : '💬 Classic'
    }
    return mode === 'field' ? '🌊 Field' : '💬 Classic'
  }

  const getDescription = () => {
    if (mode === 'auto') {
      return responseSource === 'field_system'
        ? 'Auto mode selected Field for this question'
        : 'Auto mode selected Classic for this question'
    }
    return null
  }

  return (
    <div className="mode-badge" title={getDescription() || undefined}>
      <span className="badge-label">{getLabel()}</span>
      {mode === 'auto' && <span className="auto-indicator">Auto</span>}

      <style jsx>{`
        .mode-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.625rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .badge-label {
          font-weight: 500;
        }

        .auto-indicator {
          padding: 0.125rem 0.375rem;
          background: rgba(79, 70, 229, 0.3);
          border-radius: 6px;
          font-size: 0.625rem;
        }
      `}</style>
    </div>
  )
}