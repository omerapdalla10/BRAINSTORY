import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
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

export async function POST(request: Request) {
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
  const existing = await categories.findOne({ name }, { projection: { _id: 1 } });
  if (existing) {
    return NextResponse.json({ success: false, error: "Category already exists" }, { status: 409 });
  }

  const now = new Date().toISOString();
  const data = { id: randomUUID(), name, description };
  await categories.insertOne({
    _id: data.id,
    name,
    description,
    created_at: now,
    updated_at: now,
  });

  revalidatePath("/app/categories");
  revalidatePath("/app/blogs");
  revalidatePath("/app/dashboard");
  return NextResponse.json({ success: true, category: data });
}
