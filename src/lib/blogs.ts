import { randomUUID } from "node:crypto";
import { getCollections, type BlogDoc } from "@/lib/db/mongodb";

export type BlogCategory = {
  id: string;
  name: string;
};

export type BlogAuthor = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  title?: string | null;
  role?: "super_admin" | "admin" | "author";
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  small_description: string;
  content: string;
  image_url: string | null;
  status: "draft" | "published";
  featured: boolean;
  category: BlogCategory | null;
  author: BlogAuthor | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminBlogRow = BlogPost;

export type CreateBlogPostInput = {
  title: string;
  slug?: string;
  small_description: string;
  content: string;
  image_url?: string;
  featured: boolean;
  status: "draft" | "published";
  category_id: string | null;
  author_id: string;
};

async function hydrateBlogs(docs: BlogDoc[]): Promise<BlogPost[]> {
  const { categories, profiles } = await getCollections();
  const categoryIds = [...new Set(docs.map((d) => d.category_id).filter((v): v is string => !!v))];
  const authorIds = [...new Set(docs.map((d) => d.author_id).filter((v): v is string => !!v))];

  const [categoryDocs, authorDocs] = await Promise.all([
    categoryIds.length ? categories.find({ _id: { $in: categoryIds } }).toArray() : [],
    authorIds.length ? profiles.find({ _id: { $in: authorIds } }).toArray() : [],
  ]);
  const categoryMap = new Map(categoryDocs.map((c) => [c._id, c]));
  const authorMap = new Map(authorDocs.map((a) => [a._id, a]));

  return docs.map((doc) => {
    const category = doc.category_id ? categoryMap.get(doc.category_id) : undefined;
    const author = doc.author_id ? authorMap.get(doc.author_id) : undefined;
    return {
      id: doc._id,
      title: doc.title,
      slug: doc.slug,
      small_description: doc.small_description,
      content: doc.content,
      image_url: doc.image_url,
      status: doc.status,
      featured: doc.featured,
      category: category ? { id: category._id, name: category.name } : null,
      author: author
        ? {
            id: author._id,
            full_name: author.full_name,
            username: author.username,
            avatar_url: author.avatar_url,
            title: author.title,
          }
        : null,
      published_at: doc.published_at,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
    };
  });
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatBlogDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export async function getPublishedBlogPosts(limit = 20): Promise<BlogPost[]> {
  const { blogs } = await getCollections();
  const docs = await blogs
    .find({ status: "published" })
    .sort({ published_at: -1, created_at: -1 })
    .limit(limit)
    .toArray();
  return hydrateBlogs(docs);
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const { categories } = await getCollections();
  const rows = await categories.find({}).sort({ name: 1 }).toArray();
  return rows.map((row) => ({ id: row._id, name: row.name }));
}

export async function getBlogAuthors(): Promise<BlogAuthor[]> {
  const { profiles } = await getCollections();
  const rows = await profiles.find({}).sort({ full_name: 1 }).toArray();
  return rows.map((row) => ({
    id: row._id,
    full_name: row.full_name,
    username: row.username,
    avatar_url: row.avatar_url,
    role: row.role,
  }));
}

export async function createBlogPost(input: CreateBlogPostInput): Promise<void> {
  const { blogs } = await getCollections();
  const cleanedSlug = slugify(input.slug?.trim() ? input.slug : input.title);
  const now = new Date().toISOString();

  await blogs.insertOne({
    _id: randomUUID(),
    title: input.title.trim(),
    slug: cleanedSlug,
    small_description: input.small_description.trim(),
    content: input.content.trim(),
    image_url: input.image_url?.trim() || null,
    featured: input.featured,
    status: input.status,
    category_id: input.category_id,
    author_id: input.author_id,
    published_at: input.status === "published" ? now : null,
    created_at: now,
    updated_at: now,
  });
}

export type AdminBlogFilters = {
  q?: string;
  status?: "draft" | "published";
  categoryId?: string;
};

export async function getAdminBlogsPage(
  page = 1,
  pageSize = 10,
  filters: AdminBlogFilters = {},
): Promise<{
  rows: AdminBlogRow[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const { blogs } = await getCollections();
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 10;

  const filter: Record<string, unknown> = {};
  if (filters.q?.trim()) {
    const escaped = filters.q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.title = { $regex: escaped, $options: "i" };
  }
  if (filters.status) filter.status = filters.status;
  if (filters.categoryId) filter.category_id = filters.categoryId;

  const [docs, total] = await Promise.all([
    blogs
      .find(filter)
      .sort({ created_at: -1 })
      .skip((safePage - 1) * safePageSize)
      .limit(safePageSize)
      .toArray(),
    blogs.countDocuments(filter),
  ]);

  return {
    rows: await hydrateBlogs(docs),
    total,
    page: safePage,
    pageSize: safePageSize,
  };
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  const { blogs } = await getCollections();
  const doc = await blogs.findOne({ _id: id });
  if (!doc) {
    return null;
  }
  const [post] = await hydrateBlogs([doc]);
  return post ?? null;
}

export async function getPublishedBlogBySlug(slug: string): Promise<BlogPost | null> {
  let decodedSlug = slug.trim().replace(/^\/+|\/+$/g, "");
  try {
    decodedSlug = decodeURIComponent(decodedSlug);
  } catch {
    // keep the raw slug
  }

  const { blogs } = await getCollections();
  const doc = await blogs.findOne({ slug: decodedSlug, status: "published" });
  if (!doc) {
    return null;
  }
  const [post] = await hydrateBlogs([doc]);
  return post ?? null;
}
