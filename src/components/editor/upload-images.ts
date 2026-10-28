/** Uploads image files through the dashboard upload endpoint and returns their public URLs. */
export async function uploadImageFiles(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const result = (await response.json()) as { success?: boolean; url?: string; error?: string };
    if (!response.ok || !result.success || !result.url) {
      throw new Error(result.error ?? `Could not upload ${file.name}.`);
    }
    urls.push(result.url);
  }
  return urls;
}
