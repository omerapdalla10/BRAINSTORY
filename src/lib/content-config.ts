// Client-safe description of the dashboard-managed content types (no database imports).

export type FieldType = "text" | "textarea" | "date" | "select" | "url" | "image" | "file" | "checkbox";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  /** Somali translation field is stored under `${key}_so` and edited alongside. */
  bilingual?: boolean;
};

export type ContentType =
  | "projects"
  | "achievements"
  | "testimonials"
  | "policies"
  | "partners"
  | "team"
  | "resources";

export type ContentConfig = {
  type: ContentType;
  singular: string;
  plural: string;
  icon: string;
  description: string;
  /** Field shown as the item's headline in the dashboard list. */
  titleKey: string;
  /** Field shown under the headline. */
  subtitleKey?: string;
  fields: Field[];
  emptyHint: string;
};

export const CONTENT_TYPES: ContentType[] = [
  "projects",
  "achievements",
  "testimonials",
  "policies",
  "partners",
  "team",
  "resources",
];

export const RESOURCE_CATEGORIES = [
  { value: "annual-report", label: "Annual report" },
  { value: "policy-brief", label: "Policy brief" },
  { value: "research", label: "Research" },
  { value: "publication", label: "Publication" },
  { value: "project-results", label: "Project results" },
];

export const CONTENT_CONFIG: Record<ContentType, ContentConfig> = {
  projects: {
    type: "projects",
    singular: "project",
    plural: "Projects",
    icon: "work",
    description: "Current and completed projects shown on the public Projects page.",
    titleKey: "title",
    subtitleKey: "location",
    emptyHint: "Add your first project. Mark it Ongoing or Completed.",
    fields: [
      { key: "title", label: "Project title", type: "text", required: true, bilingual: true },
      {
        key: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "ongoing", label: "Ongoing (current)" },
          { value: "completed", label: "Completed" },
        ],
      },
      { key: "start_date", label: "Start date", type: "date" },
      { key: "end_date", label: "End date", type: "date", help: "Leave empty for ongoing projects." },
      { key: "location", label: "Location", type: "text", placeholder: "e.g. Mogadishu" },
      { key: "description", label: "Description", type: "textarea", required: true, bilingual: true },
      { key: "image_url", label: "Photo (approved images only)", type: "image" },
    ],
  },
  achievements: {
    type: "achievements",
    singular: "achievement",
    plural: "Achievements",
    icon: "emoji_events",
    description: "Verified achievements with a date and supporting evidence.",
    titleKey: "title",
    subtitleKey: "date",
    emptyHint: "Only add achievements you can support with evidence (a report, link, or document).",
    fields: [
      { key: "title", label: "Achievement", type: "text", required: true, bilingual: true },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "description", label: "Description", type: "textarea", bilingual: true },
      {
        key: "evidence_label",
        label: "Evidence label",
        type: "text",
        placeholder: "e.g. Final project report, Donor letter",
      },
      {
        key: "evidence_url",
        label: "Evidence link",
        type: "url",
        help: "Link to the document or page that verifies this achievement.",
      },
    ],
  },
  testimonials: {
    type: "testimonials",
    singular: "testimonial",
    plural: "Testimonials",
    icon: "format_quote",
    description: "Quotes from people we serve or partners. Shown publicly only with consent.",
    titleKey: "name",
    subtitleKey: "role",
    emptyHint: "Add a testimonial only after the person has given written consent to publish it.",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role / organization", type: "text", placeholder: "e.g. Program participant" },
      { key: "quote", label: "Testimonial", type: "textarea", required: true, bilingual: true },
      { key: "photo_url", label: "Photo (only with consent)", type: "image" },
      {
        key: "consent",
        label: "Written consent to publish this testimonial (and photo) was received",
        type: "checkbox",
        help: "A testimonial is hidden from the website until this box is ticked.",
      },
    ],
  },
  policies: {
    type: "policies",
    singular: "policy",
    plural: "Policies",
    icon: "policy",
    description: "Privacy, safeguarding and other organizational policies.",
    titleKey: "title",
    emptyHint: "Add policies such as Privacy Policy and Safeguarding Policy.",
    fields: [
      {
        key: "title",
        label: "Policy name",
        type: "text",
        required: true,
        bilingual: true,
        placeholder: "e.g. Privacy Policy",
      },
      {
        key: "body",
        label: "Policy text",
        type: "textarea",
        required: true,
        bilingual: true,
        help: "Separate paragraphs with a blank line.",
      },
    ],
  },
  partners: {
    type: "partners",
    singular: "partner",
    plural: "Partners",
    icon: "handshake",
    description: "Partner organizations shown with their logos on the website.",
    titleKey: "name",
    subtitleKey: "website",
    emptyHint:
      "Until you add partners here, the website shows UNDP, HRPG and Hormuud as text. Add each one with its logo.",
    fields: [
      { key: "name", label: "Organization name", type: "text", required: true },
      { key: "logo_url", label: "Logo", type: "image", help: "Use a logo you are permitted to display. A transparent PNG works best." },
      { key: "website", label: "Website", type: "url", placeholder: "https://..." },
    ],
  },
  team: {
    type: "team",
    singular: "team member",
    plural: "Team",
    icon: "groups",
    description: "Team members with their photos and details, shown on the About page.",
    titleKey: "name",
    subtitleKey: "role",
    emptyHint: "Add team members with their approved photo and role. They appear in the order you add them.",
    fields: [
      { key: "name", label: "Full name", type: "text", required: true },
      { key: "role", label: "Role", type: "text", required: true, bilingual: true },
      { key: "photo_url", label: "Photo", type: "image" },
      { key: "bio", label: "Short bio", type: "textarea", bilingual: true },
    ],
  },
  resources: {
    type: "resources",
    singular: "resource",
    plural: "Resources",
    icon: "library_books",
    description: "Annual reports, policy briefs, research, publications and project results.",
    titleKey: "title",
    subtitleKey: "year",
    emptyHint: "Upload a PDF or paste a link to each report, brief or publication.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, bilingual: true },
      { key: "category", label: "Type", type: "select", required: true, options: RESOURCE_CATEGORIES },
      { key: "year", label: "Year", type: "text", placeholder: "e.g. 2025" },
      { key: "description", label: "Short description", type: "textarea", bilingual: true },
      { key: "file_url", label: "File (PDF) or link", type: "file", required: true },
    ],
  },
};

export type ContentItem = {
  id: string;
  published: boolean;
  created_at: string;
  [key: string]: string | boolean;
};

export function isContentType(value: string): value is ContentType {
  return (CONTENT_TYPES as string[]).includes(value);
}

/** Every stored key for a type, including `_so` translations. */
export function storedKeys(config: ContentConfig): string[] {
  return config.fields.flatMap((field) => (field.bilingual ? [field.key, `${field.key}_so`] : [field.key]));
}
