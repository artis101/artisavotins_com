import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusPanel from './StatusPanel';

describe('StatusPanel', () => {
  it('should render the flags', () => {
    render(
      <StatusPanel
        flags={10}
        gameState="playing"
        onReset={() => {}}
        isTimerRunning={false}
        onTimeChange={() => {}}
        shouldResetTimer={false}
      />
    );

    expect(screen.getByText('010')).toBeInTheDocument();
  });

  it('should render the correct smiley based on the game state', () => {
    const { rerender } = render(
      <StatusPanel
        flags={10}
        gameState="playing"
        onReset={() => {}}
        isTimerRunning={false}
        onTimeChange={() => {}}
        shouldResetTimer={false}
      />
    );

    expect(screen.getByText('🙂')).toBeInTheDocument();

    rerender(
      <StatusPanel
        flags={10}
        gameState="won"
        onReset={() => {}}
        isTimerRunning={false}
        onTimeChange={() => {}}
        shouldResetTimer={false}
      />
    );

    expect(screen.getByText('😎')).toBeInTheDocument();

    rerender(
      <StatusPanel
        flags={10}
        gameState="lost"
        onReset={() => {}}
        isTimerRunning={false}
        onTimeChange={() => {}}
        shouldResetTimer={false}
      />
    );

    expect(screen.getByText('😵')).toBeInTheDocument();
  });
});
