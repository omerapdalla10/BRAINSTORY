"use client";

import { useRef, useState } from "react";
import { showToast } from "@/lib/toast";

type FileFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
};

/** Document picker: upload a PDF or paste a link to a file hosted elsewhere. */
export default function FileField({ value, onChange, label, required }: FileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", "document");
      const response = await fetch("/api/upload", { method: "POST", body });
      const result = (await response.json()) as { success?: boolean; url?: string; error?: string };
      if (!response.ok || !result.success || !result.url) {
        showToast(result.error ?? "Upload failed.", "error");
        return;
      }
      onChange(result.url);
      showToast("File uploaded", "success");
    } catch {
      showToast("Upload failed.", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="flex flex-col gap-3 rounded-lg border border-neutral-soft dark:border-slate-700 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            accept="application/pdf"
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
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
          {value ? (
            <>
              <a
                className="inline-flex h-10 items-center gap-1 rounded-lg border border-neutral-soft dark:border-slate-700 px-4 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                href={value}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                Open
              </a>
              <button
                className="h-10 px-4 rounded-lg border border-neutral-soft dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => onChange("")}
                type="button"
              >
                Remove
              </button>
            </>
          ) : null}
        </div>
        <input
          className="h-10 rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          onChange={(event) => onChange(event.target.value)}
          placeholder="...or paste a link (https://...)"
          type="text"
          value={value}
        />
      </div>
    </div>
  );
}
