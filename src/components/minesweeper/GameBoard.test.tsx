import React from 'react';
import { render, screen } from '@testing-library/react';
import GameBoard from './GameBoard';
import { DIFFICULTIES } from '../../constants/minesweeper';

describe('GameBoard', () => {
  const board = Array(100).fill(null).map((_, index) => ({
    x: index % 10,
    y: Math.floor(index / 10),
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    adjacentMines: 0,
  }));

  it('should render the correct number of cells', () => {
    render(
      <GameBoard
        board={board}
        config={DIFFICULTIES.easy}
        onCellClick={() => {}}
        onCellRightClick={() => {}}
        onCellMouseDown={() => {}}
        disabled={false}
      />
    );

    expect(screen.getAllByRole('button')).toHaveLength(100);
  });
});
