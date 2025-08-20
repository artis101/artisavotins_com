import { describe, it, expect } from 'vitest';
import { DIFFICULTIES } from './minesweeper';

describe('minesweeper constants', () => {
  it('should include all difficulty levels', () => {
    expect(DIFFICULTIES.trivial).toBeDefined();
    expect(DIFFICULTIES.easy).toBeDefined();
    expect(DIFFICULTIES.medium).toBeDefined();
    expect(DIFFICULTIES.hard).toBeDefined();
  });

  it('should have correct trivial difficulty settings', () => {
    expect(DIFFICULTIES.trivial.boardSize).toBe(3);
    expect(DIFFICULTIES.trivial.numMines).toBe(2);
  });

  it('should have correct easy difficulty settings', () => {
    expect(DIFFICULTIES.easy.boardSize).toBe(10);
    expect(DIFFICULTIES.easy.numMines).toBe(10);
  });

  it('should have correct medium difficulty settings', () => {
    expect(DIFFICULTIES.medium.boardSize).toBe(16);
    expect(DIFFICULTIES.medium.numMines).toBe(40);
  });

  it('should have correct hard difficulty settings', () => {
    expect(DIFFICULTIES.hard.boardSize).toBe(24);
    expect(DIFFICULTIES.hard.numMines).toBe(99);
  });
});