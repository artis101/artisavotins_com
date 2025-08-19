import { renderHook, act } from '@testing-library/react';
import { useMinesweeper } from './useMinesweeper';
import { DIFFICULTIES } from '../constants/minesweeper';

describe('useMinesweeper', () => {
  it('should initialize with the easy difficulty', () => {
    const { result } = renderHook(() => useMinesweeper(DIFFICULTIES.easy));

    expect(result.current.board.length).toBe(0);
    expect(result.current.gameState).toBe('playing');
    expect(result.current.flags).toBe(DIFFICULTIES.easy.numMines);
  });

  it('should create a board on first click', () => {
    const { result } = renderHook(() => useMinesweeper(DIFFICULTIES.easy));

    act(() => {
      result.current.handleCellClick(0, 0);
    });

    expect(result.current.board.length).toBe(
      DIFFICULTIES.easy.boardSize * DIFFICULTIES.easy.boardSize
    );
  });

  it('should not place a mine on the first click', () => {
    const { result } = renderHook(() => useMinesweeper(DIFFICULTIES.easy));

    act(() => {
      result.current.handleCellClick(0, 0);
    });

    const firstCell = result.current.board[0];
    expect(firstCell.isMine).toBe(false);
  });

  it('should handle a mine click', () => {
    const { result } = renderHook(() => useMinesweeper(DIFFICULTIES.easy));

    act(() => {
      result.current.handleCellClick(0, 0);
    });

    const mineIndex = result.current.board.findIndex((cell) => cell.isMine);
    const mineCell = result.current.board[mineIndex];

    act(() => {
      result.current.handleCellClick(mineCell.x, mineCell.y);
    });

    expect(result.current.gameState).toBe('lost');
  });

    it('should handle flagging a cell', () => {
    const { result } = renderHook(() => useMinesweeper(DIFFICULTIES.easy));

    act(() => {
      result.current.handleCellClick(5, 5);
    });

    act(() => {
      result.current.handleCellRightClick({ preventDefault: () => {} } as React.MouseEvent, 1, 1);
    });

    const cell = result.current.board.find(c => c.x === 1 && c.y === 1);
    expect(cell?.isFlagged).toBe(true);
    expect(result.current.flags).toBe(DIFFICULTIES.easy.numMines - 1);
  });

  it('should handle unflagging a cell', () => {
    const { result } = renderHook(() => useMinesweeper(DIFFICULTIES.easy));

    act(() => {
      result.current.handleCellClick(5, 5);
    });

    act(() => {
      result.current.handleCellRightClick({ preventDefault: () => {} } as React.MouseEvent, 1, 1);
    });

    act(() => {
      result.current.handleCellRightClick({ preventDefault: () => {} } as React.MouseEvent, 1, 1);
    });

    const cell = result.current.board.find(c => c.x === 1 && c.y === 1);
    expect(cell?.isFlagged).toBe(false);
    expect(result.current.flags).toBe(DIFFICULTIES.easy.numMines);
  });
});
