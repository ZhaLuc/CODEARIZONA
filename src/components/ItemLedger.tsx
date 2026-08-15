import { isAlmostThere, ledgerState, ledgerStateLabel, type LiveItem } from "@/lib/fulfillment";

export function ItemLedger({
  item,
  emphasize,
}: {
  item: LiveItem;
  emphasize?: boolean;
}) {
  const state = ledgerState(item.fulfilled, item.quantityNeeded);
  const almost = isAlmostThere(item.remaining, item.quantityNeeded);
  return (
    <div className={`ledger-row ${state} ${emphasize ? "need-pop" : ""}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium">{item.name}</p>
        <p className="display text-2xl leading-none">
          {item.remaining === 0 ? (
            <span className="text-juniper">Closed</span>
          ) : (
            <>
              {item.remaining} <span className="text-lg text-ink-soft">still needed</span>
            </>
          )}
        </p>
      </div>
      <div className="mt-2 flex items-baseline justify-between text-sm text-ink-soft">
        <span>
          {item.fulfilled} / {item.quantityNeeded} closed
        </span>
        <span>{ledgerStateLabel[state]}</span>
      </div>
      <div className="progress-track mt-2 h-2.5 rounded-full">
        <div className="progress-fill rounded-full" style={{ width: `${item.pct}%` }} />
      </div>
      {almost && item.remaining > 0 && (
        <p className="mt-2 text-xs font-medium text-copper-deep">Almost there · {item.remaining} would close this line</p>
      )}
      <p className="mt-2 text-sm text-ink-soft">{item.why}</p>
    </div>
  );
}

export function NeedCount({ remaining, needed, fulfilled }: { remaining: number; needed: number; fulfilled: number }) {
  const state = ledgerState(fulfilled, needed);
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Remaining need</p>
      <p className="display mt-1 text-5xl leading-none">{remaining}</p>
      <p className="mt-2 text-sm text-ink-soft">
        {fulfilled} of {needed} item units closed · {ledgerStateLabel[state]}
      </p>
      <p className="mt-1 text-xs text-ink-soft">A mixed list stays open until every line is closed.</p>
    </div>
  );
}
