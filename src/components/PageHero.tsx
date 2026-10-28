import Image from "next/image";

type PageHeroProps = {
  title: string;
  subtitle: string;
  /** Page name. No longer shown (breadcrumbs were removed) but kept so callers stay valid. */
  crumb?: string;
  /** Photo shown on the right (rounded). Omit it when `aside` is used instead. */
  image?: string;
  /** Custom right-hand content, e.g. a form card. */
  aside?: React.ReactNode;
  /** Extra content under the intro text. */
  children?: React.ReactNode;
};

/** Shared top section for inner pages: breadcrumb, title and intro on the left, photo or card on the right. */
export default function PageHero({ title, subtitle, image, aside, children }: PageHeroProps) {
  const hasRight = Boolean(image || aside);

  return (
    <section className="w-full bg-[#f3f6f5] dark:bg-background-dark">
      <div
        className={`mx-auto grid w-full max-w-[1280px] gap-10 px-4 pb-14 pt-12 sm:px-8 lg:px-12 ${
          hasRight ? "lg:grid-cols-12" : ""
        } ${aside ? "lg:items-start" : "lg:items-center"}`}
      >
        <div className={`admin-animate ${hasRight ? "lg:col-span-7" : ""}`}>
          <h1 className="max-w-[640px] text-4xl font-extrabold leading-[1.08] tracking-tight text-primary dark:text-white md:text-5xl [text-wrap:balance]">
            {title}
          </h1>
          <p className="mt-5 max-w-[520px] leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
            {subtitle}
          </p>
          {children}
        </div>

        {image ? (
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-xl shadow-primary/10">
              <Image alt="" className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 40vw" src={image} />
            </div>
          </div>
        ) : null}
        {aside ? <div className="lg:col-span-5">{aside}</div> : null}
      </div>
    </section>
  );
}
