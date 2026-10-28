import type { Document } from "mongodb";
import { getDb } from "@/lib/db/mongodb";
import { CONTENT_CONFIG, storedKeys, type ContentItem, type ContentType } from "@/lib/content-config";

function toItem(type: ContentType, doc: Document): ContentItem {
  const config = CONTENT_CONFIG[type];
  const item: ContentItem = {
    id: String(doc._id),
    published: Boolean(doc.published),
    created_at: String(doc.created_at ?? ""),
  };
  for (const field of config.fields) {
    for (const key of field.bilingual ? [field.key, `${field.key}_so`] : [field.key]) {
      item[key] = field.type === "checkbox" ? Boolean(doc[key]) : String(doc[key] ?? "");
    }
  }
  if (type === "policies") {
    item.slug = String(doc.slug ?? "");
  }
  return item;
}

const SORT: Record<ContentType, Record<string, 1 | -1>> = {
  projects: { start_date: -1, created_at: -1 },
  achievements: { date: -1, created_at: -1 },
  testimonials: { created_at: -1 },
  policies: { title: 1 },
  partners: { created_at: 1 },
  team: { created_at: 1 },
  resources: { year: -1, created_at: -1 },
};

/** Everything, for the dashboard. */
export async function listContent(type: ContentType): Promise<ContentItem[]> {
  const db = await getDb();
  const docs = await db.collection(type).find({}).sort(SORT[type]).toArray();
  return docs.map((doc) => toItem(type, doc));
}

/** Only what may be shown on the public website. Testimonials also need consent. */
export async function listPublicContent(type: ContentType): Promise<ContentItem[]> {
  const db = await getDb();
  const filter: Document = { published: true };
  if (type === "testimonials") filter.consent = true;
  const docs = await db.collection(type).find(filter).sort(SORT[type]).toArray();
  return docs.map((doc) => toItem(type, doc));
}

export async function getPublicPolicy(slug: string): Promise<ContentItem | null> {
  const db = await getDb();
  const doc = await db.collection("policies").findOne({ slug, published: true });
  return doc ? toItem("policies", doc) : null;
}

export { storedKeys };
