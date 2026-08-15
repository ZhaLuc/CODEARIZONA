import { isAlmostThere, ledgerState, ledgerStateLabel, type LiveItem } from "@/lib/fulfillment";

export function ItemLedger({
  item,
  emphasize,
}: {
  item: LiveItem;
  emphasize?: boolean;
}) {
  const state = ledgerState(item.verified, item.quantityNeeded);
  const almost = isAlmostThere(item.remaining, item.quantityNeeded);
  return (
    <div className={`ledger-row ${state} ${emphasize ? "need-pop" : ""}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium">{item.name}</p>
        <p className="num text-2xl leading-none">
          {item.remaining === 0 ? (
            <span className="text-verified">Closed</span>
          ) : (
            <>
              {item.remaining} <span className="text-lg font-sans font-normal text-ink-soft">still needed</span>
            </>
          )}
        </p>
      </div>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 text-sm text-ink-soft">
        <span>
          Verified {item.verified} / {item.quantityNeeded}
          {item.pending > 0 ? ` · ${item.pending} pending` : ""}
        </span>
        <span>{ledgerStateLabel[state]}</span>
      </div>
      <div className="progress-track mt-2 h-2.5 rounded-full">
        <div className="progress-fill rounded-full" style={{ width: `${item.pct}%` }} />
      </div>
      {item.pending > 0 && (
        <p className="mt-2 text-xs text-pending">
          {item.pending} pending verification. {item.remainingAfterPending} would remain once verified.
        </p>
      )}
      {almost && item.remaining > 0 && item.pending === 0 && (
        <p className="mt-2 text-xs font-medium text-accent">Almost there. {item.remaining} would close this line.</p>
      )}
      <p className="mt-2 text-sm text-ink-soft">{item.why}</p>
    </div>
  );
}

export function LedgerTable({ items }: { items: LiveItem[] }) {
  return (
    <div className="overflow-x-auto rounded-[22px] border border-line bg-surface">
      <table className="w-full min-w-[520px] text-sm">
        <caption className="sr-only">Item ledger with verified, pending, and remaining counts</caption>
        <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          <tr className="border-b border-line">
            <th className="px-5 py-3 font-medium">Item</th>
            <th className="px-3 py-3 text-right font-medium">Needed</th>
            <th className="px-3 py-3 text-right font-medium">Verified</th>
            <th className="px-3 py-3 text-right font-medium">Pending</th>
            <th className="px-5 py-3 text-right font-medium">Still needed</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const state = ledgerState(item.verified, item.quantityNeeded);
            return (
              <tr key={item.id} className={`ledger-row ${state} border-b border-line last:border-0`}>
                <td className="px-5 py-4">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-ink-faint">{ledgerStateLabel[state]}</p>
                </td>
                <td className="num px-3 py-4 text-right">{item.quantityNeeded}</td>
                <td className="num px-3 py-4 text-right">{item.verified}</td>
                <td className="num px-3 py-4 text-right text-pending">{item.pending}</td>
                <td className={`num px-5 py-4 text-right text-xl ${item.remaining === 0 ? "text-verified" : ""}`}>
                  {item.remaining === 0 ? "0" : item.remaining}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function NeedCount({
  remaining,
  needed,
  verified,
  pending,
}: {
  remaining: number;
  needed: number;
  verified: number;
  pending?: number;
}) {
  const state = ledgerState(verified, needed);
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">Items still needed</p>
      <p className="num mt-1 text-6xl leading-none md:text-7xl">{remaining}</p>
      <p className="mt-3 text-sm text-ink-soft">
        {verified} / {needed} verified · {ledgerStateLabel[state]}
      </p>
      {pending ? (
        <p className="mt-1 text-sm text-pending">
          {pending} pending verification. {remaining - pending > 0 ? `${remaining - pending} would remain once verified.` : "This line would close once verified."} Not counted yet.
        </p>
      ) : (
        <p className="mt-1 text-xs text-ink-faint">A mixed list stays open until every line is verified closed.</p>
      )}
    </div>
  );
}
