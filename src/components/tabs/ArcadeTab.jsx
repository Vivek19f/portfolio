import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hash, Bug, ArrowRight, Play, Flame, Keyboard, Sparkles, Compass, Trophy } from 'lucide-react';
import PlaygroundModal from '../PlaygroundModal';
import { getAllArcadeRecords } from '../../utils/arcadeScores';

export default function ArcadeTab() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [records, setRecords] = useState(() => getAllArcadeRecords());

  useEffect(() => {
    const handleUpdate = () => {
      setRecords(getAllArcadeRecords());
    };
    window.addEventListener('arcade-record-updated', handleUpdate);
    return () => window.removeEventListener('arcade-record-updated', handleUpdate);
  }, []);

  const games = [
    {
      id: 'constellation-connect',
      title: 'Constellation Connect',
      desc: 'Link stars to chart authentic ancient constellations across the cosmos before your stardate chronometer expires.',
      icon: Compass,
      defaultRecord: '6/6 Epochs (2,150 pts)',
      tag: 'Celestial Challenge'
    },
    {
      id: 'quick-math',
      title: 'Quick Math',
      desc: 'Rapid-fire mental arithmetic. 10 rapid questions. No hesitation. Beat my best time of 14.8 seconds.',
      icon: Hash,
      defaultRecord: '14.8s (Avg 0.74s/q)',
      tag: 'Speed Challenge'
    },
    {
      id: 'code-review',
      title: 'Code Review Bug Spotter',
      desc: 'Three production code snippets, one bug each. Tap the exact line that breaks it.',
      icon: Bug,
      defaultRecord: '3/3 Bugs Caught',
      tag: 'Bug Hunter'
    },
    {
      id: 'speed-typer',
      title: 'Code Speedrun',
      desc: '30-second rapid syntax typing test with real TypeScript and Python snippets. Live WPM and accuracy metrics.',
      icon: Keyboard,
      defaultRecord: '98 WPM (99% Acc)',
      tag: 'Typing Challenge'
    },
    {
      id: 'memory-matrix',
      title: 'Neural Memory Matrix',
      desc: 'Memorize and recall flashing cyan tile patterns across 4×4 neural grids as complexity escalates.',
      icon: Sparkles,
      defaultRecord: 'Level 8 Cleared (1,200 pts)',
      tag: 'Working Memory'
    }
  ];

  return (
    <motion.main
      key="arcade-page"
      className="projects-page-container arcade-page-container"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
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
          const recordData = records[g.id];
          const recordLabel = recordData?.label || g.defaultRecord;
          const isBeaten = recordData && !recordData.isAuthorBaseline;

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
                <div className="flex items-center gap-1.5 text-xs text-muted-custom flex-wrap">
                  <Flame size={14} className={isBeaten ? "text-amber-400 animate-pulse" : "text-accent"} />
                  <span>
                    {isBeaten ? 'Your Best: ' : 'Record: '}
                    <strong className={isBeaten ? "text-amber-300 font-bold" : "text-accent"}>
                      {recordLabel}
                    </strong>
                  </span>
                  {isBeaten && (
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-300">
                      🏆 Best
                    </span>
                  )}
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
