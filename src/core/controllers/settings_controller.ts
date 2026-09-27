// Next
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
// Models
import { DIFFICULTIES, type Difficulty, type DifficultyStats } from "@/core/models";

type SettingsController = {
  difficulty: Difficulty;
  stats: Record<Difficulty, DifficultyStats>;
  isHydrated: boolean;
  setDifficulty: (difficulty: Difficulty) => void;
  recordGame: (difficulty: Difficulty, isWin: boolean, seconds: number) => void;
  setIsHydrated: (isHydrated: boolean) => void;
};

const EMPTY_STATS = Object.fromEntries(Object.keys(DIFFICULTIES).map((difficulty) => [difficulty, { best: null, wins: 0, played: 0 }])) as Record<Difficulty, DifficultyStats>;

export const useSettingsController = create<SettingsController>()(
  persist(
    (set) => ({
      difficulty: "medium",
      stats: EMPTY_STATS,
      isHydrated: false,
      setDifficulty: (difficulty) => set({ difficulty }),
      recordGame: (difficulty, isWin, seconds) =>
        set((state) => {
          const { best, wins, played } = state.stats[difficulty];

          return { stats: { ...state.stats, [difficulty]: { best: isWin && (best === null || seconds < best) ? seconds : best, wins: wins + Number(isWin), played: played + 1 } } };
        }),
      setIsHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: "minesweeper_settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ difficulty: state.difficulty, stats: state.stats }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => state?.setIsHydrated(true),
      // Nothing is saved on a first visit; a board added later has no stats, and a removed one must not stay picked
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<SettingsController>;

        return { ...current, stats: { ...current.stats, ...saved.stats }, difficulty: saved.difficulty && saved.difficulty in DIFFICULTIES ? saved.difficulty : current.difficulty };
      },
    }
  )
);
