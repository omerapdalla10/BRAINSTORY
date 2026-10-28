import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import Counter from "@/components/Counter";
import Partners from "@/components/Partners";
import PostCover from "@/components/PostCover";
import Reveal from "@/components/Reveal";
import { formatBlogDate, getPublishedBlogPosts } from "@/lib/blogs";
import { listPublicContent } from "@/lib/content";
import { getCollections } from "@/lib/db/mongodb";
import { getDictionary, getLang, localized } from "@/lib/i18n";
import { getPublishedPrograms } from "@/lib/programs";

const WRAP = "mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-12";
const PAGE_BG = "bg-[#f3f6f5] dark:bg-background-dark";

const pillars = [
  {
    icon: "favorite",
    title: "Mental Health Care",
    text: "Providing expert clinical support and psychological first aid to those affected by conflict, displacement, and prolonged trauma.",
  },
  {
    icon: "groups",
    title: "Community Resilience",
    text: "Strengthening social bonds and community support systems through group counseling and peer-to-peer healing networks.",
  },
  {
    icon: "handshake",
    title: "Peacebuilding",
    text: "Promoting lasting peace by addressing the psychological roots of conflict and supporting the social reintegration of ex-combatants.",
  },
];

const groups = [
  "IDPs & Refugees",
  "GBV Survivors",
  "Ex-combatants",
  "Orphaned Youth",
  "Widowed Women",
  "Conflict Victims",
];

type StoryPost = Awaited<ReturnType<typeof getPublishedBlogPosts>>[number];

function StoryMeta({ post }: { post: StoryPost }) {
  return (
    <p className="text-xs font-semibold">
      <span className="text-accent">{post.category?.name ?? "Uncategorized"}</span>
      <span className="text-slate-400"> · {formatBlogDate(post.published_at ?? post.created_at)}</span>
    </p>
  );
}

