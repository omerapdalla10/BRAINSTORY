import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCollections } from "@/lib/db/mongodb";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export type ProfileRole = "super_admin" | "admin" | "author";

export type AppProfile = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  role: ProfileRole;
};

/** Returns the signed-in profile from the session cookie, or null. */
export async function getSessionProfile(): Promise<AppProfile | null> {
  const cookieStore = await cookies();
  const userId = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!userId) {
    return null;
  }

  const { profiles } = await getCollections();
  const doc = await profiles.findOne({ _id: userId });
  if (!doc) {
    return null;
  }

  return {
    id: doc._id,
    full_name: doc.full_name,
    username: doc.username,
    email: doc.email,
    avatar_url: doc.avatar_url,
    role: doc.role,
  };
}

export async function requireUser() {
  const profile = await getSessionProfile();
  if (!profile) {
    redirect("/auth/login");
  }
  return { user: { id: profile.id } };
}

export async function getCurrentProfile() {
  await requireUser();
  return getSessionProfile();
}

export async function requireAdminProfile() {
  const profile = await getCurrentProfile();

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    redirect("/app/blogs");
  }

  return profile;
}

export async function requireAuthorOrAdminProfile() {
  const profile = await getCurrentProfile();

  if (!profile || !["author", "admin", "super_admin"].includes(profile.role)) {
    redirect("/auth/login?error=Unauthorized");
  }

  return profile;
}
