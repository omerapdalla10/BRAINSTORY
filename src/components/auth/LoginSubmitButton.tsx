"use client";

import { useFormStatus } from "react-dom";

export default function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="h-14 rounded-xl bg-accent text-white text-lg font-bold hover:brightness-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      disabled={pending}
      type="submit"
    >
      {pending ? "Signing in..." : "Sign In →"}
    </button>
  );
}
