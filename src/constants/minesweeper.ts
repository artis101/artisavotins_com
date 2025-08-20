import type { GameConfig } from '../types/minesweeper';

export const DIFFICULTIES: Record<string, GameConfig> = {
  trivial: {
    boardSize: 3,
    numMines: 2,
  },
  easy: {
    boardSize: 10,
    numMines: 10,
  },
  medium: {
    boardSize: 16,
    numMines: 40,
  },
  hard: {
    boardSize: 24,
    numMines: 99,
  },
};
