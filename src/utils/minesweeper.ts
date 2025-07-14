import type { Board, Cell, Position, GameConfig } from "../types/minesweeper";

export const createBoard = (
  config: GameConfig,
  firstClick: Position
): Board => {
  const { boardSize, numMines } = config;
  const newBoard: Board = Array(boardSize * boardSize)
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

  // Generate mine locations
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
    newBoard[mineIndex].isMine = true;
  }

  // Calculate adjacent mines for each cell
  for (let i = 0; i < newBoard.length; i++) {
    if (!newBoard[i].isMine) {
      newBoard[i].adjacentMines = getAdjacentMines(
        newBoard,
        newBoard[i].x,
        newBoard[i].y,
        boardSize
      );
    }
  }

  return newBoard;
};

export const getAdjacentMines = (
  board: Board,
  x: number,
  y: number,
  boardSize: number
): number => {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newX = x + i;
      const newY = y + j;
      if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize) {
        const index = newY * boardSize + newX;
        if (board[index].isMine) {
          count++;
        }
      }
    }
  }
  return count;
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
