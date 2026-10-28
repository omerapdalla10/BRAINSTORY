import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PostCover from "@/components/PostCover";
import Reveal from "@/components/Reveal";
import { formatBlogDate, getPublishedBlogPosts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Latest Articles | Brain Story Organization",
};

type ReportsPageProps = {
  searchParams?: Promise<{
    page?: string | string[];
    category?: string | string[];
    q?: string | string[];
  }>;
};

const POSTS_PER_PAGE = 6;

/** Rough reading time, derived from the text nodes in the editor JSON. */
function readTime(content: string): number {
  const text = Array.from(content.matchAll(/"text":"((?:[^"\\]|\\.)*)"/g))
    .map((match) => match[1])
    .join(" ");
  const words = (text || content).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const rawPage = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page;
  const rawCategory = Array.isArray(resolvedSearchParams.category)
    ? resolvedSearchParams.category[0]
    : resolvedSearchParams.category;
  const selectedCategory = rawCategory?.trim() || "";
  const rawQuery = Array.isArray(resolvedSearchParams.q)
    ? resolvedSearchParams.q[0]
    : resolvedSearchParams.q;
  const searchQuery = rawQuery?.trim() || "";
  const parsedPage = Number.parseInt(rawPage ?? "1", 10);
  const requestedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const posts = await getPublishedBlogPosts(120);
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.published_at ?? a.created_at).getTime();
    const dateB = new Date(b.published_at ?? b.created_at).getTime();

    return dateB - dateA;
  });
  // An editor-marked featured article leads the page; otherwise the newest one does.
  const featuredPost = sortedPosts.find((post) => post.featured) ?? sortedPosts[0];
  const latestPosts = sortedPosts.filter((post) => post.id !== featuredPost?.id);
  const filteredPosts = latestPosts.filter((post) => {
    if (selectedCategory && post.category?.name !== selectedCategory) return false;
    if (!searchQuery) return true;
    const haystack = `${post.title} ${post.small_description}`.toLowerCase();
    return haystack.includes(searchQuery.toLowerCase());
  });
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const categories = Array.from(
    new Set(posts.map((post) => post.category?.name).filter(Boolean)),
  ) as string[];
  const buildReportsHref = (pageNumber: number, categoryName?: string) => {
    const params = new URLSearchParams();
    const category = categoryName?.trim();

    if (searchQuery) {
      params.set("q", searchQuery);
    }

    if (category) {
      params.set("category", category);
    }

    if (pageNumber > 1) {
      params.set("page", String(pageNumber));
    }

    const query = params.toString();
    return `/articles${query ? `?${query}` : ""}#latest-articles`;
  };

  const chipClass = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
      active
        ? "bg-primary text-white dark:bg-white dark:text-primary"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300"
    }`;

  return (
    <main className="flex min-h-screen flex-col bg-white text-primary dark:bg-background-dark dark:text-slate-100">
      <Header />

      <PageHero
        aside={
          <form action="/articles#latest-articles" className="relative ml-auto w-full max-w-[320px]" method="get">
            {selectedCategory ? <input name="category" type="hidden" value={selectedCategory} /> : null}
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
              search
            </span>
            <input
              className="h-11 w-full rounded-full bg-white pl-11 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/50 dark:bg-slate-800"
              defaultValue={searchQuery}
              name="q"
              placeholder="Search articles..."
              type="search"
            />
          </form>
        }
        crumb="Articles"
        subtitle="Stories, field reports, and mental health insights from the Brain Story Organization team."
        title="Latest Articles"
      />

      {/* Featured */}
      {featuredPost ? (
        <section className="w-full bg-[#f3f6f5] px-4 pb-16 dark:bg-background-dark sm:px-8 lg:px-12">
          <Link
            className="group mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-12"
            href={`/articles/${featuredPost.slug}`}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-slate-200 lg:col-span-7">
              <PostCover imageUrl={featuredPost.image_url} title={featuredPost.title} />
            </div>
            <div className="lg:col-span-5">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full bg-accent px-3 py-1 font-bold text-white">
                  {featuredPost.featured ? "Featured" : "Latest"}
                </span>
                <span className="text-slate-500">
                  {formatBlogDate(featuredPost.published_at ?? featuredPost.created_at)} ·{" "}
                  {readTime(featuredPost.content)} min read
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight transition-colors group-hover:text-accent md:text-4xl">
                {featuredPost.title}
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                {featuredPost.small_description}
              </p>
              <p className="mt-5 text-sm font-bold">{featuredPost.author?.full_name ?? "Unknown author"}</p>
            </div>
          </Link>
        </section>
      ) : (
        <section className="w-full bg-[#f3f6f5] px-4 pb-16 dark:bg-background-dark sm:px-8 lg:px-12">
          <p className="mx-auto max-w-[1280px] rounded-2xl border border-dashed border-primary/25 p-10 text-center text-slate-500">
            No published blog posts yet. Create your first post in the admin dashboard.
          </p>
        </section>
      )}

      {/* All articles */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12" id="latest-articles">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-3xl font-extrabold">Latest Articles</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link className={chipClass(!selectedCategory)} href={buildReportsHref(1)}>
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                className={chipClass(selectedCategory === category)}
                href={buildReportsHref(1, category)}
              >
                {category}
              </Link>
            ))}
          </div>

          {filteredPosts.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post, index) => (
                <Reveal key={post.id} delay={index * 70}>
                  <Link className="group block" href={`/articles/${post.slug}`}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-200">
                      <PostCover imageUrl={post.image_url} title={post.title} />
                    </div>
                    <p className="mt-4 text-xs font-semibold">
                      <span className="text-accent">{post.category?.name ?? "Uncategorized"}</span>
                      <span className="text-slate-400">
                        {" "}
                        {formatBlogDate(post.published_at ?? post.created_at)} · {readTime(post.content)} min read
                      </span>
                    </p>
                    <h3 className="mt-1.5 text-lg font-bold leading-snug transition-colors group-hover:text-accent">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                      {post.small_description}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-[#e6f0ed] p-12 text-center text-slate-600 dark:bg-white/5 dark:text-slate-300">
              <span className="material-symbols-outlined text-4xl text-accent">search_off</span>
              <p>
                {searchQuery || selectedCategory
                  ? "No articles match your search or filter."
                  : "No additional articles yet."}
              </p>
              {searchQuery || selectedCategory ? (
                <Link className="font-bold text-accent hover:underline" href="/articles#latest-articles">
                  Clear filters
                </Link>
              ) : null}
            </div>
          )}

          {totalPages > 1 ? (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <Link
                aria-disabled={currentPage <= 1}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  currentPage <= 1
                    ? "pointer-events-none bg-slate-100 text-slate-400 dark:bg-white/5"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-white/10"
                }`}
                href={currentPage > 1 ? buildReportsHref(currentPage - 1, selectedCategory) : "#"}
              >
                Previous
              </Link>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <Link
                  key={pageNumber}
                  className={chipClass(pageNumber === currentPage)}
                  href={buildReportsHref(pageNumber, selectedCategory)}
                >
                  {pageNumber}
                </Link>
              ))}
              <Link
                aria-disabled={currentPage >= totalPages}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  currentPage >= totalPages
                    ? "pointer-events-none bg-slate-100 text-slate-400 dark:bg-white/5"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-white/10"
                }`}
                href={currentPage < totalPages ? buildReportsHref(currentPage + 1, selectedCategory) : "#"}
              >
                Next
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </main>
  );
}
