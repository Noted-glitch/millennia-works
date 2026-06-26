"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAllServices, createService, updateService, deleteService, seedDefaultServices } from "@/lib/services";
import { slugify } from "@/lib/slug";
import { PROJECT_CATEGORIES, type Service } from "@/lib/types";
import Select from "@/components/Select";

const emptyService: Omit<Service, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  slug: "",
  category: PROJECT_CATEGORIES[0],
  tag: "",
  shortDescription: "",
  longDescription: "",
  bullets: [],
  coverImageUrl: "",
  order: 0,
  featured: true,
};

export default function ServicesManager() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyService);
  const [bulletsText, setBulletsText] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
      else setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (authChecked) loadServices();
  }, [authChecked]);

  async function loadServices() {
    setLoading(true);
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load services.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm({ ...emptyService, order: services.length });
    setBulletsText("");
    setSlugTouched(false);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(s: Service) {
    setForm({
      title: s.title,
      slug: s.slug,
      category: s.category || PROJECT_CATEGORIES[0],
      tag: s.tag,
      shortDescription: s.shortDescription,
      longDescription: s.longDescription,
      bullets: s.bullets || [],
      coverImageUrl: s.coverImageUrl || "",
      order: s.order,
      featured: s.featured,
    });
    setBulletsText((s.bullets || []).join("\n"));
    setSlugTouched(true);
    setEditingId(s.id || null);
    setShowForm(true);
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: slugify(value) }));
  }

  function handleBulletsChange(value: string) {
    setBulletsText(value);
    const bullets = value.split("\n").map((b) => b.trim()).filter(Boolean);
    setForm((prev) => ({ ...prev, bullets }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      if (!form.slug) {
        setMessage("Slug cannot be empty.");
        setSaving(false);
        return;
      }
      const collision = services.find((s) => s.slug === form.slug && s.id !== editingId);
      if (collision) {
        setMessage(`Slug "${form.slug}" is already used by "${collision.title}". Pick another.`);
        setSaving(false);
        return;
      }
      if (editingId) {
        await updateService(editingId, form);
        setMessage("Service updated.");
      } else {
        await createService(form);
        setMessage("Service created.");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyService);
      setBulletsText("");
      setSlugTouched(false);
      await loadServices();
    } catch (err) {
      console.error(err);
      setMessage("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteService(id);
      setMessage("Service deleted.");
      await loadServices();
    } catch (err) {
      console.error(err);
      setMessage("Delete failed.");
    }
  }

  async function handleSeed() {
    if (!confirm("Seed the 6 default services? This only runs when the collection is empty.")) return;
    setSeeding(true);
    setMessage("");
    try {
      const count = await seedDefaultServices();
      if (count === 0) {
        setMessage("Collection is not empty — nothing seeded.");
      } else {
        setMessage(`Seeded ${count} default services. Edit each to add bullets, cover image, and refined copy.`);
        await loadServices();
      }
    } catch (err) {
      console.error(err);
      setMessage("Seed failed.");
    } finally {
      setSeeding(false);
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
            <p className="text-taupe text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Services Manager</p>
          </div>
          <a href="/admin" className="text-xs tracking-widest uppercase border border-gold/30 text-gold px-4 py-2 rounded hover:bg-gold hover:text-navy transition-colors font-[family-name:var(--font-montserrat)]">← Dashboard</a>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-2 font-[family-name:var(--font-montserrat)]">Define</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal">Service <span className="text-gold italic">offerings</span></h1>
          </div>
          <div className="flex gap-3 flex-wrap">
            {services.length === 0 && !loading && (
              <button onClick={handleSeed} disabled={seeding} className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-gold/10 transition-colors disabled:opacity-50">
                {seeding ? "Seeding..." : "Seed defaults"}
              </button>
            )}
            <button onClick={openCreate} className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-pearl transition-colors">+ New service</button>
          </div>
        </div>

        {message && (
          <p className="border border-gold/30 bg-gold/10 text-gold text-sm px-4 py-3 mb-6">{message}</p>
        )}

        {showForm && (
          <form onSubmit={handleSave} className="border border-gold/20 p-6 md:p-8 mb-10 space-y-5">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl mb-4">{editingId ? "Edit service" : "New service"}</h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Title *</label>
                <input type="text" required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Slug *</label>
                <input type="text" required value={form.slug} onChange={(e) => handleSlugChange(e.target.value)} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold font-mono text-sm" />
                <p className="text-taupe text-xs mt-2">URL: /{form.slug || "your-slug"}</p>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Category *</label>
                <Select
                  required
                  value={form.category}
                  onChange={(v) => setForm({ ...form, category: v })}
                  options={PROJECT_CATEGORIES.map((c) => ({ value: c, label: c }))}
                />
                <p className="text-taupe text-xs mt-2">Cross-link key for related work, testimonials, posts.</p>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Tag *</label>
                <input type="text" required value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" placeholder="01" />
                <p className="text-taupe text-xs mt-2">Eyebrow shown on homepage card.</p>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Display order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer mt-7">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 accent-gold" />
                  <span className="text-pearl text-sm">Featured on homepage</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Cover image URL</label>
              <input type="url" value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" placeholder="https://..." />
              <p className="text-taupe text-xs mt-2">Optional. Shown in the detail page hero.</p>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Short description *</label>
              <textarea required rows={3} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold resize-none" placeholder="One or two sentences shown on the homepage card." />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Long description *</label>
              <textarea required rows={5} value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold resize-none" placeholder="A paragraph that goes under the title on the detail page." />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">What's included</label>
              <textarea rows={6} value={bulletsText} onChange={(e) => handleBulletsChange(e.target.value)} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold resize-none font-mono text-sm" placeholder="One feature per line.&#10;Brand strategy & positioning&#10;Logo & wordmark design&#10;Visual identity system" />
              <p className="text-taupe text-xs mt-2">One feature per line. Rendered as a list on the detail page.</p>
            </div>

            <div className="flex gap-3 pt-4 flex-wrap">
              <button type="submit" disabled={saving} className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-pearl transition-colors disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Update service" : "Create service"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-gold/10 transition-colors">Cancel</button>
              {form.slug && (
                <a href={`/${form.slug}`} target="_blank" rel="noopener noreferrer" className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-gold/10 transition-colors ml-auto">Preview ↗</a>
              )}
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-taupe text-sm text-center py-12">Loading services...</p>
        ) : services.length === 0 ? (
          <div className="border border-gold/20 p-12 text-center">
            <p className="text-champagne/70 mb-4">No services yet.</p>
            <p className="text-taupe text-sm mb-6">Click &ldquo;Seed defaults&rdquo; to create the 6 standard services, or &ldquo;New service&rdquo; to add one from scratch.</p>
          </div>
        ) : (
          <div className="border border-gold/20 divide-y divide-gold/10">
            {services.map((s) => (
              <div key={s.id} className="px-5 py-4 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="text-gold text-[10px] tracking-widest font-[family-name:var(--font-montserrat)]">{s.tag}</span>
                    <p className="text-pearl text-sm font-medium truncate">{s.title || "(untitled)"}</p>
                    {s.featured && <span className="text-[10px] bg-gold text-navy px-2 py-0.5 tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Featured</span>}
                  </div>
                  <p className="text-taupe text-xs truncate">{s.category} · order {s.order} · /{s.slug}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={`/${s.slug}`} target="_blank" rel="noopener noreferrer" className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-4 py-2 rounded hover:bg-gold/10 transition-colors">View ↗</a>
                  <button onClick={() => openEdit(s)} className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-4 py-2 rounded hover:bg-gold/10 transition-colors">Edit</button>
                  <button onClick={() => s.id && handleDelete(s.id, s.title)} className="border border-red-400/30 text-red-400 text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-4 py-2 rounded hover:bg-red-400/10 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
