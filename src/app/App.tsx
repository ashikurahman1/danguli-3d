/**
 * App.tsx
 *
 * Root React component for Danguli 3D.
 * Mounts the WebGL viewport, manages HUD state, and displays game status.
 */

import React, { useEffect, useRef, useState } from 'react';
import { SceneManager } from '../game/scene/SceneManager';
import { GameStateManager, GameStatusSnapshot } from '../game/core/GameState';
import './app.css';

export const App: React.FC = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const gameStateRef = useRef<GameStateManager>(new GameStateManager('ready'));

  const [gameState, setGameState] = useState<GameStatusSnapshot>(
    gameStateRef.current.getSnapshot()
  );
  const [fps, setFps] = useState<number>(60);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to GameStateManager
    const unsubscribe = gameStateRef.current.subscribe((snapshot) => {
      setGameState(snapshot);
    });

    if (!viewportRef.current) return;

    // Initialize 3D scene
    const sceneManager = new SceneManager({
      container: viewportRef.current,
      onFpsUpdate: (newFps) => setFps(newFps),
    });
    sceneManagerRef.current = sceneManager;

    return () => {
      sceneManager.dispose();
      sceneManagerRef.current = null;
      unsubscribe();
    };
  }, []);

  const handleResetCamera = () => {
    sceneManagerRef.current?.resetCamera();
  };

  return (
    <div className="game-root">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={viewportRef}
        className="game-viewport"
        id="game-viewport"
        aria-label="Danguli 3D Interactive Playing Field"
      />

      {/* Orbit hint */}
      <div className="center-hint">Drag to orbit view • Scroll to zoom</div>

      {/* UI Overlay */}
      <div className="ui-overlay">
        {/* Top Header Bar */}
        <header className="header-bar">
          <div className="title-container">
            <h1>
              Danguli 3D <span className="badge-pill">v0.1.0 (Phase 1)</span>
            </h1>
            <div className="subtitle">ডাংগুলি — Traditional South Asian Game</div>
          </div>

          <div className="stats-card">
            <div className="stat-item">
              <span className="stat-label">Phase</span>
              <span className="stat-value">{gameState.phase.toUpperCase()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Turn</span>
              <span className="stat-value">
                {gameState.currentTurn} / {gameState.totalTurns}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Score</span>
              <span className="stat-value">{gameState.score} pts</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Performance</span>
              <span className="stat-value">{fps} FPS</span>
            </div>
          </div>
        </header>

        {/* Bottom Footer Bar */}
        <footer className="footer-bar">
          <div className="guide-card">
            <div className="guide-title">
              <span>🌾</span> Tradition & Setup
            </div>
            <div className="guide-text">
              The <strong>Guli</strong> (tapered piece) rests across the <strong>Garti</strong>{' '}
              (dirt pit). A sharp tap on its tapered end flips it airborne before the full strike.
            </div>
          </div>

          <div className="control-buttons">
            <button
              type="button"
              id="reset-cam-btn"
              className="hud-button"
              onClick={handleResetCamera}
              title="Reset orbital camera view"
            >
              <span>🎥</span> Reset View
            </button>
            <button
              type="button"
              id="info-btn"
              className="hud-button"
              onClick={() => setShowGuideModal(!showGuideModal)}
              title="Toggle game rules"
            >
              <span>📜</span> {showGuideModal ? 'Close Info' : 'About Danguli'}
            </button>
          </div>
        </footer>
      </div>

      {/* About/Rules Modal */}
      {showGuideModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(26, 20, 15, 0.95)',
            border: '1px solid var(--color-earth-border)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '2rem',
            maxWidth: '520px',
            width: '90%',
            zIndex: 100,
            boxShadow: 'var(--shadow-hud)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 style={{ color: 'var(--color-sand-light)', marginBottom: '0.8rem' }}>
            About Danguli (ডাংগুলি / Gilli-Danda)
          </h2>
          <p
            style={{
              color: 'var(--color-text-muted)',
              lineHeight: '1.6',
              fontSize: '0.9rem',
              marginBottom: '1rem',
            }}
          >
            Danguli is an ancient outdoor game played across South Asia (Bangladesh, India,
            Pakistan, Nepal). It uses two handcrafted wooden pieces: the long <strong>Danda</strong>{' '}
            (striking stick) and the short, biconical <strong>Guli</strong>.
          </p>
          <div
            style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.2rem',
            }}
          >
            <h4
              style={{
                color: 'var(--color-accent-amber)',
                fontSize: '0.85rem',
                marginBottom: '0.5rem',
              }}
            >
              CURRENT MILESTONE STATUS
            </h4>
            <p
              style={{ color: 'var(--color-text-primary)', fontSize: '0.85rem', lineHeight: '1.5' }}
            >
              <strong>Milestone 1</strong> is live: 3D scene rendering, high-precision lathe models,
              lighting, ground pit, orbital camera, and state machine foundation.
            </p>
          </div>
          <button
            type="button"
            className="hud-button"
            onClick={() => setShowGuideModal(false)}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
export default App;
