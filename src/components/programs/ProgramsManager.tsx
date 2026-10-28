"use client";

import { useState } from "react";
import CoverImageField from "@/components/admin/CoverImageField";
import { PROGRAM_ICONS, type Program } from "@/lib/program-data";
import { showToast } from "@/lib/toast";

type ProgramsManagerProps = {
  initialPrograms: Program[];
};

type ApiResult = { success?: boolean; error?: string; program?: Program; programs?: Program[] };

const inputClass =
  "h-12 rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-4 focus:outline-none focus:ring-2 focus:ring-accent/50";

export default function ProgramsManager({ initialPrograms }: ProgramsManagerProps) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(PROGRAM_ICONS[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...programs].sort((a, b) => a.sort_order - b.sort_order);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setIcon(PROGRAM_ICONS[0]);
    setImageUrl("");
    setStatus("published");
    setError(null);
  }

  function startEdit(program: Program) {
    setEditingId(program.id);
    setTitle(program.title);
    setDescription(program.description);
    setIcon(program.icon);
    setImageUrl(program.image_url ?? "");
    setStatus(program.status);
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
        showToast(result.error ?? "Something went wrong.", "error");
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
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setBusy(true);
    if (editingId) {
      const payload = { title: title.trim(), description: description.trim(), icon, image_url: imageUrl.trim(), status };
      const result = await request(`/api/programs/${editingId}`, "PATCH", payload);
      if (result) {
        setPrograms((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p)));
        showToast("Program updated", "success");
        resetForm();
      }
    } else {
      const result = await request("/api/programs", "POST", {
        title: title.trim(),
        description: description.trim(),
        icon,
        image_url: imageUrl.trim(),
        status,
      });
      if (result?.program) {
        setPrograms((prev) => [...prev, result.program!]);
        showToast("Program added", "success");
        resetForm();
      }
    }
    setBusy(false);
  }

  async function handleDelete(program: Program) {
    if (!window.confirm(`Delete "${program.title}"?`)) return;
    const result = await request(`/api/programs/${program.id}`, "DELETE");
    if (result) {
      setPrograms((prev) => prev.filter((p) => p.id !== program.id));
      if (editingId === program.id) resetForm();
      showToast("Program deleted", "success");
    }
  }

  async function toggleStatus(program: Program) {
    const next = program.status === "published" ? "draft" : "published";
    const result = await request(`/api/programs/${program.id}`, "PATCH", { status: next });
    if (result) {
      setPrograms((prev) => prev.map((p) => (p.id === program.id ? { ...p, status: next } : p)));
      showToast(next === "published" ? "Program published" : "Program hidden", "success");
    }
  }

  /** Swaps the order of a program with its neighbour. */
  async function move(program: Program, direction: -1 | 1) {
    const index = sorted.findIndex((p) => p.id === program.id);
    const neighbour = sorted[index + direction];
    if (!neighbour) return;

    // Give every program its position in the list so equal sort_order values never get stuck.
    const reordered = [...sorted];
    reordered[index] = neighbour;
    reordered[index + direction] = program;
    const withOrder = reordered.map((p, i) => ({ ...p, sort_order: i + 1 }));
    setPrograms(withOrder);

    await Promise.all(
      withOrder
        .filter((p) => {
          const before = sorted.find((s) => s.id === p.id);
          return before?.sort_order !== p.sort_order;
        })
        .map((p) => request(`/api/programs/${p.id}`, "PATCH", { sort_order: p.sort_order })),
    );
  }

  async function importDefaults() {
    setBusy(true);
    const result = await request("/api/programs", "POST", { import_defaults: true });
    if (result?.programs) {
      setPrograms(result.programs);
      showToast("Default programs added", "success");
    }
    setBusy(false);
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <form
        className="xl:col-span-2 flex flex-col gap-4 self-start rounded-2xl border border-neutral-soft bg-white p-6 shadow-sm dark:border-slate-800"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-black">{editingId ? "Edit program" : "Add a program"}</h2>

        {error ? (
          <p className="rounded-lg border border-rose-300/50 bg-rose-100/60 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        ) : null}

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Title *</span>
          <input
            className={inputClass}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Counseling & Psychological Support"
            value={title}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Description *</span>
          <textarea
            className="min-h-[140px] rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What the program does and who it helps."
            value={description}
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Icon</span>
          <div className="grid grid-cols-8 gap-2">
            {PROGRAM_ICONS.map((name) => (
              <button
                key={name}
                aria-label={name}
                aria-pressed={icon === name}
                className={`grid h-11 place-items-center rounded-lg border transition-colors ${
                  icon === name
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-neutral-soft dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
                onClick={() => setIcon(name)}
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">{name}</span>
              </button>
            ))}
          </div>
        </div>

        <CoverImageField label="Photo (optional)" onChange={setImageUrl} value={imageUrl} />

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Status</span>
          <select
            className={inputClass}
            onChange={(event) => setStatus(event.target.value === "draft" ? "draft" : "published")}
            value={status}
          >
            <option value="published">Published (visible on the website)</option>
            <option value="draft">Draft (hidden)</option>
          </select>
        </label>

        <div className="flex items-center gap-3 pt-1">
          <button
            className="h-11 rounded-lg bg-accent px-6 font-bold text-white transition-all hover:brightness-105 disabled:opacity-70"
            disabled={busy}
            type="submit"
          >
            {busy ? "Saving..." : editingId ? "Update program" : "Add program"}
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
        <h2 className="mb-4 text-xl font-black">All programs ({sorted.length})</h2>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-accent/10 text-accent">
              <span className="material-symbols-outlined text-[40px]">volunteer_activism</span>
            </div>
            <h3 className="text-lg font-extrabold">No programs saved yet</h3>
            <p className="max-w-sm text-sm text-slate-500">
              The website is currently showing its built-in list of 5 programs. Import them here to
              edit them, or add your own.
            </p>
            <button
              className="mt-2 h-11 rounded-lg bg-primary px-6 font-bold text-white hover:brightness-110 disabled:opacity-70"
              disabled={busy}
              onClick={importDefaults}
              type="button"
            >
              Import the 5 default programs
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {sorted.map((program, index) => (
              <li
                key={program.id}
                className="flex items-start gap-4 rounded-xl border border-neutral-soft p-4 dark:border-slate-800"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                  <span className="material-symbols-outlined">{program.icon}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{program.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        program.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {program.status === "published" ? "Published" : "Hidden"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{program.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      className="rounded-lg border border-neutral-soft px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                      onClick={() => startEdit(program)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border border-neutral-soft px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                      onClick={() => toggleStatus(program)}
                      type="button"
                    >
                      {program.status === "published" ? "Hide" : "Publish"}
                    </button>
                    <button
                      className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      onClick={() => handleDelete(program)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    aria-label="Move up"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-neutral-soft text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800"
                    disabled={index === 0}
                    onClick={() => move(program, -1)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                  </button>
                  <button
                    aria-label="Move down"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-neutral-soft text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800"
                    disabled={index === sorted.length - 1}
                    onClick={() => move(program, 1)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
