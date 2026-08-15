"use client";

import { useDemo } from "@/lib/store";

export function DemoChrome() {
  const { resetDemo, extras, lastAction } = useDemo();
  const count = extras.reduce((s, c) => s + c.quantity, 0);

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 flex max-w-[min(92vw,360px)] flex-col gap-2">
        <div className="rounded-2xl border border-line bg-[color:var(--paper)] px-3 py-2 text-[11px] leading-snug text-ink-soft shadow-[var(--shadow)]">
          <span className="font-medium text-ink">Prototype.</span> Teachers and item counts are seeded demo records. Legislation pages are sourced from azleg.gov and labeled separately.
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        {count > 0 && (
          <p className="rounded-full bg-juniper px-3 py-1 text-[11px] text-[color:var(--paper)]">
            Units closed this session: {count}
            {lastAction ? ` · last ${lastAction.before}→${lastAction.after}` : ""}
          </p>
        )}
        <button
          onClick={resetDemo}
          className="rounded-full bg-copper px-4 py-2 text-xs font-medium tracking-wide text-[color:var(--paper)] shadow-[var(--shadow)]"
        >
          Reset demo
        </button>
      </div>
    </>
  );
}
