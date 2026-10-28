// Client-safe description of the organization-wide settings edited in Dashboard > Organization.

import type { Field } from "@/lib/content-config";

export type SiteSection = {
  id: string;
  title: string;
  icon: string;
  description: string;
  fields: Field[];
};

export const SITE_SECTIONS: SiteSection[] = [
  {
    id: "profile",
    title: "Organizational profile",
    icon: "apartment",
    description: "The finalized description of the organization, shown on the About page.",
    fields: [
      {
        key: "profile_text",
        label: "Organizational profile",
        type: "textarea",
        bilingual: true,
        help: "Separate paragraphs with a blank line. Leave empty to keep the default About text.",
      },
    ],
  },
  {
    id: "leadership",
    title: "Founder / Executive Director",
    icon: "person",
    description: "The approved professional biography of the founder or Executive Director.",
    fields: [
      { key: "leader_name", label: "Full name", type: "text" },
      { key: "leader_title", label: "Title", type: "text", bilingual: true, placeholder: "e.g. Founder & Executive Director" },
      { key: "leader_photo", label: "Approved photo", type: "image" },
      { key: "leader_bio", label: "Biography", type: "textarea", bilingual: true },
    ],
  },
  {
    id: "governance",
    title: "Registration & governance",
    icon: "gavel",
    description: "The organization's actual registration and governance information.",
    fields: [
      { key: "registration_body", label: "Registered with", type: "text", placeholder: "Name of the registering authority" },
      { key: "registration_number", label: "Registration number", type: "text" },
      { key: "registration_date", label: "Date of registration", type: "date" },
      {
        key: "governance_text",
        label: "Governance structure",
        type: "textarea",
        bilingual: true,
        help: "Board, management, accountability. Separate paragraphs with a blank line.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact details",
    icon: "contact_mail",
    description: "Used on the Contact page, the footer and the contact form.",
    fields: [
      { key: "contact_email", label: "Organizational email address", type: "text", placeholder: "info@yourdomain.org" },
      { key: "contact_phone", label: "Phone", type: "text", placeholder: "+252 ..." },
      { key: "contact_address", label: "Address", type: "text", bilingual: true, placeholder: "Mogadishu, Somalia" },
      {
        key: "extra_emails",
        label: "Other email accounts",
        type: "textarea",
        help: "One per line, as Label: address. Example: Partnerships: partners@yourdomain.org",
      },
    ],
  },
  {
    id: "advocacy",
    title: "Human rights & advocacy",
    icon: "balance",
    description:
      "How the organization approaches mental health rights, stigma reduction, inclusion and advocacy. Leave a box empty to keep the default text.",
    fields: [
      { key: "advocacy_intro", label: "Introduction", type: "textarea", bilingual: true },
      { key: "advocacy_rights", label: "Mental health rights", type: "textarea", bilingual: true },
      { key: "advocacy_stigma", label: "Stigma reduction", type: "textarea", bilingual: true },
      { key: "advocacy_inclusion", label: "Inclusion", type: "textarea", bilingual: true },
      { key: "advocacy_advocacy", label: "Advocacy", type: "textarea", bilingual: true },
    ],
  },
  {
    id: "donations",
    title: "Donations",
    icon: "volunteer_activism",
    description: "Where supporters can donate. When a link is set, the Donate page sends people there.",
    fields: [
      {
        key: "donation_url",
        label: "Donation link",
        type: "url",
        placeholder: "https://...",
        help: "Your payment or donation page (PayPal, GoFundMe, bank page, etc.).",
      },
      {
        key: "donation_note",
        label: "Donation instructions",
        type: "textarea",
        bilingual: true,
        help: "Optional. For example mobile money (EVC Plus) or bank transfer details.",
      },
    ],
  },
  {
    id: "social",
    title: "Social media",
    icon: "share",
    description: "Only the accounts you fill in appear in the website footer.",
    fields: [
      { key: "facebook_url", label: "Facebook", type: "url", placeholder: "https://facebook.com/..." },
      { key: "x_url", label: "X (Twitter)", type: "url", placeholder: "https://x.com/..." },
      { key: "instagram_url", label: "Instagram", type: "url", placeholder: "https://instagram.com/..." },
      { key: "linkedin_url", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/company/..." },
      { key: "youtube_url", label: "YouTube", type: "url", placeholder: "https://youtube.com/@..." },
      { key: "tiktok_url", label: "TikTok", type: "url", placeholder: "https://tiktok.com/@..." },
    ],
  },
];

export const SOCIAL_LINKS = [
  { key: "facebook_url", label: "Facebook" },
  { key: "x_url", label: "X" },
  { key: "instagram_url", label: "Instagram" },
  { key: "linkedin_url", label: "LinkedIn" },
  { key: "youtube_url", label: "YouTube" },
  { key: "tiktok_url", label: "TikTok" },
] as const;

/** Draft wording for the advocacy page, shown until the organization saves its own. */
export const ADVOCACY_DEFAULTS = {
  advocacy_intro:
    "Mental health is a human right. We work so that every person in Somalia can seek care without fear, shame, or discrimination.",
  advocacy_rights:
    "We promote the right of every person to accessible, dignified and confidential mental health care, and we speak up for services that respect people's culture, faith and safety.",
  advocacy_stigma:
    "Many people suffer in silence because of the stigma around mental illness. Through community dialogue, education and culturally relevant messages, we replace fear and silence with understanding.",
  advocacy_inclusion:
    "Healing spaces must be open to everyone. We prioritise the people most affected by conflict, displacement, poverty and violence, so that no one is left behind.",
  advocacy_advocacy:
    "We use what we learn from our work to speak for the voiceless, engage institutions and decision-makers, and help make mental health a national priority.",
} as const;

/** Splits "Label: address" lines. Lines without a valid address are returned as `invalid`. */
export function parseEmailLines(text: string): {
  accounts: { label: string; email: string }[];
  invalid: string[];
} {
  const accounts: { label: string; email: string }[] = [];
  const invalid: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^(?:(.*?)\s*:\s*)?(\S+@\S+\.\S+)$/);
    if (match) {
      accounts.push({ label: (match[1] ?? "").trim(), email: match[2] });
    } else {
      invalid.push(trimmed);
    }
  }
  return { accounts, invalid };
}

export type SiteSettings = Record<string, string>;

/** Every stored key, including `_so` translations. */
export function siteKeys(): string[] {
  return SITE_SECTIONS.flatMap((section) =>
    section.fields.flatMap((field) => (field.bilingual ? [field.key, `${field.key}_so`] : [field.key])),
  );
}

/** Contact values used until the dashboard ones are filled in (they were already on the site). */
export const CONTACT_FALLBACK = {
  email: "info@brainstory.so",
  phone: "+252 61 1119160",
  address: "Mogadishu, Somalia",
};
