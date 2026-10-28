"use client";

import { useMemo, useState } from "react";

export type UserRow = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  phone: string | null;
  title: string | null;
  avatar_url: string | null;
};

const roleStyles: Record<string, string> = {
  super_admin: "bg-violet-100 text-violet-700",
  admin: "bg-sky-100 text-sky-700",
  author: "bg-emerald-100 text-emerald-700",
};

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  author: "Author",
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function UsersTable({ users }: { users: UserRow[] }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      if (role && user.role !== role) return false;
      if (!q) return true;
      return [user.full_name, user.username, user.email].some((v) => v.toLowerCase().includes(q));
    });
  }, [users, query, role]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-soft bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            className="h-11 w-full rounded-xl border border-neutral-soft bg-transparent pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, username or email..."
            type="search"
            value={query}
          />
        </div>
        <select
          className="h-11 rounded-xl border border-neutral-soft bg-transparent px-3 text-sm"
          onChange={(event) => setRole(event.target.value)}
          value={role}
        >
          <option value="">All roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="author">Author</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-soft bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-bold">User</th>
              <th className="px-4 py-3 text-left font-bold">Role</th>
              <th className="px-4 py-3 text-left font-bold">Phone</th>
              <th className="px-4 py-3 text-left font-bold">Title</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-t border-neutral-soft hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={user.full_name} className="h-10 w-10 shrink-0 rounded-full object-cover" src={user.avatar_url} />
                    ) : (
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                        {initialsOf(user.full_name)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold">{user.full_name}</p>
                      <p className="truncate text-xs text-slate-400">
                        @{user.username} · {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      roleStyles[user.role] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {roleLabels[user.role] ?? user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{user.phone ?? "-"}</td>
                <td className="px-4 py-3 text-slate-500">{user.title ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-accent/10 text-accent">
              <span className="material-symbols-outlined text-[32px]">person_search</span>
            </div>
            <h3 className="font-extrabold">No users found</h3>
            <p className="text-sm text-slate-500">Try a different search or role filter.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
