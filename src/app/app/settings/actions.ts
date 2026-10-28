"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthorOrAdminProfile } from "@/lib/auth";
import { getCollections } from "@/lib/db/mongodb";
import { isValidImageUrl } from "@/lib/images";

export async function updateProfileAction(formData: FormData): Promise<void> {
  const profile = await requireAuthorOrAdminProfile();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const avatar = String(formData.get("avatar_url") ?? "").trim();

  if (!fullName) {
    redirect("/app/settings?error=Full+name+is+required");
  }

  if (avatar && !isValidImageUrl(avatar)) {
    redirect("/app/settings?error=Profile+photo+must+be+an+uploaded+image");
  }

  const { profiles } = await getCollections();
  await profiles.updateOne(
    { _id: profile.id },
    {
      $set: {
        avatar_url: avatar || null,
        full_name: fullName,
        phone: phone || null,
        title: title || null,
        updated_at: new Date().toISOString(),
      },
    },
  );

  revalidatePath("/app", "layout");
  redirect("/app/settings?success=Profile+updated");
}

export async function changePasswordAction(formData: FormData): Promise<void> {
  const profile = await requireAuthorOrAdminProfile();
  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (next.length < 8) {
    redirect("/app/settings?error=New+password+must+be+at+least+8+characters");
  }
  if (next !== confirm) {
    redirect("/app/settings?error=Passwords+do+not+match");
  }

  const { profiles } = await getCollections();
  const doc = await profiles.findOne({ _id: profile.id });
  if (!doc || !(await bcrypt.compare(current, doc.password_hash))) {
    redirect("/app/settings?error=Current+password+is+incorrect");
  }

  await profiles.updateOne(
    { _id: profile.id },
    { $set: { password_hash: await bcrypt.hash(next, 10), updated_at: new Date().toISOString() } },
  );

  redirect("/app/settings?success=Password+changed");
}
