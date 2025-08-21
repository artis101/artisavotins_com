import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DifficultySelector from './DifficultySelector';

describe('DifficultySelector', () => {
  it('should render all difficulty buttons', () => {
    render(<DifficultySelector onSelectDifficulty={vi.fn()} />);

    expect(screen.getByText('Trivial')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('should call onSelectDifficulty when a difficulty is clicked', () => {
    const onSelectDifficulty = vi.fn();
    render(<DifficultySelector onSelectDifficulty={onSelectDifficulty} />);

    const hardButton = screen.getByText('Hard');
    fireEvent.click(hardButton);

    expect(onSelectDifficulty).toHaveBeenCalledWith('hard');
  });

  it('should call onSelectDifficulty for any difficulty button', () => {
    const onSelectDifficulty = vi.fn();
    render(<DifficultySelector onSelectDifficulty={onSelectDifficulty} />);

    const trivialButton = screen.getByText('Trivial');
    fireEvent.click(trivialButton);

    expect(onSelectDifficulty).toHaveBeenCalledWith('trivial');
  });
});