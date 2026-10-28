type DashboardChartsProps = {
  monthly: { label: string; count: number }[];
  distribution: { name: string; count: number }[];
  months: number;
};

const COLORS = ["#03b180", "#003245", "#0a7ea4", "#f5a524", "#8b5cf6"];

const W = 600;
const H = 220;
const PAD = { top: 16, right: 16, bottom: 28, left: 28 };

function ActivityChart({ monthly }: { monthly: { label: string; count: number }[] }) {
  const max = Math.max(1, ...monthly.map((m) => m.count));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const step = monthly.length > 1 ? innerW / (monthly.length - 1) : 0;

  const points = monthly.map((m, i) => ({
    x: PAD.left + i * step,
    y: PAD.top + innerH - (m.count / max) * innerH,
    ...m,
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${points[points.length - 1].x},${PAD.top + innerH} L${points[0].x},${PAD.top + innerH} Z`;
  const ticks = [0, 0.5, 1].map((t) => ({ y: PAD.top + innerH - t * innerH, value: Math.round(t * max) }));

  return (
    <svg className="h-56 w-full" preserveAspectRatio="none" role="img" viewBox={`0 0 ${W} ${H}`}>
      <title>Posts created per month</title>
      <defs>
        <linearGradient id="activityFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#03b180" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#03b180" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((tick) => (
        <g key={tick.y}>
          <line stroke="currentColor" strokeDasharray="3 3" strokeOpacity="0.15" x1={PAD.left} x2={W - PAD.right} y1={tick.y} y2={tick.y} />
          <text className="fill-slate-400" fontSize="11" textAnchor="end" x={PAD.left - 6} y={tick.y + 4}>
            {tick.value}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#activityFill)" />
      <path d={line} fill="none" stroke="#03b180" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      {points.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} fill="#fff" r="4.5" stroke="#03b180" strokeWidth="2.5">
            <title>{`${p.label}: ${p.count}`}</title>
          </circle>
          <text className="fill-slate-400" fontSize="11" textAnchor="middle" x={p.x} y={H - 8}>
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Donut({ distribution, total }: { distribution: { name: string; count: number }[]; total: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offsets = distribution.map((_, i) =>
    distribution.slice(0, i).reduce((sum, d) => sum + (d.count / total) * c, 0),
  );

  return (
    <div className="relative mx-auto h-40 w-40">
      <svg className="h-full w-full -rotate-90" role="img" viewBox="0 0 140 140">
        <title>Blogs by category</title>
        <circle cx="70" cy="70" fill="none" r={r} stroke="currentColor" strokeOpacity="0.08" strokeWidth="18" />
        {distribution.map((entry, index) => {
          const length = (entry.count / total) * c;
          return (
            <circle
              key={entry.name}
              cx="70"
              cy="70"
              fill="none"
              r={r}
              stroke={COLORS[index % COLORS.length]}
              strokeDasharray={`${Math.max(0, length - 3)} ${c - Math.max(0, length - 3)}`}
              strokeDashoffset={-offsets[index]}
              strokeWidth="18"
            >
              <title>{`${entry.name}: ${entry.count}`}</title>
            </circle>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black">{total}</span>
        <span className="text-[11px] text-slate-400">posts</span>
      </div>
    </div>
  );
}

export default function DashboardCharts({ monthly, distribution, months }: DashboardChartsProps) {
  const hasActivity = monthly.some((m) => m.count > 0);
  const total = distribution.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <section className="lg:col-span-2 rounded-2xl border border-neutral-soft bg-white p-6 shadow-sm">
        <h2 className="font-extrabold">Blog Activity</h2>
        <p className="text-xs text-slate-400 mb-4">Posts created · last {months} months</p>
        {hasActivity ? (
          <ActivityChart monthly={monthly} />
        ) : (
          <div className="flex h-56 flex-col items-center justify-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-[40px]">show_chart</span>
            <p className="text-sm">No posts yet, the chart will appear once you publish.</p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-neutral-soft bg-white p-6 shadow-sm">
        <h2 className="font-extrabold">Blog Distribution</h2>
        <p className="text-xs text-slate-400 mb-4">By category</p>
        {distribution.length > 0 ? (
          <>
            <Donut distribution={distribution} total={total} />
            <ul className="mt-4 flex flex-col gap-2">
              {distribution.map((entry, index) => (
                <li key={entry.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="flex-1 truncate">{entry.name}</span>
                  <span className="font-semibold text-slate-500">{entry.count}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex h-56 flex-col items-center justify-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-[40px]">donut_large</span>
            <p className="text-sm">No blogs to chart yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
