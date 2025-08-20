import React from "react";
import type { Board, GameConfig, Cell as CellType } from "../../types/minesweeper";

interface GameBoardProps {
  board: Board;
  config: GameConfig;
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (e: React.MouseEvent, x: number, y: number) => void;
  onCellMouseDown: (e: React.MouseEvent, x: number, y: number) => void;
  disabled: boolean;
}

const getCellContent = (cell: CellType | null): string => {
  if (!cell) return "";
  if (cell.isFlagged) return "🚩";
  if (cell.isRevealed) {
    if (cell.isMine) return "💣";
    if (cell.adjacentMines > 0) return cell.adjacentMines.toString();
  }
  return "";
};

const getCellClassName = (cell: CellType | null): string => {
  let className = "minesweeper-cell";

  if (!cell) {
    return `${className} minesweeper-cell--hidden`;
  }

  if (cell.isRevealed) {
    className += " minesweeper-cell--revealed";
    if (cell.isMine) {
      className += " minesweeper-cell--mine";
      if (cell.isLosingMine) {
        className += " minesweeper-cell--losing-mine";
      }
    } else if (cell.adjacentMines > 0) {
      className += ` minesweeper-cell--adjacent-${cell.adjacentMines}`;
    }
  } else {
    className += " minesweeper-cell--hidden";
  }

  return className;
};

const GameBoard: React.FC<GameBoardProps> = ({ board, config, onCellClick, onCellRightClick, onCellMouseDown, disabled }) => {
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
            <div
              key={index}
              data-testid={`cell-${x}-${y}`}
              role="button"
              onClick={() => onCellClick(x, y)}
              onContextMenu={(e) => onCellRightClick(e, x, y)}
              onMouseDown={(e) => onCellMouseDown(e, x, y)}
              className={getCellClassName(cell)}
            >
              {getCellContent(cell)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;