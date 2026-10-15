import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Check, X, Heart } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

export default function MemoryMatrixGame() {
  const { playClick, playSuccess, playModalOpen } = useSound();

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [phase, setPhase] = useState('MEMORIZE'); // 'MEMORIZE' | 'RECALL' | 'WON_ROUND' | 'GAME_OVER'
  const [targetCells, setTargetCells] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [wrongCells, setWrongCells] = useState(new Set());

  const getTileCount = (lvl) => Math.min(3 + (lvl - 1), 9);

  const timerRef = useRef(null);

  const startRound = (lvl = level) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const count = getTileCount(lvl);
    const newTargets = new Set();
    while (newTargets.size < count) {
      const idx = Math.floor(Math.random() * 16);
      newTargets.add(idx);
    }
    setTargetCells(newTargets);
    setSelectedCells(new Set());
    setWrongCells(new Set());
    setPhase('MEMORIZE');

    timerRef.current = setTimeout(() => {
      setPhase('RECALL');
    }, 1500);
  };

  useEffect(() => {
    startRound(1);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCellClick = (idx) => {
    if (phase !== 'RECALL') return;
    if (selectedCells.has(idx) || wrongCells.has(idx)) return;

    if (targetCells.has(idx)) {
      playClick();
      const nextSelected = new Set(selectedCells).add(idx);
      setSelectedCells(nextSelected);
      setScore(s => s + 25);

      if (nextSelected.size === targetCells.size) {
        playSuccess();
        setPhase('WON_ROUND');
        setScore(s => s + 100 * level);
        timerRef.current = setTimeout(() => {
          setLevel(l => {
            const nextLvl = l + 1;
            startRound(nextLvl);
            return nextLvl;
          });
        }, 1100);
      }
    } else {
      playClick();
      const nextWrong = new Set(wrongCells).add(idx);
      setWrongCells(nextWrong);
      setLives(l => {
        const nextLives = l - 1;
        if (nextLives <= 0) {
          playModalOpen();
          setPhase('GAME_OVER');
        }
        return nextLives;
      });
    }
  };

  const restart = () => {
    setLevel(1);
    setScore(0);
    setLives(3);
    startRound(1);
  };

  return (
    <div className="game-box memory-matrix-box font-mono">
      <div className="game-stats-bar">
        <span>Level: <strong className="text-accent">{level}</strong></span>
        <span>Score: <strong className="text-accent">{score}</strong></span>
        <div className="flex items-center gap-1">
          <span>Lives: </span>
          {Array(3).fill(0).map((_, i) => (
            <Heart
              key={i}
              size={14}
              className={i < lives ? 'text-red-400 fill-red-400' : 'text-zinc-600'}
            />
          ))}
        </div>
      </div>

      <div className="memory-banner">
        {phase === 'MEMORIZE' && (
          <span className="text-accent animate-pulse">⚡ Memorize the {targetCells.size} active neural tiles...</span>
        )}
        {phase === 'RECALL' && (
          <span className="text-secondary">Recall & tap the illuminated pattern! ({selectedCells.size}/{targetCells.size})</span>
        )}
        {phase === 'WON_ROUND' && (
          <span className="text-green-400 font-bold">✨ Level {level} Synchronized! Next level...</span>
        )}
        {phase === 'GAME_OVER' && (
          <span className="text-red-400 font-bold">💥 Neural Memory Overload!</span>
        )}
      </div>

      {phase !== 'GAME_OVER' ? (
        <div className="memory-grid-4x4">
          {Array(16).fill(0).map((_, idx) => {
            const isTarget = targetCells.has(idx);
            const isFlashing = phase === 'MEMORIZE' && isTarget;
            const isSelected = selectedCells.has(idx);
            const isWrong = wrongCells.has(idx);

            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                className={`memory-cell ${isFlashing ? 'cell-flash' : ''} ${
                  isSelected ? 'cell-recalled' : ''
                } ${isWrong ? 'cell-wrong' : ''}`}
                disabled={phase !== 'RECALL'}
              >
                {isSelected && <Check size={18} className="text-accent" />}
                {isWrong && <X size={18} className="text-red-400" />}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="game-finish-view">
          <Trophy size={48} className="text-accent animate-bounce" />
          <h3 className="finish-title">Neural Grid Results</h3>
          <p className="finish-desc font-mono">
            You reached <strong className="text-accent">Level {level}</strong> with a score of <strong className="text-accent">{score}</strong>!
          </p>
          <button className="action-btn primary-glow-btn mt-6" onClick={restart}>
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}
