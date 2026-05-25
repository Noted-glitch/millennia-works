"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    await signOut(auth);
    router.push("/admin/login");
  }

  if (loading) {
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
          <div>
            <p className="font-[family-name:var(--font-playfair)] text-xl tracking-wider text-gold">
              MW
            </p>
            <p className="text-taupe text-[10px] tracking-widest uppercase mt-1 font-[family-name:var(--font-montserrat)]">
              Admin Dashboard
            </p>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-pearl/70 text-xs hidden md:block">
              {user?.email}
            </p>
            <button
              onClick={handleLogout}
              className="text-xs tracking-widest uppercase border border-gold/30 text-gold px-4 py-2 rounded hover:bg-gold hover:text-navy transition-colors font-[family-name:var(--font-montserrat)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-[family-name:var(--font-montserrat)]">
          Welcome back
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal mb-4">
          Your <span className="text-gold italic">command center.</span>
        </h1>
        <p className="text-champagne/70 text-base max-w-2xl mb-12">
          From here, you&apos;ll manage portfolio projects, testimonials, blog
          posts, and incoming inquiries. Modules unlock as we build them.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Portfolio", status: "Coming next" },
            { name: "Testimonials", status: "Coming next" },
            { name: "Blog", status: "Coming later" },
            { name: "Inquiries", status: "Coming next" },
            { name: "Services", status: "Coming later" },
            { name: "Settings", status: "Coming later" },
          ].map((mod) => (
            <div
              key={mod.name}
              className="border border-gold/20 p-6 hover:border-gold/40 transition-colors"
            >
              <h3 className="font-[family-name:var(--font-playfair)] text-xl mb-2">
                {mod.name}
              </h3>
              <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)]">
                {mod.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}