export default async function Home() {
  const recent = await getPublishedBlogPosts(12);
  const posts = [...recent.filter((post) => post.featured), ...recent.filter((post) => !post.featured)].slice(0, 3);
  const [featured, ...others] = posts;

  const { blogs } = await getCollections();
  const storyCount = await blogs.countDocuments({ status: "published" });
  const programCount = (await getPublishedPrograms()).length;
  const lang = await getLang();
  const t = getDictionary(lang);
  const testimonials = (await listPublicContent("testimonials")).slice(0, 3);

  const stats = [
    { value: 2022, label: "Year founded", plain: true },
    { value: programCount, label: "Core programs" },
    { value: groups.length, label: "Communities we serve" },
    { value: storyCount, label: "Published stories" },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white text-primary dark:bg-background-dark dark:text-slate-100">
      <Header />

      {/* Hero */}
      <section className={PAGE_BG}>
        <div className={`${WRAP} grid items-center gap-12 pb-16 pt-12 lg:grid-cols-12 lg:pb-20 lg:pt-16`}>
          <div className="admin-animate lg:col-span-7">
            <h1 className="max-w-[560px] text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem] [text-wrap:balance]">
              Building Resilience and Mental Wellness in Somalia
            </h1>
            <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Brain Story Organization (BSO) is a Somali-led NGO dedicated to addressing the
              critical mental health crisis and fostering community peace through expert care and
              advocacy.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex h-12 items-center rounded-full bg-accent px-7 text-sm font-bold text-white transition-all hover:brightness-110"
                href="/contact"
              >
                Get Involved
              </Link>
              <Link
                className="inline-flex h-12 items-center rounded-full border border-primary/25 px-7 text-sm font-bold text-primary transition-colors hover:border-primary dark:border-white/30 dark:text-white"
                href="/programs"
              >
                Explore Programs
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-xl shadow-primary/10">
              <Image
                alt="Brain Story Organization community session"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                src="/SAWIR/WhatsApp Image 2026-02-06 at 4.40.36 PM.jpeg"
              />
            </div>
            <div className="absolute -bottom-6 left-4 rounded-2xl bg-white px-5 py-4 shadow-lg dark:bg-slate-800 sm:-left-6">
              <div className="mb-2 flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent/25" />
              </div>
              <p className="max-w-[170px] text-sm font-bold leading-snug">Mental Health · Resilience · Peace</p>
            </div>
          </div>
        </div>

        {/* Numbers */}
        <div className={WRAP}>
          <dl className="grid grid-cols-2 border-t border-primary/15 lg:grid-cols-4 dark:border-white/15">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`px-4 py-6 sm:px-6 ${index > 0 ? "lg:border-l border-primary/15 dark:border-white/15" : ""} ${
                  index % 2 === 1 ? "border-l border-primary/15 dark:border-white/15" : ""
                }`}
              >
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</dt>
                <dd className="mt-1 text-4xl font-extrabold">
                  <Counter plain={stat.plain} value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-white py-20 dark:bg-background-dark/60 md:py-24">
        <Reveal className={`${WRAP} grid gap-12 lg:grid-cols-12`}>
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">What we do</span>
            <h2 className="mt-3 text-3xl font-extrabold">Core Mission Pillars</h2>
            <p className="mt-4 max-w-[380px] leading-relaxed text-slate-600 dark:text-slate-300">
              We address the psychological and social needs of our community through specialized
              interventions that restore dignity and hope.
            </p>
            <Link
              className="mt-6 inline-block text-sm font-bold text-accent underline underline-offset-4 hover:brightness-90"
              href="/programs"
            >
              Our Programs
            </Link>
          </div>
          <ul className="lg:col-span-7">
            {pillars.map((pillar, index) => (
              <li
                key={pillar.title}
                className={`flex gap-5 py-7 ${index > 0 ? "border-t border-neutral-soft dark:border-slate-700" : ""} ${
                  index === 0 ? "pt-0" : ""
                }`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                  <span className="material-symbols-outlined text-[22px]">{pillar.icon}</span>
                </span>
                <div>
                  <h3 className="text-lg font-bold">{pillar.title}</h3>
                  <p className="mt-1.5 max-w-[520px] text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {pillar.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Who we serve */}
      <section className="bg-primary py-16 text-white md:py-20">
        <Reveal className={`${WRAP} grid items-center gap-12 lg:grid-cols-12`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:col-span-5 lg:aspect-[5/5]">
            <Image
              alt="Community meeting"
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              src="/SAWIR/3b00924a-e3ad-442d-8515-5e7693b63f7b.jpeg"
            />
          </div>
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Who we serve</span>
            <h2 className="mt-3 max-w-[520px] text-3xl font-extrabold leading-tight md:text-4xl">
              Empowering Every Member of Our Community
            </h2>
            <p className="mt-4 max-w-[520px] leading-relaxed text-slate-300">
              BSO provides specialized, culturally-sensitive care to the most vulnerable groups
              across Somalia, ensuring no one is left behind in the journey towards mental
              wellness.
            </p>
            <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
              {groups.map((label) => (
                <li key={label} className="flex items-center gap-3 border-b border-white/10 py-3.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-white">
                    <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M2.6 6.4l2.1 2.1 4.7-4.9"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.7"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </li>
              ))}
            </ul>
            <Link
              className="mt-8 inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-bold text-white transition-all hover:brightness-110"
              href="/impact"
            >
              View detailed program impact
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Latest articles */}
      <section className={`${PAGE_BG} py-20 md:py-24`}>
        <Reveal className={WRAP}>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold">{t.latestArticles}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Stories, field reports, and mental health insights from our team.
              </p>
            </div>
            <Link className="text-sm font-bold text-accent hover:underline" href="/articles">
              All articles
            </Link>
          </div>

          {featured ? (
            <div className="grid gap-10 lg:grid-cols-12">
              <Link
                className={`group block ${others.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}`}
                href={`/articles/${featured.slug}`}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl bg-slate-200 ${
                    others.length > 0 ? "aspect-[16/10]" : "aspect-[21/9]"
                  }`}
                >
                  <PostCover imageUrl={featured.image_url} title={featured.title} />
                </div>
                <div className="mt-5">
                  <StoryMeta post={featured} />
                  <h3 className="mt-2 max-w-[640px] text-2xl font-extrabold leading-snug transition-colors group-hover:text-accent md:text-3xl">
                    {featured.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 max-w-[640px] text-slate-600 dark:text-slate-300">
                    {featured.small_description}
                  </p>
                </div>
              </Link>

              {others.length > 0 ? (
                <div className="flex flex-col gap-8 lg:col-span-5">
                  {others.map((post) => (
                    <Link key={post.id} className="group flex gap-5" href={`/articles/${post.slug}`}>
                      <div className="relative aspect-[4/3] w-36 shrink-0 overflow-hidden rounded-xl bg-slate-200 sm:w-44">
                        <PostCover imageUrl={post.image_url} title={post.title} />
                      </div>
                      <div className="min-w-0">
                        <StoryMeta post={post} />
                        <h3 className="mt-1.5 text-lg font-bold leading-snug transition-colors group-hover:text-accent">
                          {post.title}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                          {post.small_description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-primary/25 p-10 text-center text-slate-500">
              No stories have been published yet. Check back soon.
            </p>
          )}
        </Reveal>
      </section>

      {/* Testimonials (only approved ones with consent) */}
      {testimonials.length > 0 ? (
        <section className="bg-white py-20 dark:bg-background-dark/60 md:py-24">
          <Reveal className={WRAP}>
            <h2 className="mb-10 text-3xl font-extrabold">{t.testimonials}</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((item, index) => (
                <figure
                  key={item.id}
                  className={`flex flex-col justify-between gap-8 rounded-2xl p-7 ${
                    index % 2 === 1 ? "bg-[#f3e9d8] dark:bg-white/10" : "bg-[#e6f0ed] dark:bg-white/5"
                  }`}
                >
                  <blockquote className="font-medium leading-relaxed text-primary dark:text-slate-100">
                    &ldquo;{localized(item, "quote", lang)}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    {item.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={String(item.name)} className="h-9 w-9 rounded-full object-cover" src={String(item.photo_url)} />
                    ) : (
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                        {String(item.name).slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <span className="text-sm">
                      <span className="block font-bold">{String(item.name)}</span>
                      {item.role ? <span className="block text-slate-500">{String(item.role)}</span> : null}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </section>
      ) : null}

      <Partners className={PAGE_BG} />

      {/* Call to action */}
      <section className={`${PAGE_BG} pb-20`}>
        <div className={WRAP}>
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-accent px-8 py-12 text-white md:flex-row md:items-center md:px-14 md:py-14">
            <div className="max-w-[560px]">
              <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
                Empower Minds, Restore Hope
              </h2>
              <p className="mt-3 text-white/85">
                Join us in our mission to bring expert clinical mental health support to every
                corner of Somalia.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-bold text-white transition-colors hover:bg-primary/85"
                href="/contact"
              >
                Get in Touch
              </Link>
              <Link
                className="inline-flex h-12 items-center rounded-full border border-white/60 px-7 text-sm font-bold text-white transition-colors hover:bg-white/10"
                href="/impact"
              >
                View Impact Reports
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
