"use client";

// Next
import { useRef } from "react";
// Controllers
import { useGameController } from "@/core/controllers";
// Models
import type { Cell as CellState } from "@/core/models";
// Icons, Font Awesome on purpose: Material has no mine, and these are the board's own glyphs
import { FaBomb, FaFlag } from "react-icons/fa";

const NUMBER_COLORS = ["", "text-number-1", "text-number-2", "text-number-3", "text-number-4", "text-number-5", "text-number-6", "text-number-7", "text-number-8"];
const CELL = "h-full w-full flex items-center justify-center rounded-[0.444em] border-[0.111em] border-background font-bold";
const LONG_PRESS = 400;

export default function Cell({ cell, row, column }: { cell: CellState; row: number; column: number }) {
  const status = useGameController((state) => state.status);
  const reveal = useGameController((state) => state.reveal);
  const toggleFlag = useGameController((state) => state.toggleFlag);
  // Touch has no right click: holding a cell flags it, and the click that follows the hold is dropped
  const press = useRef({ timer: 0, isLong: false });

  const startPress = (event: React.PointerEvent) => {
    if (event.pointerType !== "touch") return;

    press.current.isLong = false;
    press.current.timer = window.setTimeout(() => {
      press.current.isLong = true;
      toggleFlag(row, column);
    }, LONG_PRESS);
  };

  const endPress = () => window.clearTimeout(press.current.timer);

  const open = () => {
    if (press.current.isLong) {
      press.current.isLong = false;
      return;
    }

    reveal(row, column);
  };

  // Android also fires contextmenu at the end of a hold, which the timer has already turned into a flag
  const flag = (event: React.MouseEvent) => {
    event.preventDefault();
    if (press.current.isLong) return;

    toggleFlag(row, column);
  };

  const handlers = { onClick: open, onContextMenu: flag, onPointerDown: startPress, onPointerUp: endPress, onPointerLeave: endPress, onPointerCancel: endPress };

  if (cell.isMine && status === "lost") {
    return (
      <div {...handlers} className={`${CELL} bg-mine text-action`}>
        <FaBomb />
      </div>
    );
  }

  if (cell.isOpen) {
    return (
      <div {...handlers} className={`${CELL} bg-background shadow-sunk ${NUMBER_COLORS[cell.count]}`}>
        {cell.count || ""}
      </div>
    );
  }

  return (
    <div {...handlers} className={`${CELL} bg-cell hover:bg-cell-hover`}>
      {cell.isFlagged && <FaFlag className="text-flag" />}
    </div>
  );
}
