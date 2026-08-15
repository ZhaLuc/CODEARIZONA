"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import type { School, Teacher, ClassroomRequest } from "@/lib/types";
import { bills } from "@/data/bills";

export type MapPoint = {
  school: School;
  remaining: number;
  fulfilled: number;
  needed: number;
  urgency: string;
  priority: number;
  request?: ClassroomRequest;
  teacher?: Teacher;
  openLines?: { name: string; remaining: number }[];
};

function iconFor(point: MapPoint) {
  const cls = point.remaining === 0 ? "fulfilled" : point.remaining <= 8 ? "priority" : point.urgency === "urgent" ? "urgent" : "";
  return L.divIcon({
    className: `need-pin ${cls}`,
    html: `<span>${point.remaining}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export function NeedMap({ points, focus }: { points: MapPoint[]; focus?: [number, number] }) {
  const center = useMemo<[number, number]>(() => focus ?? [34.15, -111.7], [focus]);
  const zoom = focus ? 9 : 6.2;

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full rounded-3xl" minZoom={6} maxBounds={[[31, -115.2], [37.2, -108.8]]}>
      <Recenter center={center} zoom={zoom} />
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      {points.map((p) => {
        const related = p.request ? bills.find((b) => p.request?.relatedBillIds.includes(b.id)) : undefined;
        const openItems = p.openLines?.slice(0, 3) ?? [];
        return (
          <Marker key={p.school.id} position={[p.school.lat, p.school.lng]} icon={iconFor(p)}>
            <Popup>
              <div className="min-w-[210px] text-sm">
                <p className="text-xs uppercase tracking-wide text-stone-500">{p.school.city} · campus</p>
                <p className="font-semibold">{p.school.name}</p>
                <p className="mt-2 text-lg font-semibold">{p.remaining} still needed</p>
                {p.request && (
                  <>
                    <p className="mt-1">{p.request.title}</p>
                    <ul className="mt-2 text-xs">
                      {openItems.map((i) => (
                        <li key={i.name}>
                          {i.name}: {i.remaining} remaining
                        </li>
                      ))}
                    </ul>
                    {related && (
                      <p className="mt-2 text-xs text-stone-600">
                        Policy relevant: {related.number} · {related.title}
                      </p>
                    )}
                    <Link href={`/requests/${p.request.id}`} className="mt-2 inline-block underline">
                      Open remaining need
                    </Link>
                  </>
                )}
                <p className="mt-2 text-[11px] text-stone-500">Campus location only. No teacher home addresses.</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
