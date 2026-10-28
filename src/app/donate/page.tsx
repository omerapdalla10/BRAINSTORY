import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import DonateForm from "@/components/DonateForm";
import Reveal from "@/components/Reveal";
import { getDictionary, getLang, localized } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donate | Brain Story Organization",
};

export const dynamic = "force-dynamic";

const PAD = "px-4 sm:px-8 lg:px-12";

const uses = [
  {
    icon: "health_and_safety",
    title: "Trauma-Informed Care",
    text: "Provides one-on-one therapy sessions with qualified psychologists for conflict survivors.",
  },
  {
    icon: "diversity_3",
    title: "Community Programs",
    text: "Supports group-healing circles and peer-to-peer resilience networks in IDP camps.",
  },
  {
    icon: "school",
    title: "Mental Health Advocacy",
    text: "Funds training for local leaders and healthcare workers to recognize psychological distress.",
  },
];

export default async function DonatePage() {
  const lang = await getLang();
  const t = getDictionary(lang);
  const settings = await getSiteSettings();

  return (
    <main className="flex min-h-screen flex-col bg-white text-primary dark:bg-background-dark dark:text-slate-100">
      <Header />

      <PageHero
        aside={
          <div className="rounded-3xl bg-white p-7 shadow-xl shadow-primary/10 dark:bg-slate-800 md:p-9">
            <DonateForm
              donateLabel={t.donateNow}
              externalNotice={t.donateExternal}
              note={localized(settings, "donation_note", lang)}
              url={settings.donation_url.trim()}
            />
          </div>
        }
        crumb="Donate"
        subtitle="Brain Story Organization is rebuilding the mental health landscape in Somalia. Every contribution funds trauma-informed care and community resilience programs for those who need it most."
        title="Your Support Saves Lives"
      >
        <div className="relative mt-8 aspect-[16/10] max-w-[560px] overflow-hidden rounded-2xl shadow-lg shadow-primary/10">
          <Image
            alt="Brain Story community session"
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            src="/SAWIR/3b00924a-e3ad-442d-8515-5e7693b63f7b.jpeg"
          />
        </div>
      </PageHero>

      {/* Where your money goes */}
      <section className={`w-full bg-primary ${PAD} py-16 text-white md:py-20`}>
        <Reveal className="mx-auto max-w-[1280px]">
          <h2 className="text-3xl font-extrabold md:text-4xl">Where your money goes</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {uses.map((item) => (
              <div key={item.title} className="border-t border-white/20 pt-6">
                <span className="material-symbols-outlined text-[22px] text-accent">{item.icon}</span>
                <h3 className="mt-6 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 max-w-[320px] text-sm leading-relaxed text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-[560px] rounded-2xl bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Our Current Goal</span>
              <span className="font-bold text-accent">$75,000</span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-accent" />
            </div>
            <p className="mt-4 text-center text-xs italic text-slate-300">
              &quot;Healing a mind is the first step to building peace.&quot;
            </p>
          </div>
        </Reveal>
      </section>

      {/* Transparency */}
      <section className={`w-full bg-[#f3f6f5] ${PAD} py-16 dark:bg-background-dark`}>
        <Reveal className="mx-auto max-w-[1280px]">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#e6f0ed] px-8 py-9 dark:bg-white/5 md:flex-row md:items-center md:px-10">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined mt-0.5 text-[22px] text-accent">verified_user</span>
              <div className="max-w-[640px]">
                <h2 className="text-xl font-extrabold">100% Transparency</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  As a Somali-led non-profit, we publish annual audited reports. Your trust is our
                  greatest asset. 92% of funds go directly to program activities.
                </p>
              </div>
            </div>
            <Link
              className="inline-flex h-11 shrink-0 items-center rounded-full bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary/85"
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
