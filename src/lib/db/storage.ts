import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^\w.-]/g, "_").toLowerCase();
}

/** Uploads to ImageKit (server-side, using the private key) and returns the file's CDN URL. */
async function uploadToImageKit(file: File, privateKey: string): Promise<string> {
  const body = new FormData();
  body.append("file", file, sanitizeFileName(file.name || "file"));
  body.append("fileName", sanitizeFileName(file.name || "file"));
  body.append("useUniqueFileName", "true");
  body.append("folder", process.env.IMAGEKIT_FOLDER || "/brainstory");

  const response = await fetch(IMAGEKIT_UPLOAD_URL, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}` },
    body,
  });

  const result = (await response.json().catch(() => ({}))) as { url?: string; message?: string };
  if (!response.ok || !result.url) {
    throw new Error(result.message ?? `ImageKit upload failed (${response.status}).`);
  }
  return result.url;
}

/**
 * Stores an uploaded image or document and returns its public URL.
 * Uses ImageKit when IMAGEKIT_PRIVATE_KEY is set, otherwise saves under public/uploads.
 */
export async function uploadBlogImage(file: File): Promise<string> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
  if (privateKey) {
    return uploadToImageKit(file, privateKey);
  }

  const fileName = `${Date.now()}-${sanitizeFileName(file.name || "image")}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, fileName), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${fileName}`;
}
