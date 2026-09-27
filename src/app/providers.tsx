"use client";

// Next
import { useEffect } from "react";
// Controllers
import { useSettingsController } from "@/core/controllers";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useSettingsController.persist.rehydrate();
  }, []);

  return children;
}
