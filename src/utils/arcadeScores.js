/**
 * Arcade High Scores & Record Tracking Engine
 * Manages persistent personal records, author baselines, and live record-breaking state.
 */

const STORAGE_KEY = 'portfolio_arcade_records_v1';

export const BASELINE_AUTHOR_RECORDS = {
  'constellation-connect': {
    id: 'constellation-connect',
    label: '6/6 Epochs (2,150 pts)',
    score: 2150,
    level: 6,
    author: 'Vivek',
    isAuthorBaseline: true,
  },
  'quick-math': {
    id: 'quick-math',
    label: '14.8s (Avg 0.74s/q)',
    score: 10,
    time: 14.8,
    author: 'Vivek',
    isAuthorBaseline: true,
  },
  'code-review': {
    id: 'code-review',
    label: '3/3 Bugs Caught',
    solved: 3,
    total: 3,
    author: 'Vivek',
    isAuthorBaseline: true,
  },
  'speed-typer': {
    id: 'speed-typer',
    label: '98 WPM (99% Acc)',
    wpm: 98,
    accuracy: 99,
    author: 'Vivek',
    isAuthorBaseline: true,
  },
  'memory-matrix': {
    id: 'memory-matrix',
    label: 'Level 8 Cleared (1,200 pts)',
    level: 8,
    score: 1200,
    author: 'Vivek',
    isAuthorBaseline: true,
  },
};

/**
 * Read all stored records from localStorage
 */
export function getAllArcadeRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...BASELINE_AUTHOR_RECORDS };
    const parsed = JSON.parse(raw);
    return {
      ...BASELINE_AUTHOR_RECORDS,
      ...parsed,
    };
  } catch {
    return { ...BASELINE_AUTHOR_RECORDS };
  }
}

/**
 * Get active record for a single game
 */
export function getGameRecord(gameId) {
  const records = getAllArcadeRecords();
  return records[gameId] || BASELINE_AUTHOR_RECORDS[gameId] || null;
}

/**
 * Checks if current run beats the active best record.
 * Returns true if the new run is strictly better than current record.
 */
function isBetterRun(gameId, currentRun, existing) {
  if (!existing) return true;

  switch (gameId) {
    case 'quick-math': {
      // 1. More questions correct is better
      if (currentRun.score > (existing.score || 0)) return true;
      // 2. If same correct count, faster time is better
      if (currentRun.score === existing.score && currentRun.time < (existing.time || Infinity)) {
        return true;
      }
      return false;
    }

    case 'speed-typer': {
      // 1. Higher WPM is better
      if (currentRun.wpm > (existing.wpm || 0)) return true;
      // 2. If same WPM, higher accuracy is better
      if (currentRun.wpm === existing.wpm && currentRun.accuracy > (existing.accuracy || 0)) {
        return true;
      }
      return false;
    }

    case 'code-review': {
      // More bugs caught is better
      if (currentRun.solved > (existing.solved || 0)) return true;
      return false;
    }

    case 'memory-matrix': {
      // Higher level is better, or higher score on same level
      if (currentRun.level > (existing.level || 0)) return true;
      if (currentRun.level === existing.level && currentRun.score > (existing.score || 0)) {
        return true;
      }
      return false;
    }

    case 'constellation-connect': {
      // Higher score is better
      if (currentRun.score > (existing.score || 0)) return true;
      if (currentRun.score === existing.score && currentRun.level > (existing.level || 0)) {
        return true;
      }
      return false;
    }

    default:
      return currentRun.score > (existing.score || 0);
  }
}

/**
 * Formats a clean human-readable record label based on the game type
 */
function formatRecordLabel(gameId, run) {
  switch (gameId) {
    case 'quick-math': {
      const avg = run.score > 0 ? (run.time / run.score).toFixed(2) : '0.00';
      return `${run.time}s (${run.score}/${run.total || 10} · ${avg}s/q)`;
    }
    case 'speed-typer': {
      return `${run.wpm} WPM (${run.accuracy}% Acc)`;
    }
    case 'code-review': {
      return `${run.solved}/${run.total || 3} Bugs Caught`;
    }
    case 'memory-matrix': {
      return `Level ${run.level} Cleared (${run.score.toLocaleString()} pts)`;
    }
    case 'constellation-connect': {
      return `${run.score.toLocaleString()} pts (${run.level}/${run.totalLevels || 6} Charted)`;
    }
    default:
      return `${run.score} pts`;
  }
}

/**
 * Evaluates current game run against stored record and author baseline.
 * If new record, saves to localStorage and notifies subscribers.
 * 
 * @returns {{ isNewRecord: boolean, isAuthorBeaten: boolean, record: object }}
 */
export function recordGameScore(gameId, currentRun) {
  const all = getAllArcadeRecords();
  const existing = all[gameId] || BASELINE_AUTHOR_RECORDS[gameId];
  const baseline = BASELINE_AUTHOR_RECORDS[gameId];

  const beatsCurrentBest = isBetterRun(gameId, currentRun, existing);
  const beatsAuthor = baseline ? isBetterRun(gameId, currentRun, baseline) : beatsCurrentBest;

  if (beatsCurrentBest) {
    const updatedRecord = {
      ...currentRun,
      id: gameId,
      label: formatRecordLabel(gameId, currentRun),
      timestamp: Date.now(),
      isAuthorBaseline: false,
      isPersonalBest: true,
      beatAuthor: beatsAuthor,
    };

    all[gameId] = updatedRecord;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (err) {
      console.warn('Failed to persist arcade record to localStorage:', err);
    }

    // Broadcast update to real-time UI subscribers
    window.dispatchEvent(
      new CustomEvent('arcade-record-updated', {
        detail: {
          gameId,
          record: updatedRecord,
          isNewRecord: true,
          beatAuthor: beatsAuthor,
        },
      })
    );

    return {
      isNewRecord: true,
      isAuthorBeaten: beatsAuthor,
      record: updatedRecord,
    };
  }

  return {
    isNewRecord: false,
    isAuthorBeaten: false,
    record: existing,
  };
}

/**
 * Reset all personal bests back to author baselines
 */
export function resetArcadeRecords() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn(err);
  }
  window.dispatchEvent(new CustomEvent('arcade-record-updated', { detail: { reset: true } }));
}
