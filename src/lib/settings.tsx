import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type FontSize = "sm" | "md" | "lg";
type SettingsCtx = {
  dark: boolean;
  setDark: (v: boolean) => void;
  fontSize: FontSize;
  setFontSize: (v: FontSize) => void;
};

const Ctx = createContext<SettingsCtx | null>(null);
const KEY = "lira-settings-v1";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("md");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setDark(!!s.dark);
        if (s.fontSize) setFontSize(s.fontSize);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ dark, fontSize }));
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", dark);
      const px = fontSize === "sm" ? "14px" : fontSize === "lg" ? "18px" : "16px";
      document.documentElement.style.fontSize = px;
    }
  }, [dark, fontSize]);

  return (
    <Ctx.Provider value={{ dark, setDark, fontSize, setFontSize }}>{children}</Ctx.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
