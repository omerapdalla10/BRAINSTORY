"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ToastType } from "@/lib/toast";

type Toast = { id: number; message: string; type: ToastType };

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const push = useCallback((message: string, type: ToastType) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  useEffect(() => {
    function onToast(event: Event) {
      const { message, type } = (event as CustomEvent<{ message: string; type: ToastType }>).detail;
      push(message, type);
    }
    window.addEventListener("admin-toast", onToast);
    return () => window.removeEventListener("admin-toast", onToast);
  }, [push]);

  // Convert ?success= / ?error= redirects into toasts, then clean the URL.
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (!success && !error) return;
    if (success) push(success, "success");
    if (error) push(error, "error");
    const next = new URLSearchParams(searchParams.toString());
    next.delete("success");
    next.delete("error");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, pathname, router, push]);

  return (
    <div className="fixed right-4 top-20 z-[70] flex w-[min(92vw,360px)] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`admin-toast flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg ${
            toast.type === "success" ? "border-emerald-300" : "border-rose-300"
          }`}
          role="status"
        >
          <span
            className={`material-symbols-outlined ${
              toast.type === "success" ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <p className="flex-1 text-sm font-semibold">{toast.message}</p>
          <button
            aria-label="Dismiss"
            className="text-slate-400 hover:text-slate-600"
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
