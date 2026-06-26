"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAllPosts, createPost, updatePost, deletePost } from "@/lib/blog";
import { slugify } from "@/lib/slug";
import ImageUpload from "@/components/ImageUpload";
import Select from "@/components/Select";
import { PROJECT_CATEGORIES, BLOG_STATUSES, type BlogPost, type BlogStatus } from "@/lib/types";

const emptyPost: Omit<BlogPost, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  category: PROJECT_CATEGORIES[0],
  author: "Millennia Works",
  status: "draft",
};

function formatDate(ms?: number) {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function BlogManager() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPublishedAt, setEditingPublishedAt] = useState<number | undefined>(undefined);
  const [editingStatus, setEditingStatus] = useState<BlogStatus | undefined>(undefined);
  const [form, setForm] = useState(emptyPost);
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
    if (authChecked) loadPosts();
  }, [authChecked]);

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyPost);
    setSlugTouched(false);
    setEditingId(null);
    setEditingPublishedAt(undefined);
    setEditingStatus(undefined);
    setShowForm(true);
  }

  function openEdit(p: BlogPost) {
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      coverImageUrl: p.coverImageUrl || "",
      category: p.category || PROJECT_CATEGORIES[0],
      author: p.author || "Millennia Works",
      status: p.status,
    });
    setSlugTouched(true);
    setEditingId(p.id || null);
    setEditingPublishedAt(p.publishedAt);
    setEditingStatus(p.status);
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
      if (!form.slug) {
        setMessage("Slug cannot be empty.");
        setSaving(false);
        return;
      }
      const collision = posts.find((p) => p.slug === form.slug && p.id !== editingId);
      if (collision) {
        setMessage(`Slug "${form.slug}" is already used by "${collision.title}". Pick another.`);
        setSaving(false);
        return;
      }
      if (editingId) {
        await updatePost(editingId, form, editingStatus, editingPublishedAt);
        setMessage("Post updated.");
      } else {
        await createPost(form);
        setMessage("Post created.");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyPost);
      setSlugTouched(false);
      await loadPosts();
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
      await deletePost(id);
      setMessage("Post deleted.");
      await loadPosts();
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
            <p className="text-taupe text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Blog Manager</p>
          </div>
          <a href="/admin" className="text-xs tracking-widest uppercase border border-gold/30 text-gold px-4 py-2 rounded hover:bg-gold hover:text-navy transition-colors font-[family-name:var(--font-montserrat)]">← Dashboard</a>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-2 font-[family-name:var(--font-montserrat)]">Write</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal">Blog <span className="text-gold italic">posts</span></h1>
          </div>
          <button onClick={openCreate} className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-pearl transition-colors">+ New post</button>
        </div>

        {message && (
          <p className="border border-gold/30 bg-gold/10 text-gold text-sm px-4 py-3 mb-6">{message}</p>
        )}

        {showForm && (
          <form onSubmit={handleSave} className="border border-gold/20 p-6 md:p-8 mb-10 space-y-5">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl mb-4">{editingId ? "Edit post" : "New post"}</h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Title *</label>
                <input type="text" required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Slug *</label>
                <input type="text" required value={form.slug} onChange={(e) => handleSlugChange(e.target.value)} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold font-mono text-sm" />
                <p className="text-taupe text-xs mt-2">URL: /blog/{form.slug || "your-slug"}</p>
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
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Status *</label>
                <Select
                  required
                  value={form.status}
                  onChange={(v) => setForm({ ...form, status: v as BlogStatus })}
                  options={BLOG_STATUSES.map((s) => ({ value: s, label: s }))}
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Author</label>
                <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
              </div>

              <ImageUpload
                category="blog"
                label="Cover image"
                hint="16:10 ratio recommended · e.g. 1600 × 1000"
                value={form.coverImageUrl}
                onChange={(url) => setForm({ ...form, coverImageUrl: url })}
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Excerpt *</label>
              <textarea required rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold resize-none" placeholder="One or two sentences that show up in the blog list..." />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Content (markdown) *</label>
              <textarea required rows={20} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold resize-y font-mono text-sm" placeholder="# Heading&#10;&#10;Write your post in markdown..." />
              <p className="text-taupe text-xs mt-2">Supports GitHub-flavored markdown: headings, lists, links, code blocks, tables.</p>
            </div>

            <div className="flex gap-3 pt-4 flex-wrap">
              <button type="submit" disabled={saving} className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-pearl transition-colors disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Update post" : "Create post"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-gold/10 transition-colors">Cancel</button>
              {form.slug && (
                <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer" className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-gold/10 transition-colors ml-auto">Preview ↗</a>
              )}
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-taupe text-sm text-center py-12">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="border border-gold/20 p-12 text-center">
            <p className="text-champagne/70 mb-4">No posts yet.</p>
            <p className="text-taupe text-sm">Click &ldquo;New post&rdquo; to write your first one.</p>
          </div>
        ) : (
          <div className="border border-gold/20 divide-y divide-gold/10">
            {posts.map((p) => (
              <div key={p.id} className="px-5 py-4 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <p className="text-pearl text-sm font-medium truncate">{p.title || "(untitled)"}</p>
                    <span className={`text-[10px] px-2 py-0.5 tracking-widest uppercase font-[family-name:var(--font-montserrat)] ${p.status === "published" ? "bg-gold text-navy" : "border border-taupe/40 text-taupe"}`}>{p.status}</span>
                  </div>
                  <p className="text-taupe text-xs truncate">{p.category} · {p.status === "published" ? formatDate(p.publishedAt) : `created ${formatDate(p.createdAt)}`} · /blog/{p.slug}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-4 py-2 rounded hover:bg-gold/10 transition-colors">View ↗</a>
                  <button onClick={() => openEdit(p)} className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-4 py-2 rounded hover:bg-gold/10 transition-colors">Edit</button>
                  <button onClick={() => p.id && handleDelete(p.id, p.title)} className="border border-red-400/30 text-red-400 text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-4 py-2 rounded hover:bg-red-400/10 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
