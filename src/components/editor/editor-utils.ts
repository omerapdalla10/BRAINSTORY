import type { Content, JSONContent } from "@tiptap/react";

export function parseEditorContent(raw: string): Content {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }

  try {
    const parsed = JSON.parse(trimmed) as JSONContent;
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    // Fallback for legacy HTML content.
  }

  return trimmed;
}

/** True for remote image URLs and for files uploaded through the dashboard. */
export function isHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) || /^\/uploads\/[\w.-]+$/.test(trimmed);
}

export function serializeEditorJson(doc: JSONContent): string {
  return JSON.stringify(doc);
}
