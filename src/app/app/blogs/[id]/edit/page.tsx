import { notFound } from "next/navigation";
import Link from "next/link";
import BlogEditForm from "@/components/blogs/BlogEditForm";
import { getBlogAuthors, getBlogById, getBlogCategories } from "@/lib/blogs";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AppEditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const [blog, categories, authors] = await Promise.all([
    getBlogById(id),
    getBlogCategories(),
    getBlogAuthors(),
  ]);

  if (!blog) {
    notFound();
  }

  return (
    <div className="text-primary">

      <section className="w-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2">Edit Blog</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Update content, category, author, and publish state.
              </p>
            </div>
            <Link
              className="h-11 px-5 inline-flex items-center rounded-lg border border-neutral-soft dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="/app/blogs"
            >
              Back to Blogs
            </Link>
          </div>

          <BlogEditForm authors={authors} blog={blog} categories={categories} />
        </div>
      </section>

    </div>
  );
}
