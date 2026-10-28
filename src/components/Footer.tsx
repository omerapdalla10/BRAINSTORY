import Image from "next/image";
import Link from "next/link";
import { getDictionary, getLang } from "@/lib/i18n";
import { getContact, getSiteSettings } from "@/lib/site";
import { SOCIAL_LINKS, parseEmailLines } from "@/lib/site-config";

export default async function Footer() {
  const lang = await getLang();
  const t = getDictionary(lang);
  const settings = await getSiteSettings();
  const contact = getContact(settings, lang);
  const extraEmails = parseEmailLines(settings.extra_emails).accounts;
  const socials = SOCIAL_LINKS.filter((social) => settings[social.key].trim());
  const phoneDigits = contact.phone.replace(/[^\d]/g, "");

  const columns = [
    {
      title: t.about,
      links: [
        { href: "/about", label: t.about },
        { href: "/governance", label: t.governance },
        { href: "/policies", label: t.policies },
        { href: "/impact", label: t.impactTitle },
      ],
    },
    {
      title: t.programs,
      links: [
        { href: "/programs", label: t.programs },
        { href: "/projects", label: t.projects },
        { href: "/advocacy", label: t.advocacyTitle },
        { href: "/articles", label: t.latestArticles },
      ],
    },
  ];

  return (
    <footer className="w-full bg-primary px-4 py-16 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center">
              <div className="relative h-14 w-[180px]">
                <Image
                  src="/brand/footer/logo.png"
                  alt="Brain Story"
                  fill
                  className="object-contain object-left"
                  sizes="180px"
                />
              </div>
            </Link>
            <p className="max-w-[320px] text-sm leading-relaxed text-slate-300">
              Brain Story Organization is a Somali-led organization working at the intersection of
              mental health and peacebuilding to create a more resilient society.
            </p>
            {socials.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {socials.map((social) => (
                  <a
                    key={social.key}
                    aria-label={social.label}
                    className="inline-flex h-9 items-center rounded-full border border-white/25 px-4 text-xs font-semibold transition-colors hover:border-accent hover:bg-accent"
                    href={settings[social.key]}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h4 className="text-sm font-bold">{column.title}</h4>
              <nav className="flex flex-col gap-3 text-sm text-slate-300">
                {column.links.map((link) => (
                  <Link key={link.href} className="transition-colors hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold">{t.contactTitle}</h4>
            <div className="flex flex-col gap-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-accent">location_on</span>
                <span>{contact.address}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-accent">mail</span>
                <a className="break-all transition-colors hover:text-white" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </div>
              {extraEmails.map((account) => (
                <div key={account.email} className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-accent">alternate_email</span>
                  <a className="break-all transition-colors hover:text-white" href={`mailto:${account.email}`}>
                    {account.label ? `${account.label}: ` : ""}
                    {account.email}
                  </a>
                </div>
              ))}
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-accent">call</span>
                <a className="transition-colors hover:text-white" href={`tel:+${phoneDigits}`}>
                  {contact.phone}
                </a>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-accent px-5 text-sm font-bold transition-all hover:brightness-110"
                href="/donate"
              >
                <span className="material-symbols-outlined text-[16px]">favorite</span>
                {t.donate}
              </Link>
              <Link
                className="inline-flex h-10 items-center rounded-full border border-white/30 px-5 text-sm font-bold transition-colors hover:bg-white/10"
                href="/contact"
              >
                {t.partner}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Brain Story Organization (BSO). {t.rights}
          </p>
          <p>{contact.address}</p>
        </div>
      </div>

      {phoneDigits ? (
        <a
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-2xl bg-[#25d366] text-white shadow-xl transition-transform hover:scale-110"
          href={`https://wa.me/${phoneDigits}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="material-symbols-outlined text-[26px]">chat</span>
        </a>
      ) : null}
    </footer>
  );
}
