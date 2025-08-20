import type { Board, Cell, Position, GameConfig } from "../types/minesweeper";

import type { Board, Cell, Position, GameConfig } from "../types/minesweeper";

const initializeEmptyBoard = (boardSize: number): Board => {
  return Array(boardSize * boardSize)
    .fill(null)
    .map((_, index) => {
      const x = index % boardSize;
      const y = Math.floor(index / boardSize);
      return {
        x,
        y,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      };
    });
};

export const placeMines = (board: Board, config: GameConfig, firstClick: Position): void => {
  const { boardSize, numMines } = config;
  if (firstClick.x === -1 && firstClick.y === -1) {
    // Don't place mines
    return;
  }
  const firstClickIndex = firstClick.y * boardSize + firstClick.x;
  const possibleMineLocations = Array.from(
    { length: boardSize * boardSize },
    (_, i) => i
  ).filter((i) => i !== firstClickIndex);

  // Fisher-Yates shuffle
  for (let i = possibleMineLocations.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [possibleMineLocations[i], possibleMineLocations[j]] = [
      possibleMineLocations[j],
      possibleMineLocations[i],
    ];
  }

  // Place mines
  for (let i = 0; i < numMines; i++) {
    const mineIndex = possibleMineLocations[i];
    board[mineIndex].isMine = true;
  }
};

export const calculateAdjacentMines = (board: Board, boardSize: number): void => {
  for (let i = 0; i < board.length; i++) {
    if (!board[i].isMine) {
      board[i].adjacentMines = getAdjacentMines(
        board,
        board[i].x,
        board[i].y,
        boardSize
      );
    }
  }
};

export const createBoard = (
  config: GameConfig,
  firstClick: Position
): Board => {
  const newBoard = initializeEmptyBoard(config.boardSize);
  placeMines(newBoard, config, firstClick);
  calculateAdjacentMines(newBoard, config.boardSize);
  return newBoard;
};

export const getAdjacentCells = (
  board: Board,
  x: number,
  y: number,
  boardSize: number
): Cell[] => {
  const adjacentCells: Cell[] = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newX = x + i;
      const newY = y + j;
      if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize) {
        const index = newY * boardSize + newX;
        adjacentCells.push(board[index]);
      }
    }
  }
  return adjacentCells;
};

export const getAdjacentMines = (
  board: Board,
  x: number,
  y: number,
  boardSize: number
): number => {
  return getAdjacentCells(board, x, y, boardSize).filter((cell) => cell.isMine)
    .length;
};

export const revealCell = (
  board: Board,
  x: number,
  y: number,
  boardSize: number
): void => {
  const index = y * boardSize + x;
  const cell = board[index];

  if (cell.isRevealed || cell.isFlagged) {
    return;
  }

  cell.isRevealed = true;

  if (cell.adjacentMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newX = x + i;
        const newY = y + j;
        if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize) {
          revealCell(board, newX, newY, boardSize);
        }
      }
    }
  }
};

export const revealAllMines = (board: Board): void => {
  for (let i = 0; i < board.length; i++) {
    if (board[i].isMine) {
      board[i].isRevealed = true;
    }
  }
};

export const checkWinCondition = (board: Board): boolean => {
  for (let i = 0; i < board.length; i++) {
    const cell = board[i];
    if (!cell.isMine && !cell.isRevealed) {
      return false;
    }
  }
  return true;
};

export const getCellIndex = (
  x: number,
  y: number,
  boardSize: number
): number => {
  return y * boardSize + x;
};

export const getPositionFromIndex = (
  index: number,
  boardSize: number
): Position => {
  return {
    x: index % boardSize,
    y: Math.floor(index / boardSize),
  };
};
