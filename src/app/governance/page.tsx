import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";
import PageHero from "@/components/PageHero";
import { getDictionary, getLang, localized, paragraphs, type Lang } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/site";

export const metadata: Metadata = {
  title: "Governance | Brain Story Organization",
};

export const dynamic = "force-dynamic";

const PAD = "px-4 sm:px-8 lg:px-12";

function formatDate(value: string, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "so" ? "so-SO" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default async function GovernancePage() {
  const lang = await getLang();
  const t = getDictionary(lang);
  const settings = await getSiteSettings();

  const facts = [
    { icon: "account_balance", label: t.registeredWith, value: settings.registration_body.trim() },
    { icon: "badge", label: t.registrationNumber, value: settings.registration_number.trim() },
    {
      icon: "event",
      label: t.registrationDate,
      value: settings.registration_date ? formatDate(settings.registration_date, lang) : "",
    },
  ].filter((fact) => fact.value);
  const governance = paragraphs(localized(settings, "governance_text", lang));
  const hasContent = facts.length > 0 || governance.length > 0;

  return (
    <main className="bg-background-light dark:bg-background-dark text-primary dark:text-slate-100 min-h-screen flex flex-col">
      <Header />

      <PageHero
        crumb={t.governance}
        image="/SAWIR/3b00924a-e3ad-442d-8515-5e7693b63f7b.jpeg"
        subtitle="How Brain Story Organization is registered, governed and held accountable."
        title={t.governance}
      />

      <section className={`w-full ${PAD} py-12 md:py-16`}>
        <div className="mx-auto max-w-[1280px] flex flex-col gap-10">
          {!hasContent ? (
            <ComingSoon icon="gavel" message={t.comingSoon} />
          ) : (
            <>
              {facts.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-start gap-4 rounded-2xl border border-neutral-soft bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                        <span className="material-symbols-outlined">{fact.icon}</span>
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {fact.label}
                        </p>
                        <p className="mt-1 break-words font-bold">{fact.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {governance.length > 0 ? (
                <div className="flex flex-col gap-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                  {governance.map((text, index) => (
                    <p key={index}>{text}</p>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
