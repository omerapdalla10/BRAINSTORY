import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Counter from "@/components/Counter";
import Partners from "@/components/Partners";
import TeamSection from "@/components/TeamSection";
import Reveal from "@/components/Reveal";
import { listPublicContent } from "@/lib/content";
import { getDictionary, getLang, localized, paragraphs } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us | Brain Story Organization",
};

const WRAP = "mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-12";
const PAGE_BG = "bg-[#f3f6f5] dark:bg-background-dark";

const values = [
  { icon: "favorite", title: "Empathy", text: "Understanding lived experiences." },
  { icon: "groups", title: "Inclusivity", text: "Support for all backgrounds." },
  { icon: "verified_user", title: "Integrity", text: "Ethical and transparent action." },
  { icon: "language", title: "Cultural Relevance", text: "Respecting local traditions." },
  { icon: "campaign", title: "Advocacy", text: "Speaking for the voiceless." },
];

const facts = [
  { label: "Founded", value: "2022" },
  { label: "Led by", value: "Somalis, for Somalis" },
  { label: "Based in", value: "Mogadishu" },
  { label: "Approach", value: "Trauma-informed care" },
];

const mission =
  "To promote mental and emotional well-being by providing accessible, holistic, and evidence-based mental health care to Somali communities. We aim to dismantle stigma, strengthen psychosocial resilience, and create inclusive spaces for healing, growth, and empowerment.";
const vision =
  "A Somalia where mental health is a national priority: understood, respected, and equitably supported. We envision resilient communities where individuals, families, and institutions possess the emotional strength and psychological tools to heal from trauma, build peaceful lives, and shape a more just and healthy future.";

