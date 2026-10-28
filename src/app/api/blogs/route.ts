import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSessionProfile } from "@/lib/auth";
import { isValidImageUrl } from "@/lib/images";
import { getCollections } from "@/lib/db/mongodb";
import { slugify } from "@/lib/blogs";

type CreateBlogPayload = {
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

export async function POST(request: Request) {
  const { user, role } = await getCurrentUserWithRole();
  if (!user || !role || !["author", "admin", "super_admin"].includes(role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as CreateBlogPayload;
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

  const { blogs } = await getCollections();
  const existingSlug = await blogs.findOne({ slug: computedSlug }, { projection: { _id: 1 } });
  if (existingSlug) {
    return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 409 });
  }

  const authorId =
    role === "admin" || role === "super_admin"
      ? (requestedAuthorId || user.id)
      : user.id;

  const now = new Date().toISOString();
  await blogs.insertOne({
    _id: randomUUID(),
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
    created_at: now,
    updated_at: now,
  });

  revalidatePath("/app/blogs");
  revalidatePath("/articles");
  revalidatePath("/");
  revalidatePath("/app/dashboard");
  return NextResponse.json({ success: true });
}
