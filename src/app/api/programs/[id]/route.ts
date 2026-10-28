import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { getCollections } from "@/lib/db/mongodb";
import { isValidImageUrl } from "@/lib/images";

type ProgramPayload = {
  title?: string;
  description?: string;
  icon?: string;
  image_url?: string;
  status?: string;
  sort_order?: number;
};

async function isAdmin() {
  const profile = await getSessionProfile();
  return Boolean(profile && ["admin", "super_admin"].includes(profile.role));
}

function refresh() {
  revalidatePath("/programs");
  revalidatePath("/");
  revalidatePath("/app/programs");
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as ProgramPayload;
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (payload.title !== undefined) {
    const title = String(payload.title).trim();
    if (!title) return NextResponse.json({ success: false, error: "Title is required." }, { status: 400 });
    update.title = title;
  }
  if (payload.description !== undefined) {
    const description = String(payload.description).trim();
    if (!description) {
      return NextResponse.json({ success: false, error: "Description is required." }, { status: 400 });
    }
    update.description = description;
  }
  if (payload.icon !== undefined) update.icon = String(payload.icon);
  if (payload.image_url !== undefined) {
    const imageUrl = String(payload.image_url).trim();
    if (imageUrl && !isValidImageUrl(imageUrl)) {
      return NextResponse.json({ success: false, error: "Image must be an uploaded file or an http(s) URL." }, { status: 400 });
    }
    update.image_url = imageUrl;
  }
  if (payload.status !== undefined) update.status = payload.status === "draft" ? "draft" : "published";
  if (payload.sort_order !== undefined && Number.isFinite(payload.sort_order)) {
    update.sort_order = Number(payload.sort_order);
  }

  const { programs } = await getCollections();
  await programs.updateOne({ _id: id }, { $set: update });

  refresh();
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { programs } = await getCollections();
  await programs.deleteOne({ _id: id });

  refresh();
  return NextResponse.json({ success: true });
}
