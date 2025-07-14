export interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export type Board = Cell[];

export type GameState = "playing" | "won" | "lost";

export interface GameConfig {
  boardSize: number;
  numMines: number;
}

export interface Position {
  x: number;
  y: number;
}
