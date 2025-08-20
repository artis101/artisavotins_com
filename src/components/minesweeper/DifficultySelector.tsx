import React from 'react';
import type { Difficulty } from '../../types/difficulty';
import '../../styles/components.css';

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelectDifficulty }) => {
  return (
    <div className="difficulty-selector">
      <button onClick={() => onSelectDifficulty('easy')}>Easy</button>
      <button onClick={() => onSelectDifficulty('medium')}>Medium</button>
      <button onClick={() => onSelectDifficulty('hard')}>Hard</button>
    </div>
  );
};

export default DifficultySelector;
