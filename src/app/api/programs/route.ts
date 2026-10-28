import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSessionProfile } from "@/lib/auth";
import { getCollections } from "@/lib/db/mongodb";
import { isValidImageUrl } from "@/lib/images";
import { DEFAULT_PROGRAMS } from "@/lib/program-data";

type ProgramPayload = {
  title?: string;
  description?: string;
  icon?: string;
  image_url?: string;
  status?: string;
  sort_order?: number;
  import_defaults?: boolean;
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

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as ProgramPayload;
  const { programs } = await getCollections();
  const now = new Date().toISOString();

  if (payload.import_defaults) {
    if ((await programs.countDocuments({})) > 0) {
      return NextResponse.json({ success: false, error: "Programs already exist." }, { status: 409 });
    }
    const docs = DEFAULT_PROGRAMS.map((program) => ({
      _id: randomUUID(),
      ...program,
      created_at: now,
      updated_at: now,
    }));
    await programs.insertMany(docs);
    refresh();
    return NextResponse.json({
      success: true,
      programs: docs.map((doc) => ({
        id: doc._id,
        title: doc.title,
        description: doc.description,
        icon: doc.icon,
        status: doc.status,
        sort_order: doc.sort_order,
      })),
    });
  }

  const title = String(payload.title ?? "").trim();
  const description = String(payload.description ?? "").trim();
  if (!title || !description) {
    return NextResponse.json({ success: false, error: "Title and description are required." }, { status: 400 });
  }

  const imageUrl = String(payload.image_url ?? "").trim();
  if (imageUrl && !isValidImageUrl(imageUrl)) {
    return NextResponse.json({ success: false, error: "Image must be an uploaded file or an http(s) URL." }, { status: 400 });
  }

  const last = await programs.find({}).sort({ sort_order: -1 }).limit(1).toArray();
  const doc = {
    _id: randomUUID(),
    title,
    description,
    icon: String(payload.icon ?? "volunteer_activism"),
    image_url: imageUrl,
    status: payload.status === "draft" ? ("draft" as const) : ("published" as const),
    sort_order: Number.isFinite(payload.sort_order) ? Number(payload.sort_order) : (last[0]?.sort_order ?? 0) + 1,
    created_at: now,
    updated_at: now,
  };
  await programs.insertOne(doc);

  refresh();
  return NextResponse.json({
    success: true,
    program: {
      id: doc._id,
      title: doc.title,
      description: doc.description,
      icon: doc.icon,
      image_url: doc.image_url,
      status: doc.status,
      sort_order: doc.sort_order,
    },
  });
}
