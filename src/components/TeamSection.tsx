import Reveal from "@/components/Reveal";
import { listPublicContent } from "@/lib/content";
import { getDictionary, getLang, localized } from "@/lib/i18n";

/** Team grid for the About page. Renders nothing until members are added in the dashboard. */
export default async function TeamSection() {
  const lang = await getLang();
  const t = getDictionary(lang);
  const members = await listPublicContent("team");
  if (members.length === 0) return null;

  return (
    <section className="w-full bg-white px-4 py-16 dark:bg-background-dark/60 sm:px-8 md:py-24 lg:px-12">
      <Reveal className="mx-auto max-w-[1280px]">
        <h2 className="mb-10 text-3xl font-extrabold">{t.team}</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => {
            const bio = localized(member, "bio", lang);
            return (
              <article key={member.id}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#e6f0ed] dark:bg-white/5">
                  {member.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={String(member.name)}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={String(member.photo_url)}
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-accent/60">
                      <span className="material-symbols-outlined text-6xl">person</span>
                    </div>
                  )}
                </div>
                <h3 className="mt-4 font-bold">{String(member.name)}</h3>
                <p className="mt-0.5 text-xs font-bold text-accent">{localized(member, "role", lang)}</p>
                {bio ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {bio}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
