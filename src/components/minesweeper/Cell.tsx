import React from "react";
import type { Cell as CellType } from "../../types/minesweeper";

interface CellProps {
  cell: CellType | null;
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (e: React.MouseEvent, x: number, y: number) => void;
  x: number;
  y: number;
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
    } else if (cell.adjacentMines > 0) {
      className += ` minesweeper-cell--adjacent-${cell.adjacentMines}`;
    }
  } else {
    className += " minesweeper-cell--hidden";
  }

  return className;
};

const Cell: React.FC<CellProps> = ({
  cell,
  onCellClick,
  onCellRightClick,
  x,
  y,
}) => {
  return (
    <div
      onClick={() => onCellClick(x, y)}
      onContextMenu={(e) => onCellRightClick(e, x, y)}
      className={getCellClassName(cell)}
    >
      {getCellContent(cell)}
    </div>
  );
};

export default Cell;
