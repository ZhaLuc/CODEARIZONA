import type { ReactNode } from "react";
import type { FulfillmentStatus } from "@/lib/types";
import { fulfillmentStatusLabel } from "@/lib/fulfillment";

export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "ink" | "verified" | "pending" | "accent" | "info" | "danger";
}) {
  const map = {
    muted: "bg-surface-muted text-ink",
    ink: "bg-ink text-[color:var(--surface)]",
    verified: "bg-verified text-[color:var(--on-verified)]",
    pending: "bg-pending text-[color:var(--on-pending)]",
    accent: "bg-accent text-[color:var(--on-accent)]",
    info: "bg-info text-[color:var(--on-info)]",
    danger: "bg-danger text-[color:var(--on-danger)]",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

export function StatusChip({ status }: { status: FulfillmentStatus }) {
  const tone = status === "verified" ? "verified" : status === "needs_attention" ? "danger" : "pending";
  return <Badge tone={tone}>{fulfillmentStatusLabel[status]}</Badge>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-[22px] border border-dashed border-line bg-surface px-8 py-12 text-center">
      <p className="display text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-[52ch] text-ink-soft">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function FieldLabel({
  htmlFor,
  children,
  hint,
  error,
}: {
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm">
      <span className="font-medium">{children}</span>
      {hint ? <span className="mt-1 block text-xs text-ink-faint">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
    </label>
  );
}

export function PageHeader({ kicker, title, body }: { kicker?: string; title: string; body?: string }) {
  return (
    <header className="max-w-3xl">
      {kicker ? <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">{kicker}</p> : null}
      <h1 className="display mt-2 text-4xl leading-[0.95] md:text-6xl">{title}</h1>
      {body ? <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-ink-soft">{body}</p> : null}
    </header>
  );
}
