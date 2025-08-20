import React from "react";
import type { GameState } from "../../types/minesweeper";

interface StatusPanelProps {
  flags: number;
  time: number;
  gameState: GameState;
  onReset: () => void;
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
  time,
  gameState,
  onReset,
}) => {
  return (
    <div className="minesweeper-status-panel">
      <div className="minesweeper-digital-display">
        {String(flags).padStart(3, "0")}
      </div>
      <button className="minesweeper-smiley-button" onClick={onReset}>
        {getSmileyEmoji(gameState)}
      </button>
      <div className="minesweeper-digital-display">
        {String(time).padStart(3, "0")}
      </div>
    </div>
  );
};

export default StatusPanel;
