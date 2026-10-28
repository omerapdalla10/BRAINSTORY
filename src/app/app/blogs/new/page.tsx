import type { Metadata } from "next";
import Link from "next/link";
import BlogCreateForm from "@/components/blogs/BlogCreateForm";
import { getBlogAuthors, getBlogCategories } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "New Article | Brainstory",
};

export const dynamic = "force-dynamic";

export default async function AppNewBlogPage() {
  const [categories, authors] = await Promise.all([getBlogCategories(), getBlogAuthors()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">New Article</h1>
          <p className="text-sm text-slate-500 mt-1">Write, preview, then save as a draft or publish it to the Latest Articles page.</p>
        </div>
        <Link
          className="h-11 px-5 inline-flex items-center gap-2 rounded-xl border border-neutral-soft font-semibold hover:bg-slate-100 transition-colors"
          href="/app/blogs"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Articles
        </Link>
      </div>

      <BlogCreateForm authors={authors} categories={categories} />
    </div>
  );
}
