"use client";

// Next
import { useEffect } from "react";
import Image from "next/image";
// Controllers
import { useGameController, useSettingsController } from "@/core/controllers";
// Models
import { DIFFICULTIES } from "@/core/models";
// Components
import Board from "./_components/board";
import GamePanel from "./_components/game_panel";
// Utils
import { formatTime } from "@/utils/format";
// Icons
import { FaBomb } from "react-icons/fa";
import { MdOutlineGridOn } from "react-icons/md";
import type { IconType } from "react-icons";

const STATUS_TEXT = {
  ready: "The first click is always safe",
  playing: "Right click or hold a cell to flag it",
  won: "Board cleared",
  lost: "You hit a mine",
};

const PILL = "h-[5.4rem] shrink-0 flex items-center justify-center gap-[0.8rem] rounded-[1.6rem] text-[2.2rem] font-extrabold tabular-nums max-lg:h-[4.6rem] max-lg:text-[1.8rem]";

export default function HomePage() {
  const board = useGameController((state) => state.board);
  const difficulty = useGameController((state) => state.difficulty);
  const status = useGameController((state) => state.status);
  const seconds = useGameController((state) => state.seconds);
  const restart = useGameController((state) => state.restart);
  const tick = useGameController((state) => state.tick);
  const isHydrated = useSettingsController((state) => state.isHydrated);

  const { label, size, mines } = DIFFICULTIES[difficulty];
  const cells = board.flat();
  const flags = cells.filter((cell) => cell.isFlagged).length;
  const cleared = Math.floor((cells.filter((cell) => cell.isOpen && !cell.isMine).length / (size * size - mines)) * 100);
  const isRunning = status === "playing";

  useEffect(() => {
    const interval = setInterval(tick, 250);

    return () => clearInterval(interval);
  }, [tick]);

  // A visit starts on the board picked last time, once the saved settings are read
  useEffect(() => {
    if (isHydrated) restart(useSettingsController.getState().difficulty);
  }, [isHydrated, restart]);

  // The saved board is only known once the settings rehydrate, a frame after mount
  if (!isHydrated) return null;

  const buildRailTile = (Icon: IconType, tileLabel: string) => (
    <div className="h-[5.6rem] w-[5.6rem] flex flex-col items-center justify-center gap-[0.3rem] rounded-[1.8rem] bg-surface shadow-raise">
      <Icon size={18} />
      <span className="text-[1rem] font-extrabold tracking-[0.05rem] text-meta">{tileLabel}</span>
    </div>
  );

  return (
    <div className="h-dvh w-full px-[4rem] py-[2.8rem] flex gap-[3.2rem] bg-background max-lg:h-auto max-lg:min-h-dvh max-lg:px-[1.6rem] max-lg:py-[1.6rem] max-lg:flex-col max-lg:items-center max-lg:gap-[2.4rem]">
      <div className="w-[7.2rem] shrink-0 flex flex-col items-center gap-[1.6rem] max-lg:hidden">
        <div className="h-[5.6rem] w-[5.6rem] flex items-center justify-center rounded-[1.8rem] bg-tile shadow-raise">
          <Image src="/logo/icon.svg" alt="Minesweeper" width={40} height={40} priority />
        </div>
        <span className="my-[0.6rem] h-px w-[3.2rem] bg-line" />
        {buildRailTile(MdOutlineGridOn, `${size}×${size}`)}
        {buildRailTile(FaBomb, String(mines))}
      </div>

      <div className="min-w-0 flex-1 flex items-center justify-center max-lg:w-full max-lg:flex-none">
        <div className="w-fit flex flex-col gap-[2rem] max-lg:w-full">
          <div className="flex items-center justify-between gap-[1.6rem] max-lg:flex-col max-lg:items-stretch">
            <div className="min-w-0 flex items-center gap-[1.4rem]">
              <div className="h-[5.2rem] w-[5.2rem] shrink-0 flex items-center justify-center rounded-[1.6rem] bg-tile shadow-raise max-lg:h-[4.6rem] max-lg:w-[4.6rem]">
                <MdOutlineGridOn size={22} />
              </div>
              <div className="min-w-0 flex flex-col gap-[0.2rem]">
                <h1 className="truncate text-[1.7rem] font-extrabold">
                  Minesweeper<span className="font-bold text-meta"> · {label}</span>
                </h1>
                <span className="truncate text-[1.3rem] text-meta">{STATUS_TEXT[status]}</span>
              </div>
            </div>

            <div className="flex gap-[1.2rem]">
              <div title="Mines left" className={`${PILL} w-[11.2rem] bg-background text-meta shadow-inset max-lg:w-auto max-lg:flex-1`}>
                <FaBomb size={16} />
                {mines - flags}
              </div>
              <div title="Time" className={`${PILL} w-[12.4rem] max-lg:w-auto max-lg:flex-1 ${isRunning ? "bg-action text-on-action shadow-raise" : "bg-background text-meta shadow-inset"}`}>
                {isRunning && <span className="h-[0.8rem] w-[0.8rem] rounded-full bg-accent" />}
                {formatTime(seconds)}
              </div>
            </div>
          </div>

          <Board />

          <div className="flex items-center gap-[1.6rem]">
            <span className="label shrink-0">Cleared</span>
            <div className="h-[1.2rem] min-w-0 flex-1 overflow-hidden rounded-full bg-background shadow-inset">
              <div className="h-full rounded-full bg-action transition-[width] duration-300" style={{ width: `${cleared}%` }} />
            </div>
            <span className="w-[4.8rem] shrink-0 text-right text-[1.5rem] font-extrabold tabular-nums">{cleared}%</span>
          </div>
        </div>
      </div>

      <GamePanel />
    </div>
  );
}
