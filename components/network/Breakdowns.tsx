import { formatInt } from "@/lib/format";
import { MODEL_SHARE, NET_VENDOR_COLORS, PLANS, PROVIDERS_PER_CELL } from "@/lib/mock/network";

const CELLS = 30;

function Card({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 rounded-card bg-surface p-8 max-sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[17px] font-semibold">{title}</span>
        <span className="font-mono text-[11px] text-muted">{note}</span>
      </div>
      {children}
    </div>
  );
}

export function ModelShareCard() {
  const max = Math.max(...MODEL_SHARE.map((m) => m.sharePct));
  return (
    <Card title="Model share & capacity" note="share · 24h / capacity left">
      {MODEL_SHARE.map((m) => (
        <div key={m.model} className="grid grid-cols-[150px_1fr_56px_90px] items-center gap-3.5 text-sm max-sm:grid-cols-[110px_1fr_48px_70px] max-sm:gap-2">
          <span className="truncate">{m.model}</span>
          <div className="h-2 overflow-hidden rounded-[2px] bg-bg">
            <div
              className="h-full"
              style={{ width: `${((m.sharePct / max) * 100).toFixed(1)}%`, background: NET_VENDOR_COLORS[m.vendor] }}
            />
          </div>
          <span className="text-right font-mono text-[13px]">{m.sharePct}%</span>
          <span className={`text-right font-mono text-xs ${m.capacityPct < 25 ? "text-warn" : "text-muted"}`}>
            {m.capacityPct}% free
          </span>
        </div>
      ))}
    </Card>
  );
}

export function PlansCard() {
  return (
    <Card title="Providers by plan" note="online now">
      {PLANS.map((p) => {
        const filled = Math.round(p.providers / PROVIDERS_PER_CELL);
        return (
          <div key={p.plan} className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span>{p.plan}</span>
              <span className="font-mono text-text-2">{formatInt(p.providers)}</span>
            </div>
            <div className="flex h-3.5 gap-0.5" aria-hidden="true">
              {Array.from({ length: CELLS }, (_, i) => (
                <div key={i} className={`clip-hex flex-1 ${i < filled ? "bg-volt" : "bg-surface-3"}`} />
              ))}
            </div>
          </div>
        );
      })}
      <span className="font-mono text-[11px] text-muted-2">1 cell ≈ {PROVIDERS_PER_CELL} providers</span>
    </Card>
  );
}
