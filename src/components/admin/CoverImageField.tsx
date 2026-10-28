"use client";

import { useRef, useState } from "react";
import { showToast } from "@/lib/toast";

type CoverImageFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

/** Cover image picker: upload a file from the computer or paste an image URL. */
export default function CoverImageField({ value, onChange, label = "Cover image" }: CoverImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const result = (await response.json()) as { success?: boolean; url?: string; error?: string };
      if (!response.ok || !result.success || !result.url) {
        showToast(result.error ?? "Upload failed.", "error");
        return;
      }
      onChange(result.url);
      showToast("Image uploaded", "success");
    } catch {
      showToast("Upload failed.", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex flex-col gap-3 rounded-lg border border-neutral-soft dark:border-slate-700 p-3">
        {value ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Cover preview" className="h-full w-full object-cover" src={value} />
          </div>
        ) : (
          <div className="grid aspect-video w-full place-items-center rounded-md bg-slate-50 dark:bg-slate-900/30 text-slate-400">
            <span className="material-symbols-outlined text-4xl">image</span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
            type="file"
          />
          <button
            className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:brightness-110 disabled:opacity-60"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            {uploading ? "Uploading..." : "Upload image"}
          </button>
          {value ? (
            <button
              className="h-10 px-4 rounded-lg border border-neutral-soft dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => onChange("")}
              type="button"
            >
              Remove
            </button>
          ) : null}
        </div>
        <input
          className="h-10 rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          onChange={(event) => onChange(event.target.value)}
          placeholder="...or paste an image URL (https://...)"
          type="text"
          value={value}
        />
      </div>
    </div>
  );
}
