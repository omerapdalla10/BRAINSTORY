"use client";

import { useMemo, useRef, useState } from "react";
import { isHttpUrl } from "@/components/editor/editor-utils";
import { uploadImageFiles } from "@/components/editor/upload-images";

type ImageModalMode = "image" | "gallery";

type ImageModalProps = {
  isOpen: boolean;
  mode: ImageModalMode;
  onClose: () => void;
  onSubmit: (payload: { urls: string[]; alt: string }) => void;
};

export default function ImageModal({ isOpen, mode, onClose, onSubmit }: ImageModalProps) {
  const [urlInput, setUrlInput] = useState("");
  const [alt, setAlt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsedUrls = useMemo(
    () =>
      urlInput
        .split(/[\n,]+/)
        .map((value) => value.trim())
        .filter(Boolean),
    [urlInput],
  );

  if (!isOpen) {
    return null;
  }

  const title = mode === "gallery" ? "Insert Gallery Images" : "Insert Image";
  const description =
    mode === "gallery"
      ? "Paste image URLs separated by commas or new lines."
      : "Paste one image URL.";

  async function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const urls = await uploadImageFiles(mode === "image" ? files.slice(0, 1) : files);
      setUrlInput((prev) => (mode === "image" ? urls[0] : [prev.trim(), ...urls].filter(Boolean).join("\n")));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSubmit() {
    if (!parsedUrls.length) {
      setError("Please provide at least one image URL.");
      return;
    }

    if (mode === "image" && parsedUrls.length > 1) {
      setError("Image mode accepts a single URL.");
      return;
    }

    const invalid = parsedUrls.find((value) => !isHttpUrl(value));
    if (invalid) {
      setError(`Invalid URL: ${invalid}`);
      return;
    }

    onSubmit({ urls: parsedUrls, alt: alt.trim() });
    setUrlInput("");
    setAlt("");
    setError(null);
    onClose();
  }

  function handleClose() {
    setUrlInput("");
    setAlt("");
    setError(null);
    onClose();
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      role="dialog"
    >
      <div className="w-full max-w-xl rounded-2xl border border-neutral-soft dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            multiple={mode === "gallery"}
            onChange={(event) => handleFiles(event.target.files)}
            type="file"
          />
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            {uploading ? "Uploading..." : mode === "gallery" ? "Upload images" : "Upload image"}
          </button>
          <span className="text-xs text-slate-500">from your computer, or paste URLs below</span>
        </div>

        <label className="mb-4 flex flex-col gap-2">
          <span className="text-sm font-semibold">Image URL{mode === "gallery" ? "s" : ""}</span>
          <textarea
            className="min-h-[96px] rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            onChange={(event) => setUrlInput(event.target.value)}
            placeholder={
              mode === "gallery"
                ? "https://example.com/1.jpg\nhttps://example.com/2.jpg"
                : "https://example.com/image.jpg"
            }
            value={urlInput}
          />
        </label>

        <label className="mb-4 flex flex-col gap-2">
          <span className="text-sm font-semibold">Alt text (optional)</span>
          <input
            className="h-10 rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            onChange={(event) => setAlt(event.target.value)}
            placeholder="Describe the image"
            type="text"
            value={alt}
          />
        </label>

        {error ? (
          <p className="mb-3 rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-end gap-2">
          <button
            className="rounded-lg border border-neutral-soft dark:border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={handleClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
            disabled={uploading}
            onClick={handleSubmit}
            type="button"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}
