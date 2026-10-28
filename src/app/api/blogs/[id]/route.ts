import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { isValidImageUrl } from "@/lib/images";
import { getCollections } from "@/lib/db/mongodb";
import { slugify } from "@/lib/blogs";

type UpdateBlogPayload = {
  title?: string;
  slug?: string;
  small_description?: string;
  content?: string;
  image_url?: string;
  category_id?: string | null;
  author_id?: string | null;
  featured?: boolean;
  status?: "draft" | "published";
};

async function getCurrentUserWithRole() {
  const profile = await getSessionProfile();
  return {
    user: profile ? { id: profile.id } : null,
    role: profile?.role ?? null,
  };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, role } = await getCurrentUserWithRole();
  if (!user || !role || !["author", "admin", "super_admin"].includes(role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { blogs } = await getCollections();
  const existing = await blogs.findOne({ _id: id }, { projection: { author_id: 1 } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
  }
  if (!["admin", "super_admin"].includes(role) && existing.author_id !== user.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  const payload = (await request.json()) as UpdateBlogPayload;
  const title = String(payload.title ?? "").trim();
  const smallDescription = String(payload.small_description ?? "").trim();
  const content = String(payload.content ?? "").trim();
  const categoryId = payload.category_id ? String(payload.category_id).trim() : null;
  const imageUrl = String(payload.image_url ?? "").trim();
  const requestedAuthorId = payload.author_id ? String(payload.author_id).trim() : null;
  const featured = Boolean(payload.featured);
  const status = payload.status === "published" ? "published" : "draft";

  if (!title || !smallDescription || !content) {
    return NextResponse.json(
      { success: false, error: "Please fill all required fields." },
      { status: 400 },
    );
  }

  if (imageUrl && !isValidImageUrl(imageUrl)) {
    return NextResponse.json(
      { success: false, error: "Image must be an uploaded file or a URL starting with http:// or https://" },
      { status: 400 },
    );
  }

  const computedSlug = slugify(payload.slug?.trim() ? payload.slug : title);
  if (!computedSlug) {
    return NextResponse.json({ success: false, error: "Unable to generate valid slug" }, { status: 400 });
  }

  const existingSlug = await blogs.findOne(
    { slug: computedSlug, _id: { $ne: id } },
    { projection: { _id: 1 } },
  );
  if (existingSlug) {
    return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 409 });
  }

  const authorId =
    role === "admin" || role === "super_admin"
      ? (requestedAuthorId || existing.author_id || user.id)
      : user.id;

  const now = new Date().toISOString();
  await blogs.updateOne(
    { _id: id },
    {
      $set: {
        title,
        slug: computedSlug,
        small_description: smallDescription,
        content,
        image_url: imageUrl || null,
        status,
        featured,
        category_id: categoryId,
        author_id: authorId,
        published_at: status === "published" ? now : null,
        updated_at: now,
      },
    },
  );

  revalidatePath("/app/blogs");
  revalidatePath("/articles");
  revalidatePath("/");
  revalidatePath("/app/dashboard");
  return NextResponse.json({ success: true });
}
