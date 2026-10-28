"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "site-theme";

/**
 * Toggles the public site's dark mode by adding `dark` to <html>.
 * The class is removed on unmount so the admin area (which has its own theme) is unaffected.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // storage unavailable
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ? stored === "dark" : prefersDark;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(initial);
    return () => document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function toggle() {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // storage unavailable
    }
  }

  return (
    <button
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-primary dark:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors ${className}`}
      onClick={toggle}
      type="button"
    >
      <span className="material-symbols-outlined text-[20px]">{dark ? "light_mode" : "dark_mode"}</span>
    </button>
  );
}
