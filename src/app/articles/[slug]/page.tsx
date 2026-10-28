import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatBlogDate, getPublishedBlogBySlug } from "@/lib/blogs";
import styles from "@/app/articles/[slug]/frappe-content.module.css";

type ReportDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ReportDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Brain Story Organization",
    };
  }

  return {
    title: `${post.title} | Brain Story Organization`,
    description: post.small_description,
  };
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-background-light dark:bg-background-dark text-primary dark:text-slate-100 min-h-screen flex flex-col">
      <Header />

      <article className="w-full px-4 sm:px-8 lg:px-12 py-12 flex-1">
        <div className="max-w-[980px] mx-auto flex flex-col gap-8">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:gap-3 transition-all"
            href="/articles"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Reports
          </Link>

          <div className="rounded-2xl overflow-hidden border border-neutral-soft dark:border-slate-800 bg-white dark:bg-background-dark/50 shadow-xl">
            <div className="aspect-[16/8] bg-slate-200 overflow-hidden">
              <img
                alt={post.title}
                className="w-full h-full object-cover"
                src={post.image_url ?? "/file.svg"}
              />
            </div>

            <div className="p-7 md:p-10 flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wide">
                  {post.category?.name ?? "Uncategorized"}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold capitalize">
                  {post.status}
                </span>
                {post.featured ? (
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                    Featured
                  </span>
                ) : null}
              </div>

              <h1 className="text-3xl md:text-5xl font-black leading-tight">{post.title}</h1>

              <p className="text-lg text-slate-600 dark:text-slate-400">{post.small_description}</p>

              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-neutral-soft dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                    <p className="font-bold">{post.author?.full_name ?? "Unknown author"}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {post.author?.title ?? "Author"}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Published {formatBlogDate(post.published_at ?? post.created_at)}
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-2xl border border-neutral-soft dark:border-slate-800 bg-white dark:bg-background-dark/50 p-7 md:p-10 shadow-sm">
            <div
              className={styles.frappeContent}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </section>
        </div>
      </article>

      <Footer />
    </main>
  );
}
