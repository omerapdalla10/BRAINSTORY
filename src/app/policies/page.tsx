import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";
import PageHero from "@/components/PageHero";
import { listPublicContent } from "@/lib/content";
import { getDictionary, getLang, localized } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Policies | Brain Story Organization",
};

export const dynamic = "force-dynamic";

const PAD = "px-4 sm:px-8 lg:px-12";

export default async function PoliciesPage() {
  const lang = await getLang();
  const t = getDictionary(lang);
  const policies = await listPublicContent("policies");

  return (
    <main className="bg-background-light dark:bg-background-dark text-primary dark:text-slate-100 min-h-screen flex flex-col">
      <Header />

      <PageHero
        crumb={t.policies}
        image="/SAWIR/3b00924a-e3ad-442d-8515-5e7693b63f7b.jpeg"
        subtitle="Our privacy, safeguarding and organizational policies."
        title={t.policies}
      />

      <section className={`w-full ${PAD} py-12 md:py-16`}>
        <div className="mx-auto max-w-[1280px]">
          {policies.length === 0 ? (
            <ComingSoon icon="policy" message={t.comingSoon} />
          ) : (
            <ul className="border-b border-neutral-soft dark:border-slate-700">
              {policies.map((policy) => (
                <li key={policy.id} className="border-t border-neutral-soft dark:border-slate-700">
                  <Link
                    className="group flex items-center gap-5 py-7 transition-colors"
                    href={`/policies/${String(policy.slug)}`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                      <span className="material-symbols-outlined text-[22px]">verified_user</span>
                    </span>
                    <span className="flex-1 text-xl font-extrabold transition-colors group-hover:text-accent">
                      {localized(policy, "title", lang)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-accent">
                      {t.readPolicy}
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
