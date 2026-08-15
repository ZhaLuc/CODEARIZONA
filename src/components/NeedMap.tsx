"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import type { School, Teacher, ClassroomRequest } from "@/lib/types";
import { LedgerBar } from "./ui";

export type MapPoint = {
  school: School;
  remaining: number;
  fulfilled: number;
  needed: number;
  urgency: string;
  priority: number;
  request?: ClassroomRequest;
  teacher?: Teacher;
};

function iconFor(point: MapPoint) {
  const cls = point.remaining === 0 ? "fulfilled" : point.urgency === "urgent" ? "urgent" : point.priority >= 6 ? "priority" : "";
  return L.divIcon({
    className: `need-pin ${cls}`,
    html: `<span>${point.remaining}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

export function NeedMap({ points, focus }: { points: MapPoint[]; focus?: [number, number] }) {
  const center = useMemo<[number, number]>(() => focus ?? [34.15, -111.7], [focus]);

  return (
    <MapContainer
      center={center}
      zoom={focus ? 10 : 6.2}
      scrollWheelZoom
      className="h-full w-full rounded-3xl"
      minZoom={6}
      maxBounds={[
        [31, -115.2],
        [37.2, -108.8],
      ]}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {points.map((p) => (
        <Marker key={p.school.id} position={[p.school.lat, p.school.lng]} icon={iconFor(p)}>
          <Popup>
            <div className="min-w-[200px] text-sm">
              <p className="text-xs uppercase tracking-wide text-stone-500">{p.school.city}</p>
              <p className="font-semibold">{p.school.name}</p>
              {p.teacher && p.request ? (
                <>
                  <p className="mt-1">
                    {p.teacher.name} · {p.request.title}
                  </p>
                  <div className="mt-2">
                    <LedgerBar fulfilled={p.fulfilled} needed={p.needed} />
                  </div>
                  <p className="mt-2 font-medium">{p.remaining} items still needed</p>
                  <Link href={`/requests/${p.request.id}`} className="mt-2 inline-block underline">
                    Open request
                  </Link>
                </>
              ) : (
                <p className="mt-1">{p.remaining} remaining across open requests</p>
              )}
              <p className="mt-2 text-[11px] text-stone-500">School location is campus-level. No teacher home addresses.</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
