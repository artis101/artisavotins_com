import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusPanel from './StatusPanel';

describe('StatusPanel', () => {
  it('should render the flags and time', () => {
    render(
      <StatusPanel
        flags={10}
        time={20}
        gameState="playing"
        onReset={() => {}}
      />
    );

    expect(screen.getByText('010')).toBeInTheDocument();
    expect(screen.getByText('020')).toBeInTheDocument();
  });

  it('should render the correct smiley based on the game state', () => {
    const { rerender } = render(
      <StatusPanel
        flags={10}
        time={20}
        gameState="playing"
        onReset={() => {}}
      />
    );

    expect(screen.getByText('🙂')).toBeInTheDocument();

    rerender(
      <StatusPanel
        flags={10}
        time={20}
        gameState="won"
        onReset={() => {}}
      />
    );

    expect(screen.getByText('😎')).toBeInTheDocument();

    rerender(
      <StatusPanel
        flags={10}
        time={20}
        gameState="lost"
        onReset={() => {}}
      />
    );

    expect(screen.getByText('😵')).toBeInTheDocument();
  });
});
