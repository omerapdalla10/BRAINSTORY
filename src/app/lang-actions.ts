"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { LANG_COOKIE } from "@/lib/i18n";

export async function setLanguageAction(lang: string): Promise<void> {
  const store = await cookies();
  store.set(LANG_COOKIE, lang === "so" ? "so" : "en", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
