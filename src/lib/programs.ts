import { getCollections } from "@/lib/db/mongodb";
import { DEFAULT_PROGRAMS, type Program } from "@/lib/program-data";

export { DEFAULT_PROGRAMS, PROGRAM_ICONS, type Program } from "@/lib/program-data";

export async function getAllPrograms(): Promise<Program[]> {
  const { programs } = await getCollections();
  const docs = await programs.find({}).sort({ sort_order: 1, created_at: 1 }).toArray();
  return docs.map((doc) => ({
    id: doc._id,
    title: doc.title,
    description: doc.description,
    icon: doc.icon,
    image_url: doc.image_url ?? "",
    status: doc.status,
    sort_order: doc.sort_order,
  }));
}

/**
 * Programs shown on the public site. Falls back to the built-in list until the
 * first program is saved from the dashboard, so the page is never empty.
 */
export async function getPublishedPrograms(): Promise<Program[]> {
  const all = await getAllPrograms();
  if (all.length === 0) {
    return DEFAULT_PROGRAMS.map((program, index) => ({ ...program, id: `default-${index}` }));
  }
  return all.filter((program) => program.status === "published");
}
