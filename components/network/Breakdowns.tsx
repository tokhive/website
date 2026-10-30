import { formatInt } from "@/lib/format";
import { planLabel, type NetVendor, type PublicNetwork } from "@/lib/public-network";

export const NET_VENDOR_COLORS: Record<NetVendor, string> = {
  anthropic: "#C8F031",
  openai: "#F2F2EE",
};

const CELLS = 30;
const MODELS_SHOWN = 8;

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

function Empty({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[13px] text-muted">{children}</span>;
}

export function ModelShareCard({ data }: { data: PublicNetwork | null }) {
  const models = (data?.models ?? []).slice(0, MODELS_SHOWN);
  const total = (data?.models ?? []).reduce((t, m) => t + m.tokens, 0);
  const max = Math.max(1, ...models.map((m) => m.tokens));
  return (
    <Card title="Model share & capacity" note="share · 24h / capacity free now">
      {data && models.length === 0 && <Empty>No traffic in the last 24 hours</Empty>}
      {!data && <Empty>—</Empty>}
      {models.map((m) => {
        const free = m.capacity_free_pct;
        return (
          <div key={m.model} className="grid grid-cols-[150px_1fr_56px_90px] items-center gap-3.5 text-sm max-sm:grid-cols-[110px_1fr_48px_70px] max-sm:gap-2">
            <span className="truncate">{m.model}</span>
            <div className="h-2 overflow-hidden rounded-[2px] bg-bg">
              <div
                className="h-full"
                style={{ width: `${((m.tokens / max) * 100).toFixed(1)}%`, background: NET_VENDOR_COLORS[m.vendor] }}
              />
            </div>
            <span className="text-right font-mono text-[13px]">{((m.tokens / total) * 100).toFixed(1)}%</span>
            <span className={`text-right font-mono text-xs ${free !== null && free < 25 ? "text-warn" : "text-muted"}`}>
              {free === null ? "no supply" : `${free}% free`}
            </span>
          </div>
        );
      })}
    </Card>
  );
}

export function PlansCard({ data }: { data: PublicNetwork | null }) {
  const plans = data?.plans ?? [];
  const perCell = Math.max(1, Math.ceil(Math.max(0, ...plans.map((p) => p.accounts)) / CELLS));
  return (
    <Card title="Accounts by plan" note="online now">
      {data && plans.length === 0 && <Empty>No accounts online</Empty>}
      {!data && <Empty>—</Empty>}
      {plans.map((p) => {
        const filled = Math.ceil(p.accounts / perCell);
        return (
          <div key={`${p.platform}/${p.plan}`} className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span>{planLabel(p.platform, p.plan)}</span>
              <span className="font-mono text-text-2">{formatInt(p.accounts)}</span>
            </div>
            <div className="flex h-3.5 gap-0.5" aria-hidden="true">
              {Array.from({ length: CELLS }, (_, i) => (
                <div key={i} className={`clip-hex flex-1 ${i < filled ? "bg-volt" : "bg-surface-3"}`} />
              ))}
            </div>
          </div>
        );
      })}
      {plans.length > 0 && (
        <span className="font-mono text-[11px] text-muted-2">1 cell = {perCell === 1 ? "1 account" : `${perCell} accounts`}</span>
      )}
    </Card>
  );
}
