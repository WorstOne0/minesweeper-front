// Models
import type { Board } from "@/core/models";

const STEPS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const copyBoard = (board: Board) => board.map((cells) => cells.map((cell) => ({ ...cell })));

export const createBoard = (size: number): Board =>
  Array.from({ length: size }, () => Array.from({ length: size }, () => ({ isMine: false, isOpen: false, isFlagged: false, count: 0 })));

export const neighboursOf = (board: Board, row: number, column: number) =>
  STEPS.map(([rowStep, columnStep]) => [row + rowStep, column + columnStep]).filter(([neighbourRow, neighbourColumn]) => board[neighbourRow]?.[neighbourColumn]);

// Mines go down on the first click, never on that cell or around it, so a game always opens with room to play.
export const placeMines = (board: Board, mines: number, safeRow: number, safeColumn: number) => {
  const next = copyBoard(board);
  const safe = new Set([[safeRow, safeColumn], ...neighboursOf(board, safeRow, safeColumn)].map(([row, column]) => `${row},${column}`));
  const free = next.flatMap((cells, row) => cells.map((_, column) => [row, column])).filter(([row, column]) => !safe.has(`${row},${column}`));

  for (let placed = 0; placed < mines && free.length; placed++) {
    const [row, column] = free.splice(Math.floor(Math.random() * free.length), 1)[0];
    next[row][column].isMine = true;
  }

  next.forEach((cells, row) => cells.forEach((cell, column) => (cell.count = neighboursOf(next, row, column).filter(([mineRow, mineColumn]) => next[mineRow][mineColumn].isMine).length)));
  return next;
};

// A blank cell keeps opening its neighbours; flagged cells stay shut.
export const openFrom = (board: Board, row: number, column: number) => {
  const next = copyBoard(board);
  const queue = [[row, column]];

  while (queue.length) {
    const [currentRow, currentColumn] = queue.pop()!;
    const cell = next[currentRow][currentColumn];
    if (cell.isOpen || cell.isFlagged) continue;

    cell.isOpen = true;
    if (!cell.isMine && !cell.count) queue.push(...neighboursOf(next, currentRow, currentColumn));
  }

  return next;
};

// Clicking an open number with as many flags around it opens every other neighbour.
export const chord = (board: Board, row: number, column: number) => {
  const around = neighboursOf(board, row, column);
  const flags = around.filter(([flagRow, flagColumn]) => board[flagRow][flagColumn].isFlagged).length;

  if (!board[row][column].count || flags !== board[row][column].count) return board;

  return around.reduce((next, [neighbourRow, neighbourColumn]) => openFrom(next, neighbourRow, neighbourColumn), board);
};
