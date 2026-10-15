import QuickMathGame from './QuickMathGame';
import CodeReviewGame from './CodeReviewGame';
import SpeedTyperGame from './SpeedTyperGame';
import MemoryMatrixGame from './MemoryMatrixGame';

/**
 * Registry of available arcade challenges.
 * Follows Open/Closed Principle (OCP) - new games are registered here
 * without modifying the modal container component.
 */
export const GAME_REGISTRY = {
  'quick-math': {
    id: 'quick-math',
    title: '⚡ Quick Math Challenge',
    roleBadge: '> Arcade_Challenge',
    component: QuickMathGame,
  },
  'code-review': {
    id: 'code-review',
    title: '🐛 Code Review: Spot the Bug',
    roleBadge: '> Arcade_Challenge',
    component: CodeReviewGame,
  },
  'speed-typer': {
    id: 'speed-typer',
    title: '⌨️ Code Speedrun',
    roleBadge: '> Arcade_Challenge',
    component: SpeedTyperGame,
  },
  'memory-matrix': {
    id: 'memory-matrix',
    title: '🧠 Neural Memory Matrix',
    roleBadge: '> Arcade_Challenge',
    component: MemoryMatrixGame,
  },
};

export function getGameConfig(gameId) {
  return GAME_REGISTRY[gameId] || null;
}
