// Next
import { create } from "zustand";
// Controllers
import { useSettingsController } from "./settings_controller";
// Models
import { DIFFICULTIES, type Board, type Difficulty, type GameStatus } from "@/core/models";
// Utils
import { chord, createBoard, openFrom, placeMines } from "@/utils/minesweeper";

type GameController = {
  difficulty: Difficulty;
  board: Board;
  status: GameStatus;
  // Bumped on every new game, so closing the result hides it for that game only
  game: number;
  startedAt: number | null;
  seconds: number;
  isNewBest: boolean;
  reveal: (row: number, column: number) => void;
  toggleFlag: (row: number, column: number) => void;
  restart: (difficulty?: Difficulty) => void;
  tick: () => void;
};

export const useGameController = create<GameController>()((set, get) => ({
  difficulty: "medium",
  board: createBoard(DIFFICULTIES.medium.size),
  status: "ready",
  game: 0,
  startedAt: null,
  seconds: 0,
  isNewBest: false,
  reveal: (row, column) => {
    const { board, status, difficulty, startedAt } = get();
    const cell = board[row][column];

    if (status === "won" || status === "lost" || cell.isFlagged) return;

    const armed = status === "ready" ? placeMines(board, DIFFICULTIES[difficulty].mines, row, column) : board;
    const next = cell.isOpen ? chord(armed, row, column) : openFrom(armed, row, column);
    const start = startedAt ?? Date.now();
    const seconds = Math.floor((Date.now() - start) / 1000);
    const isLost = next.some((cells) => cells.some((cell) => cell.isOpen && cell.isMine));
    const isWon = !isLost && next.every((cells) => cells.every((cell) => cell.isMine || cell.isOpen));

    if (!isLost && !isWon) return set({ board: next, status: "playing", startedAt: start });

    const { stats, recordGame } = useSettingsController.getState();
    const best = stats[difficulty].best;
    recordGame(difficulty, isWon, seconds);

    if (isLost) return set({ board: next, status: "lost", startedAt: start, seconds });

    set({
      board: next.map((cells) => cells.map((cell) => (cell.isMine ? { ...cell, isFlagged: true } : cell))),
      status: "won",
      startedAt: start,
      seconds,
      isNewBest: best === null || seconds < best,
    });
  },
  toggleFlag: (row, column) => {
    const { board, status } = get();

    if (status === "won" || status === "lost" || board[row][column].isOpen) return;

    set({ board: board.map((cells, rowIndex) => (rowIndex !== row ? cells : cells.map((cell, columnIndex) => (columnIndex !== column ? cell : { ...cell, isFlagged: !cell.isFlagged })))) });
  },
  restart: (difficulty = get().difficulty) =>
    set((state) => ({ difficulty, board: createBoard(DIFFICULTIES[difficulty].size), status: "ready", game: state.game + 1, startedAt: null, seconds: 0, isNewBest: false })),
  tick: () => {
    const { status, startedAt } = get();

    if (status !== "playing" || !startedAt) return;

    set({ seconds: Math.floor((Date.now() - startedAt) / 1000) });
  },
}));
