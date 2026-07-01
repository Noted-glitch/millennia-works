"use client";

import { useRef, useState } from "react";
import {
  ACCEPTED_TYPES,
  uploadImageToR2,
  deleteImageFromR2,
  validateImageFile,
  type UploadCategory,
} from "@/lib/r2-upload-client";

interface GalleryUploadProps {
  category: UploadCategory;
  /** Ordered list of gallery image URLs. */
  value: string[];
  /** Called with the full updated list on any add / remove / reorder. */
  onChange: (urls: string[]) => void;
  label?: string;
  hint?: string;
}

export default function GalleryUpload({
  category,
  value,
  onChange,
  label = "Gallery",
  hint,
}: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError("");

    // Pre-validate; skip invalid files but keep going with the valid ones.
    const valid: File[] = [];
    const problems: string[] = [];
    for (const f of Array.from(fileList)) {
      const v = validateImageFile(f);
      if (v) problems.push(`${f.name}: ${v}`);
      else valid.push(f);
    }
    if (problems.length) setError(problems.join(" "));
    if (valid.length === 0) return;

    setBusy(true);
    // `value` is captured here; each success appends to `added` and re-emits
    // the original list plus everything added so far, so thumbnails appear as
    // uploads complete without clobbering earlier results.
    const added: string[] = [];
    try {
      for (let i = 0; i < valid.length; i++) {
        setProgressText(`Uploading ${i + 1} of ${valid.length}…`);
        try {
          const url = await uploadImageToR2(valid[i], category);
          added.push(url);
          onChange([...value, ...added]);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "upload failed.";
          setError((prev) => `${prev ? prev + " " : ""}${valid[i].name}: ${msg}`);
        }
      }
    } finally {
      setBusy(false);
      setProgressText("");
    }
  }

  function removeAt(index: number) {
    const url = value[index];
    onChange(value.filter((_, i) => i !== index));
    if (url) deleteImageFromR2(url);
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">
        {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = ""; // allow re-selecting the same file(s)
        }}
      />

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {value.map((url, i) => (
            <div key={url} className="relative border border-gold/30 bg-navy">
              <div className="aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Gallery image ${i + 1}`} className="w-full h-full object-cover" />
              </div>
              <span className="absolute top-1.5 left-1.5 text-[10px] bg-navy/80 text-gold px-1.5 py-0.5 font-mono rounded">
                {i + 1}
              </span>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-navy/85 px-1.5 py-1">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move back"
                    title="Move back"
                    className="text-gold text-xs leading-none px-1.5 py-1 border border-gold/30 rounded hover:bg-gold/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1}
                    aria-label="Move forward"
                    title="Move forward"
                    className="text-gold text-xs leading-none px-1.5 py-1 border border-gold/30 rounded hover:bg-gold/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ▶
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label="Remove"
                  title="Remove"
                  className="text-red-400 text-xs leading-none px-1.5 py-1 border border-red-400/30 rounded hover:bg-red-400/10 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !busy) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!busy) handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 px-6 py-8 border border-dashed rounded cursor-pointer transition-colors text-center ${
          dragging ? "border-gold bg-gold/10" : "border-gold/30 hover:border-gold/60"
        } ${busy ? "opacity-60 pointer-events-none" : ""}`}
      >
        {busy ? (
          <p className="text-champagne/80 text-sm">{progressText || "Uploading…"}</p>
        ) : (
          <>
            <p className="text-champagne/80 text-sm">
              Drag &amp; drop images, or{" "}
              <span className="text-gold underline underline-offset-2">browse</span>
              {value.length > 0 && " to add more"}
            </p>
            <p className="text-taupe text-xs">
              Select multiple · JPEG, PNG, WebP, or GIF · up to 5 MB each · saved as WebP
            </p>
            {hint && <p className="text-taupe text-xs">{hint}</p>}
          </>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm border border-red-400/30 bg-red-400/10 px-4 py-3 mt-3">
          {error}
        </p>
      )}
    </div>
  );
}
