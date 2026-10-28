import type { Metadata } from "next";
import Link from "next/link";
import CategoriesManager from "@/components/categories/CategoriesManager";
import { getCollections } from "@/lib/db/mongodb";

export const metadata: Metadata = {
  title: "Categories Management | Brain Story Organization",
};

export default async function AppCategoriesPage() {
  const { categories } = await getCollections();
  const categoryDocs = await categories.find({}).sort({ name: 1 }).toArray();
  const data = categoryDocs.map((doc) => ({
    id: doc._id,
    name: doc.name,
    description: doc.description,
  }));

  return (
    <div className="text-primary">

      <section className="w-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2">Categories</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Create, edit, and delete categories.
              </p>
            </div>
            <Link
              className="h-11 px-5 inline-flex items-center rounded-lg border border-neutral-soft dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="/app/dashboard"
            >
              Back to Dashboard
            </Link>
          </div>

          <CategoriesManager initialCategories={(data ?? []) as { id: string; name: string; description: string | null }[]} />
        </div>
      </section>

    </div>
  );
}
