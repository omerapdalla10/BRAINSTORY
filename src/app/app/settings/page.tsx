import type { Metadata } from "next";
import { changePasswordAction, updateProfileAction } from "@/app/app/settings/actions";
import AvatarField from "@/components/admin/AvatarField";
import { requireAuthorOrAdminProfile } from "@/lib/auth";
import { getCollections } from "@/lib/db/mongodb";

export const metadata: Metadata = {
  title: "Settings | Brainstory",
};

export const dynamic = "force-dynamic";

const inputClass =
  "h-12 rounded-xl border border-neutral-soft bg-transparent px-4 focus:outline-none focus:ring-2 focus:ring-accent/50";

export default async function AppSettingsPage() {
  const profile = await requireAuthorOrAdminProfile();
  const { profiles } = await getCollections();
  const doc = await profiles.findOne({ _id: profile.id }, { projection: { password_hash: 0 } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your profile and password.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <form
          action={updateProfileAction}
          className="flex flex-col gap-4 rounded-2xl border border-neutral-soft bg-white p-6 shadow-sm"
        >
          <h2 className="font-extrabold">Profile</h2>
          <AvatarField initial={doc?.avatar_url ?? ""} />
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Full name</span>
            <input className={inputClass} defaultValue={doc?.full_name ?? ""} name="full_name" required />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Email</span>
            <input
              className={`${inputClass} opacity-60`}
              defaultValue={profile.email}
              disabled
              type="email"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Phone</span>
            <input className={inputClass} defaultValue={doc?.phone ?? ""} name="phone" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Job title</span>
            <input className={inputClass} defaultValue={doc?.title ?? ""} name="title" />
          </label>
          <button
            className="mt-2 h-12 rounded-xl bg-accent font-bold text-white hover:brightness-105 transition-all"
            type="submit"
          >
            Save profile
          </button>
        </form>

        <form
          action={changePasswordAction}
          className="flex flex-col gap-4 rounded-2xl border border-neutral-soft bg-white p-6 shadow-sm self-start"
        >
          <h2 className="font-extrabold">Change password</h2>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Current password</span>
            <input className={inputClass} name="current_password" required type="password" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">New password</span>
            <input className={inputClass} minLength={8} name="new_password" required type="password" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Confirm new password</span>
            <input className={inputClass} minLength={8} name="confirm_password" required type="password" />
          </label>
          <button
            className="mt-2 h-12 rounded-xl bg-primary font-bold text-white hover:brightness-110 transition-all"
            type="submit"
          >
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}
