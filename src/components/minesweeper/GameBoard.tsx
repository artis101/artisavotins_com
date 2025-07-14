import React from "react";
import Cell from "./Cell";
import type { Board, GameConfig } from "../../types/minesweeper";

interface GameBoardProps {
  board: Board;
  config: GameConfig;
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (e: React.MouseEvent, x: number, y: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  config,
  onCellClick,
  onCellRightClick,
}) => {
  const cells =
    board.length > 0
      ? board
      : Array(config.boardSize * config.boardSize).fill(null);

  return (
    <div className="minesweeper-game-board">
      <div
        className="minesweeper-game-grid"
        style={{
          gridTemplateColumns: `repeat(${config.boardSize}, 24px)`,
        }}
      >
        {cells.map((cell, index) => {
          const x = index % config.boardSize;
          const y = Math.floor(index / config.boardSize);
          return (
            <Cell
              key={index}
              cell={cell}
              onCellClick={onCellClick}
              onCellRightClick={onCellRightClick}
              x={x}
              y={y}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
