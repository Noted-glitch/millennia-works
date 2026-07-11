"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// Auto sign-out after this much inactivity.
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
// How often to check whether the idle threshold has been crossed.
const CHECK_INTERVAL_MS = 30 * 1000; // 30 seconds
// Activity that counts as "still working" and resets the idle clock.
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart", "click"] as const;

/**
 * Enforces the admin login policy in one place (rendered from app/admin/layout.tsx):
 *   - Session persistence: the auth session lives in sessionStorage, so closing the
 *     browser/tab requires a fresh login. Calling setPersistence also migrates any
 *     older localStorage session created before this policy existed.
 *   - Idle timeout: after IDLE_TIMEOUT_MS with no user activity, sign the admin out.
 *     The per-page onAuthStateChanged gates then redirect to /admin/login.
 */
export function AdminSessionGuard() {
  const router = useRouter();
  // Stamped with Date.now() inside the effect once a user is present; the idle
  // watchdog is only armed after that, so the initial 0 is never evaluated.
  const lastActivityRef = useRef<number>(0);

  // Downgrade persistence from the Firebase default (localStorage) to session scope.
  useEffect(() => {
    setPersistence(auth, browserSessionPersistence).catch((err) => {
      console.error("Failed to set session persistence:", err);
    });
  }, []);

  // Idle-timeout watchdog — only armed while a user is signed in.
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const markActive = () => {
      lastActivityRef.current = Date.now();
    };

    const teardown = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = undefined;
      for (const evt of ACTIVITY_EVENTS) window.removeEventListener(evt, markActive);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      teardown();
      if (!user) return;

      lastActivityRef.current = Date.now();
      for (const evt of ACTIVITY_EVENTS) {
        window.addEventListener(evt, markActive, { passive: true });
      }

      intervalId = setInterval(async () => {
        if (Date.now() - lastActivityRef.current < IDLE_TIMEOUT_MS) return;
        teardown();
        try {
          await signOut(auth);
        } catch (err) {
          console.error("Idle sign-out failed:", err);
        }
        router.push("/admin/login");
      }, CHECK_INTERVAL_MS);
    });

    return () => {
      teardown();
      unsubscribe();
    };
  }, [router]);

  return null;
}
