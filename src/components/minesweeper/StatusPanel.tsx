import React from "react";
import Timer from "./Timer";
import type { GameState } from "../../types/minesweeper";

interface StatusPanelProps {
  flags: number;
  gameState: GameState;
  onReset: () => void;
  isTimerRunning: boolean;
  onTimeChange: (time: number) => void;
  shouldResetTimer: boolean;
}

const getSmileyEmoji = (gameState: GameState): string => {
  switch (gameState) {
    case "lost":
      return "😵";
    case "won":
      return "😎";
    case "playing":
    default:
      return "🙂";
  }
};

const StatusPanel: React.FC<StatusPanelProps> = ({
  flags,
  gameState,
  onReset,
  isTimerRunning,
  onTimeChange,
  shouldResetTimer,
}) => {
  return (
    <div className="minesweeper-status-panel">
      <div className="minesweeper-digital-display">
        {String(flags).padStart(3, "0")}
      </div>
      <button className="minesweeper-smiley-button" onClick={onReset}>
        {getSmileyEmoji(gameState)}
      </button>
      <Timer 
        isRunning={isTimerRunning} 
        onTimeChange={onTimeChange} 
        shouldReset={shouldResetTimer}
      />
    </div>
  );
};

export default StatusPanel;
