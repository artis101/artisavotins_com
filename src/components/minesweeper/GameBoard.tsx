import React from "react";
import Cell from "./Cell";
import type { Board, GameConfig } from "../../types/minesweeper";
import styles from "../../styles/minesweeper.module.css";

interface GameBoardProps {
  board: Board;
  config: GameConfig;
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (e: React.MouseEvent, x: number, y: number) => void;
  onCellMouseDown: (e: React.MouseEvent, x: number, y: number) => void;
  disabled: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, config, onCellClick, onCellRightClick, onCellMouseDown, disabled }) => {
  const cells =
    board.length > 0
      ? board
      : Array(config.boardSize * config.boardSize).fill(null);

  return (
    <div className={styles.minesweeperGameBoard}>
      <div
        className={styles.minesweeperGameGrid}
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
              onCellMouseDown={onCellMouseDown}
              x={x}
              y={y}
              disabled={disabled}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