/** First sentence as a large statement, the rest as supporting text. */
function splitLead(text: string): { lead: string; rest: string } {
  const match = text.match(/^(.+?[.!?])\s+([\s\S]*)$/);
  return match ? { lead: match[1], rest: match[2] } : { lead: text, rest: "" };
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`text-xs font-bold uppercase tracking-widest ${light ? "text-emerald-300" : "text-accent"}`}
    >
      {children}
    </span>
  );
}

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const lang = await getLang();
  const t = getDictionary(lang);
  const settings = await getSiteSettings();
  const achievements = await listPublicContent("achievements");

  const profile = paragraphs(localized(settings, "profile_text", lang));
  const storyParagraphs =
    profile.length > 0
      ? profile
      : [
          "Founded in 2022, Brain Story Organization (BSO) is a Somali-led non-profit dedicated to addressing the deep and enduring mental health crisis in Somalia, a country that has endured over three decades of armed conflict, forced displacement, and institutional collapse.",
          "Our mission is to provide comprehensive, culturally attuned, and trauma-informed mental health care across the nation, especially for communities most affected by war, poverty, marginalization, and systemic neglect.",
        ];
  const leaderName = settings.leader_name.trim();
  const leaderTitle = localized(settings, "leader_title", lang);
  const leaderBio = paragraphs(localized(settings, "leader_bio", lang));
  const hasLeader = Boolean(leaderName || leaderBio.length > 0);

  const missionText = splitLead(mission);
  const visionText = splitLead(vision);

  return (
    <main className="flex min-h-screen flex-col bg-white text-primary dark:bg-background-dark dark:text-slate-100">
      <Header />

      {/* Hero */}
      <section className={PAGE_BG}>
        <div className={`${WRAP} pt-12`}>
          <div className="admin-animate grid items-end gap-6 lg:grid-cols-12">
            <h1 className="text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:col-span-8 lg:text-[3.5rem] [text-wrap:balance]">
              Advancing Mental Health in Somalia
            </h1>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300 lg:col-span-4 lg:pb-2">
              BSO is a Somali-led non-profit dedicated to addressing mental health crises through
              advocacy, education, and culturally relevant support.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:h-[440px] lg:grid-cols-12">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl lg:col-span-8 lg:aspect-auto">
              <Image
                alt="Brain Story community session"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                src="/SAWIR/WhatsApp Image 2026-02-06 at 4.40.36 PM.jpeg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 lg:col-span-4 lg:grid-cols-1 lg:grid-rows-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto">
                <Image
                  alt="Community meeting"
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  src="/SAWIR/3b00924a-e3ad-442d-8515-5e7693b63f7b.jpeg"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto">
                <Image
                  alt="Support group session"
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  src="/SAWIR/WhatsApp Image 2026-01-15 at 9.10.35 AM.jpeg"
                />
              </div>
            </div>
          </div>

          <dl className="mt-10 grid grid-cols-2 border-t border-primary/15 dark:border-white/15 lg:grid-cols-4">
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className={`px-4 py-5 ${index > 0 ? "lg:border-l border-primary/15 dark:border-white/15" : "pl-0"} ${
                  index % 2 === 1 ? "border-l border-primary/15 dark:border-white/15" : ""
                }`}
              >
                <dt className="text-xs text-slate-500 dark:text-slate-400">{fact.label}</dt>
                <dd className="mt-1 font-bold">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Our story */}
      <section className={`${PAGE_BG} pb-20 pt-12 md:pb-24`}>
        <Reveal className={`${WRAP} grid gap-10 lg:grid-cols-12`}>
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-extrabold">Who we are</h2>
            <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Healing a nation that has carried its pain in silence
            </p>
          </div>
          <div className="lg:col-span-8">
            <p className="text-xl font-semibold leading-relaxed md:text-2xl">{storyParagraphs[0]}</p>
            {storyParagraphs.slice(1).map((text, index) => (
              <p key={index} className="mt-6 max-w-[640px] leading-relaxed text-slate-600 dark:text-slate-300">
                {text}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Mission & vision */}
      <section className="bg-white py-16 dark:bg-background-dark/60 md:py-24">
        <Reveal className={`${WRAP} flex flex-col gap-5 md:block`}>
          <article className="rounded-2xl bg-[#e6f0ed] p-8 dark:bg-white/5 md:w-[72%] md:p-10 md:pb-20">
            <p className="flex items-center gap-2 text-xs font-bold text-accent">
              <span className="material-symbols-outlined text-[18px]">target</span>
              Our Mission
            </p>
            <p className="mt-4 text-xl font-bold leading-snug md:text-2xl">{missionText.lead}</p>
            <p className="mt-4 max-w-[520px] text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {missionText.rest}
            </p>
          </article>
          <article className="relative rounded-2xl bg-primary p-8 text-white shadow-xl md:z-10 md:-mt-12 md:ml-auto md:w-[72%] md:p-10">
            <p className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              Our Vision
            </p>
            <p className="mt-4 text-xl font-bold leading-snug md:text-2xl">{visionText.lead}</p>
            <p className="mt-4 max-w-[520px] text-sm leading-relaxed text-slate-300">{visionText.rest}</p>
          </article>
        </Reveal>
      </section>

      {/* Core values */}
      <section className={`${PAGE_BG} py-16 md:py-24`}>
        <Reveal className={`${WRAP} grid gap-10 lg:grid-cols-12`}>
          <div className="lg:col-span-4">
            <Eyebrow>What guides us</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold">Our Core Values</h2>
          </div>
          <ul className="lg:col-span-8">
            {values.map((value, index) => (
              <li
                key={value.title}
                className={`grid items-center gap-3 py-5 sm:grid-cols-[240px_1fr] sm:gap-8 ${
                  index > 0 ? "border-t border-primary/10 dark:border-white/10" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <span className="material-symbols-outlined text-[22px]">{value.icon}</span>
                  </span>
                  <h3 className="font-bold">{value.title}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{value.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Leadership */}
      {hasLeader ? (
        <section className={`${PAGE_BG} pb-16 md:pb-24`}>
          <Reveal className={WRAP}>
            <div className="grid items-center gap-8 rounded-3xl bg-[#f3e9d8] p-6 dark:bg-white/10 md:p-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-2xl bg-[#f8f3ea] dark:bg-white/10">
                  {settings.leader_photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={leaderName} className="absolute inset-0 h-full w-full object-cover" src={settings.leader_photo} />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-accent/60">
                      <span className="material-symbols-outlined text-6xl">person</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-8">
                <Eyebrow>{t.leadership}</Eyebrow>
                {leaderName ? <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{leaderName}</h2> : null}
                {leaderTitle ? <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{leaderTitle}</p> : null}
                <div className="mt-5 flex max-w-[640px] flex-col gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {leaderBio.map((text, index) => (
                    <p key={index}>{text}</p>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      ) : null}

      <TeamSection />

      {/* Why Somalia needs BSO */}
      <section className="bg-primary py-16 text-white md:py-24">
        <Reveal className={`${WRAP} grid gap-12 lg:grid-cols-12`}>
          <div className="lg:col-span-7">
            <Eyebrow light>The need</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Why Somalia Needs BSO</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div className="border-t border-white/20 pt-5">
                <p className="text-5xl font-extrabold text-accent md:text-6xl">
                  <Counter suffix="%+" value={70} />
                </p>
                <p className="mt-3 max-w-[260px] text-sm text-slate-300">
                  Population affected by trauma-related conditions.
                </p>
              </div>
              <div className="border-t border-white/20 pt-5">
                <p className="text-5xl font-extrabold text-accent md:text-6xl">1 in 3</p>
                <p className="mt-3 max-w-[260px] text-sm text-slate-300">
                  Somalis experiencing mental health challenges.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 text-sm leading-relaxed text-slate-300 lg:col-span-5">
            <p>
              Decades of conflict and displacement have left deep psychological scars on the Somali
              population. Many suffer in silence due to the severe social stigma surrounding mental
              illness.
            </p>
            <p>
              BSO exists to break this cycle. We provide the vital link between clinical expertise
              and community understanding, ensuring that trauma recovery is not a luxury, but a
              reality for everyone in Somalia.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Achievements */}
      {achievements.length > 0 ? (
        <section className={`${PAGE_BG} py-16 md:py-24`}>
          <Reveal className={`${WRAP} grid gap-10 lg:grid-cols-12`}>
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-extrabold">{t.achievements}</h2>
            </div>
            <ol className="relative flex flex-col gap-8 border-l border-accent/40 pl-7 lg:col-span-8">
              {achievements.map((item) => (
                <li key={item.id} className="relative">
                  <span className="absolute -left-[33px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                  <p className="text-xs font-bold text-accent">
                    {new Intl.DateTimeFormat(lang === "so" ? "so-SO" : "en-US", {
                      month: "long",
                      year: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(String(item.date)))}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{localized(item, "title", lang)}</h3>
                  {localized(item, "description", lang) ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {localized(item, "description", lang)}
                    </p>
                  ) : null}
                  {item.evidence_url ? (
                    <a
                      className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-accent hover:underline"
                      href={String(item.evidence_url)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      {String(item.evidence_label) || t.evidence}
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
          </Reveal>
        </section>
      ) : null}

      <Partners className={PAGE_BG} />

      {/* CTA */}
      <section className={`${PAGE_BG} pb-20`}>
        <div className={WRAP}>
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-accent px-8 py-12 text-white md:flex-row md:items-center md:px-12">
            <div className="max-w-[520px]">
              <h2 className="text-3xl font-extrabold md:text-4xl">Be part of the healing</h2>
              <p className="mt-3 text-white/85">
                Explore our programs, read stories from the field, or support our work.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary/85"
                href="/programs"
              >
                Our Programs
              </Link>
              <Link
                className="inline-flex h-11 items-center rounded-full border border-white/60 px-6 text-sm font-bold text-white transition-colors hover:bg-white/10"
                href="/donate"
              >
                Donate
              </Link>
              <Link
                className="inline-flex h-11 items-center rounded-full border border-white/60 px-6 text-sm font-bold text-white transition-colors hover:bg-white/10"
                href="/governance"
              >
                {t.governance}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
