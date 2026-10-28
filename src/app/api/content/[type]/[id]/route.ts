import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { CONTENT_CONFIG, isContentType } from "@/lib/content-config";
import { parseFields } from "@/lib/content-validate";
import { getDb } from "@/lib/db/mongodb";

type RouteContext = { params: Promise<{ type: string; id: string }> };

async function isAdmin() {
  const profile = await getSessionProfile();
  return Boolean(profile && ["admin", "super_admin"].includes(profile.role));
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { type, id } = await params;
  if (!isContentType(type)) {
    return NextResponse.json({ success: false, error: "Unknown content type." }, { status: 404 });
  }
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const config = CONTENT_CONFIG[type];
  const payload = (await request.json()) as Record<string, unknown>;
  const parsed = parseFields(config.fields, payload, true);
  if ("error" in parsed) {
    return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
  }

  const db = await getDb();
  const collection = db.collection(type);
  const existing = await collection.findOne({ _id: id as never });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Not found." }, { status: 404 });
  }

  const update: Record<string, unknown> = { ...parsed.data, updated_at: new Date().toISOString() };
  if ("published" in payload) update.published = payload.published === true;

  if (type === "testimonials") {
    const willBePublished = "published" in update ? update.published === true : Boolean(existing.published);
    const hasConsent = "consent" in update ? update.consent === true : Boolean(existing.consent);
    if (willBePublished && !hasConsent) {
      return NextResponse.json(
        { success: false, error: "Tick the consent box before publishing a testimonial." },
        { status: 400 },
      );
    }
  }

  await collection.updateOne({ _id: id as never }, { $set: update });

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { type, id } = await params;
  if (!isContentType(type)) {
    return NextResponse.json({ success: false, error: "Unknown content type." }, { status: 404 });
  }
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  await db.collection(type).deleteOne({ _id: id as never });

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
