"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import CommandSearch from "@/components/admin/CommandSearch";
import Toaster from "@/components/admin/Toaster";

type NavItem = { href: string; label: string; icon: string; adminOnly?: boolean };

const navItems: NavItem[] = [
  { href: "/app/dashboard", label: "Dashboard", icon: "dashboard", adminOnly: true },
  { href: "/app/blogs", label: "Articles", icon: "article" },
  { href: "/app/categories", label: "Categories", icon: "folder", adminOnly: true },
  { href: "/app/programs", label: "Programs", icon: "volunteer_activism", adminOnly: true },
  { href: "/app/content/projects", label: "Projects", icon: "work", adminOnly: true },
  { href: "/app/content/achievements", label: "Achievements", icon: "emoji_events", adminOnly: true },
  { href: "/app/content/testimonials", label: "Testimonials", icon: "format_quote", adminOnly: true },
  { href: "/app/content/policies", label: "Policies", icon: "policy", adminOnly: true },
  { href: "/app/content/resources", label: "Resources", icon: "library_books", adminOnly: true },
  { href: "/app/content/partners", label: "Partners", icon: "handshake", adminOnly: true },
  { href: "/app/content/team", label: "Team", icon: "groups", adminOnly: true },
  { href: "/app/site", label: "Organization", icon: "apartment", adminOnly: true },
  { href: "/app/profiles", label: "Users", icon: "group", adminOnly: true },
  { href: "/app/settings", label: "Settings", icon: "settings" },
];

const NAV_GROUPS: { title: string; hrefs: string[] }[] = [
  { title: "Overview", hrefs: ["/app/dashboard"] },
  {
    title: "Content",
    hrefs: [
      "/app/blogs",
      "/app/categories",
      "/app/programs",
      "/app/content/projects",
      "/app/content/achievements",
      "/app/content/testimonials",
      "/app/content/policies",
      "/app/content/resources",
      "/app/content/partners",
    ],
  },
  {
    title: "Organization",
    hrefs: ["/app/content/team", "/app/site", "/app/profiles", "/app/settings"],
  },
];

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrator",
  author: "Author",
};

const crumbLabels: Record<string, string> = {
  dashboard: "Dashboard",
  blogs: "Articles",
  categories: "Categories",
  programs: "Programs",
  projects: "Projects",
  achievements: "Achievements",
  testimonials: "Testimonials",
  policies: "Policies",
  site: "Organization",
  resources: "Resources",
  partners: "Partners",
  team: "Team",
  profiles: "Users",
  settings: "Settings",
  new: "New",
  edit: "Edit",
};

export type ShellNotifications = {
  draftCount: number;
  items: { id: string; title: string; created_at: string }[];
};

type AdminShellProps = {
  fullName: string;
  avatarUrl: string | null;
  role: string;
  notifications: ShellNotifications;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
};

