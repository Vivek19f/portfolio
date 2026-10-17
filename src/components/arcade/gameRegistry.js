import { lazy } from 'react';

const QuickMathGame = lazy(() => import('./QuickMathGame'));
const CodeReviewGame = lazy(() => import('./CodeReviewGame'));
const SpeedTyperGame = lazy(() => import('./SpeedTyperGame'));
const MemoryMatrixGame = lazy(() => import('./MemoryMatrixGame'));
const ConstellationGame = lazy(() => import('./ConstellationGame'));

/**
 * Registry of available arcade challenges.
 * Follows Open/Closed Principle (OCP) - new games are registered here
 * without modifying the modal container component.
 */
export const GAME_REGISTRY = {
  'constellation-connect': {
    id: 'constellation-connect',
    title: '✨ Constellation Connect',
    roleBadge: '> Celestial_Challenge',
    component: ConstellationGame,
  },
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
