"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ACCEPTED_TYPES,
  uploadImageToR2,
  deleteImageFromR2,
  validateImageFile,
} from "@/lib/r2-upload-client";

export type { UploadCategory } from "@/lib/r2-upload-client";

interface ImageUploadProps {
  category: "portfolio" | "blog" | "settings";
  /** Current image URL (empty string when none). */
  value?: string;
  /** Called with the new public URL on success, or "" when removed. */
  onChange: (url: string) => void;
  /** Optional field label shown above the control. */
  label?: string;
  /** Optional dimension/format hint shown below the drop zone. */
  hint?: string;
}

export default function ImageUpload({
  category,
  value,
  onChange,
  label = "Image",
  hint,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  // Local blob URL so the preview is visible immediately on file selection,
  // before the CDN URL comes back from the server.
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const uploading = progress !== null;
  const previewSrc = localPreview || value || null;

  // Revoke the blob URL when the component unmounts to avoid memory leaks.
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  async function upload(file: File) {
    setError("");
    const previousUrl = value; // capture before anything changes — used to delete old R2 object on replace

    // Validate up front so the preview only appears for a valid file.
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);
    setProgress(0);
    try {
      const url = await uploadImageToR2(file, category, (p) => setProgress(p));
      URL.revokeObjectURL(blobUrl);
      setLocalPreview(null);
      onChange(url);
      // Delete the old object only after the new one is confirmed saved.
      if (previousUrl) deleteImageFromR2(previousUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      URL.revokeObjectURL(blobUrl);
      setLocalPreview(null);
    } finally {
      setProgress(null);
    }
  }

  function handleFiles(files: FileList | null) {
    if (files && files[0]) upload(files[0]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (uploading) return;
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">
        {label}
      </label>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = ""; // allow re-selecting the same file
        }}
      />

      {previewSrc ? (
        // Preview: shows the local blob immediately on selection, then the CDN URL once uploaded.
        <div className="border border-gold/30">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Uploaded preview"
              className="w-full max-h-64 object-contain bg-navy"
            />
            {uploading && (
              <div className="absolute inset-0 bg-navy/75 flex flex-col items-center justify-center gap-2">
                <p className="text-pearl text-sm">Uploading… {progress}%</p>
                <div className="w-2/3 h-1.5 bg-gold/15 rounded overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-150"
                    style={{ width: `${progress ?? 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          {!uploading && (
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gold/20">
              <p className="text-taupe text-xs truncate font-mono">{value}</p>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-4 py-2 rounded hover:bg-gold/10 transition-colors"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    const urlToDelete = value;
                    onChange("");
                    if (urlToDelete) deleteImageFromR2(urlToDelete);
                  }}
                  className="border border-red-400/30 text-red-400 text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-4 py-2 rounded hover:bg-red-400/10 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Drop zone / click-to-select.
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 px-6 py-10 border border-dashed rounded cursor-pointer transition-colors text-center ${
            dragging ? "border-gold bg-gold/10" : "border-gold/30 hover:border-gold/60"
          }`}
        >
          <p className="text-champagne/80 text-sm">
            Drag &amp; drop an image, or{" "}
            <span className="text-gold underline underline-offset-2">browse</span>
          </p>
          <p className="text-taupe text-xs">JPEG, PNG, WebP, or GIF · up to 5 MB · saved as WebP</p>
          {hint && <p className="text-taupe text-xs">{hint}</p>}
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm border border-red-400/30 bg-red-400/10 px-4 py-3 mt-3">
          {error}
        </p>
      )}
    </div>
  );
}
