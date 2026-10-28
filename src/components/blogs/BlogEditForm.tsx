"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CoverImageField from "@/components/admin/CoverImageField";
import { isValidImageUrl } from "@/lib/images";
import { showToast } from "@/lib/toast";
import RichTextEditor from "@/components/editor/RichTextEditor";
import type { BlogAuthor, BlogCategory, BlogPost } from "@/lib/blogs";

type BlogEditFormProps = {
  blog: BlogPost;
  categories: BlogCategory[];
  authors: BlogAuthor[];
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogEditForm({ blog, categories, authors }: BlogEditFormProps) {
  const EMPTY_EDITOR_JSON = '{"type":"doc","content":[{"type":"paragraph"}]}';
  const router = useRouter();
  const [title, setTitle] = useState(blog.title);
  const [manualSlug, setManualSlug] = useState(blog.slug);
  const [content, setContent] = useState(blog.content || EMPTY_EDITOR_JSON);
  const [smallDescription, setSmallDescription] = useState(blog.small_description);
  const [imageUrl, setImageUrl] = useState(blog.image_url ?? "");
  const [authorId, setAuthorId] = useState(blog.author?.id ?? "");
  const [status, setStatus] = useState<"draft" | "published">(blog.status);
  const [featured, setFeatured] = useState(blog.featured);
  const [categoryId, setCategoryId] = useState(blog.category?.id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const resolvedSlug = useMemo(() => slugify(manualSlug || title), [manualSlug, title]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !smallDescription.trim() || !content.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    if (imageUrl.trim() && !isValidImageUrl(imageUrl.trim())) {
      setError("Image must be an uploaded file or a URL starting with http:// or https://");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/blogs/${blog.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug: manualSlug,
          small_description: smallDescription,
          content,
          image_url: imageUrl,
          category_id: categoryId || null,
          author_id: authorId || null,
          featured,
          status,
        }),
      });

      const result = (await response.json()) as { error?: string; success?: boolean };
      if (!response.ok || !result.success) {
        setError(result.error ?? "Failed to update blog.");
        return;
      }

      setSuccess("Blog updated successfully.");
      showToast("Blog updated successfully", "success");
      router.refresh();
    } catch {
      setError("Unexpected error while updating blog.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="rounded-2xl border border-neutral-soft dark:border-slate-800 bg-white dark:bg-background-dark/50 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-5"
      onSubmit={handleSubmit}
    >
      {error ? (
        <div className="md:col-span-2 rounded-lg border border-rose-300/50 bg-rose-100/60 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="md:col-span-2 rounded-lg border border-emerald-300/50 bg-emerald-100/60 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      ) : null}

      <label className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm font-semibold">Title *</span>
        <input
          className="h-12 rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-4 focus:outline-none focus:ring-2 focus:ring-accent/50"
          name="title"
          onChange={(event) => setTitle(event.target.value)}
          required
          type="text"
          value={title}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Slug</span>
        <input
          className="h-12 rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-4 focus:outline-none focus:ring-2 focus:ring-accent/50"
          name="slug"
          onChange={(event) => setManualSlug(event.target.value)}
          placeholder={resolvedSlug || "post-title"}
          type="text"
          value={manualSlug}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Category</span>
        <select
          className="h-12 rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-4 focus:outline-none focus:ring-2 focus:ring-accent/50"
          name="category_id"
          onChange={(event) => setCategoryId(event.target.value)}
          value={categoryId}
        >
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Author</span>
        <select
          className="h-12 rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-4 focus:outline-none focus:ring-2 focus:ring-accent/50"
          name="author_id"
          onChange={(event) => setAuthorId(event.target.value)}
          value={authorId}
        >
          <option value="">Current logged-in user</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.full_name} (@{author.username})
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Status *</span>
        <select
          className="h-12 rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-4 focus:outline-none focus:ring-2 focus:ring-accent/50"
          name="status"
          onChange={(event) => setStatus(event.target.value === "published" ? "published" : "draft")}
          value={status}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      <label className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm font-semibold">Small Description *</span>
        <textarea
          className="rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-4 py-3 min-h-[110px] focus:outline-none focus:ring-2 focus:ring-accent/50"
          name="small_description"
          onChange={(event) => setSmallDescription(event.target.value)}
          required
          value={smallDescription}
        />
      </label>

      <label className="flex flex-col gap-2 md:col-span-2">
        <span className="text-sm font-semibold">Content *</span>
        <RichTextEditor onChange={setContent} value={content} />
      </label>

      <CoverImageField onChange={setImageUrl} value={imageUrl} />

      <label className="flex items-center gap-3 md:col-span-2">
        <input
          className="h-4 w-4 rounded border-neutral-soft text-accent focus:ring-accent"
          name="featured"
          onChange={(event) => setFeatured(event.target.checked)}
          checked={featured}
          type="checkbox"
        />
        <span className="text-sm font-semibold">Mark as featured story</span>
      </label>

      <div className="md:col-span-2 pt-2">
        <button
          className="h-12 px-8 rounded-lg bg-accent text-white font-bold hover:brightness-105 transition-all"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Updating..." : "Update Blog"}
        </button>
      </div>
    </form>
  );
}
