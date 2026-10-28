import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PostCover from "@/components/PostCover";
import Reveal from "@/components/Reveal";
import { getPublishedPrograms } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Programs | Brain Story Organization",
};

const PAD = "px-4 sm:px-8 lg:px-12";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const programs = await getPublishedPrograms();

  return (
    <main className="bg-background-light dark:bg-background-dark text-primary dark:text-slate-100 min-h-screen flex flex-col">
      <Header />

      <PageHero
        crumb="Programs"
        image="/SAWIR/1.jpg.jpeg"
        subtitle="Empowering communities across Somalia through professional mental health initiatives, crisis response, and psychosocial support."
        title="Our Programs"
      />

      <section className={`w-full ${PAD} py-20 md:py-28`}>
        <div className="mx-auto max-w-[1280px]">
          <Reveal className="mb-12 flex flex-col gap-4 md:mb-16">
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-accent">
              <span className="h-0.5 w-8 bg-accent" />
              What we offer
            </span>
            <h2 className="max-w-[760px] text-3xl font-black leading-tight md:text-4xl">
              Comprehensive mental health initiatives
            </h2>
            <p className="max-w-[720px] text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Our mission is to dismantle the barriers to mental health care. We provide
              professional, culturally sensitive support and community-led empowerment to address
              the silent crisis in our region.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => (
              <Reveal key={program.title} delay={index * 80}>
                <article className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-neutral-soft bg-white p-8 transition-all hover:border-accent hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  {program.image_url ? (
                    <div className="relative -mx-8 -mt-8 aspect-[16/10] overflow-hidden">
                      <PostCover imageUrl={program.image_url} title={program.title} />
                    </div>
                  ) : (
                    <span className="absolute right-6 top-5 text-4xl font-black text-slate-100 dark:text-slate-800">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                  <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    <span className="material-symbols-outlined text-3xl">{program.icon}</span>
                  </span>
                  <h3 className="relative text-xl font-bold leading-snug">{program.title}</h3>
                  <p className="relative leading-relaxed text-slate-600 dark:text-slate-400">
                    {program.description}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                </article>
              </Reveal>
            ))}

            <Reveal delay={programs.length * 80}>
              <Link
                href="/contact"
                className="group flex h-full flex-col justify-between gap-6 rounded-2xl bg-primary p-8 text-white transition-all hover:shadow-xl"
              >
                <div>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-emerald-300">
                    <span className="material-symbols-outlined text-3xl">handshake</span>
                  </span>
                  <h3 className="mt-5 text-xl font-bold">Partner with us</h3>
                  <p className="mt-3 leading-relaxed text-slate-300">
                    Want to bring one of these programs to your community or support our work?
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 font-bold text-emerald-300 transition-all group-hover:gap-3">
                  Get in touch
                  <span className="material-symbols-outlined">arrow_forward</span>
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={`w-full ${PAD} pb-24`}>
        <Reveal className="mx-auto max-w-[1280px]">
          <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-white md:p-16">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/10" />
            <div className="absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-white/5" />
            <div className="relative flex flex-col items-center gap-6 text-center">
              <span className="material-symbols-outlined text-5xl text-emerald-300">support_agent</span>
              <h2 className="max-w-[720px] text-3xl font-black md:text-4xl">Need immediate help?</h2>
              <p className="max-w-[720px] text-lg leading-relaxed text-slate-300">
                If you or someone you know is in crisis, our team is here to support you 24/7. We
                offer confidential, free-of-charge assistance for anyone in distress.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-4">
                <Link
                  className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-xl bg-accent px-6 font-bold text-white transition-all hover:brightness-110"
                  href="/contact"
                >
                  Contact Crisis Team
                </Link>
                <Link
                  className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-xl border border-white/30 px-6 font-bold text-white transition-all hover:bg-white/10"
                  href="/articles"
                >
                  View Resources
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
