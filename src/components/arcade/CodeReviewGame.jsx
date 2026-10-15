import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

export default function CodeReviewGame() {
  const { playSuccess, playClick } = useSound();

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
      playSuccess();
      setIsCorrect(true);
      setSolved((s) => s + 1);
    } else {
      playClick();
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
