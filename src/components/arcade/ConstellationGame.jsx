import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw, Compass, HelpCircle, Zap, Star, Flame } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { recordGameScore } from '../../utils/arcadeScores';

// Curated constellations with normalized coordinates for optimal game viewport (560 x 360)
const CONSTELLATION_LEVELS = [
  {
    id: 'cassiopeia',
    name: 'CASSIOPEIA',
    subtitle: 'The Queen of the Heavens · "W" Asterism',
    season: 'Autumn / Winter Sky',
    difficulty: 'Novice',
    stars: [
      { id: 0, name: 'Caph', x: 70, y: 150, r: 6, color: '#38bdf8' },
      { id: 1, name: 'Schedar', x: 175, y: 245, r: 7.5, color: '#00f0ff' },
      { id: 2, name: 'Navi (γ Cas)', x: 280, y: 110, r: 7, color: '#ffffff' },
      { id: 3, name: 'Ruchbah', x: 385, y: 230, r: 6.5, color: '#38bdf8' },
      { id: 4, name: 'Segin', x: 490, y: 135, r: 6, color: '#00f0ff' }
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4]
    ]
  },
  {
    id: 'cygnus',
    name: 'CYGNUS',
    subtitle: 'The Northern Swan · Northern Cross Asterism',
    season: 'Summer / Autumn Sky',
    difficulty: 'Apprentice',
    stars: [
      { id: 0, name: 'Deneb', x: 280, y: 65, r: 8, color: '#ffffff' }, // Tail
      { id: 1, name: 'Sadr (γ Cyg)', x: 280, y: 180, r: 7.5, color: '#00f0ff' }, // Center
      { id: 2, name: 'Albireo', x: 280, y: 300, r: 6.5, color: '#fbbf24' }, // Head (Golden Double)
      { id: 3, name: 'Gienah', x: 120, y: 170, r: 6.5, color: '#38bdf8' }, // West Wing
      { id: 4, name: 'Delta Cyg', x: 440, y: 170, r: 6.5, color: '#7dd3fc' } // East Wing
    ],
    edges: [
      [0, 1],
      [1, 2],
      [3, 1],
      [1, 4]
    ]
  },
  {
    id: 'ursa-major',
    name: 'URSA MAJOR',
    subtitle: 'The Great Bear · The Big Dipper',
    season: 'Spring / Circumpolar',
    difficulty: 'Astronomer',
    stars: [
      { id: 0, name: 'Alkaid', x: 60, y: 100, r: 6, color: '#38bdf8' },
      { id: 1, name: 'Mizar & Alcor', x: 135, y: 140, r: 6.5, color: '#00f0ff' },
      { id: 2, name: 'Alioth', x: 215, y: 165, r: 7, color: '#ffffff' },
      { id: 3, name: 'Megrez', x: 295, y: 180, r: 6, color: '#38bdf8' },
      { id: 4, name: 'Phecda', x: 310, y: 275, r: 6.5, color: '#7dd3fc' },
      { id: 5, name: 'Merak', x: 440, y: 260, r: 7, color: '#38bdf8' }, // Pointer Star
      { id: 6, name: 'Dubhe', x: 430, y: 165, r: 7.5, color: '#fbbf24' } // Pointer Star
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 3]
    ]
  },
  {
    id: 'canis-major',
    name: 'CANIS MAJOR',
    subtitle: 'The Greater Dog · Home of Sirius',
    season: 'Winter Sky',
    difficulty: 'Veteran',
    stars: [
      { id: 0, name: 'Sirius (α CMa)', x: 190, y: 80, r: 9, color: '#ffffff' }, // Brightest star in night sky
      { id: 1, name: 'Mirzam', x: 90, y: 125, r: 6, color: '#38bdf8' },
      { id: 2, name: 'Muliphein', x: 295, y: 95, r: 5.5, color: '#7dd3fc' },
      { id: 3, name: 'Wezen', x: 330, y: 220, r: 7, color: '#fbbf24' },
      { id: 4, name: 'Adhara', x: 245, y: 300, r: 7, color: '#00f0ff' },
      { id: 5, name: 'Aludra', x: 420, y: 285, r: 6, color: '#38bdf8' }
    ],
    edges: [
      [1, 0],
      [0, 2],
      [0, 3],
      [3, 4],
      [3, 5]
    ]
  },
  {
    id: 'taurus',
    name: 'TAURUS',
    subtitle: 'The Celestial Bull · Aldebaran & The Hyades',
    season: 'Late Autumn / Winter Sky',
    difficulty: 'Master',
    stars: [
      { id: 0, name: 'Aldebaran (Eye of Bull)', x: 290, y: 210, r: 8.5, color: '#f97316' }, // Red Giant
      { id: 1, name: 'Elnath (Horn)', x: 440, y: 70, r: 7, color: '#00f0ff' },
      { id: 2, name: 'Tianguan (Horn)', x: 420, y: 290, r: 6.5, color: '#38bdf8' },
      { id: 3, name: 'Ain (Hyades)', x: 210, y: 165, r: 6.5, color: '#ffffff' },
      { id: 4, name: 'Hyades γ', x: 180, y: 220, r: 5.5, color: '#7dd3fc' },
      { id: 5, name: 'Pleiades M45', x: 75, y: 105, r: 7.5, color: '#38bdf8' }
    ],
    edges: [
      [0, 3],
      [3, 4],
      [4, 0],
      [0, 1],
      [0, 2],
      [3, 5]
    ]
  },
  {
    id: 'orion',
    name: 'ORION',
    subtitle: 'The Celestial Hunter · Belt of 3 Kings',
    season: 'Winter Pinnacle',
    difficulty: 'Mythic',
    stars: [
      { id: 0, name: 'Betelgeuse (α Ori)', x: 155, y: 65, r: 8.5, color: '#ef4444' }, // Red Supergiant
      { id: 1, name: 'Bellatrix (γ Ori)', x: 385, y: 75, r: 7.5, color: '#38bdf8' },
      { id: 2, name: 'Alnitak (Belt)', x: 230, y: 185, r: 6.5, color: '#00f0ff' },
      { id: 3, name: 'Alnilam (Belt)', x: 270, y: 180, r: 7, color: '#ffffff' },
      { id: 4, name: 'Mintaka (Belt)', x: 310, y: 175, r: 6.5, color: '#00f0ff' },
      { id: 5, name: 'Saiph (κ Ori)', x: 175, y: 305, r: 7, color: '#38bdf8' },
      { id: 6, name: 'Rigel (β Ori)', x: 375, y: 295, r: 9, color: '#7dd3fc' }, // Blue-White Supergiant
      { id: 7, name: 'Meissa (Head)', x: 270, y: 25, r: 5.5, color: '#ffffff' }
    ],
    edges: [
      [0, 7],
      [7, 1],
      [0, 2],
      [1, 4],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6]
    ]
  }
];

