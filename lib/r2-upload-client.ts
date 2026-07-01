import { auth } from "@/lib/firebase";

/**
 * Client-side helpers for the R2 upload pipeline. This is the single shared
 * implementation used by both the single-image <ImageUpload> and the
 * multi-image <GalleryUpload> — they only differ in UI, not in how bytes get
 * to the server. All uploads go through POST /api/upload (auth + WebP + R2);
 * deletes go through DELETE /api/upload.
 */

export type UploadCategory = "portfolio" | "blog" | "settings";

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/** Returns an error message if the file is invalid, or null if it's acceptable. */
export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Unsupported file type. Use JPEG, PNG, WebP, or GIF.";
  }
  if (file.size > MAX_BYTES) {
    return "File too large. Maximum size is 5 MB.";
  }
  return null;
}

/**
 * Uploads a single image to R2 via the API route and resolves with the public
 * CDN URL. Throws with a user-facing message on validation, auth, or network
 * failure. `onProgress` (0–100) is optional.
 */
export async function uploadImageToR2(
  file: File,
  category: UploadCategory,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const user = auth.currentUser;
  if (!user) {
    throw new Error("You appear to be signed out. Refresh the page and sign in again.");
  }

  let token: string;
  try {
    token = await user.getIdToken();
  } catch {
    throw new Error("Could not verify your session. Please try again.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
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
}

/**
 * Deletes an object from R2 by its public URL. Best-effort and silent — an
 * orphaned object is not critical, so failures are swallowed.
 */
export async function deleteImageFromR2(url: string): Promise<void> {
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
    // Silent — orphaned objects are not critical.
  }
}
