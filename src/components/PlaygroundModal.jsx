import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Trophy, Check, AlertCircle, Bomb, Flag } from 'lucide-react';

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
              {gameId === 'minesweeper' && '💣 Minesweeper: Clean Grid'}
              {gameId === 'mini-sudoku' && '🧩 Mini Sudoku'}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="game-container">
          {gameId === 'quick-math' && <QuickMathGame />}
          {gameId === 'code-review' && <CodeReviewGame />}
          {gameId === 'minesweeper' && <MinesweeperGame />}
          {gameId === 'mini-sudoku' && <SudokuGame />}
        </div>
      </motion.div>
    </div>
  );
}

// ---------------- QUICK MATH GAME ----------------
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

  // Generate arithmetic questions
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

// ---------------- CODE REVIEW BUG SPOTTER ----------------
function CodeReviewGame() {
  const SNIPPETS = [
    {
      title: "Snippet 1: Async State Mutation",
      code: [
        "async function fetchUserData(userId) {",
        "  const cache = await getCache();",
        "  let data = cache.find(u => u.id === userId);",
        "  if (!data) {",
        "    data = fetch(`/api/users/${userId}`); // BUG: Missing await!",
        "    cache.push(data);",
        "  }",
        "  return data;",
        "}"
      ],
      bugLine: 4,
      explanation: "Line 5 called fetch() without 'await', causing a raw Promise to be cached and returned instead of the resolved user data."
    },
    {
      title: "Snippet 2: Off-By-One Array Bounds",
      code: [
        "function computeSlidingAverage(arr, windowSize) {",
        "  const results = [];",
        "  for (let i = 0; i <= arr.length; i++) { // BUG: i <= arr.length causes index out of range",
        "    const slice = arr.slice(i, i + windowSize);",
        "    const sum = slice.reduce((a, b) => a + b, 0);",
        "    results.push(sum / slice.length);",
        "  }",
        "  return results;",
        "}"
      ],
      bugLine: 2,
      explanation: "Line 3 used 'i <= arr.length' instead of 'i < arr.length', producing an out-of-bounds slice and NaN values."
    },
    {
      title: "Snippet 3: Object Reference Mutation",
      code: [
        "function updateUserRole(userState, newRole) {",
        "  // Pure reducer expected:",
        "  userState.role = newRole; // BUG: Directly mutating frozen state argument",
        "  return {",
        "    ...userState,",
        "    updatedAt: Date.now()",
        "  };",
        "}"
      ],
      bugLine: 2,
      explanation: "Line 3 mutates userState directly before cloning, breaking React immutability and triggering subtle re-render bugs."
    }
  ];

  const [snippetIdx, setSnippetIdx] = useState(0);
  const [selectedLine, setSelectedLine] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [solved, setSolved] = useState(0);

  const handleLineClick = (lineIndex) => {
    if (isCorrect) return;
    setSelectedLine(lineIndex);
    if (lineIndex === SNIPPETS[snippetIdx].bugLine) {
      setIsCorrect(true);
      setSolved((s) => s + 1);
    } else {
      setIsCorrect(false);
    }
  };

  const nextSnippet = () => {
    setSelectedLine(null);
    setIsCorrect(null);
    setSnippetIdx((prev) => (prev + 1) % SNIPPETS.length);
  };

  const current = SNIPPETS[snippetIdx];

  return (
    <div className="game-box">
      <div className="game-stats-bar font-mono">
        <span>{current.title}</span>
        <span>Solved: <strong className="text-accent">{solved}</strong></span>
      </div>
      <p className="font-mono text-xs text-muted-custom mb-3">
        🔍 Tap on the exact line containing the bug:
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
            Next Snippet →
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
            <AlertCircle size={18} /> Not this line. Look closer!
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ---------------- MINESWEEPER MINI ----------------
function MinesweeperGame() {
  const ROWS = 8;
  const COLS = 8;
  const MINES = 10;

  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const initGrid = () => {
    let board = Array(ROWS)
      .fill(null)
      .map(() =>
        Array(COLS).fill(null).map(() => ({
          isMine: false,
          revealed: false,
          flagged: false,
          adjacent: 0,
        }))
      );

    // Place mines
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!board[r][c].isMine) {
        board[r][c].isMine = true;
        placed++;
      }
    }

    // Count adjacents
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!board[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) {
                count++;
              }
            }
          }
          board[r][c].adjacent = count;
        }
      }
    }
    setGrid(board);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    initGrid();
  }, []);

  const revealCell = (r, c) => {
    if (gameOver || won || grid[r][c].revealed || grid[r][c].flagged) return;

    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    if (newGrid[r][c].isMine) {
      // Game over!
      newGrid.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isMine) cell.revealed = true;
        })
      );
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

    // Flood fill zeros
    const flood = (cr, cc) => {
      if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) return;
      if (newGrid[cr][cc].revealed || newGrid[cr][cc].isMine) return;
      newGrid[cr][cc].revealed = true;
      if (newGrid[cr][cc].adjacent === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            flood(cr + dr, cc + dc);
          }
        }
      }
    };

    flood(r, c);

    // Check win condition
    let unrevealedSafe = 0;
    newGrid.forEach((row) =>
      row.forEach((cell) => {
        if (!cell.isMine && !cell.revealed) unrevealedSafe++;
      })
    );

    setGrid(newGrid);
    if (unrevealedSafe === 0) {
      setWon(true);
    }
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameOver || won || grid[r][c].revealed) return;
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    newGrid[r][c].flagged = !newGrid[r][c].flagged;
    setGrid(newGrid);
  };

  return (
    <div className="game-box">
      <div className="game-stats-bar font-mono">
        <span>Mines: <strong className="text-accent">{MINES}</strong></span>
        <span>
          {gameOver && <span className="text-red-400 font-bold">💥 Hit a Mine!</span>}
          {won && <span className="text-green-400 font-bold">🎉 Field Cleared!</span>}
          {!gameOver && !won && <span>Right-click or hold to flag</span>}
        </span>
        <button onClick={initGrid} className="ghost-btn-sm font-mono flex items-center gap-1">
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      <div className="minesweeper-board font-mono">
        {grid.map((row, r) => (
          <div key={r} className="minesweeper-row">
            {row.map((cell, c) => (
              <button
                key={c}
                onClick={() => revealCell(r, c)}
                onContextMenu={(e) => toggleFlag(e, r, c)}
                className={`mine-cell ${cell.revealed ? 'revealed' : 'hidden-cell'} ${
                  cell.isMine && cell.revealed ? 'mine-hit' : ''
                }`}
              >
                {cell.revealed ? (
                  cell.isMine ? (
                    <Bomb size={14} className="text-red-400" />
                  ) : cell.adjacent > 0 ? (
                    <span className={`mine-num num-${cell.adjacent}`}>{cell.adjacent}</span>
                  ) : null
                ) : cell.flagged ? (
                  <Flag size={12} className="text-accent" />
                ) : null}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- SUDOKU MINI ----------------
function SudokuGame() {
  return (
    <div className="game-box text-center p-6 font-mono">
      <Trophy size={40} className="text-accent mx-auto mb-3" />
      <h3 className="text-lg font-bold mb-2">Mini 6×6 Sudoku</h3>
      <p className="text-secondary text-xs max-w-sm mx-auto mb-4">
        Pure deductive logic with 2×3 box constraints. Designed for quick 2-minute daily coffee runs.
      </p>
      <div className="inline-block p-4 rounded-xl border border-white/10 bg-black/40 text-accent text-sm">
        Coming in next daily rotation! Try Quick Math or Code Review above.
      </div>
    </div>
  );
}
