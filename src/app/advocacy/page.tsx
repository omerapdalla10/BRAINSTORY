import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getDictionary, getLang, localized, paragraphs } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/site";
import { ADVOCACY_DEFAULTS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Human Rights & Advocacy | Brain Story Organization",
};

export const dynamic = "force-dynamic";

const PAD = "px-4 sm:px-8 lg:px-12";

export default async function AdvocacyPage() {
  const lang = await getLang();
  const t = getDictionary(lang);
  const settings = await getSiteSettings();

  /** The dashboard text wins; the draft default is used until it is filled in. */
  const text = (key: keyof typeof ADVOCACY_DEFAULTS) =>
    localized(settings, key, lang) || ADVOCACY_DEFAULTS[key];

  const pillars = [
    { icon: "balance", title: t.rightsTitle, body: text("advocacy_rights") },
    { icon: "forum", title: t.stigmaTitle, body: text("advocacy_stigma") },
    { icon: "diversity_3", title: t.inclusionTitle, body: text("advocacy_inclusion") },
    { icon: "campaign", title: t.advocacyPillar, body: text("advocacy_advocacy") },
  ];

  return (
    <main className="bg-background-light dark:bg-background-dark text-primary dark:text-slate-100 min-h-screen flex flex-col">
      <Header />

      <PageHero
        crumb={t.advocacy}
        image="/SAWIR/WhatsApp Image 2026-02-06 at 4.40.36 PM.jpeg"
        subtitle={paragraphs(text("advocacy_intro"))[0] ?? ""}
        title={t.advocacyTitle}
      />

      <section className={`w-full ${PAD} py-20 md:py-28`}>
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 80}>
                <article className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-neutral-soft bg-white p-8 transition-all hover:border-accent hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 md:p-10">
                  <span className="absolute right-6 top-5 text-4xl font-black text-slate-100 dark:text-slate-800">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    <span className="material-symbols-outlined text-3xl">{pillar.icon}</span>
                  </span>
                  <h2 className="relative text-2xl font-black">{pillar.title}</h2>
                  <div className="relative flex flex-col gap-3 leading-relaxed text-slate-600 dark:text-slate-300">
                    {paragraphs(pillar.body).map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`w-full ${PAD} pb-24`}>
        <Reveal className="mx-auto max-w-[1280px]">
          <div className="flex flex-col items-center gap-5 rounded-3xl bg-primary px-6 py-14 text-center text-white md:px-16">
            <h2 className="text-3xl font-black md:text-4xl">{t.impactTitle}</h2>
            <p className="max-w-xl text-lg text-slate-300">
              Reports, policy briefs, research and stories that show the difference this work makes.
            </p>
            <Link
              className="inline-flex h-12 items-center rounded-xl bg-accent px-8 font-bold text-white transition-all hover:brightness-110"
              href="/impact"
            >
              {t.impactTitle}
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
