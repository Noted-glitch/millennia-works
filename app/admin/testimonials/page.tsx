"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/testimonials";
import { PROJECT_CATEGORIES, type Testimonial } from "@/lib/types";

const emptyTestimonial: Omit<Testimonial, "id" | "createdAt" | "updatedAt"> = {
  quote: "",
  clientName: "",
  role: "",
  company: "",
  category: PROJECT_CATEGORIES[0],
  photoUrl: "",
  featured: false,
  order: 0,
};

export default function TestimonialsManager() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyTestimonial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
      else setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (authChecked) loadTestimonials();
  }, [authChecked]);

  async function loadTestimonials() {
    setLoading(true);
    try {
      const data = await getAllTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm({ ...emptyTestimonial, order: testimonials.length });
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(t: Testimonial) {
    setForm({
      quote: t.quote,
      clientName: t.clientName,
      role: t.role,
      company: t.company,
      category: t.category || PROJECT_CATEGORIES[0],
      photoUrl: t.photoUrl || "",
      featured: t.featured,
      order: t.order,
    });
    setEditingId(t.id || null);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      if (editingId) {
        await updateTestimonial(editingId, form);
        setMessage("Testimonial updated.");
      } else {
        await createTestimonial(form);
        setMessage("Testimonial created.");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyTestimonial);
      await loadTestimonials();
    } catch (err) {
      console.error(err);
      setMessage("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, clientName: string) {
    if (!confirm(`Delete testimonial from "${clientName}"? This cannot be undone.`)) return;
    try {
      await deleteTestimonial(id);
      setMessage("Testimonial deleted.");
      await loadTestimonials();
    } catch (err) {
      console.error(err);
      setMessage("Delete failed.");
    }
  }

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-navy text-pearl flex items-center justify-center">
        <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Verifying access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy text-pearl">
      <nav className="border-b border-gold/10 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/admin" className="font-[family-name:var(--font-playfair)] text-xl tracking-wider text-gold">MW</a>
            <p className="text-taupe text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Testimonials Manager</p>
          </div>
          <a href="/admin" className="text-xs tracking-widest uppercase border border-gold/30 text-gold px-4 py-2 rounded hover:bg-gold hover:text-navy transition-colors font-[family-name:var(--font-montserrat)]">← Dashboard</a>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-2 font-[family-name:var(--font-montserrat)]">Manage</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal">Client <span className="text-gold italic">testimonials</span></h1>
          </div>
          <button onClick={openCreate} className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-pearl transition-colors">+ New testimonial</button>
        </div>

        {message && (
          <p className="border border-gold/30 bg-gold/10 text-gold text-sm px-4 py-3 mb-6">{message}</p>
        )}

        {showForm && (
          <form onSubmit={handleSave} className="border border-gold/20 p-6 md:p-8 mb-10 space-y-5">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl mb-4">{editingId ? "Edit testimonial" : "New testimonial"}</h2>

            <div>
              <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Quote *</label>
              <textarea required rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold resize-none" placeholder="What did they say about working with you?" />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Client name *</label>
                <input type="text" required value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Category *</label>
                <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-navy border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold">
                  {PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Role</label>
                <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" placeholder="Founder, CEO, etc." />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Company</label>
                <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Display order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
                <p className="text-taupe text-xs mt-2">Lower numbers appear first.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Photo URL</label>
              <input type="url" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" placeholder="https://..." />
              <p className="text-taupe text-xs mt-2">Optional. Paste a direct image URL. R2 drag-and-drop upload coming soon.</p>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 accent-gold" />
                <span className="text-pearl text-sm">Featured on homepage</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={saving} className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-pearl transition-colors disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Update testimonial" : "Create testimonial"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-gold/10 transition-colors">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-taupe text-sm text-center py-12">Loading testimonials...</p>
        ) : testimonials.length === 0 ? (
          <div className="border border-gold/20 p-12 text-center">
            <p className="text-champagne/70 mb-4">No testimonials yet.</p>
            <p className="text-taupe text-sm">Click &ldquo;New testimonial&rdquo; to add your first one.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="border border-gold/20 overflow-hidden flex flex-col">
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    {t.photoUrl ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-graphite">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.photoUrl} alt={t.clientName} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-graphite flex items-center justify-center text-gold text-sm font-[family-name:var(--font-playfair)]">{t.clientName.charAt(0) || "?"}</div>
                    )}
                    {t.featured && <span className="text-[10px] bg-gold text-navy px-2 py-1 tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Featured</span>}
                  </div>
                  <p className="text-gold text-[10px] tracking-widest uppercase mb-3 font-[family-name:var(--font-montserrat)]">{t.category}</p>
                  <p className="text-gold text-2xl font-[family-name:var(--font-playfair)] mb-2">&ldquo;</p>
                  <p className="text-champagne/80 text-sm italic mb-4 line-clamp-4 font-[family-name:var(--font-playfair)]">{t.quote}</p>
                  <div className="mb-4">
                    <p className="text-pearl text-sm font-medium">{t.clientName}</p>
                    <p className="text-taupe text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)] mt-1">{t.role}{t.role && t.company && " · "}{t.company}</p>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => openEdit(t)} className="flex-1 border border-gold/30 text-gold text-xs tracking-widest uppercase py-2 hover:bg-gold/10 transition-colors font-[family-name:var(--font-montserrat)]">Edit</button>
                    <button onClick={() => t.id && handleDelete(t.id, t.clientName)} className="flex-1 border border-red-400/30 text-red-400 text-xs tracking-widest uppercase py-2 hover:bg-red-400/10 transition-colors font-[family-name:var(--font-montserrat)]">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
