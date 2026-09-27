"use client";

// Controllers
import { useGameController } from "@/core/controllers";
// Components
import Cell from "./cell";

export default function Board() {
  const board = useGameController((state) => state.board);

  return (
    <div className="@container size-[min(90rem,100dvh,calc(100vw_-_30rem))] shrink-0 max-lg:size-[min(90rem,calc(100vw_-_2rem))]">
      <div
        onContextMenu={(event) => event.preventDefault()}
        className="h-full w-full p-[0.2rem] grid bg-background touch-manipulation select-none"
        // A cell's text, border and sunk shadow are in em, so this one size scales the whole cell with the board
        style={{ gridTemplateColumns: `repeat(${board.length}, 1fr)`, gridTemplateRows: `repeat(${board.length}, 1fr)`, fontSize: `${36 / board.length}cqw` }}
      >
        {board.map((cells, row) => cells.map((cell, column) => <Cell key={`${row}-${column}`} cell={cell} row={row} column={column} />))}
      </div>
    </div>
  );
}
