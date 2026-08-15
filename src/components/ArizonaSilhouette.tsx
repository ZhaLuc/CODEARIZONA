"use client";

const cities: { name: string; x: number; y: number; id: string }[] = [
  { name: "Page", x: 58, y: 8, id: "Page" },
  { name: "Flagstaff", x: 48, y: 22, id: "Flagstaff" },
  { name: "Fort Defiance", x: 78, y: 20, id: "Fort Defiance" },
  { name: "Kingman", x: 18, y: 22, id: "Kingman" },
  { name: "Prescott-ish", x: 38, y: 32, id: "Payson" },
  { name: "Payson", x: 52, y: 34, id: "Payson" },
  { name: "Phoenix", x: 42, y: 48, id: "Phoenix" },
  { name: "Glendale", x: 38, y: 46, id: "Glendale" },
  { name: "Scottsdale", x: 46, y: 46, id: "Scottsdale" },
  { name: "Mesa", x: 50, y: 50, id: "Mesa" },
  { name: "Chandler", x: 48, y: 54, id: "Chandler" },
  { name: "Laveen", x: 40, y: 54, id: "Laveen" },
  { name: "Tucson", x: 54, y: 72, id: "Tucson" },
  { name: "Nogales", x: 52, y: 88, id: "Nogales" },
  { name: "Yuma", x: 12, y: 68, id: "Yuma" },
];

export function ArizonaSilhouette({
  selected,
  onSelect,
  counts,
}: {
  selected?: string;
  onSelect?: (city: string) => void;
  counts?: Record<string, number>;
}) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Arizona map of classroom needs">
      <path
        d="M22 8 L78 10 L77 22 L84 30 L82 48 L80 78 L78 92 L28 90 L29 58 L18 50 L12 38 L14 24 L22 8 Z"
        fill="#e7dcc8"
        stroke="#1c1917"
        strokeWidth="1.1"
      />
      <path d="M22 8 L38 9 L37 22 L28 20 Z" fill="#d9cbb3" />
      {cities
        .filter((c) => c.name !== "Prescott-ish")
        .map((c) => {
          const n = counts?.[c.id] ?? 0;
          const active = selected === c.id;
          return (
            <g key={c.name} className="cursor-pointer" onClick={() => onSelect?.(c.id)}>
              <circle
                cx={c.x}
                cy={c.y}
                r={active ? 3.2 : n > 0 ? 2.4 : 1.6}
                fill={n > 0 ? (active ? "#c45c3a" : "#1c1917") : "#a8a29e"}
              />
              <text x={c.x + 3.2} y={c.y + 1.2} fontSize="3.2" fill="#1c1917">
                {c.id}
                {n ? ` ${n}` : ""}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
