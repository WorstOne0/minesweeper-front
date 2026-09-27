"use client";

// Controllers
import { useGameController, useSettingsController } from "@/core/controllers";
// Models
import { DIFFICULTIES, type Difficulty } from "@/core/models";
// Utils
import { formatTime } from "@/utils/format";
// Icons
import { FaFlag } from "react-icons/fa";
import { MdOutlineAdsClick, MdOutlineLooksOne, MdOutlineReplay } from "react-icons/md";

const HOW_TO_PLAY = [
  { Icon: MdOutlineAdsClick, text: "Click a cell to open it. The first one is always safe." },
  { Icon: FaFlag, text: "Right click, or hold it on a phone, to flag a mine." },
  { Icon: MdOutlineLooksOne, text: "Click a number whose flags are all placed to open the rest around it." },
];

export default function GamePanel() {
  const difficulty = useGameController((state) => state.difficulty);
  const restart = useGameController((state) => state.restart);
  const stats = useSettingsController((state) => state.stats[difficulty]);
  const setDifficulty = useSettingsController((state) => state.setDifficulty);

  const pickDifficulty = (next: Difficulty) => {
    setDifficulty(next);
    restart(next);
  };

  const buildStat = (label: string, value: string) => (
    <div className="min-w-0 flex-1 px-[1.6rem] py-[1.4rem] flex flex-col gap-[0.8rem] rounded-[1.6rem] bg-surface shadow-inset">
      <span className="label">{label}</span>
      <span className="text-[2.4rem] leading-none font-extrabold tabular-nums">{value}</span>
    </div>
  );

  return (
    <div className="w-[37.2rem] shrink-0 p-[2.4rem] flex flex-col gap-[2.4rem] rounded-card bg-surface shadow-raise-lg max-lg:w-full max-lg:max-w-[64rem]">
      <div className="flex flex-col gap-[1.2rem]">
        <span className="label">Difficulty</span>
        <div className="p-[0.8rem] flex gap-[0.8rem] rounded-[1.8rem] bg-surface shadow-inset">
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map((option) => {
            const isPicked = option === difficulty;
            const { label, size, mines } = DIFFICULTIES[option];

            return (
              <button
                key={option}
                type="button"
                aria-pressed={isPicked}
                onClick={() => pickDifficulty(option)}
                className={`h-[5.6rem] min-w-0 flex-1 flex flex-col items-center justify-center gap-[0.2rem] rounded-[1.2rem] ${isPicked ? "bg-action text-on-action shadow-raise" : "text-meta hover:text-title"}`}
              >
                <span className="text-[1.5rem] font-bold">{label}</span>
                <span className={`text-[1.1rem] font-bold tabular-nums ${isPicked ? "text-accent-on-action" : "text-faint"}`}>
                  {size}×{size} · {mines}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-[1.2rem]">
        <span className="label">Your {DIFFICULTIES[difficulty].label.toLowerCase()} record</span>
        <div className="flex gap-[1.2rem]">
          {buildStat("Best time", stats.best === null ? "–" : formatTime(stats.best))}
          {buildStat("Won", `${stats.wins} / ${stats.played}`)}
        </div>
      </div>

      <div className="flex flex-col gap-[1.4rem]">
        <span className="label">How to play</span>
        {HOW_TO_PLAY.map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-[1.4rem]">
            <span className="h-[4rem] w-[4rem] shrink-0 flex items-center justify-center rounded-[1.2rem] bg-tile shadow-raise">
              <Icon size={16} />
            </span>
            <span className="text-[1.4rem] leading-[1.45] text-soft">{text}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => restart()}
        className="mt-auto h-[5.6rem] flex items-center justify-center gap-[1rem] rounded-[1.8rem] bg-action text-[1.7rem] font-extrabold text-on-action shadow-raise active:shadow-inset"
      >
        <MdOutlineReplay size={20} />
        New game
      </button>
    </div>
  );
}
