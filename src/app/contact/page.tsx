import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { getLang } from "@/lib/i18n";
import { getContact, getSiteSettings } from "@/lib/site";
import { parseEmailLines } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us - BSO | Brain Story Organization Somalia",
};

export const dynamic = "force-dynamic";

const PAD = "px-4 sm:px-8 lg:px-12";

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const contact = getContact(settings, await getLang());
  const extraEmails = parseEmailLines(settings.extra_emails).accounts;
  const phoneHref = `tel:+${contact.phone.replace(/[^\d]/g, "")}`;

  const details = [
    { icon: "language", label: "Website", value: "www.brainstory.so", href: "https://www.brainstory.so", external: true },
    { icon: "mail", label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    ...extraEmails.map((account) => ({
      icon: "alternate_email",
      label: account.label || "Email",
      value: account.email,
      href: `mailto:${account.email}`,
    })),
    { icon: "call", label: "Phone", value: contact.phone, href: phoneHref },
    { icon: "alternate_email", label: "Social Media", value: "@brainstory", href: "" },
  ];

  const faqs = [
    {
      q: "Is support confidential and free?",
      a: "Yes. We offer confidential, free-of-charge assistance for anyone in distress.",
    },
    {
      q: "Where are you based?",
      a: "We are based in Mogadishu, Somalia, and work with communities across the country.",
    },
    {
      q: "How can my organization partner with BSO?",
      a: `Use the form above or email ${contact.email} and tell us about your organization and how you would like to collaborate.`,
    },
    {
      q: "What should I do in a crisis?",
      a: "Reach out to our team right away through the contact details on this page, or visit our centers in Mogadishu for immediate psychological first aid.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white text-primary dark:bg-background-dark dark:text-slate-100">
      <Header />

      <PageHero
        aside={
          <div className="rounded-3xl bg-white p-7 shadow-xl shadow-primary/10 dark:bg-slate-800 md:p-9">
            <h2 className="text-2xl font-extrabold">Send us a message</h2>
            <div className="mt-6">
              <ContactForm email={contact.email} />
            </div>
          </div>
        }
        crumb="Contact"
        subtitle="Whether you are looking for support, interested in partnership, or simply want to learn more about our work, we are here to listen and help."
        title="Contact Our Team"
      >
        <h2 className="sr-only">Contact Information</h2>
        <ul className="mt-8 max-w-[420px] border-t border-primary/10 dark:border-white/10">
          {details.map((item) => (
            <li
              key={`${item.label}-${item.value}`}
              className="flex items-center gap-4 border-b border-primary/10 py-4 dark:border-white/10"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{item.label}</p>
                {item.href ? (
                  <a
                    className="break-all text-sm font-bold transition-colors hover:text-accent"
                    href={item.href}
                    {...(item.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm font-bold">{item.value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Map */}
      <section className={`w-full bg-[#f3f6f5] ${PAD} pb-16 dark:bg-background-dark`}>
        <Reveal className="mx-auto max-w-[1280px]">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-accent">Our Location</p>
          <div className="relative aspect-[21/9] min-h-[240px] w-full overflow-hidden rounded-3xl bg-[#e6f0ed] dark:bg-slate-800">
            <iframe
              className="h-full w-full"
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127593.75487679464!2d45.24430488612154!3d2.043513687391963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3d58425955364893%3A0x5ca9196568600d44!2sMogadishu%2C%20Somalia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              style={{ border: 0 }}
              title="Map"
              allowFullScreen
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold shadow-md dark:bg-slate-800">
              <span className="material-symbols-outlined text-[16px] text-accent">location_on</span>
              {contact.address}
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className={`w-full ${PAD} py-16 md:py-20`}>
        <Reveal className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-12">
          <h2 className="text-3xl font-extrabold leading-tight lg:col-span-4">Frequently asked questions</h2>
          <div className="lg:col-span-8">
            {faqs.map((item, index) => (
              <details
                key={item.q}
                className={`group border-b border-neutral-soft py-5 dark:border-slate-700 ${
                  index === 0 ? "border-t" : ""
                }`}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {item.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                    <span className="material-symbols-outlined text-[18px] group-open:hidden">add</span>
                    <span className="material-symbols-outlined hidden text-[18px] group-open:block">remove</span>
                  </span>
                </summary>
                <p className="mt-3 max-w-[640px] leading-relaxed text-slate-600 dark:text-slate-300">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Urgent support */}
      <section className={`w-full bg-[#f3f6f5] ${PAD} py-16 dark:bg-background-dark`}>
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 rounded-3xl bg-[#f3e9d8] px-8 py-10 dark:bg-white/10 md:flex-row md:items-center md:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-2xl font-extrabold">Are you looking for urgent support?</h2>
            <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">
              If you or someone you know is experiencing a mental health crisis, please reach out to
              our dedicated emergency helpline or visit our centers in Mogadishu for immediate
              psychological first aid.
            </p>
          </div>
          <Link
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-white transition-colors hover:bg-primary/85"
            href="/programs"
          >
            Emergency Resources
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
