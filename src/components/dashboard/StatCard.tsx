import Link from "next/link";

type StatCardProps = {
  label: string;
  value: number;
  hint?: string;
  href?: string;
  icon?: string;
  badge?: string;
};

export default function StatCard({ label, value, hint, href, icon, badge }: StatCardProps) {
  const card = (
    <article className="h-full rounded-2xl border border-neutral-soft bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="h-11 w-11 rounded-xl bg-accent/10 text-accent grid place-items-center">
          <span className="material-symbols-outlined">{icon ?? "analytics"}</span>
        </div>
        {badge ? (
          <span className="rounded-full bg-primary/5 px-2.5 py-1 text-xs font-bold text-primary">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-black text-primary">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
      {hint ? (
        <p className="mt-3 text-xs text-slate-400">{href ? `${hint} →` : hint}</p>
      ) : null}
    </article>
  );

  if (!href) {
    return card;
  }

  return (
    <Link className="block h-full transition-transform hover:-translate-y-0.5" href={href}>
      {card}
    </Link>
  );
}
