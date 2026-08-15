"use client";

import { useState } from "react";
import type { EvidenceFile } from "@/lib/types";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX = 8 * 1024 * 1024;

function sizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ShippingUpload({
  value,
  onChange,
}: {
  value: EvidenceFile | null;
  onChange: (file: EvidenceFile | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function take(file: File | undefined) {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setError("Use a JPG, PNG, WEBP, or PDF shipping label.");
      return;
    }
    if (file.size > MAX) {
      setError("File is too large. Keep it under 8 MB.");
      return;
    }
    setError(null);
    onChange({
      fileName: file.name,
      fileKind: file.type === "application/pdf" ? "pdf" : "image",
      sizeLabel: sizeLabel(file.size),
    });
  }

  return (
    <div>
      <p className="display text-2xl">Verify your shipment</p>
      <p className="mt-2 text-sm text-ink-soft">
        Upload the shipping label so the classroom can confirm that the requested item is on its way.
      </p>
      <label
        className={`mt-4 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed px-4 text-center text-sm ${
          dragging ? "border-ink bg-surface-muted" : "border-line bg-surface"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          take(e.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          className="sr-only"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(e) => take(e.target.files?.[0])}
        />
        {value ? (
          <span>
            Uploaded {value.fileName} ({value.sizeLabel})
          </span>
        ) : (
          <span>Drop a label here, or choose a file</span>
        )}
      </label>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {value && (
        <div className="mt-3 flex gap-2">
          <button type="button" className="btn btn-secondary !min-h-10 text-sm" onClick={() => onChange(null)}>
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
