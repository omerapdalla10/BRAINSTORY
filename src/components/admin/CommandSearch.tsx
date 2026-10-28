"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Result = { type: string; icon: string; title: string; sub: string; href: string };

type CommandSearchProps = { pages: { href: string; label: string; icon: string }[] };

export default function CommandSearch({ pages }: CommandSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as { results: Result[] };
        setResults(data.results);
      } catch {
        // aborted or failed
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const activeResults = query.trim().length >= 2 ? results : [];
  const matchedPages = pages.filter((p) => p.label.toLowerCase().includes(query.trim().toLowerCase()));

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        className="hidden md:flex items-center gap-2 h-10 w-64 rounded-xl border border-neutral-soft bg-white px-3 text-sm text-slate-400 hover:bg-slate-50"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span className="material-symbols-outlined text-[20px]">search</span>
        <span className="flex-1 text-left">Search or jump to...</span>
        <kbd className="rounded border border-neutral-soft px-1.5 text-[11px]">Ctrl K</kbd>
      </button>
      <button
        aria-label="Search"
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-soft"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span className="material-symbols-outlined text-[20px]">search</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 pt-[12vh]"
          onClick={() => { setOpen(false); setQuery(""); }}
        >
          <div
            className="admin-animate w-full max-w-xl overflow-hidden rounded-2xl border border-neutral-soft bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-neutral-soft px-4">
              <span className="material-symbols-outlined text-slate-400">search</span>
              <input
                ref={inputRef}
                className="h-14 flex-1 bg-transparent outline-none"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    const first = activeResults[0] ?? matchedPages[0];
                    if (first) go(first.href);
                  }
                }}
                placeholder="Search articles, categories, users..."
                value={query}
              />
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {matchedPages.length > 0 ? (
                <>
                  <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Pages
                  </p>
                  {matchedPages.map((page) => (
                    <Link
                      key={page.href}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-slate-50"
                      href={page.href}
                      onClick={() => setOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[20px] text-accent">{page.icon}</span>
                      {page.label}
                    </Link>
                  ))}
                </>
              ) : null}
              {activeResults.length > 0 ? (
                <>
                  <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Results
                  </p>
                  {activeResults.map((result, index) => (
                    <Link
                      key={`${result.href}-${index}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50"
                      href={result.href}
                      onClick={() => setOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[20px] text-accent">{result.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{result.title}</span>
                        <span className="block truncate text-xs text-slate-400">{result.sub}</span>
                      </span>
                      <span className="rounded-full bg-primary/5 px-2 py-0.5 text-[11px] font-bold">
                        {result.type}
                      </span>
                    </Link>
                  ))}
                </>
              ) : null}
              {query.trim().length >= 2 && activeResults.length === 0 && matchedPages.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-slate-400">No results found.</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
