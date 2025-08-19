import React from "react";
import type { Cell as CellType } from "../../types/minesweeper";
import styles from "../../styles/minesweeper.module.css";

interface CellProps {
  cell: CellType | null;
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (e: React.MouseEvent, x: number, y: number) => void;
  onCellMouseDown: (e: React.MouseEvent, x: number, y: number) => void;
  x: number;
  y: number;
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
  let className = styles.minesweeperCell;

  if (!cell) {
    return `${className} ${styles.minesweeperCellHidden}`;
  }

  if (cell.isRevealed) {
    className += ` ${styles.minesweeperCellRevealed}`;
    if (cell.isMine) {
      className += ` ${styles.minesweeperCellMine}`;
      if (cell.isLosingMine) {
        className += ` ${styles.minesweeperCellLosingMine}`;
      }
    } else if (cell.adjacentMines > 0) {
      className += ` ${styles[`minesweeperCellAdjacent${cell.adjacentMines}`]}`;
    }
  } else {
    className += ` ${styles.minesweeperCellHidden}`;
  }

  return className;
};

const Cell: React.FC<CellProps> = ({
  cell,
  onCellClick,
  onCellRightClick,
  onCellMouseDown,
  x,
  y,
  disabled,
}) => {
  const handleClick = () => {
    if (disabled) return;
    onCellClick(x, y);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (disabled) return;
    onCellRightClick(e, x, y);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    onCellMouseDown(e, x, y);
  };

  return (
    <div
      role="button"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      className={getCellClassName(cell)}
    >
      {getCellContent(cell)}
    </div>
  );
};

export default Cell;
