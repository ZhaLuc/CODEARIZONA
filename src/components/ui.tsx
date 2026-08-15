import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "ink",
}: {
  children: ReactNode;
  tone?: "ink" | "juniper" | "copper" | "clay" | "civic" | "sand";
}) {
  const map = {
    ink: "bg-ink text-[color:var(--paper)]",
    juniper: "bg-juniper text-[color:var(--paper)]",
    copper: "bg-copper text-[color:var(--paper)]",
    clay: "bg-clay text-[color:var(--paper)]",
    civic: "bg-civic text-[color:var(--paper)]",
    sand: "bg-sand text-ink",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

export function SourceTag({ kind }: { kind: "demo" | "law" }) {
  return kind === "law" ? (
    <Badge tone="civic">Real legislation data</Badge>
  ) : (
    <Badge tone="sand">Demonstration classroom data</Badge>
  );
}

export function LedgerBar({
  fulfilled,
  needed,
  label,
}: {
  fulfilled: number;
  needed: number;
  label?: string;
}) {
  const pct = needed === 0 ? 0 : Math.min(100, (fulfilled / needed) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium">
          {fulfilled} / {needed} fulfilled
        </span>
        {label ? <span className="text-ink-soft">{label}</span> : <span className="text-ink-soft">{needed - fulfilled} remaining</span>}
      </div>
      <div className="progress-track h-2.5 rounded-full">
        <div className="progress-fill rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Stat({ k, v, hint }: { k: string; v: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-[color:var(--paper-2)]/60 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">{k}</p>
      <p className="display mt-1 text-3xl">{v}</p>
      {hint ? <p className="mt-1 text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-line p-10 text-center">
      <p className="display text-2xl">{title}</p>
      <p className="mt-2 text-ink-soft">{body}</p>
    </div>
  );
}
