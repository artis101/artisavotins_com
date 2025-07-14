import React from "react";
import GameBoard from "./minesweeper/GameBoard";
import StatusPanel from "./minesweeper/StatusPanel";
import { useMinesweeper } from "../hooks/useMinesweeper";
import "../styles/minesweeper.css";

const BOARD_SIZE = 10;
const NUM_MINES = 10;

const Minesweeper = () => {
  const config = { boardSize: BOARD_SIZE, numMines: NUM_MINES };
  const {
    board,
    gameState,
    flags,
    time,
    handleCellClick,
    handleCellRightClick,
    resetGame,
  } = useMinesweeper(config);

  return (
    <div className="window" style={{ margin: "20px", maxWidth: "fit-content" }}>
      <div className="title-bar" style={{ padding: "2px 4px" }}>
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
        <StatusPanel
          flags={flags}
          time={time}
          gameState={gameState}
          onReset={resetGame}
        />
        <GameBoard
          board={board}
          config={config}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
        />
      </div>
    </div>
  );
};

export default Minesweeper;
