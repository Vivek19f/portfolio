import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bomb, Hash, BrainCircuit, Bug, ArrowRight, Play, Flame, LayoutGrid, Keyboard, Sparkles } from 'lucide-react';
import PlaygroundModal from '../PlaygroundModal';

export default function ArcadeTab() {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'quick-math',
      title: 'Quick Math',
      desc: 'Rapid-fire mental arithmetic. 10 rapid questions. No hesitation. Beat my best time of 14.8 seconds.',
      icon: Hash,
      record: '14.8s (Avg 0.74s/q)',
      tag: 'Speed Challenge'
    },
    {
      id: 'code-review',
      title: 'Code Review Bug Spotter',
      desc: 'Real production code snippets with sneaky bugs. Tap the exact line that triggers runtime crashes or race conditions.',
      icon: Bug,
      record: '5/5 Catch Rate',
      tag: 'Bug Hunter'
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper',
      desc: 'Clear an 8×8 board hiding 10 hidden mines. Deductive logic, zero-guess cascade, right-click to flag.',
      icon: Bomb,
      record: '42s Clear',
      tag: 'Deductive Logic'
    },
    {
      id: 'mini-sudoku',
      title: 'Mini Sudoku 6×6',
      desc: '6×6 grid with 2×3 subgrid constraints. Real-time conflict detection and interactive digit keypad.',
      icon: BrainCircuit,
      record: '1m 08s Clear',
      tag: 'Spatial Puzzle'
    },
    {
      id: 'game-2048',
      title: '2048: Dev Edition',
      desc: 'Slide and merge tech stack tiles from `var` and `CSS` up to `Docker`, `K8s`, and `Staff 🚀`. Supports Arrow keys & D-pad.',
      icon: LayoutGrid,
      record: 'Score: 4096',
      tag: 'Algorithm Puzzle'
    },
    {
      id: 'speed-typer',
      title: 'Code Speedrun',
      desc: '30-second rapid syntax typing test with real TypeScript and Python snippets. Live WPM and accuracy metrics.',
      icon: Keyboard,
      record: '98 WPM (99% Acc)',
      tag: 'Typing Challenge'
    },
    {
      id: 'memory-matrix',
      title: 'Neural Memory Matrix',
      desc: 'Memorize and recall flashing cyan tile patterns across 4×4 neural grids as complexity escalates.',
      icon: Sparkles,
      record: 'Level 8 Cleared',
      tag: 'Working Memory'
    }
  ];

  return (
    <motion.main
      key="arcade-page"
      className="projects-page-container arcade-page-container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
    >
      <div className="projects-hero-header">
        <h1 className="projects-main-title">I Play</h1>
        <p className="projects-hero-subtitle">
          Today's puzzles. Test your engineering logic and beat my time.
        </p>
      </div>

      <div className="arcade-games-grid">
        {games.map((g) => {
          const IconComp = g.icon;
          return (
            <div
              key={g.id}
              onClick={() => setSelectedGame(g.id)}
              className="arcade-card group cursor-pointer"
            >
              <div className="arcade-card-top">
                <div className="arcade-icon-box">
                  <IconComp size={28} className="text-muted-custom group-hover:text-accent transition-colors" />
                </div>
                <span className="arcade-tag font-mono text-xs">{g.tag}</span>
              </div>

              <h2 className="arcade-card-title group-hover:text-accent transition-colors">
                {g.title}
              </h2>
              <p className="arcade-card-desc">{g.desc}</p>

              <div className="arcade-card-footer font-mono">
                <div className="flex items-center gap-1.5 text-xs text-muted-custom">
                  <Flame size={14} className="text-accent" />
                  <span>Record: <strong className="text-accent">{g.record}</strong></span>
                </div>
                <button className="play-trigger-btn font-mono">
                  <span>Play</span>
                  <Play size={12} fill="currentColor" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedGame && (
        <PlaygroundModal
          gameId={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </motion.main>
  );
}
