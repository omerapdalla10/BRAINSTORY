import { listPublicContent } from "@/lib/content";
import { getDictionary, getLang } from "@/lib/i18n";

/** Shown until partners are added in the dashboard, so the section is never empty. */
const FALLBACK = [{ name: "UNDP" }, { name: "HRPG" }, { name: "Hormuud" }];

type PartnersProps = {
  className?: string;
};

export default async function Partners({ className = "" }: PartnersProps) {
  const t = getDictionary(await getLang());
  const saved = await listPublicContent("partners");
  const partners =
    saved.length > 0
      ? saved.map((item) => ({
          name: String(item.name),
          logo: String(item.logo_url) || "",
          website: String(item.website) || "",
        }))
      : FALLBACK.map((item) => ({ ...item, logo: "", website: "" }));

  return (
    <section className={`w-full px-4 sm:px-8 lg:px-12 py-14 ${className}`}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-14 gap-y-6">
        <p className="text-sm font-bold">{t.partners}</p>
        <ul className="flex flex-wrap items-center gap-x-12 gap-y-6">
          {partners.map((partner) => {
            const content = partner.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={partner.name}
                className="h-9 w-auto max-w-[150px] object-contain opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                src={partner.logo}
              />
            ) : (
              <span className="text-lg font-extrabold tracking-tight text-slate-400 transition-colors hover:text-primary dark:hover:text-white">
                {partner.name}
              </span>
            );

            return (
              <li key={partner.name} className="flex items-center">
                {partner.website ? (
                  <a href={partner.website} rel="noopener noreferrer" target="_blank" title={partner.name}>
                    {content}
                  </a>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
