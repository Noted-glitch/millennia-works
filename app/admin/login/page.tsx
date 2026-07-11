"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Session-scoped: closing the browser ends the session and requires re-login.
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in.";
      if (message.includes("invalid-credential") || message.includes("wrong-password") || message.includes("user-not-found")) {
        setError("Invalid email or password.");
      } else if (message.includes("too-many-requests")) {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-navy text-pearl flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <a href="/" className="font-[family-name:var(--font-playfair)] text-2xl tracking-wider text-gold inline-block mb-6">MW</a>
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3 font-[family-name:var(--font-montserrat)]">Admin Access</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal">
            Sign in to <span className="text-gold italic">manage</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="border border-gold/20 p-8 md:p-10 space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold transition-colors" placeholder="david@millenniaworks.com" />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold transition-colors" placeholder="••••••••••••" />
          </div>

          {error && (
            <p className="text-red-400 text-sm border border-red-400/30 bg-red-400/10 px-4 py-3">{error}</p>
          )}

          <button type="submit" disabled={loading} className="w-full bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] py-3.5 rounded hover:bg-pearl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center mt-8">
          <a href="/" className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] hover:text-gold transition-colors">← Back to site</a>
        </p>
      </motion.div>
    </main>
  );
}