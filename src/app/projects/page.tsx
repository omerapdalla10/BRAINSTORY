import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";
import PageHero from "@/components/PageHero";
import PostCover from "@/components/PostCover";
import Reveal from "@/components/Reveal";
import { listPublicContent } from "@/lib/content";
import type { ContentItem } from "@/lib/content-config";
import { getDictionary, getLang, localized, type Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Projects | Brain Story Organization",
};

export const dynamic = "force-dynamic";

const PAD = "px-4 sm:px-8 lg:px-12";

function formatMonth(value: string, lang: Lang): string {
  if (!value) return "";
  return new Intl.DateTimeFormat(lang === "so" ? "so-SO" : "en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function ProjectCard({ project, lang }: { project: ContentItem; lang: Lang }) {
  const start = formatMonth(String(project.start_date), lang);
  const end = formatMonth(String(project.end_date), lang);
  const period = [start, end].filter(Boolean).join(" – ");
  const ongoing = project.status === "ongoing";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-soft bg-white transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-[16/10] overflow-hidden">
        <PostCover imageUrl={String(project.image_url) || null} title={localized(project, "title", lang)} />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
            ongoing ? "bg-accent text-white" : "bg-white text-primary"
          }`}
        >
          {ongoing ? "Ongoing" : "Completed"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-xl font-bold leading-snug">{localized(project, "title", lang)}</h3>
        {period || project.location ? (
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            {period ? (
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                {period}
              </span>
            ) : null}
            {project.location ? (
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {String(project.location)}
              </span>
            ) : null}
          </p>
        ) : null}
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          {localized(project, "description", lang)}
        </p>
      </div>
    </article>
  );
}

export default async function ProjectsPage() {
  const lang = await getLang();
  const t = getDictionary(lang);
  const projects = await listPublicContent("projects");
  const current = projects.filter((project) => project.status === "ongoing");
  const completed = projects.filter((project) => project.status === "completed");

  return (
    <main className="bg-background-light dark:bg-background-dark text-primary dark:text-slate-100 min-h-screen flex flex-col">
      <Header />

      <PageHero
        crumb={t.projects}
        image="/SAWIR/1.jpg.jpeg"
        subtitle="Our current and completed work across Somalia."
        title={t.projects}
      />

      <section className={`w-full ${PAD} py-20 md:py-24`}>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-16">
          {projects.length === 0 ? (
            <ComingSoon icon="work" message={t.comingSoon} />
          ) : (
            <>
              {[
                { title: t.current, items: current },
                { title: t.completed, items: completed },
              ]
                .filter((group) => group.items.length > 0)
                .map((group) => (
                  <div key={group.title}>
                    <h2 className="mb-8 text-3xl font-black">{group.title}</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {group.items.map((project, index) => (
                        <Reveal key={project.id} delay={index * 80}>
                          <ProjectCard lang={lang} project={project} />
                        </Reveal>
                      ))}
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
