"use client";

// Next
import { useState } from "react";
// Controllers
import { useGameController, useSettingsController } from "@/core/controllers";
// Models
import { DIFFICULTIES } from "@/core/models";
// Utils
import { formatTime } from "@/utils/format";
// Icons
import { FaBomb } from "react-icons/fa";
import { MdOutlineClose, MdOutlineEmojiEvents, MdOutlineReplay, MdOutlineVisibility } from "react-icons/md";

// A loss waits longer, so the revealed mines are seen before the card covers them
const OUTCOMES = {
  won: { title: "You won", fill: "bg-win", halo: "ring-win/25", delay: "[animation-delay:300ms]" },
  lost: { title: "You lost", fill: "bg-loss", halo: "ring-loss/25", delay: "[animation-delay:900ms]" },
};

const BUTTON = "h-[5.2rem] min-w-0 flex-1 flex items-center justify-center gap-[1rem] rounded-[1.6rem] text-[1.6rem] font-extrabold active:shadow-inset";

export default function ResultCard() {
  const status = useGameController((state) => state.status);
  const game = useGameController((state) => state.game);
  const board = useGameController((state) => state.board);
  const difficulty = useGameController((state) => state.difficulty);
  const seconds = useGameController((state) => state.seconds);
  const isNewBest = useGameController((state) => state.isNewBest);
  const restart = useGameController((state) => state.restart);
  const best = useSettingsController((state) => state.stats[difficulty].best);

  const [closedGame, setClosedGame] = useState<number | null>(null);

  if ((status !== "won" && status !== "lost") || closedGame === game) return null;

  const outcome = OUTCOMES[status];
  const { label, size, mines } = DIFFICULTIES[difficulty];
  const cleared = Math.floor((board.flat().filter((cell) => cell.isOpen && !cell.isMine).length / (size * size - mines)) * 100);

  const buildStat = (statLabel: string, value: string) => (
    <div className="min-w-0 flex-1 flex flex-col items-center gap-[0.6rem]">
      <span className="text-[2.2rem] leading-none font-extrabold tabular-nums">{value}</span>
      <span className="text-[1.1rem] font-extrabold tracking-[0.1rem] text-meta uppercase">{statLabel}</span>
    </div>
  );

  return (
    <div className={`absolute inset-0 z-40 flex items-center justify-center rounded-[2.2rem] bg-overlay animate-result-in ${outcome.delay}`}>
      <div
        role="status"
        className={`relative w-[38rem] max-w-[calc(100%_-_3.2rem)] px-[3.2rem] pt-[3.6rem] pb-[3.2rem] flex flex-col items-center gap-[2.4rem] rounded-card bg-surface shadow-frame animate-result-card ${outcome.delay}`}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setClosedGame(game)}
          className="absolute top-[1.4rem] right-[1.4rem] h-[3.6rem] w-[3.6rem] flex items-center justify-center rounded-[1.2rem] text-meta hover:text-title"
        >
          <MdOutlineClose size={18} />
        </button>

        <span className={`h-[7.2rem] w-[7.2rem] flex items-center justify-center rounded-full ring-[1.2rem] text-white ${outcome.fill} ${outcome.halo}`}>
          {status === "won" ? <MdOutlineEmojiEvents size={34} /> : <FaBomb size={28} />}
        </span>

        <div className="flex flex-col items-center gap-[0.6rem] text-center">
          <span className="text-[3.2rem] leading-tight font-extrabold">{outcome.title}</span>
          <span className="text-[1.5rem] text-meta">{status === "won" ? `${label} cleared in ${formatTime(seconds)}` : `A mine went off after ${formatTime(seconds)}`}</span>
          {isNewBest && <span className="mt-[0.4rem] px-[1.2rem] py-[0.4rem] rounded-full bg-accent/15 text-[1.2rem] font-extrabold tracking-[0.08rem] text-accent uppercase">New best</span>}
        </div>

        <div className="w-full px-[1.6rem] py-[1.8rem] flex items-center rounded-[1.8rem] bg-surface shadow-inset">
          {buildStat("Time", formatTime(seconds))}
          <span className="h-[3.2rem] w-px shrink-0 bg-line" />
          {buildStat("Cleared", `${cleared}%`)}
          <span className="h-[3.2rem] w-px shrink-0 bg-line" />
          {buildStat("Best", best === null ? "–" : formatTime(best))}
        </div>

        <div className="w-full flex gap-[1.2rem]">
          <button type="button" onClick={() => restart()} className={`${BUTTON} bg-action text-on-action shadow-raise`}>
            <MdOutlineReplay size={18} />
            Play again
          </button>
          <button type="button" onClick={() => setClosedGame(game)} className={`${BUTTON} bg-surface shadow-raise`}>
            <MdOutlineVisibility size={18} />
            View board
          </button>
        </div>
      </div>
    </div>
  );
}
