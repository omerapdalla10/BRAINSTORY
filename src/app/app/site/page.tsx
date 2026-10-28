import type { Metadata } from "next";
import SiteForm from "@/components/admin/SiteForm";
import { getSiteSettings } from "@/lib/site";

export const metadata: Metadata = {
  title: "Organization | Brainstory",
};

export const dynamic = "force-dynamic";

export default async function AppSitePage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black">Organization</h1>
        <p className="text-sm text-slate-500 mt-1">
          Profile, leadership, governance and contact details. Every text has an English and a
          Somali field; the Somali one is shown when a visitor picks Somali.
        </p>
      </div>
      <SiteForm initial={settings} />
    </div>
  );
}
