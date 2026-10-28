"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthorOrAdminProfile } from "@/lib/auth";
import { getCollections } from "@/lib/db/mongodb";

export async function deleteBlogAction(formData: FormData): Promise<void> {
  const profile = await requireAuthorOrAdminProfile();
  const blogId = String(formData.get("blog_id") ?? "").trim();

  if (!blogId) {
    redirect("/app/blogs?error=Missing+blog+id");
  }

  const { blogs } = await getCollections();
  const filter: { _id: string; author_id?: string } = { _id: blogId };
  if (!["admin", "super_admin"].includes(profile.role)) {
    filter.author_id = profile.id;
  }

  await blogs.deleteOne(filter);

  revalidatePath("/app/blogs");
  revalidatePath("/articles");
  revalidatePath("/");
  revalidatePath("/app/dashboard");
  redirect("/app/blogs?success=Blog+deleted");
}

async function ownedFilter(blogId: string) {
  const profile = await requireAuthorOrAdminProfile();
  const filter: { _id: string; author_id?: string } = { _id: blogId };
  if (!["admin", "super_admin"].includes(profile.role)) {
    filter.author_id = profile.id;
  }
  return filter;
}

function refreshArticles() {
  revalidatePath("/app/blogs");
  revalidatePath("/articles");
  revalidatePath("/");
  revalidatePath("/app/dashboard");
}

export async function toggleStatusAction(formData: FormData): Promise<void> {
  const blogId = String(formData.get("blog_id") ?? "").trim();
  const filter = await ownedFilter(blogId);
  const { blogs } = await getCollections();
  const blog = await blogs.findOne(filter);
  if (!blog) {
    redirect("/app/blogs?error=Article+not+found");
  }

  const publishing = blog.status !== "published";
  const now = new Date().toISOString();
  await blogs.updateOne(filter, {
    $set: {
      status: publishing ? "published" : "draft",
      published_at: publishing ? (blog.published_at ?? now) : blog.published_at,
      updated_at: now,
    },
  });

  refreshArticles();
  redirect(`/app/blogs?success=${encodeURIComponent(publishing ? "Article published" : "Article moved to drafts")}`);
}

export async function toggleFeaturedAction(formData: FormData): Promise<void> {
  const blogId = String(formData.get("blog_id") ?? "").trim();
  const filter = await ownedFilter(blogId);
  const { blogs } = await getCollections();
  const blog = await blogs.findOne(filter);
  if (!blog) {
    redirect("/app/blogs?error=Article+not+found");
  }

  await blogs.updateOne(filter, { $set: { featured: !blog.featured, updated_at: new Date().toISOString() } });

  refreshArticles();
  redirect(`/app/blogs?success=${encodeURIComponent(blog.featured ? "Removed from featured" : "Article featured")}`);
}
