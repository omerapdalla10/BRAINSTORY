import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { getCollections } from "@/lib/db/mongodb";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  const profile = await getSessionProfile();
  if (!profile) {
    return NextResponse.json({ results: [] }, { status: 401 });
  }

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const rx = new RegExp(escapeRegex(q), "i");
  const isAdmin = ["admin", "super_admin"].includes(profile.role);
  const { blogs, categories, profiles } = await getCollections();

  const [blogDocs, categoryDocs, profileDocs] = await Promise.all([
    blogs.find({ title: rx }, { projection: { title: 1, status: 1 } }).limit(5).toArray(),
    isAdmin ? categories.find({ name: rx }).limit(3).toArray() : [],
    isAdmin
      ? profiles
          .find({ $or: [{ full_name: rx }, { email: rx }] }, { projection: { full_name: 1, email: 1 } })
          .limit(3)
          .toArray()
      : [],
  ]);

  const results = [
    ...blogDocs.map((b) => ({
      type: "Article",
      icon: "article",
      title: b.title,
      sub: b.status,
      href: `/app/blogs/${b._id}/edit`,
    })),
    ...categoryDocs.map((c) => ({
      type: "Category",
      icon: "folder",
      title: c.name,
      sub: "category",
      href: "/app/categories",
    })),
    ...profileDocs.map((p) => ({
      type: "User",
      icon: "person",
      title: p.full_name,
      sub: p.email,
      href: "/app/profiles",
    })),
  ];

  return NextResponse.json({ results });
}