export default function AdminShell({
  fullName,
  avatarUrl,
  role,
  notifications,
  logoutAction,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDark(localStorage.getItem("admin-theme") === "dark");
    } catch {
      // storage unavailable
    }
  }, []);

  function toggleTheme() {
    setDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("admin-theme", next ? "dark" : "light");
      } catch {
        // storage unavailable
      }
      return next;
    });
  }

  const isAdmin = role === "admin" || role === "super_admin";
  const items = navItems.filter((item) => !item.adminOnly || isAdmin);
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const segments = pathname.split("/").filter(Boolean).slice(1);
  const crumbs = segments
    .filter((segment) => crumbLabels[segment])
    .map((segment, index, arr) => ({
      label: crumbLabels[segment],
      href: `/app/${segments.slice(0, segments.indexOf(segment) + 1).join("/")}`,
      last: index === arr.length - 1,
    }));
  const pageTitle = crumbs.length > 0 ? crumbs[crumbs.length - 1].label : "Admin";

  const navLink = (item: NavItem) => {
    const active = pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        className={`relative flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-semibold transition-colors ${
          active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
        } ${collapsed ? "lg:justify-center" : ""}`}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        title={item.label}
      >
        {active ? <span className="absolute left-0 h-6 w-1 rounded-r-full bg-accent" /> : null}
        <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
        {!collapsed ? <span>{item.label}</span> : null}
      </Link>
    );
  };

  return (
    <div className={`${dark ? "dark admin-dark" : ""} min-h-screen`}>
      <div className="min-h-screen bg-[#f4f7f9] text-primary flex">
        {mobileOpen ? (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <aside
          className={`fixed lg:sticky top-0 z-40 h-screen shrink-0 flex flex-col bg-primary text-white transition-all duration-200 ${
            collapsed ? "lg:w-[84px]" : "lg:w-[264px]"
          } w-[264px] ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="flex items-center justify-between gap-2 px-4 py-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-10 w-10 shrink-0 rounded-xl bg-white overflow-hidden">
                <Image
                  src="/brand/footer/fav%20icon.png"
                  alt="Brainstory logo"
                  fill
                  className="object-contain p-1.5"
                  sizes="40px"
                />
              </div>
              {!collapsed ? (
                <div className="min-w-0">
                  <p className="text-sm font-extrabold leading-tight truncate">Brainstory Admin</p>
                  <p className="text-xs text-white/60 truncate">Management Console</p>
                </div>
              ) : null}
            </div>
            <button
              aria-label="Collapse sidebar"
              className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 hover:bg-white/20"
              onClick={() => setCollapsed((prev) => !prev)}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                {collapsed ? "chevron_right" : "chevron_left"}
              </span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 flex flex-col gap-1">
            {NAV_GROUPS.map((group) => {
              const groupItems = group.hrefs
                .map((href) => items.find((item) => item.href === href))
                .filter((item): item is NavItem => Boolean(item));
              if (groupItems.length === 0) return null;
              return (
                <div key={group.title} className="flex flex-col gap-1">
                  {!collapsed ? (
                    <p className="px-3 pb-1 pt-4 text-[11px] font-bold uppercase tracking-widest text-white/40">
                      {group.title}
                    </p>
                  ) : (
                    <span className="my-2 border-t border-white/10" />
                  )}
                  {groupItems.map(navLink)}
                </div>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-3 flex flex-col gap-1">
            <Link
              className={`flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white ${
                collapsed ? "lg:justify-center" : ""
              }`}
              href="/"
              target="_blank"
              title="View website"
            >
              <span className="material-symbols-outlined text-[22px]">open_in_new</span>
              {!collapsed ? <span>View website</span> : null}
            </Link>
            <form action={logoutAction}>
              <button
                className={`w-full flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-semibold text-rose-300 hover:bg-white/10 ${
                  collapsed ? "lg:justify-center" : ""
                }`}
                title="Sign out"
                type="submit"
              >
                <span className="material-symbols-outlined text-[22px]">logout</span>
                {!collapsed ? <span>Sign out</span> : null}
              </button>
            </form>
            {!collapsed ? (
              <p className="px-3 pt-2 text-xs text-white/50 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" /> All systems normal
              </p>
            ) : null}
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-neutral-soft bg-white/80 backdrop-blur px-4 sm:px-8 h-[72px]">
            <div className="flex items-center gap-3 min-w-0">
              <button
                aria-label="Open menu"
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-soft"
                onClick={() => setMobileOpen(true)}
                type="button"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="min-w-0">
                <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-slate-500">
                  <span>Brainstory</span>
                  {crumbs.map((crumb) => (
                    <span key={crumb.href} className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      {crumb.last ? (
                        <span className="font-semibold text-primary">{crumb.label}</span>
                      ) : (
                        <Link className="hover:text-accent" href={crumb.href}>
                          {crumb.label}
                        </Link>
                      )}
                    </span>
                  ))}
                </nav>
                <h2 className="text-lg font-extrabold leading-tight truncate">{pageTitle}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <CommandSearch pages={items} />

              <button
                aria-label="Toggle dark mode"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-soft hover:bg-slate-50"
                onClick={toggleTheme}
                title={dark ? "Light mode" : "Dark mode"}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {dark ? "light_mode" : "dark_mode"}
                </span>
              </button>

              <div className="relative">
                <button
                  aria-label="Notifications"
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-soft hover:bg-slate-50"
                  onClick={() => setBellOpen((prev) => !prev)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  {notifications.draftCount > 0 ? (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                      {notifications.draftCount}
                    </span>
                  ) : null}
                </button>
                {bellOpen ? (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setBellOpen(false)} />
                    <div className="admin-animate absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-neutral-soft bg-white shadow-xl">
                      <p className="border-b border-neutral-soft px-4 py-3 text-sm font-extrabold">
                        Notifications
                      </p>
                      {notifications.items.length > 0 ? (
                        <ul className="divide-y divide-neutral-soft">
                          {notifications.items.map((item) => (
                            <li key={item.id}>
                              <Link
                                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50"
                                href={`/app/blogs/${item.id}/edit`}
                                onClick={() => setBellOpen(false)}
                              >
                                <span className="material-symbols-outlined mt-0.5 text-[20px] text-amber-500">
                                  draft
                                </span>
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-semibold">{item.title}</span>
                                  <span className="block text-xs text-slate-400">Draft waiting to be published</span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="px-4 py-8 text-center text-sm text-slate-400">
                          You are all caught up.
                        </p>
                      )}
                    </div>
                  </>
                ) : null}
              </div>

              <Link className="flex items-center gap-3 pl-1" href="/app/settings">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold leading-tight">{fullName}</p>
                  <p className="text-xs text-slate-500">{roleLabels[role] ?? role}</p>
                </div>
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={fullName} className="h-10 w-10 rounded-full object-cover" src={avatarUrl} />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent text-white grid place-items-center text-sm font-bold">
                    {initials || "A"}
                  </div>
                )}
              </Link>
            </div>
          </header>

          <main className="admin-main admin-animate flex-1 px-4 sm:px-8 py-8">
            <div className="max-w-[1200px] mx-auto">{children}</div>
          </main>
        </div>

        <Suspense fallback={null}>
          <Toaster />
        </Suspense>
      </div>
    </div>
  );
}
