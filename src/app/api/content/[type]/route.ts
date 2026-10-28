import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSessionProfile } from "@/lib/auth";
import { slugify } from "@/lib/blogs";
import { CONTENT_CONFIG, isContentType } from "@/lib/content-config";
import { parseFields } from "@/lib/content-validate";
import { getDb } from "@/lib/db/mongodb";

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isContentType(type)) {
    return NextResponse.json({ success: false, error: "Unknown content type." }, { status: 404 });
  }

  const profile = await getSessionProfile();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const config = CONTENT_CONFIG[type];
  const payload = (await request.json()) as Record<string, unknown>;
  const parsed = parseFields(config.fields, payload, false);
  if ("error" in parsed) {
    return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
  }

  const published = payload.published === true;
  if (type === "testimonials" && published && parsed.data.consent !== true) {
    return NextResponse.json(
      { success: false, error: "Tick the consent box before publishing a testimonial." },
      { status: 400 },
    );
  }

  const db = await getDb();
  const collection = db.collection(type);
  const now = new Date().toISOString();
  const doc: Record<string, unknown> = {
    _id: randomUUID() as never,
    ...parsed.data,
    published,
    created_at: now,
    updated_at: now,
  };

  if (type === "policies") {
    const base = slugify(String(parsed.data.title)) || "policy";
    let slug = base;
    for (let n = 2; await collection.findOne({ slug }, { projection: { _id: 1 } }); n += 1) {
      slug = `${base}-${n}`;
    }
    doc.slug = slug;
  }

  await collection.insertOne(doc);

  revalidatePath("/", "layout");
  return NextResponse.json({
    success: true,
    item: { ...parsed.data, id: String(doc._id), published, created_at: now, slug: doc.slug ?? undefined },
  });
}
