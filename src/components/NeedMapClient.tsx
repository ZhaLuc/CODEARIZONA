"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "./NeedMap";

const Inner = dynamic(() => import("./NeedMap").then((m) => m.NeedMap), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-surface-muted text-sm text-ink-soft">
      Loading Arizona map
    </div>
  ),
});

export function NeedMapClient(props: { points: MapPoint[]; focus?: [number, number] }) {
  return <Inner {...props} />;
}
