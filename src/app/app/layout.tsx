import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { logoutAction } from "@/app/auth/login/actions";
import { getSessionProfile } from "@/lib/auth";
import { getCollections } from "@/lib/db/mongodb";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getSessionProfile();
  if (!profile) {
    redirect("/auth/login");
  }

  const { blogs } = await getCollections();
  const isAdmin = ["admin", "super_admin"].includes(profile.role);
  const draftFilter = isAdmin
    ? { status: "draft" as const }
    : { status: "draft" as const, author_id: profile.id };
  const [draftCount, drafts] = await Promise.all([
    blogs.countDocuments(draftFilter),
    blogs
      .find(draftFilter, { projection: { title: 1, created_at: 1 } })
      .sort({ created_at: -1 })
      .limit(5)
      .toArray(),
  ]);

  return (
    <AdminShell
      avatarUrl={profile.avatar_url}
      fullName={profile.full_name}
      logoutAction={logoutAction}
      notifications={{
        draftCount,
        items: drafts.map((d) => ({ id: d._id, title: d.title, created_at: d.created_at })),
      }}
      role={profile.role}
    >
      {children}
    </AdminShell>
  );
}
