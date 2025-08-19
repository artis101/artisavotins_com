import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cell from './Cell';
import { vi } from 'vitest';

describe('Cell', () => {
  const cell = {
    x: 0,
    y: 0,
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    adjacentMines: 0,
  };

  it('should render a hidden cell', () => {
    render(
      <Cell
        cell={cell}
        onCellClick={() => {}}
        onCellRightClick={() => {}}
        onCellMouseDown={() => {}}
        x={0}
        y={0}
        disabled={false}
      />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render a revealed cell with adjacent mines', () => {
    const revealedCell = { ...cell, isRevealed: true, adjacentMines: 2 };
    render(
      <Cell
        cell={revealedCell}
        onCellClick={() => {}}
        onCellRightClick={() => {}}
        onCellMouseDown={() => {}}
        x={0}
        y={0}
        disabled={false}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render a flagged cell', () => {
    const flaggedCell = { ...cell, isFlagged: true };
    render(
      <Cell
        cell={flaggedCell}
        onCellClick={() => {}}
        onCellRightClick={() => {}}
        onCellMouseDown={() => {}}
        x={0}
        y={0}
        disabled={false}
      />
    );

    expect(screen.getByText('🚩')).toBeInTheDocument();
  });

  it('should render a mine', () => {
    const mineCell = { ...cell, isMine: true, isRevealed: true };
    render(
      <Cell
        cell={mineCell}
        onCellClick={() => {}}
        onCellRightClick={() => {}}
        onCellMouseDown={() => {}}
        x={0}
        y={0}
        disabled={false}
      />
    );

    expect(screen.getByText('💣')).toBeInTheDocument();
  });

  it('should call the correct handlers on click', () => {
    const onCellClick = vi.fn();
    const onCellRightClick = vi.fn();
    const onCellMouseDown = vi.fn();

    render(
      <Cell
        cell={cell}
        onCellClick={onCellClick}
        onCellRightClick={onCellRightClick}
        onCellMouseDown={onCellMouseDown}
        x={0}
        y={0}
        disabled={false}
      />
    );

    const cellElement = screen.getByRole('button');
    fireEvent.click(cellElement);
    expect(onCellClick).toHaveBeenCalledWith(0, 0);

    fireEvent.contextMenu(cellElement);
    expect(onCellRightClick).toHaveBeenCalled();

    fireEvent.mouseDown(cellElement, { button: 1 });
    expect(onCellMouseDown).toHaveBeenCalled();
  });
});
