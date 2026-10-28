import type { Metadata } from "next";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { getSessionProfile } from "@/lib/auth";
import { getCollections } from "@/lib/db/mongodb";
import { formatBlogDate } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Admin Dashboard | Brainstory",
};

export const dynamic = "force-dynamic";

const MONTHS = 6;

export default async function AppDashboardPage() {
  const { blogs, categories, profiles } = await getCollections();

  const [totalBlogs, published, drafts, totalCategories, totalProfiles, recent, allBlogs, byCategory] =
    await Promise.all([
      blogs.countDocuments({}),
      blogs.countDocuments({ status: "published" }),
      blogs.countDocuments({ status: "draft" }),
      categories.countDocuments({}),
      profiles.countDocuments({}),
      blogs.find({}).sort({ created_at: -1 }).limit(5).toArray(),
      blogs.find({}, { projection: { created_at: 1 } }).toArray(),
      blogs
        .aggregate<{ _id: string | null; count: number }>([
          { $group: { _id: "$category_id", count: { $sum: 1 } } },
        ])
        .toArray(),
    ]);

  const categoryDocs = await categories.find({}).toArray();
  const categoryNames = new Map(categoryDocs.map((c) => [c._id, c.name]));
  const distribution = byCategory
    .map((row) => ({
      name: row._id ? (categoryNames.get(row._id) ?? "Unknown") : "Uncategorized",
      count: row.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const now = new Date();
  const profile = await getSessionProfile();
  const firstName = profile?.full_name.split(" ")[0] ?? "there";
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateLabel = now.toLocaleDateString("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const monthly = Array.from({ length: MONTHS }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en", { month: "short" }), count: 0 };
  });
  for (const doc of allBlogs) {
    const d = new Date(doc.created_at);
    const slot = monthly.find((m) => m.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (slot) slot.count += 1;
  }

  const quickActions = [
    { href: "/app/blogs", icon: "edit_note", title: "Write a new article", sub: `${drafts} drafts waiting` },
    { href: "/app/categories", icon: "folder", title: "Manage categories", sub: `${totalCategories} categories` },
    { href: "/app/profiles", icon: "group", title: "Manage users", sub: `${totalProfiles} accounts` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-2xl bg-primary p-8 text-white">
                        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm text-white/70">{dateLabel}</p>
            <h1 className="mt-1 text-3xl font-black">
              {greeting}, {firstName}
            </h1>
            <p className="mt-2 max-w-md text-white/80">
              You have {published} published {published === 1 ? "story" : "stories"} and {drafts}{" "}
              {drafts === 1 ? "draft" : "drafts"} waiting.
            </p>
          </div>
          <Link
            className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-bold text-white hover:brightness-110 transition-all"
            href="/app/blogs/new"
          >
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
            Write new article
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          badge="all posts"
          hint="Click for breakdown"
          href="/app/blogs"
          icon="article"
          label="Total Articles"
          value={totalBlogs}
        />
        <StatCard
          badge="live"
          hint="Visible on the website"
          href="/app/blogs"
          icon="public"
          label="Published"
          value={published}
        />
        <StatCard
          badge={drafts > 0 ? `${drafts} pending` : "0 pending"}
          hint="Click for breakdown"
          href="/app/blogs"
          icon="draft"
          label="Drafts"
          value={drafts}
        />
        <StatCard
          badge="staff & admin"
          hint="Click for breakdown"
          href="/app/profiles"
          icon="group"
          label="Users"
          value={totalProfiles}
        />
      </div>

      <DashboardCharts distribution={distribution} months={MONTHS} monthly={monthly.map(({ label, count }) => ({ label, count }))} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 rounded-2xl border border-neutral-soft bg-white p-6 shadow-sm">
          <h2 className="font-extrabold mb-4">Recent Activity</h2>
          {recent.length > 0 ? (
            <ul className="divide-y divide-neutral-soft">
              {recent.map((blog) => (
                <li key={blog._id} className="flex items-center gap-4 py-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-accent/10 text-accent grid place-items-center">
                    <span className="material-symbols-outlined text-[20px]">article</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{blog.title}</p>
                    <p className="text-xs text-slate-400">
                      {blog.status === "published" ? "Published" : "Draft"} ·{" "}
                      {formatBlogDate(blog.created_at)}
                    </p>
                  </div>
                  <Link
                    className="text-xs font-semibold text-accent hover:underline"
                    href={`/app/blogs/${blog._id}/edit`}
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 py-6 text-center">No activity yet.</p>
          )}
        </section>

        <section className="rounded-2xl border border-neutral-soft bg-white p-6 shadow-sm">
          <h2 className="font-extrabold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                className="flex items-center gap-3 rounded-xl border border-neutral-soft p-3 hover:bg-slate-50 transition-colors"
                href={action.href}
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-accent/10 text-accent grid place-items-center">
                  <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{action.title}</p>
                  <p className="text-xs text-slate-400">{action.sub}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
