import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { uploadBlogImage } from "@/lib/db/storage";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const DOCUMENT_TYPES = ["application/pdf"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  if (!profile) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const isDocument = form.get("kind") === "document";
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "No file received." }, { status: 400 });
  }

  const allowed = isDocument ? DOCUMENT_TYPES : IMAGE_TYPES;
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      {
        success: false,
        error: isDocument ? "Only PDF files are allowed." : "Only JPG, PNG, WebP or GIF images are allowed.",
      },
      { status: 400 },
    );
  }

  const maxBytes = isDocument ? MAX_DOCUMENT_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { success: false, error: `File must be ${maxBytes / (1024 * 1024)} MB or smaller.` },
      { status: 400 },
    );
  }

  try {
    const url = await uploadBlogImage(file);
    return NextResponse.json({ success: true, url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
