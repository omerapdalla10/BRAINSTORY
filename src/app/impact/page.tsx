import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";
import PageHero from "@/components/PageHero";
import PostCover from "@/components/PostCover";
import Reveal from "@/components/Reveal";
import { formatBlogDate, getPublishedBlogPosts } from "@/lib/blogs";
import { listPublicContent } from "@/lib/content";
import { RESOURCE_CATEGORIES } from "@/lib/content-config";
import { getDictionary, getLang, localized } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Impact & Resources | Brain Story Organization",
};

export const dynamic = "force-dynamic";

const PAD = "px-4 sm:px-8 lg:px-12";

const CATEGORY_ICONS: Record<string, string> = {
  "annual-report": "description",
  "policy-brief": "gavel",
  research: "science",
  publication: "menu_book",
  "project-results": "monitoring",
};

export default async function ImpactPage() {
  const lang = await getLang();
  const t = getDictionary(lang);
  const resources = await listPublicContent("resources");
  const stories = await getPublishedBlogPosts(3);

  const groups = RESOURCE_CATEGORIES.map((category) => ({
    ...category,
    items: resources.filter((item) => item.category === category.value),
  })).filter((group) => group.items.length > 0);

  return (
    <main className="flex min-h-screen flex-col bg-white text-primary dark:bg-background-dark dark:text-slate-100">
      <Header />

      <PageHero
        crumb={t.impact}
        image="/SAWIR/WhatsApp Image 2026-01-15 at 9.10.35 AM.jpeg"
        subtitle="Annual reports, policy briefs, research, publications, project results and approved community stories."
        title={t.impactTitle}
      />

      {/* Library */}
      <section className={`w-full bg-[#f3f6f5] ${PAD} pb-20 pt-6 dark:bg-background-dark md:pb-24`}>
        <div className="mx-auto max-w-[1280px]">
          {groups.length === 0 ? (
            <ComingSoon icon="library_books" message={t.comingSoon} />
          ) : (
            <div className="grid gap-10 lg:grid-cols-12">
              <aside className="lg:col-span-4">
                <ul className="flex flex-col gap-1 lg:sticky lg:top-24">
                  {groups.map((group) => (
                    <li key={group.value}>
                      <a
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-white hover:text-primary dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                        href={`#${group.value}`}
                      >
                        <span>{group.label}</span>
                        <span className="text-xs text-slate-400">{group.items.length}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="flex flex-col gap-12 lg:col-span-8">
                {groups.map((group) => (
                  <Reveal key={group.value}>
                    <div id={group.value} className="scroll-mt-24">
                      <h2 className="flex items-center gap-2 text-lg font-extrabold">
                        <span className="material-symbols-outlined text-[22px] text-accent">
                          {CATEGORY_ICONS[group.value] ?? "description"}
                        </span>
                        {group.label}
                      </h2>
                      <ul className="mt-4 border-b border-neutral-soft dark:border-slate-700">
                        {group.items.map((item) => {
                          const href = String(item.file_url);
                          const isFile = href.startsWith("/uploads/") || /\.pdf(\?|$)/i.test(href);
                          const description = localized(item, "description", lang);
                          return (
                            <li
                              key={item.id}
                              className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-soft py-6 dark:border-slate-700"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-bold">{localized(item, "title", lang)}</h3>
                                  {item.year ? (
                                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-accent">
                                      {String(item.year)}
                                    </span>
                                  ) : null}
                                </div>
                                {description ? (
                                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
                                ) : null}
                              </div>
                              <a
                                className="inline-flex h-10 items-center gap-2 rounded-full border border-primary/25 px-5 text-sm font-bold transition-colors hover:border-accent hover:text-accent dark:border-white/30"
                                href={href}
                                {...(isFile ? { download: true } : { rel: "noopener noreferrer", target: "_blank" })}
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {isFile ? "download" : "open_in_new"}
                                </span>
                                {isFile ? t.download : t.openLink}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Approved community stories */}
      {stories.length > 0 ? (
        <section className={`w-full ${PAD} py-16 md:py-20`}>
          <Reveal className="mx-auto max-w-[1280px]">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl font-extrabold">{t.communityStories}</h2>
              <Link className="text-sm font-bold text-accent hover:underline" href="/articles">
                {t.allStories}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {stories.map((post) => (
                <Link key={post.id} className="group block" href={`/articles/${post.slug}`}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-200">
                    <PostCover imageUrl={post.image_url} title={post.title} />
                  </div>
                  <p className="mt-4 text-xs font-bold">{formatBlogDate(post.published_at ?? post.created_at)}</p>
                  <h3 className="mt-1 font-bold leading-snug transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                    {post.small_description}
                  </p>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}
