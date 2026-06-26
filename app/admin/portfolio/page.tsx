"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAllProjects, createProject, updateProject, deleteProject } from "@/lib/portfolio";
import { slugify } from "@/lib/slug";
import { PROJECT_CATEGORIES, type Project } from "@/lib/types";
import ImageUpload from "@/components/ImageUpload";
import Select from "@/components/Select";

const emptyProject: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
  slug: "",
  title: "",
  category: PROJECT_CATEGORIES[0],
  description: "",
  imageUrl: "",
  client: "",
  year: new Date().getFullYear().toString(),
  projectUrl: "",
  featured: false,
  order: 0,
};

export default function PortfolioManager() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [slugTouched, setSlugTouched] = useState(false);
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
    if (authChecked) loadProjects();
  }, [authChecked]);

  async function loadProjects() {
    setLoading(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm({ ...emptyProject, order: projects.length });
    setSlugTouched(false);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(p: Project) {
    setForm({
      slug: p.slug || slugify(p.title),
      title: p.title,
      category: p.category,
      description: p.description,
      imageUrl: p.imageUrl,
      client: p.client,
      year: p.year,
      projectUrl: p.projectUrl,
      featured: p.featured,
      order: p.order,
    });
    // Always treat existing slugs as touched — don't auto-update from title edits.
    setSlugTouched(true);
    setEditingId(p.id || null);
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      if (!form.imageUrl) {
        setMessage("Please upload a project image.");
        setSaving(false);
        return;
      }
      if (!form.slug) {
        setMessage("Slug cannot be empty.");
        setSaving(false);
        return;
      }
      // Collision check — no two projects can share a slug.
      const collision = projects.find((p) => p.slug === form.slug && p.id !== editingId);
      if (collision) {
        setMessage(`Slug "${form.slug}" is already used by "${collision.title}". Pick another.`);
        setSaving(false);
        return;
      }
      if (editingId) {
        await updateProject(editingId, form);
        setMessage("Project updated.");
      } else {
        await createProject(form);
        setMessage("Project created.");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyProject);
      setSlugTouched(false);
      await loadProjects();
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
      await deleteProject(id);
      setMessage("Project deleted.");
      await loadProjects();
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
            <p className="text-taupe text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Portfolio Manager</p>
          </div>
          <a href="/admin" className="text-xs tracking-widest uppercase border border-gold/30 text-gold px-4 py-2 rounded hover:bg-gold hover:text-navy transition-colors font-[family-name:var(--font-montserrat)]">← Dashboard</a>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-2 font-[family-name:var(--font-montserrat)]">Manage</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal">Portfolio <span className="text-gold italic">projects</span></h1>
          </div>
          <button onClick={openCreate} className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-pearl transition-colors">+ New project</button>
        </div>

        {message && (
          <p className="border border-gold/30 bg-gold/10 text-gold text-sm px-4 py-3 mb-6">{message}</p>
        )}

        {showForm && (
          <form onSubmit={handleSave} className="border border-gold/20 p-6 md:p-8 mb-10 space-y-5">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl mb-4">{editingId ? "Edit project" : "New project"}</h2>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Title — drives auto-slug on create */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Slug — editable, shows URL preview */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold font-mono text-sm"
                />
                <p className="text-taupe text-xs mt-2">URL: millenniaworks.com/work/{form.slug || "your-slug"}</p>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Category *</label>
                <Select
                  required
                  value={form.category}
                  onChange={(v) => setForm({ ...form, category: v })}
                  options={PROJECT_CATEGORIES.map((c) => ({ value: c, label: c }))}
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Client</label>
                <input type="text" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Year</label>
                <input type="text" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Description *</label>
              <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold resize-none" />
            </div>

            <ImageUpload
              category="portfolio"
              label="Project image *"
              hint="4:3 ratio recommended · e.g. 1200 × 900"
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
            />

            <div>
              <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Project URL / Case study</label>
              <input type="url" value={form.projectUrl} onChange={(e) => setForm({ ...form, projectUrl: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" placeholder="https://..." />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Display order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
                <p className="text-taupe text-xs mt-2">Lower numbers appear first.</p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer mt-7">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 accent-gold" />
                  <span className="text-pearl text-sm">Featured on homepage</span>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <button type="submit" disabled={saving} className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-pearl transition-colors disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Update project" : "Create project"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-gold/10 transition-colors">Cancel</button>
              {form.slug && (
                <a href={`/work/${form.slug}`} target="_blank" rel="noopener noreferrer" className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-gold/10 transition-colors ml-auto">Preview ↗</a>
              )}
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-taupe text-sm text-center py-12">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="border border-gold/20 p-12 text-center">
            <p className="text-champagne/70 mb-4">No projects yet.</p>
            <p className="text-taupe text-sm">Click &ldquo;New project&rdquo; to add your first one.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div key={p.id} className="border border-gold/20 overflow-hidden flex flex-col">
                {p.imageUrl ? (
                  <div className="aspect-[4/3] bg-graphite overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-graphite flex items-center justify-center text-taupe text-xs">No image</div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gold text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)]">{p.category}</p>
                    {p.featured && <span className="text-[10px] bg-gold text-navy px-2 py-1 tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Featured</span>}
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl mb-2">{p.title}</h3>
                  <p className="text-champagne/70 text-sm mb-3 line-clamp-2">{p.description}</p>
                  <p className="text-taupe text-xs mb-1">{p.client && `${p.client} · `}{p.year}</p>
                  <p className="text-taupe text-[10px] font-mono mb-4 truncate">/work/{p.slug || slugify(p.title)}</p>
                  <div className="flex gap-2 mt-auto">
                    <a href={`/work/${p.slug || slugify(p.title)}`} target="_blank" rel="noopener noreferrer" className="border border-gold/30 text-gold text-xs tracking-widest uppercase py-2 px-3 hover:bg-gold/10 transition-colors font-[family-name:var(--font-montserrat)]">View ↗</a>
                    <button onClick={() => openEdit(p)} className="flex-1 border border-gold/30 text-gold text-xs tracking-widest uppercase py-2 hover:bg-gold/10 transition-colors font-[family-name:var(--font-montserrat)]">Edit</button>
                    <button onClick={() => p.id && handleDelete(p.id, p.title)} className="flex-1 border border-red-400/30 text-red-400 text-xs tracking-widest uppercase py-2 hover:bg-red-400/10 transition-colors font-[family-name:var(--font-montserrat)]">Delete</button>
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
