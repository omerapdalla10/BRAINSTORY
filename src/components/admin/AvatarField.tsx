"use client";

import { useState } from "react";
import CoverImageField from "@/components/admin/CoverImageField";

/** Profile photo picker for a plain <form>: the chosen URL is submitted as `avatar_url`. */
export default function AvatarField({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);

  return (
    <>
      <CoverImageField label="Profile photo" onChange={setValue} value={value} />
      <input name="avatar_url" type="hidden" value={value} />
    </>
  );
}
