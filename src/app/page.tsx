"use client";

// Next
import { useEffect, useState } from "react";
// Controllers
import { useGameController } from "@/core/controllers";
// Models
import { DIFFICULTIES, type Difficulty } from "@/core/models";
// Components
import Board from "./_components/board";
// Icons
import { FaBomb } from "react-icons/fa";
import { MdOutlineRefresh, MdOutlineSettings, MdOutlineTimer } from "react-icons/md";
import type { IconType } from "react-icons";

const BLOCK = "py-[7rem] flex flex-col items-center justify-center max-lg:flex-1 max-lg:py-[0.5rem]";
const WELL = "h-[8rem] w-4/5 flex items-center justify-center gap-[1rem] rounded-[0.8rem] shadow-well max-lg:h-[5.6rem] max-lg:w-full";

export default function HomePage() {
  const board = useGameController((state) => state.board);
  const difficulty = useGameController((state) => state.difficulty);
  const status = useGameController((state) => state.status);
  const game = useGameController((state) => state.game);
  const seconds = useGameController((state) => state.seconds);
  const restart = useGameController((state) => state.restart);
  const tick = useGameController((state) => state.tick);

  const [closedGame, setClosedGame] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const flags = board.reduce((total, cells) => total + cells.filter((cell) => cell.isFlagged).length, 0);
  const isResultOpen = (status === "won" || status === "lost") && closedGame !== game;

  useEffect(() => {
    const interval = setInterval(tick, 250);

    return () => clearInterval(interval);
  }, [tick]);

  const pickDifficulty = (next: Difficulty) => {
    setIsMenuOpen(false);
    restart(next);
  };

  const buildStat = (Icon: IconType, title: string, value: string | number) => (
    <div className={BLOCK}>
      <h2 className="py-[1.5rem] flex items-center gap-[1rem] text-[2.2rem] font-bold max-lg:py-[0.8rem] max-lg:text-[1.6rem]">
        <Icon />
        {title}
      </h2>
      <div className={WELL}>
        <span className="font-clock text-[3.2rem] max-lg:text-[2.4rem]">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="h-dvh w-full flex items-center justify-center bg-background max-lg:h-auto max-lg:min-h-dvh max-lg:flex-col max-lg:justify-start max-lg:pb-[1rem]">
      <div className="h-full w-[30rem] flex flex-col max-lg:h-auto max-lg:w-full">
        <div className="h-[10rem] px-[2.5rem] flex items-center justify-between max-lg:h-[6rem]">
          <h1 className="py-[1.5rem] text-[2.2rem] font-bold">Minesweeper</h1>
          <div className="relative">
            <button
              type="button"
              aria-label="Difficulty"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-[3.2rem] w-[3.2rem] flex items-center justify-center rounded-full hover:shadow-raised"
            >
              <MdOutlineSettings size={20} />
            </button>
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 top-[4rem] z-30 w-[22rem] p-[0.8rem] flex flex-col gap-[0.4rem] rounded-[0.8rem] bg-background shadow-raised">
                  {(Object.keys(DIFFICULTIES) as Difficulty[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => pickDifficulty(option)}
                      className={`h-[4.4rem] px-[1.4rem] flex items-center justify-between rounded-[0.6rem] text-[1.6rem] font-bold ${option === difficulty ? "shadow-well" : "text-meta hover:text-action"}`}
                    >
                      {DIFFICULTIES[option].label}
                      <span className="text-[1.3rem] font-normal">
                        {DIFFICULTIES[option].size}×{DIFFICULTIES[option].size} · {DIFFICULTIES[option].mines}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col max-lg:px-[1rem] max-lg:flex-row max-lg:items-end max-lg:gap-[1rem]">
          {buildStat(MdOutlineTimer, "Timer", `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`)}
          {buildStat(FaBomb, "Bombs", DIFFICULTIES[difficulty].mines - flags)}
          <div className={BLOCK}>
            <button type="button" onClick={() => restart()} className={`${WELL} text-[2.2rem] hover:shadow-raised max-lg:text-[1.8rem]`}>
              <MdOutlineRefresh />
              Retry
            </button>
          </div>
        </div>
      </div>

      <Board />

      {isResultOpen && (
        <div onClick={() => setClosedGame(game)} className="fixed inset-0 z-40 flex items-center justify-center bg-overlay">
          <div className="h-[30rem] w-full px-[2rem] flex flex-col items-center justify-center bg-banner text-center text-on-action select-none">
            <h2 className="py-[1.5rem] text-[6.4rem] font-bold leading-tight max-lg:text-[3.6rem]">{status === "won" ? "You Won !!" : "You Lost !! Better Luck Next Time"}</h2>
            <p className="text-[1.8rem] font-bold">Click anywhere to exit</p>
          </div>
        </div>
      )}
    </div>
  );
}
