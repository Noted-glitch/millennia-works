"use client";

// TEMPORARY: standalone harness for testing the /api/upload route + ImageUpload
// component before wiring uploads into the Portfolio/Blog/Settings forms.
// Safe to delete once integration is done.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import ImageUpload, { type UploadCategory } from "@/components/ImageUpload";

const CATEGORIES: UploadCategory[] = ["portfolio", "blog", "settings"];

export default function TestUpload() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [category, setCategory] = useState<UploadCategory>("portfolio");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
      else setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-navy text-pearl flex items-center justify-center">
        <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)]">
          Verifying access...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy text-pearl">
      <nav className="border-b border-gold/10 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/admin" className="font-[family-name:var(--font-playfair)] text-xl tracking-wider text-gold">MW</a>
            <p className="text-taupe text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Upload Test (temporary)</p>
          </div>
          <a href="/admin" className="text-xs tracking-widest uppercase border border-gold/30 text-gold px-4 py-2 rounded hover:bg-gold hover:text-navy transition-colors font-[family-name:var(--font-montserrat)]">← Dashboard</a>
        </div>
      </nav>

      <section className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-2 font-[family-name:var(--font-montserrat)]">Sandbox</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal mb-10">
          Test <span className="text-gold italic">upload</span>
        </h1>

        <div className="border border-gold/20 p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as UploadCategory)}
              className="w-full bg-navy border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <ImageUpload category={category} value={url} onChange={setUrl} label="Upload an image" />

          <div>
            <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Returned URL</label>
            <input
              type="text"
              readOnly
              value={url}
              placeholder="(none yet)"
              className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold font-mono text-sm"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
