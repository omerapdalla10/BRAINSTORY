"use client";

import { useTransition } from "react";
import { setLanguageAction } from "@/app/lang-actions";
import type { Lang } from "@/lib/i18n";

/** English / Somali switch. The choice is stored in a cookie and the page re-renders in that language. */
export default function LanguageToggle({ lang }: { lang: Lang }) {
  const [pending, startTransition] = useTransition();

  function choose(next: Lang) {
    if (next === lang) return;
    startTransition(async () => {
      await setLanguageAction(next);
    });
  }

  return (
    <div
      aria-label="Language"
      className={`inline-flex h-9 items-center rounded-full bg-slate-200/70 p-0.5 text-[11px] font-bold dark:bg-white/10 ${
        pending ? "opacity-60" : ""
      }`}
      role="group"
    >
      {(["en", "so"] as const).map((code) => (
        <button
          key={code}
          aria-pressed={lang === code}
          className={`h-full rounded-full px-3 uppercase transition-colors ${
            lang === code
              ? "bg-white text-primary shadow-sm dark:bg-slate-700 dark:text-white"
              : "text-slate-500 hover:text-primary dark:hover:text-white"
          }`}
          onClick={() => choose(code)}
          type="button"
        >
          {code}
        </button>
      ))}
    </div>
  );
}
