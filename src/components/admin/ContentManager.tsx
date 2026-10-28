"use client";

import { useState } from "react";
import FieldInput from "@/components/admin/FieldInput";
import {
  CONTENT_CONFIG,
  storedKeys,
  type ContentConfig,
  type ContentItem,
  type ContentType,
} from "@/lib/content-config";
import { showToast } from "@/lib/toast";

type ContentManagerProps = {
  type: ContentType;
  initialItems: ContentItem[];
};

type Values = Record<string, string | boolean>;
type ApiResult = { success?: boolean; error?: string; item?: ContentItem };

function emptyValues(config: ContentConfig): Values {
  const values: Values = {};
  for (const field of config.fields) {
    for (const key of field.bilingual ? [field.key, `${field.key}_so`] : [field.key]) {
      values[key] = field.type === "checkbox" ? false : field.type === "select" ? (field.options?.[0]?.value ?? "") : "";
    }
  }
  return values;
}

function valuesFromItem(config: ContentConfig, item: ContentItem): Values {
  const values = emptyValues(config);
  for (const key of storedKeys(config)) {
    if (key in item) values[key] = item[key];
  }
  return values;
}

export default function ContentManager({ type, initialItems }: ContentManagerProps) {
  const config = CONTENT_CONFIG[type];
  const [items, setItems] = useState<ContentItem[]>(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<Values>(() => emptyValues(config));
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setValue(key: string, value: string | boolean) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setValues(emptyValues(config));
    setPublished(true);
    setError(null);
  }

  function startEdit(item: ContentItem) {
    setEditingId(item.id);
    setValues(valuesFromItem(config, item));
    setPublished(item.published);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function request(url: string, method: string, body?: unknown): Promise<ApiResult | null> {
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const result = (await response.json()) as ApiResult;
      if (!response.ok || !result.success) {
        const message = result.error ?? "Something went wrong.";
        setError(message);
        showToast(message, "error");
        return null;
      }
      return result;
    } catch {
      showToast("Unexpected error.", "error");
      return null;
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    for (const field of config.fields) {
      if (field.required && !String(values[field.key] ?? "").trim()) {
        setError(`${field.label} is required.`);
        return;
      }
    }
    if (type === "testimonials" && published && values.consent !== true) {
      setError("Tick the consent box before publishing a testimonial.");
      return;
    }

    setBusy(true);
    const payload = { ...values, published };
    if (editingId) {
      const result = await request(`/api/content/${type}/${editingId}`, "PATCH", payload);
      if (result) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
        showToast(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} updated`, "success");
        resetForm();
      }
    } else {
      const result = await request(`/api/content/${type}`, "POST", payload);
      if (result?.item) {
        setItems((prev) => [result.item!, ...prev]);
        showToast(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} added`, "success");
        resetForm();
      }
    }
    setBusy(false);
  }

  async function togglePublished(item: ContentItem) {
    if (!item.published && type === "testimonials" && item.consent !== true) {
      showToast("Tick the consent box (edit the testimonial) before publishing.", "error");
      return;
    }
    const next = !item.published;
    const result = await request(`/api/content/${type}/${item.id}`, "PATCH", { published: next });
    if (result) {
      setItems((prev) => prev.map((entry) => (entry.id === item.id ? { ...entry, published: next } : entry)));
      showToast(next ? "Published on the website" : "Hidden from the website", "success");
    }
  }

  async function handleDelete(item: ContentItem) {
    if (!window.confirm(`Delete "${String(item[config.titleKey])}"?`)) return;
    const result = await request(`/api/content/${type}/${item.id}`, "DELETE");
    if (result) {
      setItems((prev) => prev.filter((entry) => entry.id !== item.id));
      if (editingId === item.id) resetForm();
      showToast("Deleted", "success");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <form
        className="xl:col-span-2 flex flex-col gap-5 self-start rounded-2xl border border-neutral-soft bg-white p-6 shadow-sm dark:border-slate-800"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-black">
          {editingId ? `Edit ${config.singular}` : `Add a ${config.singular}`}
        </h2>

        {error ? (
          <p className="rounded-lg border border-rose-300/50 bg-rose-100/60 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        ) : null}

        {config.fields.map((field) => (
          <FieldInput key={field.key} field={field} onChange={setValue} values={values} />
        ))}

        <label className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/30">
          <input
            checked={published}
            className="h-4 w-4 rounded border-neutral-soft text-accent focus:ring-accent"
            onChange={(event) => setPublished(event.target.checked)}
            type="checkbox"
          />
          <span className="text-sm font-semibold">Visible on the website</span>
        </label>

        <div className="flex items-center gap-3">
          <button
            className="h-11 rounded-lg bg-accent px-6 font-bold text-white transition-all hover:brightness-105 disabled:opacity-70"
            disabled={busy}
            type="submit"
          >
            {busy ? "Saving..." : editingId ? "Save changes" : `Add ${config.singular}`}
          </button>
          {editingId ? (
            <button
              className="h-11 rounded-lg border border-neutral-soft px-5 font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              onClick={resetForm}
              type="button"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <section className="xl:col-span-3 rounded-2xl border border-neutral-soft bg-white p-6 shadow-sm dark:border-slate-800">
        <h2 className="mb-4 text-xl font-black">
          All {config.plural.toLowerCase()} ({items.length})
        </h2>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-accent/10 text-accent">
              <span className="material-symbols-outlined text-[40px]">{config.icon}</span>
            </div>
            <h3 className="text-lg font-extrabold">Nothing here yet</h3>
            <p className="max-w-sm text-sm text-slate-500">{config.emptyHint}</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-4 rounded-xl border border-neutral-soft p-4 dark:border-slate-800"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                  <span className="material-symbols-outlined">{config.icon}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{String(item[config.titleKey] ?? "")}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        item.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.published ? "Published" : "Hidden"}
                    </span>
                    {type === "testimonials" ? (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          item.consent === true ? "bg-sky-100 text-sky-700" : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {item.consent === true ? "Consent received" : "No consent"}
                      </span>
                    ) : null}
                    {type === "projects" ? (
                      <span className="rounded-full bg-primary/5 px-2.5 py-0.5 text-xs font-bold capitalize">
                        {String(item.status)}
                      </span>
                    ) : null}
                  </div>
                  {config.subtitleKey && item[config.subtitleKey] ? (
                    <p className="mt-0.5 text-sm text-slate-500">{String(item[config.subtitleKey])}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      className="rounded-lg border border-neutral-soft px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                      onClick={() => startEdit(item)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border border-neutral-soft px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                      onClick={() => togglePublished(item)}
                      type="button"
                    >
                      {item.published ? "Hide" : "Publish"}
                    </button>
                    <button
                      className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      onClick={() => handleDelete(item)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
