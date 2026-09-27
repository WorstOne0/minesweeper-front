"use client";

// Controllers
import { useGameController } from "@/core/controllers";
// Components
import Cell from "./cell";
import ResultCard from "./result_card";

export default function Board() {
  const board = useGameController((state) => state.board);

  return (
    <div className="relative shrink-0 p-[1.4rem] rounded-[2.2rem] bg-surface shadow-frame">
      {/* Height left after the page padding, both bars, their gaps and this frame; width after the rail and the panel */}
      <div className="@container size-[min(72rem,calc(100vh_-_21rem),calc(100vw_-_61.6rem))] max-lg:size-[calc(100vw_-_6rem)]">
        <div
          onContextMenu={(event) => event.preventDefault()}
          className="h-full w-full p-[0.2rem] grid overflow-hidden rounded-[1.2rem] bg-board touch-manipulation select-none"
          // A cell's text, border and sunk shadow are in em, so this one size scales the whole cell with the board
          style={{ gridTemplateColumns: `repeat(${board.length}, 1fr)`, gridTemplateRows: `repeat(${board.length}, 1fr)`, fontSize: `${36 / board.length}cqw` }}
        >
          {board.map((cells, row) => cells.map((cell, column) => <Cell key={`${row}-${column}`} cell={cell} row={row} column={column} />))}
        </div>
      </div>
      <ResultCard />
    </div>
  );
}
