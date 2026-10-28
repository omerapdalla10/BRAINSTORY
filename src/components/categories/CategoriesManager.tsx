"use client";

import { showToast } from "@/lib/toast";
import { useMemo, useState } from "react";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

type CategoriesManagerProps = {
  initialCategories: Category[];
};

export default function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories],
  );

  function startEdit(category: Category) {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description ?? "");
    setError(null);
    setSuccess(null);
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setDescription("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        const response = await fetch(`/api/categories/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
        });
        const result = (await response.json()) as { success?: boolean; error?: string };
        if (!response.ok || !result.success) {
          setError(result.error ?? "Failed to update category.");
          return;
        }

        setCategories((prev) =>
          prev.map((item) =>
            item.id === editingId ? { ...item, name: name.trim(), description: description.trim() || null } : item,
          ),
        );
        setSuccess("Category updated successfully.");
        showToast("Category updated successfully", "success");
      } else {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
        });
        const result = (await response.json()) as {
          success?: boolean;
          error?: string;
          category?: Category;
        };
        if (!response.ok || !result.success || !result.category) {
          setError(result.error ?? "Failed to create category.");
          return;
        }

        setCategories((prev) => [result.category!, ...prev]);
        setSuccess("Category created successfully.");
        showToast("Category created successfully", "success");
      }

      resetForm();
    } catch {
      setError("Unexpected error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(categoryId: string) {
    const confirmed = window.confirm("Delete this category?");
    if (!confirmed) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
      const result = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !result.success) {
        setError(result.error ?? "Failed to delete category.");
        return;
      }

      setCategories((prev) => prev.filter((item) => item.id !== categoryId));
      if (editingId === categoryId) {
        resetForm();
      }
      setSuccess("Category deleted.");
    } catch {
      setError("Unexpected error.");
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="rounded-2xl border border-neutral-soft dark:border-slate-800 bg-white dark:bg-background-dark/50 p-6">
        <h2 className="text-2xl font-black mb-4">{editingId ? "Edit Category" : "Create Category"}</h2>

        {error ? (
          <div className="mb-4 rounded-lg border border-rose-300/50 bg-rose-100/60 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mb-4 rounded-lg border border-emerald-300/50 bg-emerald-100/60 px-4 py-3 text-sm text-emerald-800">
            {success}
          </div>
        ) : null}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Name *</span>
            <input
              className="h-12 rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-4 focus:outline-none focus:ring-2 focus:ring-accent/50"
              onChange={(event) => setName(event.target.value)}
              required
              type="text"
              value={name}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Description</span>
            <textarea
              className="rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-4 py-3 min-h-[130px] focus:outline-none focus:ring-2 focus:ring-accent/50"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              className="h-11 px-5 rounded-lg bg-accent text-white font-semibold hover:brightness-105 transition-all disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Saving..." : editingId ? "Update Category" : "Create Category"}
            </button>
            {editingId ? (
              <button
                className="h-11 px-5 rounded-lg border border-neutral-soft dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={resetForm}
                type="button"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-neutral-soft dark:border-slate-800 bg-white dark:bg-background-dark/50 p-6">
        <h2 className="text-2xl font-black mb-4">Categories</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/30">
              <tr>
                <th className="px-3 py-2 text-left font-bold">Name</th>
                <th className="px-3 py-2 text-left font-bold">Description</th>
                <th className="px-3 py-2 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories.length > 0 ? (
                sortedCategories.map((category) => (
                  <tr key={category.id} className="border-t border-neutral-soft dark:border-slate-800">
                    <td className="px-3 py-2 font-semibold">{category.name}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                      {category.description || "-"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-lg border border-neutral-soft px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                          onClick={() => startEdit(category)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                          onClick={() => handleDelete(category.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-4 text-center text-slate-500" colSpan={3}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
