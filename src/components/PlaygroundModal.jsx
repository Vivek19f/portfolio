import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, RotateCcw, Trophy, Check, AlertCircle, Bomb, Flag, 
  Heart, Sparkles, Play, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Delete, ChevronRight
} from 'lucide-react';

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
              {gameId === 'mini-sudoku' && '🧩 Mini Sudoku (6×6)'}
              {gameId === 'game-2048' && '🎮 2048: Dev Edition'}
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
          {gameId === 'minesweeper' && <MinesweeperGame />}
          {gameId === 'mini-sudoku' && <SudokuGame />}
          {gameId === 'game-2048' && <Dev2048Game />}
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
      explanation: "Line 5 called fetch() without 'await', causing an unresolved raw Promise to be cached and returned instead of the actual user object."
    },
    {
      title: "Snippet 2: Off-By-One Array Bounds",
      code: [
        "function computeSlidingAverage(arr, windowSize) {",
        "  const results = [];",
        "  for (let i = 0; i <= arr.length; i++) { // BUG: i <= arr.length triggers out of range",
        "    const slice = arr.slice(i, i + windowSize);",
        "    const sum = slice.reduce((a, b) => a + b, 0);",
        "    results.push(sum / slice.length);",
        "  }",
        "  return results;",
        "}"
      ],
      bugLine: 2,
      explanation: "Line 3 used 'i <= arr.length' instead of 'i < arr.length', producing an out-of-bounds slice and unexpected NaN average values."
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
      explanation: "Line 3 mutates userState directly before cloning, breaking React immutability contracts and skipping reactive component re-renders."
    },
    {
      title: "Snippet 4: SQL Injection via Template Strings",
      code: [
        "export async function getUserProfile(userId, tenantId) {",
        "  // Fetching tenant isolated user record:",
        "  const query = `SELECT * FROM users WHERE id = '${userId}' AND tenant = '${tenantId}'`; // BUG: Raw string interpolation prone to SQLi",
        "  const [rows] = await db.pool.execute(query);",
        "  return rows[0] || null;",
        "}"
      ],
      bugLine: 2,
      explanation: "Line 3 directly interpolated unescaped arguments into the raw SQL string without parameterized query placeholders ($1, $2)."
    },
    {
      title: "Snippet 5: Broken Recursive Base Case",
      code: [
        "function flattenCategoryTree(node, accumulator = []) {",
        "  accumulator.push(node.name);",
        "  if (node.children && node.children.length > 0) {",
        "    for (const child of node.children) {",
        "      flattenCategoryTree(child); // BUG: Missed forwarding existing accumulator",
        "    }",
        "  }",
        "  return accumulator;",
        "}"
      ],
      bugLine: 4,
      explanation: "Line 5 recursively called flattenCategoryTree(child) without passing the existing accumulator argument, discarding all child category trees."
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
        <span>{current.title} ({snippetIdx + 1}/{SNIPPETS.length})</span>
        <span>Bugs Caught: <strong className="text-accent">{solved}</strong></span>
      </div>
      <p className="font-mono text-xs text-muted-custom mb-3">
        🔍 Review the code and tap the single line that triggers a production defect:
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
            <AlertCircle size={18} /> Not this line. Look closer at types and async contracts!
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// 3. MINESWEEPER MINI
// ============================================================================
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

    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!board[r][c].isMine) {
        board[r][c].isMine = true;
        placed++;
      }
    }

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
      newGrid.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isMine) cell.revealed = true;
        })
      );
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

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

