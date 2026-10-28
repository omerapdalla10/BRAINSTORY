// Client-safe program types and defaults (no database imports).

export type Program = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url?: string;
  status: "draft" | "published";
  sort_order: number;
};

/** Icons offered in the dashboard picker (Material Symbols names). */
export const PROGRAM_ICONS = [
  "campaign",
  "diversity_1",
  "e911_emergency",
  "health_and_safety",
  "volunteer_activism",
  "psychology",
  "groups",
  "school",
  "favorite",
  "handshake",
  "family_restroom",
  "medical_services",
  "forum",
  "spa",
  "emoji_people",
  "menu_book",
];

export const DEFAULT_PROGRAMS: Omit<Program, "id">[] = [
  {
    icon: "campaign",
    title: "Mental Health Awareness & Education",
    description:
      "Reducing stigma and promoting understanding through community outreach, schools, and educational workshops tailored to local cultural contexts.",
    status: "published",
    sort_order: 1,
  },
  {
    icon: "diversity_1",
    title: "Counseling & Psychological Support",
    description:
      "Professional individual and group therapy sessions for those dealing with trauma, depression, and anxiety in a safe, confidential environment.",
    status: "published",
    sort_order: 2,
  },
  {
    icon: "e911_emergency",
    title: "Crisis Response and Intervention",
    description:
      "Rapid response services for immediate mental health emergencies and psychiatric crises, ensuring no one has to face their darkest moments alone.",
    status: "published",
    sort_order: 3,
  },
  {
    icon: "health_and_safety",
    title: "Protection & Psychosocial Support",
    description:
      "Integrated protection services focusing on the well-being and rights of vulnerable populations, including displaced persons and survivors of violence.",
    status: "published",
    sort_order: 4,
  },
  {
    icon: "volunteer_activism",
    title: "Community Healing & Empowerment",
    description:
      "Building resilience and social cohesion through collaborative healing initiatives, vocational training, and community empowerment programs.",
    status: "published",
    sort_order: 5,
  },
];
