import React, { useState } from "react";
import GameBoard from "./minesweeper/GameBoard";
import StatusPanel from "./minesweeper/StatusPanel";
import DifficultySelector from "./minesweeper/DifficultySelector";
import type { Difficulty } from "../types/difficulty";
import { useMinesweeper } from "../hooks/useMinesweeper";
import styles from "../styles/minesweeper.module.css";
import { DIFFICULTIES } from "../constants/minesweeper";

const Minesweeper = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const handleSelectDifficulty = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
  };

  const {
    board,
    gameState,
    flags,
    time,
    config,
    handleCellClick,
    handleCellRightClick,
    handleCellMouseDown,
    resetGame,
  } = useMinesweeper(DIFFICULTIES[difficulty]);

  return (
    <div className={styles.window} style={{ margin: "20px", maxWidth: "fit-content" }}>
      <div className={styles.titleBar} style={{ padding: "2px 4px" }}>
        <div className={styles.titleBarText}>Minesweeper</div>
        <div className={styles.titleBarControls}>
          {/* <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button> */}
          <button
            aria-label="Close"
            onClick={() => (window.location.href = "/")}
          ></button>
        </div>
      </div>
      <div className={styles.windowBody}>
        <DifficultySelector onSelectDifficulty={handleSelectDifficulty} />
        <StatusPanel
          flags={flags}
          time={time}
          gameState={gameState}
          onReset={() => resetGame(DIFFICULTIES[difficulty])}
        />
        <GameBoard
          board={board}
          config={config}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
          onCellMouseDown={handleCellMouseDown}
          disabled={gameState === "won" || gameState === "lost"}
        />
      </div>
    </div>
  );
};

export default Minesweeper;
