export type Cell = { isMine: boolean; isOpen: boolean; isFlagged: boolean; count: number };

// board[row][column]; every board is square.
export type Board = Cell[][];

export type GameStatus = "ready" | "playing" | "won" | "lost";

export const DIFFICULTIES = {
  easy: { label: "Easy", size: 9, mines: 10 },
  medium: { label: "Medium", size: 18, mines: 40 },
  hard: { label: "Hard", size: 24, mines: 99 },
};

export type Difficulty = keyof typeof DIFFICULTIES;
