import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { getCollections } from "@/lib/db/mongodb";

type CategoryPayload = {
  name?: string;
  description?: string | null;
};

async function requireAdmin() {
  const profile = await getSessionProfile();
  return { authorized: Boolean(profile && ["admin", "super_admin"].includes(profile.role)) };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as CategoryPayload;
  const name = String(payload.name ?? "").trim();
  const description = payload.description ? String(payload.description).trim() : null;

  if (!name) {
    return NextResponse.json({ success: false, error: "Category name is required." }, { status: 400 });
  }

  const { categories } = await getCollections();
  const duplicate = await categories.findOne({ name, _id: { $ne: id } }, { projection: { _id: 1 } });
  if (duplicate) {
    return NextResponse.json({ success: false, error: "Category already exists" }, { status: 409 });
  }

  await categories.updateOne(
    { _id: id },
    { $set: { name, description, updated_at: new Date().toISOString() } },
  );

  revalidatePath("/app/categories");
  revalidatePath("/app/blogs");
  revalidatePath("/app/dashboard");
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { categories, blogs } = await getCollections();
  await categories.deleteOne({ _id: id });
  await blogs.updateMany({ category_id: id }, { $set: { category_id: null } });

  revalidatePath("/app/categories");
  revalidatePath("/app/blogs");
  revalidatePath("/app/dashboard");
  return NextResponse.json({ success: true });
}
