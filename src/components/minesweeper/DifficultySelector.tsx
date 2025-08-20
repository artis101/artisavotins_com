import React from 'react';
import type { Difficulty } from '../../types/difficulty';

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelectDifficulty }) => {
  return (
    <div className="difficulty-selector" style={{ textAlign: 'center', padding: '0 0 10px' }}>
      <button onClick={() => onSelectDifficulty('easy')}>Easy</button>
      <button onClick={() => onSelectDifficulty('medium')}>Medium</button>
      <button onClick={() => onSelectDifficulty('hard')}>Hard</button>
    </div>
  );
};

export default DifficultySelector;
