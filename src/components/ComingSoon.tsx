type ComingSoonProps = {
  message: string;
  icon?: string;
};

/** Shown where the organization has not published its approved content yet. */
export default function ComingSoon({ message, icon = "hourglass_top" }: ComingSoonProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-[#e6f0ed] px-6 py-7 dark:bg-white/5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-accent shadow-sm dark:bg-slate-800">
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </span>
      <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}
