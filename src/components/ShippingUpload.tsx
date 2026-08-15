"use client";

import { useState } from "react";
import type { EvidenceFile } from "@/lib/types";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX = 8 * 1024 * 1024;

function sizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readPreview(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      if (!file.type.startsWith("image/")) {
        resolve(src);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 720 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

export function ShippingUpload({
  value,
  onChange,
  title = "Upload shipping evidence",
  body = "Upload a photo of the shipping label or order confirmation so the classroom can verify the shipment.",
}: {
  value: EvidenceFile | null;
  onChange: (file: EvidenceFile | null) => void;
  title?: string;
  body?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  async function take(file: File | undefined) {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setError("Use a JPG, PNG, or WEBP photo.");
      return;
    }
    if (file.size > MAX) {
      setError("File is too large. Keep it under 8 MB.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const previewUrl = await readPreview(file);
      onChange({
        fileName: file.name,
        fileKind: "image",
        sizeLabel: sizeLabel(file.size),
        previewUrl,
      });
    } catch {
      setError("Could not read that file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="display text-3xl md:text-4xl">{title}</h2>
      <p className="mt-2 max-w-[52ch] text-sm text-ink-soft">{body}</p>
      <label
        className={`mt-5 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed px-4 text-center ${
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
          void take(e.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          className="sr-only"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={(e) => void take(e.target.files?.[0])}
        />
        {loading ? (
          <span className="text-sm text-ink-soft">Reading photo</span>
        ) : value?.previewUrl ? (
          <span className="flex w-full max-w-sm flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value.previewUrl} alt="Selected shipping evidence" className="max-h-48 rounded-xl object-contain" />
            <span className="text-sm">
              {value.fileName} · {value.sizeLabel} · image
            </span>
          </span>
        ) : (
          <span>
            <span className="block text-base font-medium">Upload shipping label</span>
            <span className="mt-1 block text-sm text-ink-soft">Drop a photo here, or tap to choose from your camera roll</span>
          </span>
        )}
      </label>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {value && (
        <button type="button" className="btn btn-secondary mt-3 !min-h-10 text-sm" onClick={() => onChange(null)}>
          Remove
        </button>
      )}
    </div>
  );
}
