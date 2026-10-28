"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import type { Dictionary, Lang } from "@/lib/i18n";

type HeaderClientProps = {
  lang: Lang;
  labels: Dictionary;
};

export default function HeaderClient({ lang, labels }: HeaderClientProps) {
  const pathname = usePathname();
  const navLinks = [
    { href: "/", label: labels.home },
    { href: "/about", label: labels.about },
    { href: "/programs", label: labels.programs },
    { href: "/projects", label: labels.projects },
    { href: "/advocacy", label: labels.advocacy },
    { href: "/impact", label: labels.impact },
    { href: "/articles", label: labels.articles },
    { href: "/contact", label: labels.contact },
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-solid bg-[#f3f6f5]/90 dark:bg-background-dark/90 backdrop-blur-md px-4 sm:px-8 lg:px-12 py-3 transition-shadow duration-300 ${
        scrolled
          ? "border-neutral-soft dark:border-slate-800 shadow-xl"
          : "border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center" onClick={closeMenu}>
          <div className="relative h-12 w-[160px] sm:h-14 sm:w-[190px] md:h-16 md:w-[220px]">
            <Image
              src="/brand/Asset%202.png"
              alt="Brain Story logo"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 640px) 160px, (max-width: 768px) 190px, 220px"
            />
          </div>
        </Link>

        <div className="hidden xl:flex flex-1 items-center">
          <nav className="flex flex-1 items-center justify-center gap-1 2xl:gap-5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                    active
                      ? "bg-accent/15 text-accent"
                      : "text-primary/80 hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-white/10"
                  }`}
                  href={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
          <LanguageToggle lang={lang} />
          <ThemeToggle />
          <Link
            href="/donate"
            className="flex min-w-[110px] items-center justify-center gap-1.5 rounded-full h-10 px-5 bg-accent text-white text-sm font-bold shadow-sm hover:shadow-xl hover:brightness-105 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">favorite</span>
            {labels.donate}
          </Link>
          </div>
        </div>

        <div className="xl:hidden flex items-center gap-2">
          <LanguageToggle lang={lang} />
          <ThemeToggle />
          <button
            aria-controls="mobile-nav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-soft dark:border-slate-700 text-primary dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            type="button"
          >
            <span className="material-symbols-outlined">{isMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id="mobile-nav"
          className="xl:hidden mt-3 rounded-2xl border border-neutral-soft dark:border-slate-800 bg-white dark:bg-background-dark/95 p-4 shadow-lg"
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? "bg-accent/10 text-accent"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                href={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link
              className="mt-2 inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-bold text-white hover:brightness-105 transition-all"
              href="/donate"
              onClick={closeMenu}
            >
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              {labels.donate}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
