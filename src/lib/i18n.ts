import { cookies } from "next/headers";

export type Lang = "en" | "so";

export const LANG_COOKIE = "lang";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return store.get(LANG_COOKIE)?.value === "so" ? "so" : "en";
}

/** Interface labels. Page content comes from the dashboard (English + Somali fields). */
const dictionary = {
  en: {
    home: "Home",
    about: "About Us",
    programs: "Programs",
    projects: "Projects",
    articles: "Articles",
    contact: "Contact",
    donate: "Donate",
    governance: "Governance",
    policies: "Policies",
    quickLinks: "Quick Links",
    contactTitle: "Contact",
    followUs: "Follow Us",
    latestArticles: "Latest Articles",
    successStories: "Success Stories",
    partner: "Partner With Us",
    rights: "All rights reserved.",
    leadership: "Leadership",
    achievements: "Achievements",
    testimonials: "What people say",
    current: "Current projects",
    completed: "Completed projects",
    evidence: "View evidence",
    comingSoon: "This information will be published soon.",
    registeredWith: "Registered with",
    registrationNumber: "Registration number",
    registrationDate: "Date of registration",
    readPolicy: "Read policy",
    language: "Language",
    advocacy: "Advocacy",
    advocacyTitle: "Human Rights & Advocacy",
    impact: "Impact",
    impactTitle: "Impact & Resources",
    partners: "Our Partners",
    team: "Our Team",
    donateNow: "Donate now",
    download: "Download",
    communityStories: "Approved community stories",
    allStories: "Read all stories",
    emailAccounts: "Email accounts",
    rightsTitle: "Mental health rights",
    stigmaTitle: "Stigma reduction",
    inclusionTitle: "Inclusion",
    advocacyPillar: "Advocacy",
    openLink: "Open",
    donateExternal: "You will be taken to our secure donation page.",
  },
  so: {
    home: "Hoyga",
    about: "Nagu saabsan",
    programs: "Barnaamijyada",
    projects: "Mashaariicda",
    articles: "Maqaallada",
    contact: "Nala xiriir",
    donate: "Deeq bixi",
    governance: "Maamulka",
    policies: "Siyaasadaha",
    quickLinks: "Xiriirro degdeg ah",
    contactTitle: "Xiriirka",
    followUs: "Nala soo raac",
    latestArticles: "Maqaallada ugu dambeeyay",
    successStories: "Sheekooyin guul ah",
    partner: "Nala shaqayso",
    rights: "Xuquuqda oo dhan way dhowran tahay.",
    leadership: "Hoggaanka",
    achievements: "Guulaha",
    testimonials: "Waxa dadku sheegaan",
    current: "Mashaariicda socda",
    completed: "Mashaariicda dhammaaday",
    evidence: "Arag caddaynta",
    comingSoon: "Macluumaadkan dhawaan ayaa la daabici doonaa.",
    registeredWith: "Waxaa laga diiwaangeliyay",
    registrationNumber: "Lambarka diiwaangelinta",
    registrationDate: "Taariikhda diiwaangelinta",
    readPolicy: "Akhri siyaasadda",
    language: "Luuqadda",
    advocacy: "U-doodista",
    advocacyTitle: "Xuquuqda Aadanaha & U-doodista",
    impact: "Saameynta",
    impactTitle: "Saameynta & Agabka",
    partners: "Lammaanayaasheenna",
    team: "Kooxdayada",
    donateNow: "Hadda ku deeq",
    download: "Soo dejiso",
    communityStories: "Sheekooyin bulsho oo la oggolaaday",
    allStories: "Akhri dhammaan sheekooyinka",
    emailAccounts: "Akoonnada email-ka",
    rightsTitle: "Xuquuqda caafimaadka maskaxda",
    stigmaTitle: "Yareynta ceebaynta",
    inclusionTitle: "Ka-qaybgalka dhammaan",
    advocacyPillar: "U-doodista",
    openLink: "Fur",
    donateExternal: "Waxaa laguu gudbin doonaa boggayaga deeqaha ee ammaanka ah.",
  },
} as const;

export type Dictionary = Record<keyof (typeof dictionary)["en"], string>;

export function getDictionary(lang: Lang): Dictionary {
  return dictionary[lang];
}

/** Picks the Somali value when the visitor chose Somali and a translation exists. */
export function localized(values: Record<string, unknown>, key: string, lang: Lang): string {
  const so = lang === "so" ? String(values[`${key}_so`] ?? "").trim() : "";
  return so || String(values[key] ?? "").trim();
}

/** Splits stored text on blank lines for rendering as paragraphs. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}
