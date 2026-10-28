import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { parseFields } from "@/lib/content-validate";
import { getDb } from "@/lib/db/mongodb";
import { SITE_SECTIONS, parseEmailLines } from "@/lib/site-config";

/** Saves one section (or several) of the organization settings. */
export async function PUT(request: Request) {
  const profile = await getSessionProfile();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const fields = SITE_SECTIONS.flatMap((section) => section.fields);
  const parsed = parseFields(fields, payload, true);
  if ("error" in parsed) {
    return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
  }

  if (parsed.data.contact_email && !/^\S+@\S+\.\S+$/.test(String(parsed.data.contact_email))) {
    return NextResponse.json({ success: false, error: "Enter a valid email address." }, { status: 400 });
  }

  if (parsed.data.extra_emails) {
    const { invalid } = parseEmailLines(String(parsed.data.extra_emails));
    if (invalid.length > 0) {
      return NextResponse.json(
        { success: false, error: `Check these email lines (use Label: address): ${invalid.join("; ")}` },
        { status: 400 },
      );
    }
  }

  const db = await getDb();
  await db
    .collection("site_settings")
    .updateOne(
      { _id: "site" as never },
      { $set: { ...parsed.data, updated_at: new Date().toISOString() } },
      { upsert: true },
    );

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
