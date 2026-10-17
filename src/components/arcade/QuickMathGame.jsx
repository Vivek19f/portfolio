import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Flame } from 'lucide-react';
import { recordGameScore } from '../../utils/arcadeScores';

export default function QuickMathGame() {
  const TOTAL_QUESTIONS = 10;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [recordResult, setRecordResult] = useState(null);
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
    setRecordResult(null);
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
    if (isFinished) {
      const res = recordGameScore('quick-math', {
        score,
        time: parseFloat(elapsed),
        total: TOTAL_QUESTIONS
      });
      setRecordResult(res);
    }
  }, [isFinished, score, elapsed]);

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
          {recordResult?.isNewRecord && (
            <div className="new-record-banner font-mono">
              <Flame size={14} className="text-amber-400 animate-pulse" />
              <span>NEW PERSONAL BEST! {recordResult.isAuthorBeaten ? '🏆 Vivek\'s Record Beaten!' : ''}</span>
            </div>
          )}
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