// ============================================================================
// 4. MINI SUDOKU (6×6) GAME
// ============================================================================
function SudokuGame() {
  const PUZZLES = [
    {
      initial: [
        [1, 0, 3, 0, 5, 0],
        [0, 5, 0, 1, 0, 3],
        [2, 0, 4, 0, 6, 0],
        [0, 6, 0, 2, 0, 4],
        [3, 0, 5, 0, 1, 0],
        [0, 1, 0, 3, 0, 5]
      ],
      solution: [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 4, 5, 6, 1],
        [5, 6, 1, 2, 3, 4],
        [3, 4, 5, 6, 1, 2],
        [6, 1, 2, 3, 4, 5]
      ]
    },
    {
      initial: [
        [3, 0, 5, 0, 6, 0],
        [0, 4, 0, 3, 0, 1],
        [0, 5, 0, 4, 0, 6],
        [4, 0, 6, 0, 1, 0],
        [5, 0, 1, 0, 4, 0],
        [0, 6, 0, 1, 0, 5]
      ],
      solution: [
        [3, 1, 5, 2, 6, 4],
        [6, 4, 2, 3, 5, 1],
        [1, 5, 3, 4, 2, 6],
        [4, 2, 6, 5, 1, 3],
        [5, 3, 1, 6, 4, 2],
        [2, 6, 4, 1, 3, 5]
      ]
    }
  ];

  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [conflicts, setConflicts] = useState(new Set());

  const currentPuzzle = PUZZLES[puzzleIdx];

  const initPuzzle = (idx) => {
    const p = PUZZLES[idx];
    setBoard(p.initial.map(row => [...row]));
    setSelectedCell(null);
    setIsWon(false);
    setElapsed(0);
    setConflicts(new Set());
  };

  useEffect(() => {
    initPuzzle(puzzleIdx);
  }, [puzzleIdx]);

  useEffect(() => {
    if (isWon) return;
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, [isWon]);

  // Check conflicts and win condition
  useEffect(() => {
    if (!board.length) return;
    const badCells = new Set();

    // Check rows
    for (let r = 0; r < 6; r++) {
      const seen = {};
      for (let c = 0; c < 6; c++) {
        const val = board[r][c];
        if (val !== 0) {
          if (seen[val] !== undefined) {
            badCells.add(`${r}-${c}`);
            badCells.add(`${r}-${seen[val]}`);
          } else {
            seen[val] = c;
          }
        }
      }
    }

    // Check cols
    for (let c = 0; c < 6; c++) {
      const seen = {};
      for (let r = 0; r < 6; r++) {
        const val = board[r][c];
        if (val !== 0) {
          if (seen[val] !== undefined) {
            badCells.add(`${r}-${c}`);
            badCells.add(`${seen[val]}-${c}`);
          } else {
            seen[val] = r;
          }
        }
      }
    }

    // Check 2x3 blocks
    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 2; bc++) {
        const seen = {};
        for (let r = br * 2; r < br * 2 + 2; r++) {
          for (let c = bc * 3; c < bc * 3 + 3; c++) {
            const val = board[r][c];
            if (val !== 0) {
              if (seen[val]) {
                badCells.add(`${r}-${c}`);
                badCells.add(`${seen[val].r}-${seen[val].c}`);
              } else {
                seen[val] = { r, c };
              }
            }
          }
        }
      }
    }

    setConflicts(badCells);

    // Win check
    let hasZero = false;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (board[r][c] === 0) hasZero = true;
      }
    }
    if (!hasZero && badCells.size === 0) {
      setIsWon(true);
    }
  }, [board]);

  const handleCellClick = (r, c) => {
    if (currentPuzzle.initial[r][c] !== 0) return;
    setSelectedCell({ r, c });
  };

  const handleSetNumber = (num) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (currentPuzzle.initial[r][c] !== 0) return;

    setBoard(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = num;
      return next;
    });
  };

  // Keyboard navigation & digit typing
  useEffect(() => {
    const handleKey = (e) => {
      if (!selectedCell) return;
      if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        handleSetNumber(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        handleSetNumber(0);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedCell]);

  return (
    <div className="game-box">
      <div className="game-stats-bar font-mono">
        <span>6×6 Grid (2×3 Boxes)</span>
        <span>Time: <strong className="text-accent">{elapsed}s</strong></span>
        <span>
          {isWon ? (
            <span className="text-green-400 font-bold">🎉 Solved!</span>
          ) : conflicts.size > 0 ? (
            <span className="text-red-400">{conflicts.size} Conflicts</span>
          ) : (
            <span className="text-accent">Deductive Mode</span>
          )}
        </span>
        <button 
          onClick={() => setPuzzleIdx((idx) => (idx + 1) % PUZZLES.length)} 
          className="ghost-btn-sm font-mono flex items-center gap-1"
        >
          <RotateCcw size={12} /> New Puzzle
        </button>
      </div>

      <div className="sudoku-board-container font-mono">
        <div className="sudoku-grid-6x6">
          {board.map((row, r) => (
            <div key={r} className="sudoku-row-6x6">
              {row.map((val, c) => {
                const isFixed = currentPuzzle.initial[r][c] !== 0;
                const isSelected = selectedCell && selectedCell.r === r && selectedCell.c === c;
                const hasConflict = conflicts.has(`${r}-${c}`);
                const isBlockBottom = r === 1 || r === 3;
                const isBlockRight = c === 2;

                return (
                  <button
                    key={c}
                    onClick={() => handleCellClick(r, c)}
                    className={`sudoku-cell ${isFixed ? 'cell-fixed' : 'cell-editable'} ${
                      isSelected ? 'cell-selected' : ''
                    } ${hasConflict ? 'cell-conflict' : ''} ${
                      isBlockBottom ? 'border-b-thick' : ''
                    } ${isBlockRight ? 'border-r-thick' : ''}`}
                  >
                    {val !== 0 ? val : ''}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sudoku Keypad */}
        <div className="sudoku-keypad font-mono">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => handleSetNumber(num)}
              className="keypad-digit-btn"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleSetNumber(0)}
            className="keypad-digit-btn keypad-erase-btn"
            title="Erase (Backspace)"
          >
            <Delete size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. 2048: DEV EDITION
// ============================================================================
function Dev2048Game() {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('arcade_2048_best') || '0', 10);
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const TILE_DATA = {
    2: { name: 'HTML', code: '2', bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' },
    4: { name: 'CSS', code: '4', bg: 'rgba(0, 240, 255, 0.2)', color: '#00f0ff' },
    8: { name: 'JS', code: '8', bg: 'rgba(250, 204, 21, 0.25)', color: '#facc15' },
    16: { name: 'React', code: '16', bg: 'rgba(96, 165, 250, 0.3)', color: '#60a5fa' },
    32: { name: 'Node', code: '32', bg: 'rgba(74, 222, 128, 0.3)', color: '#4ade80' },
    64: { name: 'TS', code: '64', bg: 'rgba(59, 130, 246, 0.4)', color: '#93c5fd' },
    128: { name: 'Python', code: '128', bg: 'rgba(251, 191, 36, 0.4)', color: '#fbbf24' },
    256: { name: 'Docker', code: '256', bg: 'rgba(14, 165, 233, 0.45)', color: '#38bdf8' },
    512: { name: 'K8s', code: '512', bg: 'rgba(99, 102, 241, 0.5)', color: '#818cf8' },
    1024: { name: 'Arch', code: '1024', bg: 'rgba(168, 85, 247, 0.55)', color: '#c084fc' },
    2048: { name: 'Staff 🚀', code: '2048', bg: 'rgba(0, 240, 255, 0.7)', color: '#ffffff' }
  };

  const getEmptyCells = (board) => {
    const empty = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) empty.push({ r, c });
      }
    }
    return empty;
  };

  const spawnRandomTile = (board) => {
    const empty = getEmptyCells(board);
    if (!empty.length) return board;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const val = Math.random() < 0.9 ? 2 : 4;
    board[r][c] = val;
    return board;
  };

  const initGame = () => {
    let board = Array(4).fill(0).map(() => Array(4).fill(0));
    spawnRandomTile(board);
    spawnRandomTile(board);
    setGrid(board);
    setScore(0);
    setIsGameOver(false);
    setHasWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const slideRowLeft = (row) => {
    const nonZero = row.filter(val => val !== 0);
    const newRow = [];
    let gained = 0;
    for (let i = 0; i < nonZero.length; i++) {
      if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;
        newRow.push(merged);
        gained += merged;
        i++;
      } else {
        newRow.push(nonZero[i]);
      }
    }
    while (newRow.length < 4) newRow.push(0);
    return { newRow, gained };
  };

  const moveLeft = (board) => {
    let changed = false;
    let gained = 0;
    const newBoard = board.map(row => {
      const { newRow, gained: rowGained } = slideRowLeft(row);
      gained += rowGained;
      if (newRow.some((val, idx) => val !== row[idx])) changed = true;
      return newRow;
    });
    return { newBoard, changed, gained };
  };

  const rotateClockwise = (board) => {
    const n = 4;
    const res = Array(4).fill(0).map(() => Array(4).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        res[c][n - 1 - r] = board[r][c];
      }
    }
    return res;
  };

  const checkGameOver = (board) => {
    if (getEmptyCells(board).length > 0) return false;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (c < 3 && board[r][c] === board[r][c + 1]) return false;
        if (r < 3 && board[r][c] === board[r + 1][c]) return false;
      }
    }
    return true;
  };

  const handleMove = (direction) => {
    if (isGameOver) return;
    let current = grid.map(r => [...r]);
    let moves = 0;
    if (direction === 'LEFT') moves = 0;
    if (direction === 'DOWN') moves = 1;
    if (direction === 'RIGHT') moves = 2;
    if (direction === 'UP') moves = 3;

    for (let i = 0; i < moves; i++) current = rotateClockwise(current);

    const { newBoard, changed, gained } = moveLeft(current);
    if (!changed) return;

    let finalBoard = newBoard;
    for (let i = 0; i < (4 - moves) % 4; i++) finalBoard = rotateClockwise(finalBoard);

    spawnRandomTile(finalBoard);
    setGrid(finalBoard);

    const nextScore = score + gained;
    setScore(nextScore);
    if (nextScore > bestScore) {
      setBestScore(nextScore);
      localStorage.setItem('arcade_2048_best', nextScore.toString());
    }

    if (!hasWon) {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (finalBoard[r][c] >= 2048) setHasWon(true);
        }
      }
    }

    if (checkGameOver(finalBoard)) {
      setIsGameOver(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        handleMove('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        handleMove('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        handleMove('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        handleMove('RIGHT');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, isGameOver, score]);

  return (
    <div className="game-box dev-2048-box">
      <div className="game-stats-bar font-mono">
        <div className="flex items-center gap-3">
          <span>Score: <strong className="text-accent">{score}</strong></span>
          <span>Best: <strong className="text-secondary">{bestScore}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          {hasWon && <span className="text-accent font-bold text-xs">🚀 2048 Unlocked!</span>}
          {isGameOver && <span className="text-red-400 font-bold text-xs">Game Over</span>}
          <button onClick={initGame} className="ghost-btn-sm font-mono flex items-center gap-1">
            <RotateCcw size={12} /> New Game
          </button>
        </div>
      </div>

      <div className="grid-2048-board font-mono">
        {grid.map((row, r) => (
          <div key={r} className="row-2048">
            {row.map((val, c) => {
              const tile = TILE_DATA[val];
              return (
                <div
                  key={c}
                  className={`tile-2048 ${val === 0 ? 'tile-empty' : 'tile-active'}`}
                  style={val !== 0 && tile ? {
                    background: tile.bg,
                    borderColor: tile.color,
                    color: tile.color
                  } : {}}
                >
                  {val !== 0 && (
                    <>
                      <span className="tile-tech-name">{tile ? tile.name : val}</span>
                      <span className="tile-code-val">{val}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Directional Pad for Mobile & Mouse */}
      <div className="dpad-controls font-mono">
        <button onClick={() => handleMove('UP')} className="dpad-btn dpad-up" aria-label="Up">
          <ArrowUp size={16} />
        </button>
        <div className="dpad-mid-row">
          <button onClick={() => handleMove('LEFT')} className="dpad-btn dpad-left" aria-label="Left">
            <ArrowLeft size={16} />
          </button>
          <div className="dpad-center text-xs text-muted-custom">DPAD</div>
          <button onClick={() => handleMove('RIGHT')} className="dpad-btn dpad-right" aria-label="Right">
            <ArrowRight size={16} />
          </button>
        </div>
        <button onClick={() => handleMove('DOWN')} className="dpad-btn dpad-down" aria-label="Down">
          <ArrowDown size={16} />
        </button>
      </div>
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

  const startRound = (lvl = level) => {
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

    setTimeout(() => {
      setPhase('RECALL');
    }, 1500);
  };

  useEffect(() => {
    startRound(1);
  }, []);

  const handleCellClick = (idx) => {
    if (phase !== 'RECALL') return;
    if (selectedCells.has(idx) || wrongCells.has(idx)) return;

    if (targetCells.has(idx)) {
      const nextSelected = new Set(selectedCells).add(idx);
      setSelectedCells(nextSelected);
      setScore(s => s + 25);

      if (nextSelected.size === targetCells.size) {
        setPhase('WON_ROUND');
        setScore(s => s + 100 * level);
        setTimeout(() => {
          setLevel(l => {
            const nextLvl = l + 1;
            startRound(nextLvl);
            return nextLvl;
          });
        }, 1100);
      }
    } else {
      const nextWrong = new Set(wrongCells).add(idx);
      setWrongCells(nextWrong);
      setLives(l => {
        const nextLives = l - 1;
        if (nextLives <= 0) {
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
