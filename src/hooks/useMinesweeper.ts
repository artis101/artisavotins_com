import { useState, useEffect } from "react";
import type {
  Board,
  GameState,
  GameConfig,
  Position,
} from "../types/minesweeper";
import {
  createBoard,
  revealCell,
  revealAllMines,
  checkWinCondition,
  getCellIndex,
} from "../utils/minesweeper";

export const useMinesweeper = (config: GameConfig) => {
  const [board, setBoard] = useState<Board>([]);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [flags, setFlags] = useState(config.numMines);
  const [time, setTime] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (gameState === "playing" && board.length > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameState, board]);

  const resetGame = () => {
    setBoard([]);
    setGameState("playing");
    setFlags(config.numMines);
    setTime(0);
  };

  const handleCellClick = (x: number, y: number) => {
    if (gameState !== "playing") {
      return;
    }

    let currentBoard = board;
    if (currentBoard.length === 0) {
      currentBoard = createBoard(config, { x, y });
      setBoard(currentBoard);
    }

    const index = getCellIndex(x, y, config.boardSize);
    const cell = currentBoard[index];

    if (cell.isRevealed || cell.isFlagged) {
      return;
    }

    if (cell.isMine) {
      setGameState("lost");
      revealAllMines(currentBoard);
      setBoard([...currentBoard]);
      return;
    }

    const newBoard = [...currentBoard];
    revealCell(newBoard, x, y, config.boardSize);
    setBoard(newBoard);

    if (checkWinCondition(newBoard)) {
      setGameState("won");
    }
  };

  const handleCellRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameState !== "playing" || board.length === 0) {
      return;
    }

    const index = getCellIndex(x, y, config.boardSize);
    const newBoard = [...board];
    const cell = newBoard[index];

    if (cell.isRevealed) {
      return;
    }

    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlags(flags + 1);
    } else if (flags > 0) {
      cell.isFlagged = true;
      setFlags(flags - 1);
    }

    setBoard(newBoard);
  };

  return {
    board,
    gameState,
    flags,
    time,
    handleCellClick,
    handleCellRightClick,
    resetGame,
  };
};
