import { useReducer, useEffect } from "react";
import { produce } from "immer";
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
  flagAllMines,
  revealAllSafeCells,
  checkWinCondition,
  getCellIndex,
  getAdjacentCells,
  placeMines,
  calculateAdjacentMines,
} from "../utils/minesweeper";

type State = {
  board: Board;
  gameState: GameState;
  flags: number;
  config: GameConfig;
};

type Action =
  | { type: "RESET"; payload: GameConfig }
  | { type: "CELL_CLICK"; payload: Position }
  | { type: "CELL_RIGHT_CLICK"; payload: Position }
  | { type: "CHORD_CLICK"; payload: Position };

const initialState = (config: GameConfig): State => ({
  board: [],
  gameState: "playing",
  flags: config.numMines,
    config,
});

const reducer = produce((draft: State, action: Action) => {
  switch (action.type) {
    case "RESET":
      return initialState(action.payload);
    case "CELL_CLICK": {
      if (draft.gameState !== "playing") {
        return;
      }

      if (draft.board.length === 0) {
        draft.board = createBoard(draft.config, action.payload);
      }

      const index = getCellIndex(
        action.payload.x,
        action.payload.y,
        draft.config.boardSize
      );
      const cell = draft.board[index];

      if (cell.isRevealed || cell.isFlagged) {
        return;
      }

      if (cell.isMine) {
        revealAllMines(draft.board);
        draft.gameState = "lost";
        draft.board[index].isLosingMine = true;
        return;
      }

      revealCell(draft.board, action.payload.x, action.payload.y, draft.config.boardSize);

      if (checkWinCondition(draft.board)) {
        draft.gameState = "won";
        flagAllMines(draft.board);
        revealAllSafeCells(draft.board);
        draft.flags = 0; // All mines are now flagged
      }

      break;
    }
    case "CHORD_CLICK": {
      if (draft.gameState !== "playing") {
        return;
      }

      const index = getCellIndex(
        action.payload.x,
        action.payload.y,
        draft.config.boardSize
      );
      const cell = draft.board[index];

      if (!cell.isRevealed || cell.adjacentMines === 0) {
        return;
      }

      const adjacentCells = getAdjacentCells(
        draft.board,
        action.payload.x,
        action.payload.y,
        draft.config.boardSize
      );
      const flaggedCells = adjacentCells.filter((c) => c.isFlagged);

      if (flaggedCells.length === cell.adjacentMines) {
        let hitMine = false;
        adjacentCells.forEach((adjacentCell) => {
          if (!adjacentCell.isFlagged && !adjacentCell.isRevealed && !hitMine) {
            revealCell(
              draft.board,
              adjacentCell.x,
              adjacentCell.y,
              draft.config.boardSize
            );
            if (adjacentCell.isMine) {
              revealAllMines(draft.board);
              draft.gameState = "lost";
              hitMine = true;
            }
          }
        });
        
        if (!hitMine && checkWinCondition(draft.board)) {
          draft.gameState = "won";
          flagAllMines(draft.board);
          draft.flags = 0; // All mines are now flagged
        }
      }

      break;
    }
    case "CELL_RIGHT_CLICK": {
      if (draft.gameState !== "playing" || draft.board.length === 0) {
        return;
      }

      const index = getCellIndex(
        action.payload.x,
        action.payload.y,
        draft.config.boardSize
      );

      if (draft.board[index].isRevealed) {
        return;
      }

      if (draft.board[index].isFlagged) {
        draft.board[index].isFlagged = false;
        draft.flags++;
      } else if (draft.flags > 0) {
        draft.board[index].isFlagged = true;
        draft.flags--;
      }

      // Check win condition after flagging/unflagging
      if (checkWinCondition(draft.board)) {
        draft.gameState = "won";
        flagAllMines(draft.board);
        revealAllSafeCells(draft.board);
        draft.flags = 0; // All mines are now flagged
      }

      break;
    }
  }
});

export const useMinesweeper = (config: GameConfig) => {
  const [state, dispatch] = useReducer(reducer, initialState(config));

  useEffect(() => {
    dispatch({ type: "RESET", payload: config });
  }, [config]);


  const resetGame = (newConfig: GameConfig) => dispatch({ type: "RESET", payload: newConfig });
  const handleCellClick = (x: number, y: number) =>
    dispatch({ type: "CELL_CLICK", payload: { x, y } });
  const handleCellRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    dispatch({ type: "CELL_RIGHT_CLICK", payload: { x, y } });
  };

  const handleCellMouseDown = (e: React.MouseEvent, x: number, y: number) => {
    if (e.button === 1) {
      e.preventDefault();
      dispatch({ type: "CHORD_CLICK", payload: { x, y } });
    }
  };

  return {
    ...state,
    resetGame,
    handleCellClick,
    handleCellRightClick,
    handleCellMouseDown,
  };
};
