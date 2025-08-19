import React from "react";
import type { GameState } from "../../types/minesweeper";
import styles from "../../styles/minesweeper.module.css";

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
    <div className={styles.minesweeperStatusPanel}>
      <div className={styles.minesweeperDigitalDisplay}>
        {String(flags).padStart(3, "0")}
      </div>
      <button className={styles.minesweeperSmileyButton} onClick={onReset}>
        {getSmileyEmoji(gameState)}
      </button>
      <div className={styles.minesweeperDigitalDisplay}>
        {String(time).padStart(3, "0")}
      </div>
    </div>
  );
};

export default StatusPanel;
