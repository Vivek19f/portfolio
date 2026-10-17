import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { getGameConfig } from './arcade/gameRegistry';

export default function PlaygroundModal({ gameId, onClose }) {
  // Reusable Escape key listener hook
  useEscapeKey(onClose, Boolean(gameId));

  const game = getGameConfig(gameId);
  if (!game) return null;

  const GameComponent = game.component;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="modal-content glass-modal game-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        <div className="modal-header">
          <div>
            <span className="modal-role-badge font-mono">{game.roleBadge}</span>
            <h2 className="modal-title">{game.title}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="game-container custom-scrollbar">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center p-12 gap-3 text-accent font-mono">
                <Sparkles size={28} className="animate-spin text-accent" />
                <span className="text-xs text-muted-custom">Loading Arcade Challenge...</span>
              </div>
            }
          >
            <GameComponent />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
