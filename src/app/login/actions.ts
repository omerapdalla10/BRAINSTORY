"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCollections } from "@/lib/db/mongodb";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect("/auth/login?error=Email+and+password+are+required");
  }

  const { profiles } = await getCollections();
  const profile = await profiles.findOne({ email });
  const valid = profile ? await bcrypt.compare(password, profile.password_hash) : false;

  if (!profile || !valid) {
    redirect("/auth/login?error=Invalid+email+or+password");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await signSession(profile._id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/app/dashboard");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/auth/login?success=Logged+out");
}
