"use client";

import { useState } from "react";
import FieldInput from "@/components/admin/FieldInput";
import { SITE_SECTIONS, type SiteSettings } from "@/lib/site-config";
import { showToast } from "@/lib/toast";

type SiteFormProps = {
  initial: SiteSettings;
};

export default function SiteForm({ initial }: SiteFormProps) {
  const [values, setValues] = useState<Record<string, string | boolean>>(initial);
  const [activeId, setActiveId] = useState(SITE_SECTIONS[0].id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const section = SITE_SECTIONS.find((item) => item.id === activeId) ?? SITE_SECTIONS[0];

  function setValue(key: string, value: string | boolean) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const payload: Record<string, string | boolean> = {};
    for (const field of section.fields) {
      for (const key of field.bilingual ? [field.key, `${field.key}_so`] : [field.key]) {
        payload[key] = values[key] ?? "";
      }
    }

    try {
      const response = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !result.success) {
        const message = result.error ?? "Could not save.";
        setError(message);
        showToast(message, "error");
        return;
      }
      showToast(`${section.title} saved`, "success");
    } catch {
      showToast("Unexpected error.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col self-start rounded-2xl border border-neutral-soft bg-white p-3 shadow-sm dark:border-slate-800">
        {SITE_SECTIONS.map((item) => (
          <button
            key={item.id}
            className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 h-11 text-sm font-semibold transition-colors ${
              item.id === activeId ? "bg-accent/10 text-accent" : "text-slate-600 hover:bg-slate-50"
            }`}
            onClick={() => {
              setActiveId(item.id);
              setError(null);
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.title}
          </button>
        ))}
      </nav>

      <form
        className="lg:col-span-3 flex max-w-[820px] flex-col gap-5 rounded-2xl border border-neutral-soft bg-white p-6 shadow-sm dark:border-slate-800 md:p-8"
        onSubmit={handleSave}
      >
        <div>
          <h2 className="text-xl font-black">{section.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{section.description}</p>
        </div>

        {error ? (
          <p className="rounded-lg border border-rose-300/50 bg-rose-100/60 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        ) : null}

        {section.fields.map((field) => (
          <FieldInput key={field.key} field={field} onChange={setValue} values={values} />
        ))}

        <div>
          <button
            className="h-11 rounded-lg bg-accent px-6 font-bold text-white transition-all hover:brightness-105 disabled:opacity-70"
            disabled={saving}
            type="submit"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
