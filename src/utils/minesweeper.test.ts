import { describe, it, expect } from 'vitest';
import {
  checkWinCondition,
  revealAllSafeCells,
  flagAllMines,
  createBoard,
  placeMines,
  calculateAdjacentMines,
} from './minesweeper';
import type { Board, GameConfig } from '../types/minesweeper';

describe('minesweeper utils', () => {
  describe('checkWinCondition', () => {
    it('should return false for empty board', () => {
      const board: Board = [];
      expect(checkWinCondition(board)).toBe(false);
    });

    it('should return true when all safe cells are revealed', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: false, isRevealed: true, isFlagged: false, adjacentMines: 1 },
        { x: 0, y: 1, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 1, y: 0, isMine: false, isRevealed: true, isFlagged: false, adjacentMines: 1 },
        { x: 1, y: 1, isMine: false, isRevealed: true, isFlagged: false, adjacentMines: 1 },
      ];
      expect(checkWinCondition(board)).toBe(true);
    });

    it('should return true when all mines are correctly flagged', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 1 },
        { x: 0, y: 1, isMine: true, isRevealed: false, isFlagged: true, adjacentMines: 0 },
        { x: 1, y: 0, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 1 },
        { x: 1, y: 1, isMine: true, isRevealed: false, isFlagged: true, adjacentMines: 0 },
      ];
      expect(checkWinCondition(board)).toBe(true);
    });

    it('should return false when there are unrevealed safe cells', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 1 },
        { x: 0, y: 1, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 1, y: 0, isMine: false, isRevealed: true, isFlagged: false, adjacentMines: 1 },
        { x: 1, y: 1, isMine: false, isRevealed: true, isFlagged: false, adjacentMines: 1 },
      ];
      expect(checkWinCondition(board)).toBe(false);
    });

    it('should return true when all safe cells are revealed even with unflagged mines', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: false, isRevealed: true, isFlagged: false, adjacentMines: 1 },
        { x: 0, y: 1, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 1, y: 0, isMine: false, isRevealed: true, isFlagged: false, adjacentMines: 1 },
        { x: 1, y: 1, isMine: false, isRevealed: true, isFlagged: false, adjacentMines: 1 },
      ];
      expect(checkWinCondition(board)).toBe(true);
    });
  });

  describe('revealAllSafeCells', () => {
    it('should reveal all safe cells', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 1 },
        { x: 0, y: 1, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 1, y: 0, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 1 },
        { x: 1, y: 1, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
      ];

      revealAllSafeCells(board);

      expect(board[0].isRevealed).toBe(true);
      expect(board[1].isRevealed).toBe(false); // Mine
      expect(board[2].isRevealed).toBe(true);
      expect(board[3].isRevealed).toBe(false); // Mine
    });
  });

  describe('flagAllMines', () => {
    it('should flag all mines that are not already flagged', () => {
      const board: Board = [
        { x: 0, y: 0, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 1 },
        { x: 0, y: 1, isMine: true, isRevealed: false, isFlagged: false, adjacentMines: 0 },
        { x: 1, y: 0, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 1 },
        { x: 1, y: 1, isMine: true, isRevealed: false, isFlagged: true, adjacentMines: 0 },
      ];

      flagAllMines(board);

      expect(board[0].isFlagged).toBe(false); // Not a mine
      expect(board[1].isFlagged).toBe(true); // Mine
      expect(board[2].isFlagged).toBe(false); // Not a mine
      expect(board[3].isFlagged).toBe(true); // Already flagged
    });
  });

  describe('createBoard', () => {
    it('should create a board with correct dimensions', () => {
      const config: GameConfig = { boardSize: 3, numMines: 2 };
      const board = createBoard(config, { x: 0, y: 0 });
      
      expect(board.length).toBe(9);
      expect(board[0].x).toBe(0);
      expect(board[0].y).toBe(0);
      expect(board[8].x).toBe(2);
      expect(board[8].y).toBe(2);
    });

    it('should not place mine on first click', () => {
      const config: GameConfig = { boardSize: 3, numMines: 2 };
      const board = createBoard(config, { x: 1, y: 1 });
      
      const firstClickIndex = 1 * 3 + 1;
      expect(board[firstClickIndex].isMine).toBe(false);
    });

    it('should place correct number of mines', () => {
      const config: GameConfig = { boardSize: 3, numMines: 2 };
      const board = createBoard(config, { x: 0, y: 0 });
      
      const mineCount = board.filter(cell => cell.isMine).length;
      expect(mineCount).toBe(2);
    });
  });
});