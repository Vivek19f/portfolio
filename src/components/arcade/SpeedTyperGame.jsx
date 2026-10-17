import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, ChevronRight, Flame } from 'lucide-react';
import { recordGameScore } from '../../utils/arcadeScores';

export default function SpeedTyperGame() {
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
  const [recordResult, setRecordResult] = useState(null);
  const inputRef = useRef(null);

  const snippet = CODE_SNIPPETS[snippetIdx];

  const startTest = () => {
    setTyped('');
    setTimeLeft(TOTAL_TIME);
    setIsActive(false);
    setIsFinished(false);
    setRecordResult(null);
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

  useEffect(() => {
    if (isFinished) {
      const result = recordGameScore('speed-typer', {
        wpm,
        accuracy,
        correctChars
      });
      setRecordResult(result);
    }
  }, [isFinished, wpm, accuracy, correctChars]);

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
          {recordResult?.isNewRecord && (
            <div className="new-record-banner font-mono">
              <Flame size={14} className="text-amber-400 animate-pulse" />
              <span>NEW PERSONAL BEST! {recordResult.isAuthorBeaten ? '🏆 Vivek\'s Record Beaten!' : ''}</span>
            </div>
          )}
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
