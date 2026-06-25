"use client";

import { useEffect, useId, useRef, useState } from "react";
import { auth } from "@/lib/firebase";

export type UploadCategory = "portfolio" | "blog" | "settings";

interface ImageUploadProps {
  category: UploadCategory;
  /** Current image URL (empty string when none). */
  value?: string;
  /** Called with the new public URL on success, or "" when removed. */
  onChange: (url: string) => void;
  /** Optional field label shown above the control. */
  label?: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export default function ImageUpload({
  category,
  value,
  onChange,
  label = "Image",
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

  async function deleteFromR2(url: string) {
    const user = auth.currentUser;
    if (!user || !url) return;
    try {
      const token = await user.getIdToken();
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } catch {
      // Silent — orphaned objects are not critical
    }
  }

  // Revoke the blob URL when the component unmounts to avoid memory leaks.
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  async function upload(file: File) {
    setError("");
    const previousUrl = value; // capture before anything changes — used to delete old R2 object on replace

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Unsupported file type. Use JPEG, PNG, WebP, or GIF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File too large. Maximum size is 5 MB.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("You appear to be signed out. Refresh the page and sign in again.");
      return;
    }

    let token: string;
    try {
      token = await user.getIdToken();
    } catch {
      setError("Could not verify your session. Please try again.");
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    setProgress(0);
    try {
      const url = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/upload");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          let body: { url?: string; error?: string } = {};
          try { body = JSON.parse(xhr.responseText); } catch { /* non-JSON */ }
          if (xhr.status >= 200 && xhr.status < 300 && body.url) {
            resolve(body.url);
          } else {
            reject(new Error(body.error || `Upload failed (${xhr.status}).`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload."));
        xhr.send(formData);
      });

      URL.revokeObjectURL(blobUrl);
      setLocalPreview(null);
      onChange(url);
      // Delete the old object only after the new one is confirmed saved.
      if (previousUrl) deleteFromR2(previousUrl);
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
                    if (urlToDelete) deleteFromR2(urlToDelete);
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
          <p className="text-taupe text-xs">JPEG, PNG, WebP, or GIF · up to 5 MB</p>
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
