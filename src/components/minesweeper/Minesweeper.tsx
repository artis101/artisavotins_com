import React, { useState, useEffect } from "react";
import "../../styles/minesweeper.css";
import "../../styles/components.css";
import GameBoard from "./GameBoard";
import StatusPanel from "./StatusPanel";
import DifficultySelector from "./DifficultySelector";
import type { Difficulty } from "../../types/difficulty";
import { useMinesweeper } from "../../hooks/useMinesweeper";
import { DIFFICULTIES } from "../../constants/minesweeper";

const Minesweeper = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [time, setTime] = useState(0);
  const [shouldResetTimer, setShouldResetTimer] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleSelectDifficulty = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setTime(0);
    setShouldResetTimer(true);
    setHasStarted(false);
  };

  const handleTimeChange = (newTime: number) => {
    setTime(newTime);
  };

  const {
    board,
    gameState,
    flags,
    config,
    handleCellClick,
    handleCellRightClick,
    handleCellMouseDown,
    resetGame,
  } = useMinesweeper(DIFFICULTIES[difficulty]);

  // Reset shouldResetTimer flag after use
  useEffect(() => {
    if (shouldResetTimer) {
      setShouldResetTimer(false);
    }
  }, [shouldResetTimer]);

  // Start timer on first movement
  useEffect(() => {
    if (board.length > 0 && !hasStarted) {
      setHasStarted(true);
    }
  }, [board.length, hasStarted]);

  // Handle reset button
  const handleReset = () => {
    resetGame(DIFFICULTIES[difficulty]);
    setTime(0);
    setShouldResetTimer(true);
    setHasStarted(false);
  };

  return (
    <div className="minesweeper-window">
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">Minesweeper</div>
          <div className="title-bar-controls">
            {/* <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button> */}
            <button
              aria-label="Close"
              onClick={() => (window.location.href = "/")}
            ></button>
          </div>
        </div>
        <div className="window-body">
          <DifficultySelector onSelectDifficulty={handleSelectDifficulty} />
          <StatusPanel
            flags={flags}
            gameState={gameState}
            onReset={handleReset}
            isTimerRunning={gameState === "playing" && board.length > 0 && hasStarted}
            onTimeChange={handleTimeChange}
            shouldResetTimer={shouldResetTimer}
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
    </div>
  );
};

export default Minesweeper;
