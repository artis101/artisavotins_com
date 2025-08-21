import { describe, it, expect } from 'vitest';
import {
  checkWinCondition,
  createBoard,
  placeMines,
  calculateAdjacentMines,
  revealAllSafeCells,
  flagAllMines,
} from './minesweeper';
import type { Board } from '../types/minesweeper';

describe('minesweeper edge cases', () => {
  describe('boundary cell calculations', () => {
    it('should handle corner cells correctly', () => {
      const config = { boardSize: 3, numMines: 2 };
      const board = createBoard(config, { x: 1, y: 1 });
      
      const cornerCell = board.find(cell => cell.x === 0 && cell.y === 0);
      expect(cornerCell).toBeDefined();
      expect(cornerCell?.adjacentMines).toBeGreaterThanOrEqual(0);
    });

    it('should handle edge cells correctly', () => {
      const config = { boardSize: 5, numMines: 5 };
      const board = createBoard(config, { x: 2, y: 2 });
      
      const edgeCell = board.find(cell => cell.x === 0 && cell.y === 2);
      expect(edgeCell).toBeDefined();
      expect(edgeCell?.adjacentMines).toBeGreaterThanOrEqual(0);
    });

    it('should handle center cells correctly', () => {
      const config = { boardSize: 5, numMines: 10 };
      const board = createBoard(config, { x: 0, y: 0 });
      
      const centerCell = board.find(cell => cell.x === 2 && cell.y === 2);
      expect(centerCell).toBeDefined();
      expect(centerCell?.adjacentMines).toBeGreaterThanOrEqual(0);
    });
  });

  describe('first click safety edge cases', () => {
    it('should not place mines on first click corner', () => {
      const config = { boardSize: 3, numMines: 8 };
      const board = createBoard(config, { x: 0, y: 0 });
      
      const cornerCell = board[0];
      expect(cornerCell.isMine).toBe(false);
    });

    it('should not place mines on first click edge', () => {
      const config = { boardSize: 5, numMines: 20 };
      const board = createBoard(config, { x: 0, y: 2 });
      
      const edgeCell = board.find(cell => cell.x === 0 && cell.y === 2);
      expect(edgeCell?.isMine).toBe(false);
    });

    it('should handle max mines safely', () => {
      const config = { boardSize: 3, numMines: 8 };
      const board = createBoard(config, { x: 1, y: 1 });
      
      const mineCount = board.filter(cell => cell.isMine).length;
      expect(mineCount).toBe(8);
      expect(board[4].isMine).toBe(false); // center cell (1,1)
    });
  });

  describe('win condition edge cases', () => {
    it('should handle empty board win condition', () => {
      const board: Board = [];
      expect(checkWinCondition(board)).toBe(false);
    });

    it('should handle single cell non-mine board', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: false, isRevealed: true, isFlagged: false, adjacentMines: 0 }
      ];
      expect(checkWinCondition(board)).toBe(true);
    });

    it('should handle single cell mine board', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: true, isRevealed: false, isFlagged: true, adjacentMines: 0 }
      ];
      expect(checkWinCondition(board)).toBe(true);
    });

    it('should handle all mines flagged but safe cells not revealed', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 1 },
        { x: 0, y: 1, isMine: true, isRevealed: false, isFlagged: true, adjacentMines: 0 },
        { x: 1, y: 0, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 1 },
        { x: 1, y: 1, isMine: true, isRevealed: false, isFlagged: true, adjacentMines: 0 },
      ];
      expect(checkWinCondition(board)).toBe(true); // All mines flagged wins regardless
    });

    it('should handle all safe cells revealed but mines not flagged', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: false, isRevealed: true, isFlagged: false, adjacentMines: 1 },
        { x: 0, y: 1, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 1, y: 0, isMine: false, isRevealed: true, isFlagged: false, adjacentMines: 1 },
        { x: 1, y: 1, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
      ];
      expect(checkWinCondition(board)).toBe(true);
    });
  });

  describe('flag management edge cases', () => {
    it('should handle zero flags remaining', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 0, y: 1, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
      ];
      
      flagAllMines(board);
      expect(board[1].isFlagged).toBe(true);
      expect(board[0].isFlagged).toBe(false);
    });

    it('should handle already flagged mines', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 0, y: 1, isMine: true, isRevealed: false, isFlagged: true, adjacentMines: 0 },
      ];
      
      flagAllMines(board);
      expect(board[1].isFlagged).toBe(true); // Should remain flagged
    });

    it('should handle revealed mines', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 0, y: 1, isMine: true, isRevealed: true, isFlagged: false, adjacentMines: 0 },
      ];
      
      flagAllMines(board);
      expect(board[1].isFlagged).toBe(true); // Should flag mines regardless of revealed state
    });
  });

  describe('board generation edge cases', () => {
    it('should handle minimum board size', () => {
      const config = { boardSize: 1, numMines: 0 };
      const board = createBoard(config, { x: 0, y: 0 });
      
      expect(board).toHaveLength(1);
      expect(board[0].isMine).toBe(false);
    });

    it('should handle large board size', () => {
      const config = { boardSize: 24, numMines: 99 };
      const board = createBoard(config, { x: 0, y: 0 });
      
      expect(board).toHaveLength(576);
      const mineCount = board.filter(cell => cell.isMine).length;
      expect(mineCount).toBe(99);
    });

    it('should handle zero mines', () => {
      const config = { boardSize: 5, numMines: 0 };
      const board = createBoard(config, { x: 2, y: 2 });
      
      const mineCount = board.filter(cell => cell.isMine).length;
      expect(mineCount).toBe(0);
    });
  });

  describe('adjacent mine calculation edge cases', () => {
    it('should calculate adjacent mines for isolated cell', () => {
      const config = { boardSize: 1, numMines: 0 };
      const board = createBoard(config, { x: 0, y: 0 });
      
      expect(board[0].adjacentMines).toBe(0);
    });

    it('should calculate adjacent mines for fully surrounded cell', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 0, y: 1, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 0, y: 2, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 1, y: 0, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 1, y: 1, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 1, y: 2, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 2, y: 0, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 2, y: 1, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 2, y: 2, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
      ];
      
      calculateAdjacentMines(board, 3);
      expect(board[4].adjacentMines).toBe(8);
    });
  });
});