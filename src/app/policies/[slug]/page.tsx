import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPublicPolicy } from "@/lib/content";
import { getDictionary, getLang, localized, paragraphs } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type PolicyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = await getPublicPolicy(slug);
  return { title: policy ? `${String(policy.title)} | Brain Story Organization` : "Policy" };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = await getPublicPolicy(slug);
  if (!policy) {
    notFound();
  }

  const lang = await getLang();
  const t = getDictionary(lang);
  const body = paragraphs(localized(policy, "body", lang));

  return (
    <main className="bg-background-light dark:bg-background-dark text-primary dark:text-slate-100 min-h-screen flex flex-col">
      <Header />

      <article className="w-full flex-1 px-4 sm:px-8 lg:px-12 py-16">
        <div className="mx-auto flex max-w-[860px] flex-col gap-8">
          <Link
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all"
            href="/policies"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            {t.policies}
          </Link>
          <h1 className="text-3xl font-black leading-tight md:text-5xl">{localized(policy, "title", lang)}</h1>
          <div className="flex flex-col gap-5 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            {body.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
