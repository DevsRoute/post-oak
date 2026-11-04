import { useEffect, useState } from "react";

export type ThemeChoice = "system" | "light" | "dark";
export type Theme = "light" | "dark";

function resolveSystem(): Theme {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme(): {
  choice: ThemeChoice;
  theme: Theme;
  setChoice: (c: ThemeChoice) => void;
} {
  const [choice, setChoice] = useState<ThemeChoice>(() => {
    try {
      const saved = localStorage.getItem("nl-theme");
      if (saved === "system" || saved === "light" || saved === "dark")
        return saved;
    } catch {
      /* ignore */
    }
    return "system";
  });

  const [systemTheme, setSystemTheme] = useState<Theme>(resolveSystem);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = () => setSystemTheme(resolveSystem());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const theme: Theme = choice === "system" ? systemTheme : choice;

  useEffect(() => {
    if (choice === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", choice);
    }
    try {
      localStorage.setItem("nl-theme", choice);
    } catch {
      /* ignore */
    }
  }, [choice]);

  return { choice, theme, setChoice };
}
