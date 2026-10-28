import type { Metadata } from "next";
import UsersTable from "@/components/admin/UsersTable";
import { getCollections } from "@/lib/db/mongodb";

export const metadata: Metadata = {
  title: "Users | Brainstory",
};

export const dynamic = "force-dynamic";

export default async function AppProfilesPage() {
  const { profiles } = await getCollections();
  const docs = await profiles
    .find({}, { projection: { password_hash: 0 } })
    .sort({ created_at: -1 })
    .toArray();

  const users = docs.map((doc) => ({
    id: doc._id,
    full_name: doc.full_name,
    username: doc.username,
    email: doc.email,
    role: doc.role,
    phone: doc.phone,
    title: doc.title,
    avatar_url: doc.avatar_url,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black">Users</h1>
        <p className="text-sm text-slate-500 mt-1">
          {users.length} {users.length === 1 ? "account" : "accounts"} with their roles.
        </p>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
