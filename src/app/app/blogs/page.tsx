import type { Metadata } from "next";
import Link from "next/link";
import DeleteBlogForm from "@/components/blogs/DeleteBlogForm";
import { deleteBlogAction, toggleFeaturedAction, toggleStatusAction } from "@/app/blogs/actions";
import {
  formatBlogDate,
  getAdminBlogsPage,
  getBlogCategories,
  type AdminBlogFilters,
} from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Articles | Brainstory",
};

export const dynamic = "force-dynamic";

type BlogsPageProps = {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    category?: string;
  }>;
};

const PAGE_SIZE = 10;

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function AppBlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const filters: AdminBlogFilters = {
    q: params.q,
    status: params.status === "draft" || params.status === "published" ? params.status : undefined,
    categoryId: params.category || undefined,
  };
  const hasFilters = Boolean(filters.q || filters.status || filters.categoryId);

  const [categories, list] = await Promise.all([
    getBlogCategories(),
    getAdminBlogsPage(page, PAGE_SIZE, filters),
  ]);

  const totalPages = Math.max(1, Math.ceil(list.total / list.pageSize));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const pageHref = (target: number) => {
    const next = new URLSearchParams();
    if (params.q) next.set("q", params.q);
    if (params.status) next.set("status", params.status);
    if (params.category) next.set("category", params.category);
    next.set("page", String(target));
    return `/app/blogs?${next.toString()}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Articles</h1>
          <p className="text-sm text-slate-500 mt-1">
            Write and manage the articles shown on the Latest Articles page.
          </p>
        </div>
        <Link
          className="h-11 px-5 inline-flex items-center gap-2 rounded-full bg-accent text-white font-bold hover:brightness-105 transition-all"
          href="/app/blogs/new"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New article
        </Link>
      </div>

      <form
        action="/app/blogs"
        className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-soft bg-white p-4 shadow-sm"
        method="get"
      >
        <div className="relative flex-1 min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            className="h-11 w-full rounded-xl border border-neutral-soft bg-transparent pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            defaultValue={params.q ?? ""}
            name="q"
            placeholder="Search articles by title..."
            type="search"
          />
        </div>
        <select
          className="h-11 rounded-xl border border-neutral-soft bg-transparent px-3 text-sm"
          defaultValue={filters.status ?? ""}
          name="status"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select
          className="h-11 rounded-xl border border-neutral-soft bg-transparent px-3 text-sm"
          defaultValue={params.category ?? ""}
          name="category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button className="h-11 px-5 rounded-full bg-primary text-white text-sm font-bold" type="submit">
          Filter
        </button>
        {hasFilters ? (
          <Link className="text-sm font-semibold text-accent hover:underline" href="/app/blogs">
            Clear
          </Link>
        ) : null}
      </form>

      <div className="overflow-x-auto rounded-2xl border border-neutral-soft bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-bold">Title</th>
              <th className="px-4 py-3 text-left font-bold">Category</th>
              <th className="px-4 py-3 text-left font-bold">Author</th>
              <th className="px-4 py-3 text-left font-bold">Status</th>
              <th className="px-4 py-3 text-left font-bold">Created</th>
              <th className="px-4 py-3 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.rows.map((blog) => (
              <tr
                key={blog.id}
                className="border-t border-neutral-soft align-middle hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{blog.title}</span>
                    {blog.featured ? (
                      <span
                        className="material-symbols-outlined text-[16px] text-amber-500"
                        title="Featured"
                      >
                        star
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs text-slate-400">{blog.slug}</div>
                </td>
                <td className="px-4 py-3">
                  {blog.category ? (
                    <span className="rounded-full bg-primary/5 px-2.5 py-1 text-xs font-semibold">
                      {blog.category.name}
                    </span>
                  ) : (
                    <span className="text-slate-400">Uncategorized</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-[11px] font-bold text-white">
                      {initialsOf(blog.author?.full_name ?? "?")}
                    </span>
                    <span>{blog.author?.full_name ?? "Unknown"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                      blog.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        blog.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {blog.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{formatBlogDate(blog.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <form action={toggleFeaturedAction}>
                      <input name="blog_id" type="hidden" value={blog.id} />
                      <button
                        className={`grid h-8 w-8 place-items-center rounded-lg border border-neutral-soft hover:bg-slate-100 ${
                          blog.featured ? "text-amber-500" : "text-slate-400"
                        }`}
                        title={blog.featured ? "Remove from featured" : "Mark as featured"}
                        type="submit"
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: `"FILL" ${blog.featured ? 1 : 0}` }}
                        >
                          star
                        </span>
                      </button>
                    </form>
                    <form action={toggleStatusAction}>
                      <input name="blog_id" type="hidden" value={blog.id} />
                      <button
                        className="rounded-lg border border-neutral-soft px-3 py-1.5 text-xs font-semibold hover:bg-slate-100"
                        type="submit"
                      >
                        {blog.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <Link
                      className="rounded-lg border border-neutral-soft px-3 py-1.5 text-xs font-semibold hover:bg-slate-100"
                      href={`/app/blogs/${blog.id}/edit`}
                    >
                      Edit
                    </Link>
                    <DeleteBlogForm action={deleteBlogAction} blogId={blog.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {list.rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-accent/10 text-accent">
              <span className="material-symbols-outlined text-[40px]">
                {hasFilters ? "search_off" : "edit_note"}
              </span>
            </div>
            <h3 className="text-lg font-extrabold">
              {hasFilters ? "No articles match your filters" : "No articles yet"}
            </h3>
            <p className="max-w-sm text-sm text-slate-500">
              {hasFilters
                ? "Try a different search or clear the filters."
                : "Write your first story and share it with the world."}
            </p>
            {!hasFilters ? (
              <Link
                className="mt-2 h-11 px-5 inline-flex items-center gap-2 rounded-xl bg-accent text-white font-bold"
                href="/app/blogs/new"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Write an article
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Page {page} of {totalPages} · {list.total} {list.total === 1 ? "post" : "posts"}
        </p>
        <div className="flex items-center gap-2">
          <Link
            aria-disabled={!hasPrev}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
              hasPrev
                ? "border-neutral-soft hover:bg-slate-100"
                : "border-neutral-soft/50 text-slate-400 pointer-events-none"
            }`}
            href={pageHref(page - 1)}
          >
            Previous
          </Link>
          <Link
            aria-disabled={!hasNext}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
              hasNext
                ? "border-neutral-soft hover:bg-slate-100"
                : "border-neutral-soft/50 text-slate-400 pointer-events-none"
            }`}
            href={pageHref(page + 1)}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
