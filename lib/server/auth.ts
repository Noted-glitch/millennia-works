import { getAdminAuth } from "@/lib/firebase-admin";

export type AdminAuthResult =
  | { ok: true; uid: string; email?: string }
  | { ok: false; status: number; error: string };

/**
 * Verifies the caller is a signed-in admin by checking the Firebase ID token
 * sent as an `Authorization: Bearer <token>` header. The client obtains this
 * token via `auth.currentUser.getIdToken()`.
 *
 * Mirrors the client-side `onAuthStateChanged` gate used by the admin pages,
 * but enforced on the server so R2 credentials are never exposed.
 */
export async function requireAdmin(request: Request): Promise<AdminAuthResult> {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { ok: false, status: 401, error: "Missing or malformed Authorization header." };
  }

  const adminAuth = getAdminAuth();
  if (!adminAuth) {
    return { ok: false, status: 503, error: "Server auth is not configured." };
  }

  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    return { ok: true, uid: decoded.uid, email: decoded.email };
  } catch {
    return { ok: false, status: 401, error: "Invalid or expired session. Please sign in again." };
  }
}