// Helper to normalize edge keys regardless of direction (e.g. "0-1" vs "1-0")
function getEdgeKey(u, v) {
  return u < v ? `${u}-${v}` : `${v}-${u}`;
}

export default function ConstellationGame() {
  const { playClick, playSuccess, playModalOpen, playMeteor } = useSound();

  const [levelIdx, setLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameState, setGameState] = useState('READY'); // 'READY' | 'PLAYING' | 'LEVEL_COMPLETED' | 'GAME_OVER' | 'VICTORY'
  const [selectedStar, setSelectedStar] = useState(null);
  const [connectedEdges, setConnectedEdges] = useState(new Set());
  const [invalidFlash, setInvalidFlash] = useState(null);
  const [showHintPulse, setShowHintPulse] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [recordResult, setRecordResult] = useState(null);

  const svgRef = useRef(null);
  const timerRef = useRef(null);

  const currentLevel = CONSTELLATION_LEVELS[levelIdx] || CONSTELLATION_LEVELS[0];

  // Set of valid edge keys for the current constellation
  const targetEdgeSet = useMemo(() => {
    const s = new Set();
    currentLevel.edges.forEach(([u, v]) => s.add(getEdgeKey(u, v)));
    return s;
  }, [currentLevel]);

  // Record score when game concludes
  useEffect(() => {
    if (gameState === 'GAME_OVER' || gameState === 'VICTORY') {
      const res = recordGameScore('constellation-connect', {
        score,
        level: levelIdx + (gameState === 'VICTORY' ? 1 : 0),
        totalLevels: CONSTELLATION_LEVELS.length
      });
      setRecordResult(res);
    }
  }, [gameState, score, levelIdx]);

  // Start the timer when playing
  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            playModalOpen();
            setGameState('GAME_OVER');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, playModalOpen]);

  const startGame = () => {
    setLevelIdx(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(50);
    setConnectedEdges(new Set());
    setSelectedStar(null);
    setRecordResult(null);
    setGameState('PLAYING');
    playClick();
  };

  const handleNextLevel = () => {
    const nextIdx = levelIdx + 1;
    if (nextIdx >= CONSTELLATION_LEVELS.length) {
      playSuccess();
      setGameState('VICTORY');
    } else {
      setLevelIdx(nextIdx);
      setConnectedEdges(new Set());
      setSelectedStar(null);
      setTimeLeft((t) => t + 15); // +15s bonus time
      setGameState('PLAYING');
      playMeteor();
    }
  };

  // Track cursor position inside SVG for dynamic rubber-band guide line
  const handleMouseMove = (e) => {
    if (!svgRef.current || selectedStar === null) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 560 / rect.width;
    const scaleY = 360 / rect.height;
    setMousePos({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    });
  };

  // Handle star selection and link creation
  const handleStarClick = (starId) => {
    if (gameState !== 'PLAYING') return;

    if (selectedStar === null) {
      // First star chosen
      playClick();
      setSelectedStar(starId);
    } else if (selectedStar === starId) {
      // Deselect if clicking the same star
      setSelectedStar(null);
    } else {
      // Attempting to draw an edge between selectedStar and starId
      const edgeKey = getEdgeKey(selectedStar, starId);

      if (targetEdgeSet.has(edgeKey)) {
        if (connectedEdges.has(edgeKey)) {
          // Already connected
          setSelectedStar(starId);
        } else {
          // Valid new edge!
          playMeteor();
          const nextEdges = new Set(connectedEdges).add(edgeKey);
          setConnectedEdges(nextEdges);
          setSelectedStar(starId); // Keep active for chain connections

          const nextStreak = streak + 1;
          setStreak(nextStreak);
          const pointsEarned = 50 + (nextStreak * 15);
          setScore((s) => s + pointsEarned);

          // Check if constellation is fully charted
          if (nextEdges.size === targetEdgeSet.size) {
            playSuccess();
            setGameState('LEVEL_COMPLETED');
            setScore((s) => s + 250); // Level completion bonus
            setTimeout(() => {
              handleNextLevel();
            }, 1400);
          }
        }
      } else {
        // Invalid link
        playModalOpen();
        setInvalidFlash(edgeKey);
        setStreak(0);
        setTimeout(() => setInvalidFlash(null), 500);
        setSelectedStar(starId);
      }
    }
  };

  // Give astronomer hint by finding an unlinked edge and flashing it
  const handleHint = () => {
    if (gameState !== 'PLAYING') return;
    for (const edge of targetEdgeSet) {
      if (!connectedEdges.has(edge)) {
        const [u] = edge.split('-').map(Number);
        setSelectedStar(u);
        setShowHintPulse(true);
        playClick();
        setTimeout(() => setShowHintPulse(false), 1200);
        setTimeLeft((t) => Math.max(t - 3, 1)); // Minor 3s penalty
        break;
      }
    }
  };

  const selectedStarObj = selectedStar !== null ? currentLevel.stars.find((s) => s.id === selectedStar) : null;

  return (
    <div className="game-box constellation-game-box font-mono select-none">
      {/* Top Header & Telemetry Bar */}
      <div className="game-stats-bar constellation-stats-bar">
        <div className="flex items-center gap-2">
          <Compass size={15} className="text-accent" />
          <span>
            Epoch: <strong className="text-accent">{levelIdx + 1}/{CONSTELLATION_LEVELS.length}</strong>
          </span>
        </div>

        <div>
          <span>
            Score: <strong className="text-accent">{score}</strong>
          </span>
          {streak > 1 && (
            <span className="ml-2 text-xs text-amber-400 font-bold animate-pulse">
              🔥 {streak}x Link
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span>Stardate: </span>
          <strong
            className={`font-mono text-base ${
              timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-accent'
            }`}
          >
            {timeLeft}s
          </strong>
        </div>
      </div>

      {/* Main Celestial Viewport Area */}
      <div className="constellation-viewport-wrapper relative">
        {/* Constellation Astronomical Title Banner */}
        <div className="constellation-name-overlay pointer-events-none">
          <div className="text-xs uppercase tracking-widest text-zinc-400">
            {currentLevel.season} · {currentLevel.difficulty}
          </div>
          <h3 className="text-lg font-bold text-white tracking-wider flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-accent" />
            {currentLevel.name}
          </h3>
          <p className="text-xs text-zinc-400 opacity-90">{currentLevel.subtitle}</p>
        </div>

        {/* SVG Interactive Constellation Star Chart */}
        <svg
          ref={svgRef}
          viewBox="0 0 560 360"
          className="constellation-svg-canvas"
          onMouseMove={handleMouseMove}
          onClick={(e) => {
            if (e.target.tagName === 'svg') setSelectedStar(null);
          }}
        >
          <defs>
            {/* Glow Filter for Celestial Laser Beams */}
            <filter id="star-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Ambient Radial Starlight Gradient */}
            <radialGradient id="nebula-radial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.08" />
              <stop offset="70%" stopColor="#1e1b4b" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Deep Space Background Rect */}
          <rect width="560" height="360" fill="url(#nebula-radial)" />

          {/* Faint Background Astronomical Grid & Crosshairs */}
          <g className="astronomical-grid" opacity="0.12">
            <line x1="280" y1="20" x2="280" y2="340" stroke="#00f0ff" strokeDasharray="4 6" />
            <line x1="20" y1="180" x2="540" y2="180" stroke="#00f0ff" strokeDasharray="4 6" />
            <circle cx="280" cy="180" r="140" fill="none" stroke="#00f0ff" strokeDasharray="2 4" />
          </g>

          {/* Faint Guide Ghost Lines (showing connected blueprint) */}
          <g className="ghost-edges">
            {currentLevel.edges.map(([u, v], idx) => {
              const p1 = currentLevel.stars.find((s) => s.id === u);
              const p2 = currentLevel.stars.find((s) => s.id === v);
              const edgeKey = getEdgeKey(u, v);
              const isConnected = connectedEdges.has(edgeKey);

              return (
                <line
                  key={`ghost-${idx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isConnected ? '#00f0ff' : 'rgba(255, 255, 255, 0.12)'}
                  strokeWidth={isConnected ? 2.5 : 1}
                  strokeDasharray={isConnected ? 'none' : '3 5'}
                  filter={isConnected ? 'url(#star-glow)' : 'none'}
                  className={isConnected ? 'connected-laser-line' : ''}
                />
              );
            })}
          </g>

          {/* Dynamic Rubber-Band Guide Line from Selected Star to Mouse */}
          {gameState === 'PLAYING' && selectedStarObj && (
            <line
              x1={selectedStarObj.x}
              y1={selectedStarObj.y}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="rgba(0, 240, 255, 0.6)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="pointer-events-none"
            />
          )}

          {/* Render All Constellation Stars */}
          {currentLevel.stars.map((star) => {
            const isSelected = selectedStar === star.id;
            const isTargetCandidate = selectedStar !== null && targetEdgeSet.has(getEdgeKey(selectedStar, star.id));

            return (
              <g
                key={star.id}
                className="constellation-star-group cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStarClick(star.id);
                }}
              >
                {/* Outer Pulsing Selection Halo */}
                {(isSelected || (showHintPulse && isTargetCandidate)) && (
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.r * 2.8}
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="1.5"
                    className="animate-ping opacity-75 pointer-events-none"
                  />
                )}

                {/* Target Candidate Beacon Ring */}
                {isTargetCandidate && !connectedEdges.has(getEdgeKey(selectedStar, star.id)) && (
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.r * 2}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    className="pointer-events-none animate-spin"
                  />
                )}

                {/* Star Glow Disk */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.r * 1.5}
                  fill={star.color}
                  opacity="0.35"
                  filter="url(#star-glow)"
                />

                {/* Star Solid Core */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.r}
                  fill={star.color}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all duration-200"
                />

                {/* Star Scientific Name Label */}
                <text
                  x={star.x}
                  y={star.y > 220 ? star.y - star.r - 12 : star.y + star.r + 17}
                  textAnchor="middle"
                  fill={isSelected ? '#00f0ff' : 'rgba(255, 255, 255, 0.75)'}
                  fontSize="10"
                  fontFamily="monospace"
                  className="pointer-events-none select-none font-medium"
                >
                  {star.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Level Complete Starlight Burst Overlay */}
        <AnimatePresence>
          {gameState === 'LEVEL_COMPLETED' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="constellation-celebration-overlay"
            >
              <div className="celebration-badge font-mono">
                <Star className="text-amber-400 fill-amber-400 animate-spin" size={24} />
                <h4 className="text-xl font-bold text-white">
                  {currentLevel.name} CHARTED!
                </h4>
                <p className="text-xs text-accent">
                  +250 Constellation Bonus · +15s Added to Chronometer
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start / Ready Overlay */}
        {gameState === 'READY' && (
          <div className="game-overlay-backdrop">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="game-ready-card font-mono text-center"
            >
              <div className="ready-icon-halo mx-auto mb-3">
                <Sparkles size={36} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Constellation Connect</h3>
              <p className="text-xs text-zinc-300 max-w-sm mb-5 leading-relaxed">
                Reconstruct authentic astronomical constellations across the starlit sky.
                Click and link neighboring stars before your stardate chronometer runs out!
              </p>
              <div className="game-rules-chips flex justify-center gap-2 mb-6 text-xs text-zinc-400">
                <span className="rule-chip">✨ 6 Constellations</span>
                <span className="rule-chip">⏱️ 50s Chronometer</span>
                <span className="rule-chip">🔗 Combo Multipliers</span>
              </div>
              <button
                className="action-btn primary-glow-btn px-6 py-2.5 text-sm uppercase tracking-wider font-bold"
                onClick={startGame}
              >
                Initiate Telescope
              </button>
            </motion.div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'GAME_OVER' && (
          <div className="game-overlay-backdrop">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="game-finish-card font-mono text-center"
            >
              <div className="ready-icon-halo mx-auto mb-3">
                <Trophy size={36} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Observation Concluded</h3>
              {recordResult?.isNewRecord && (
                <div className="new-record-banner font-mono mb-3">
                  <Flame size={14} className="text-amber-400 animate-pulse" />
                  <span>NEW PERSONAL BEST! {recordResult.isAuthorBeaten ? '🏆 Vivek\'s Record Beaten!' : ''}</span>
                </div>
              )}
              <p className="text-xs text-zinc-400 mb-4">Chronometer expired.</p>

              <div className="finish-stats-grid mb-5">
                <div className="stat-pill">
                  <span className="stat-label">Final Score</span>
                  <strong className="stat-value text-accent">{score}</strong>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Constellations</span>
                  <strong className="stat-value text-white">{levelIdx} / {CONSTELLATION_LEVELS.length}</strong>
                </div>
              </div>

              <button
                className="action-btn primary-glow-btn flex items-center justify-center gap-2 mx-auto"
                onClick={startGame}
              >
                <RotateCcw size={16} /> Re-align Optics
              </button>
            </motion.div>
          </div>
        )}

        {/* Victory Screen */}
        {gameState === 'VICTORY' && (
          <div className="game-overlay-backdrop">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="game-finish-card font-mono text-center"
            >
              <div className="ready-icon-halo mx-auto mb-3">
                <Star size={40} className="text-amber-400 fill-amber-400 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Master Astronomer!</h3>
              {recordResult?.isNewRecord && (
                <div className="new-record-banner font-mono mb-3">
                  <Flame size={14} className="text-amber-400 animate-pulse" />
                  <span>NEW PERSONAL BEST! {recordResult.isAuthorBeaten ? '🏆 Vivek\'s Record Beaten!' : ''}</span>
                </div>
              )}
              <p className="text-xs text-zinc-300 mb-4">
                You charted all {CONSTELLATION_LEVELS.length} ancient constellations across the celestial sphere!
              </p>

              <div className="finish-stats-grid mb-5">
                <div className="stat-pill">
                  <span className="stat-label">Total Score</span>
                  <strong className="stat-value text-amber-400">{score}</strong>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Time Remaining</span>
                  <strong className="stat-value text-accent">{timeLeft}s</strong>
                </div>
              </div>

              <button
                className="action-btn primary-glow-btn flex items-center justify-center gap-2 mx-auto"
                onClick={startGame}
              >
                <RotateCcw size={16} /> Chart Again
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom Controls & Hint Bar */}
      <div className="constellation-bottom-controls flex items-center justify-between mt-3 px-2">
        <div className="text-xs text-zinc-400 flex items-center gap-2">
          <Zap size={14} className="text-accent" />
          <span>
            Links: <strong className="text-white">{connectedEdges.size} / {targetEdgeSet.size}</strong>
          </span>
        </div>

        {gameState === 'PLAYING' && (
          <div className="flex items-center gap-3">
            <button
              className="hint-btn text-xs text-zinc-400 hover:text-white flex items-center gap-1 py-1 px-2.5 rounded bg-white/5 border border-white/10 hover:border-accent/40 transition-all"
              onClick={handleHint}
              title="Show guide hint (-3s)"
            >
              <HelpCircle size={13} className="text-accent" />
              Astronomer Hint (-3s)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
