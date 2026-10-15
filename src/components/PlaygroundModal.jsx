import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, RotateCcw, Trophy, Check, AlertCircle, Sparkles, Play, Heart, ChevronRight
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function PlaygroundModal({ gameId, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
            <span className="modal-role-badge font-mono">&gt; Arcade_Challenge</span>
            <h2 className="modal-title">
              {gameId === 'quick-math' && '⚡ Quick Math Challenge'}
              {gameId === 'code-review' && '🐛 Code Review: Spot the Bug'}
              {gameId === 'speed-typer' && '⌨️ Code Speedrun'}
              {gameId === 'memory-matrix' && '🧠 Neural Memory Matrix'}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="game-container custom-scrollbar">
          {gameId === 'quick-math' && <QuickMathGame />}
          {gameId === 'code-review' && <CodeReviewGame />}
          {gameId === 'speed-typer' && <SpeedTyperGame />}
          {gameId === 'memory-matrix' && <MemoryMatrixGame />}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// 1. QUICK MATH GAME
// ============================================================================
function QuickMathGame() {
  const TOTAL_QUESTIONS = 10;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const inputRef = useRef(null);

  const generateQuestions = () => {
    const list = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const ops = ['+', '-', '*'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a, b, answer;
      if (op === '+') {
        a = Math.floor(Math.random() * 40) + 10;
        b = Math.floor(Math.random() * 40) + 10;
        answer = a + b;
      } else if (op === '-') {
        a = Math.floor(Math.random() * 50) + 20;
        b = Math.floor(Math.random() * a);
        answer = a - b;
      } else {
        a = Math.floor(Math.random() * 9) + 3;
        b = Math.floor(Math.random() * 9) + 3;
        answer = a * b;
      }
      list.push({ a, b, op: op === '*' ? '×' : op, answer });
    }
    return list;
  };

  const restart = () => {
    setQuestions(generateQuestions());
    setCurrentIdx(0);
    setScore(0);
    setUserAnswer('');
    setIsFinished(false);
    setStartTime(Date.now());
    setElapsed(0);
    setFeedback(null);
  };

  useEffect(() => {
    restart();
  }, []);

  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setElapsed(((Date.now() - startTime) / 1000).toFixed(1));
    }, 100);
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [currentIdx, isFinished]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const currentQ = questions[currentIdx];
    const isCorrect = parseInt(userAnswer, 10) === currentQ.answer;

    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');
      if (currentIdx + 1 >= TOTAL_QUESTIONS) {
        setIsFinished(true);
      } else {
        setCurrentIdx((idx) => idx + 1);
      }
    }, 250);
  };

  if (!questions.length) return null;

  return (
    <div className="game-box">
      {!isFinished ? (
        <div className="math-active-view">
          <div className="game-stats-bar font-mono">
            <span>Question: <strong className="text-accent">{currentIdx + 1}</strong> / {TOTAL_QUESTIONS}</span>
            <span>Time: <strong className="text-accent">{elapsed}s</strong></span>
            <span>Score: <strong className="text-accent">{score}</strong></span>
          </div>

          <div className="math-card">
            <span className="math-expression font-mono">
              {questions[currentIdx].a} {questions[currentIdx].op} {questions[currentIdx].b} = ?
            </span>
          </div>

          <form onSubmit={handleSubmit} className="math-input-form">
            <input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your answer"
              className={`math-input font-mono ${feedback === 'correct' ? 'border-success' : feedback === 'wrong' ? 'border-danger' : ''}`}
              autoFocus
            />
            <button type="submit" className="action-btn primary-glow-btn">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="game-finish-view">
          <Trophy size={48} className="text-accent animate-bounce" />
          <h3 className="finish-title">Challenge Completed!</h3>
          <p className="finish-desc font-mono">
            You scored <strong className="text-accent">{score} / {TOTAL_QUESTIONS}</strong> in <strong className="text-accent">{elapsed}s</strong>!
          </p>
          <div className="finish-metrics">
            <div className="finish-metric-card">
              <span className="text-accent font-bold text-2xl font-mono">{((score / TOTAL_QUESTIONS) * 100).toFixed(0)}%</span>
              <span className="text-muted-custom font-mono text-xs">Accuracy</span>
            </div>
            <div className="finish-metric-card">
              <span className="text-accent font-bold text-2xl font-mono">{(elapsed / TOTAL_QUESTIONS).toFixed(2)}s</span>
              <span className="text-muted-custom font-mono text-xs">Avg / Question</span>
            </div>
          </div>
          <button className="action-btn primary-glow-btn mt-6" onClick={restart}>
            <RotateCcw size={16} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. CODE REVIEW BUG SPOTTER
// ============================================================================
function CodeReviewGame() {
  const SNIPPETS = [
    {
      title: "Snippet 1: Async User Pipeline",
      code: [
        "async function fetchUserData(userId) {",
        "  const cache = await getCache();",
        "  let data = cache.find(u => u.id === userId);",
        "  if (!data) {",
        "    data = fetch(`/api/users/${userId}`);",
        "    cache.push(data);",
        "  }",
        "  return data;",
        "}"
      ],
      bugLine: 4,
      explanation: "Line 5 calls fetch() without 'await'. This pushes an unresolved Promise into the cache instead of the resolved user data, resulting in runtime undefined property crashes."
    },
    {
      title: "Snippet 2: Sliding Window Metrics",
      code: [
        "function computeSlidingAverage(arr, windowSize) {",
        "  const results = [];",
        "  for (let i = 0; i <= arr.length; i++) {",
        "    const slice = arr.slice(i, i + windowSize);",
        "    const sum = slice.reduce((a, b) => a + b, 0);",
        "    results.push(sum / slice.length);",
        "  }",
        "  return results;",
        "}"
      ],
      bugLine: 2,
      explanation: "Line 3 uses 'i <= arr.length' instead of 'i < arr.length'. This boundary condition accesses index out-of-bounds, producing an invalid slice and NaN average values."
    },
    {
      title: "Snippet 3: Immutable State Reducer",
      code: [
        "function updateUserRole(userState, newRole) {",
        "  // Pure reducer expected without mutation:",
        "  userState.role = newRole;",
        "  return {",
        "    ...userState,",
        "    updatedAt: Date.now()",
        "  };",
        "}"
      ],
      bugLine: 2,
      explanation: "Line 3 directly mutates the incoming userState argument before spreading it. This violates React/Redux immutability, bypassing shallow equality checks and breaking re-renders."
    }
  ];

  const [snippetIdx, setSnippetIdx] = useState(0);
  const [selectedLine, setSelectedLine] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [solved, setSolved] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleLineClick = (lineIndex) => {
    if (isCorrect || isFinished) return;
    setSelectedLine(lineIndex);
    if (lineIndex === SNIPPETS[snippetIdx].bugLine) {
      soundEngine.playSuccess();
      setIsCorrect(true);
      setSolved((s) => s + 1);
    } else {
      soundEngine.playClick();
      setIsCorrect(false);
    }
  };

  const nextSnippet = () => {
    if (snippetIdx + 1 >= SNIPPETS.length) {
      setIsFinished(true);
    } else {
      setSelectedLine(null);
      setIsCorrect(null);
      setSnippetIdx((prev) => prev + 1);
    }
  };

  const restart = () => {
    setSnippetIdx(0);
    setSelectedLine(null);
    setIsCorrect(null);
    setSolved(0);
    setIsFinished(false);
  };

  const current = SNIPPETS[snippetIdx];

  if (isFinished) {
    return (
      <div className="game-box">
        <div className="game-finish-view">
          <Trophy size={48} className="text-accent animate-bounce" />
          <h3 className="finish-title">Code Review Complete!</h3>
          <p className="finish-desc font-mono">
            You spotted all <strong className="text-accent">{solved} of {SNIPPETS.length}</strong> production defects!
          </p>
          <div className="finish-metrics">
            <div className="finish-metric-card">
              <span className="text-accent font-bold text-2xl font-mono">100%</span>
              <span className="text-muted-custom font-mono text-xs">Catch Rate</span>
            </div>
            <div className="finish-metric-card">
              <span className="text-accent font-bold text-2xl font-mono">Senior</span>
              <span className="text-muted-custom font-mono text-xs">Review Rank</span>
            </div>
          </div>
          <button className="action-btn primary-glow-btn mt-6" onClick={restart}>
            <RotateCcw size={16} /> Review Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-box">
      <div className="game-stats-bar font-mono">
        <span>{current.title} ({snippetIdx + 1}/{SNIPPETS.length})</span>
        <span>Bugs Caught: <strong className="text-accent">{solved}</strong></span>
      </div>
      <p className="font-mono text-xs text-muted-custom mb-3">
        🔍 Review the code and tap the single line that breaks it in production:
      </p>

      <div className="code-editor-box font-mono">
        {current.code.map((line, idx) => (
          <div
            key={idx}
            onClick={() => handleLineClick(idx)}
            className={`code-line ${
              selectedLine === idx
                ? isCorrect
                  ? 'bug-found'
                  : 'bug-wrong'
                : ''
            }`}
          >
            <span className="line-num">{idx + 1}</span>
            <span className="line-text">{line}</span>
          </div>
        ))}
      </div>

      {isCorrect === true && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="code-feedback-box success-box font-mono"
        >
          <div className="flex items-center gap-2 text-accent font-bold">
            <Check size={18} /> Bug Spotted!
          </div>
          <p className="text-xs text-secondary mt-1">{current.explanation}</p>
          <button className="action-btn primary-glow-btn mt-3" onClick={nextSnippet}>
            {snippetIdx + 1 < SNIPPETS.length ? 'Next Snippet →' : 'Complete Review 🎯'}
          </button>
        </motion.div>
      )}

      {isCorrect === false && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="code-feedback-box error-box font-mono"
        >
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <AlertCircle size={18} /> Not this line. Look closer at types and async contracts!
          </div>
        </motion.div>
      )}
    </div>
  );
}


// ============================================================================
// 6. CODE SPEEDRUN / SPEED TYPER
// ============================================================================
function SpeedTyperGame() {
  const CODE_SNIPPETS = [
    {
      lang: 'TypeScript Async',
      code: 'const fetchUser = async (id: string): Promise<User> => { const res = await api.get(`/users/${id}`); return res.data; };'
    },
    {
      lang: 'React Hook',
      code: 'const useDebounce = (val: string, delay: number) => { const [state, set] = useState(val); useEffect(() => { const t = setTimeout(() => set(val), delay); return () => clearTimeout(t); }, [val]); return state; };'
    },
    {
      lang: 'Python Telemetry',
      code: 'async def stream_telemetry(sensor_id: str): async for packet in client.listen(sensor_id): yield process_packet(packet)'
    },
    {
      lang: 'Distributed Lock',
      code: 'class DistributedLock: async def acquire(self, key: str, ttl: int = 30) -> bool: return bool(await redis.set(f"lock:{key}", "1", nx=True, ex=ttl))'
    }
  ];

  const TOTAL_TIME = 30;
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef(null);

  const snippet = CODE_SNIPPETS[snippetIdx];

  const startTest = () => {
    setTyped('');
    setTimeLeft(TOTAL_TIME);
    setIsActive(false);
    setIsFinished(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const nextSnippet = () => {
    setSnippetIdx((prev) => (prev + 1) % CODE_SNIPPETS.length);
  };

  useEffect(() => {
    startTest();
  }, [snippetIdx]);

  useEffect(() => {
    if (!isActive || isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, isFinished]);

  const handleChange = (e) => {
    if (isFinished) return;
    const val = e.target.value;
    if (!isActive && val.length > 0) setIsActive(true);
    setTyped(val);

    if (val.length >= snippet.code.length) {
      setIsFinished(true);
    }
  };

  const elapsedSec = TOTAL_TIME - timeLeft || 1;
  const correctChars = typed.split('').filter((c, i) => c === snippet.code[i]).length;
  const wpm = Math.round((correctChars / 5) / (elapsedSec / 60));
  const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;

  const getRank = () => {
    if (wpm >= 85) return 'Staff 10x Engineer 🚀';
    if (wpm >= 65) return 'Senior Architect ⚡';
    if (wpm >= 45) return 'Full Stack Dev 💻';
    return 'Syntax Debugger 🔍';
  };

  return (
    <div className="game-box speed-typer-box font-mono" onClick={() => inputRef.current?.focus()}>
      <div className="game-stats-bar">
        <span>{snippet.lang}</span>
        <span>Time: <strong className="text-accent">{timeLeft}s</strong></span>
        <span>WPM: <strong className="text-accent">{wpm}</strong></span>
        <span>Acc: <strong className="text-accent">{accuracy}%</strong></span>
      </div>

      {!isFinished ? (
        <div className="typer-workspace">
          <p className="text-xs text-muted-custom mb-2">
            Click into the code block and type as fast and cleanly as you can:
          </p>

          <div className="typer-code-display">
            {snippet.code.split('').map((char, idx) => {
              let charClass = 'char-upcoming';
              if (idx < typed.length) {
                charClass = typed[idx] === char ? 'char-correct' : 'char-wrong';
              } else if (idx === typed.length) {
                charClass = 'char-cursor';
              }
              return (
                <span key={idx} className={`typer-char ${charClass}`}>
                  {char}
                </span>
              );
            })}
          </div>

          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleChange}
            className="typer-hidden-input"
            autoFocus
            rows={1}
            aria-label="Code typing input"
          />
        </div>
      ) : (
        <div className="game-finish-view">
          <Trophy size={48} className="text-accent animate-bounce" />
          <h3 className="finish-title">Speedrun Complete!</h3>
          <p className="text-accent font-bold font-mono text-lg mt-1">{getRank()}</p>
          
          <div className="finish-metrics mt-4">
            <div className="finish-metric-card">
              <span className="text-accent font-bold text-2xl font-mono">{wpm}</span>
              <span className="text-muted-custom font-mono text-xs">Words Per Min</span>
            </div>
            <div className="finish-metric-card">
              <span className="text-accent font-bold text-2xl font-mono">{accuracy}%</span>
              <span className="text-muted-custom font-mono text-xs">Accuracy</span>
            </div>
            <div className="finish-metric-card">
              <span className="text-accent font-bold text-2xl font-mono">{correctChars}</span>
              <span className="text-muted-custom font-mono text-xs">Characters</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button className="action-btn primary-glow-btn" onClick={startTest}>
              <RotateCcw size={16} /> Try Again
            </button>
            <button className="action-btn ghost-btn" onClick={nextSnippet}>
              Next Snippet <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 7. NEURAL MEMORY MATRIX
// ============================================================================
function MemoryMatrixGame() {
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
      soundEngine.playClick();
      const nextSelected = new Set(selectedCells).add(idx);
      setSelectedCells(nextSelected);
      setScore(s => s + 25);

      if (nextSelected.size === targetCells.size) {
        soundEngine.playSuccess();
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
      soundEngine.playClick();
      const nextWrong = new Set(wrongCells).add(idx);
      setWrongCells(nextWrong);
      setLives(l => {
        const nextLives = l - 1;
        if (nextLives <= 0) {
          soundEngine.playModalOpen();
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
