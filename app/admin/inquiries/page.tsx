"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAllInquiries, updateInquiry, deleteInquiry } from "@/lib/inquiries";
import { INQUIRY_STATUSES, type Inquiry, type InquiryStatus } from "@/lib/types";

type Filter = InquiryStatus | "all";

const FILTER_TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "replied", label: "Replied" },
  { key: "archived", label: "Archived" },
];

const STATUS_STYLES: Record<InquiryStatus, string> = {
  new: "bg-gold text-navy",
  read: "border border-pearl/40 text-pearl",
  replied: "border border-champagne/40 text-champagne",
  archived: "border border-taupe/40 text-taupe",
};

function timeAgo(ms?: number) {
  if (!ms) return "";
  const diff = Date.now() - ms;
  const days = Math.floor(diff / 86400000);
  if (days === 0) {
    const hours = Math.floor(diff / 3600000);
    if (hours === 0) return "Just now";
    return `${hours}h ago`;
  }
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(ms).toLocaleDateString();
}

export default function InquiriesManager() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<InquiryStatus>("new");
  const [editNotes, setEditNotes] = useState("");
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
    if (authChecked) loadInquiries();
  }, [authChecked]);

  async function loadInquiries() {
    setLoading(true);
    try {
      const data = await getAllInquiries();
      setInquiries(data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  }

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: inquiries.length, new: 0, read: 0, replied: 0, archived: 0 };
    for (const i of inquiries) c[i.status]++;
    return c;
  }, [inquiries]);

  const visible = useMemo(() => {
    if (filter === "all") return inquiries;
    return inquiries.filter((i) => i.status === filter);
  }, [inquiries, filter]);

  function toggleExpand(inq: Inquiry) {
    if (!inq.id) return;
    if (expandedId === inq.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(inq.id);
    setEditStatus(inq.status);
    setEditNotes(inq.notes || "");
  }

  async function handleSave(id: string) {
    setSaving(true);
    setMessage("");
    try {
      await updateInquiry(id, { status: editStatus, notes: editNotes });
      setMessage("Inquiry updated.");
      await loadInquiries();
    } catch (err) {
      console.error(err);
      setMessage("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete inquiry from "${name}"? This cannot be undone.`)) return;
    try {
      await deleteInquiry(id);
      setMessage("Inquiry deleted.");
      setExpandedId(null);
      await loadInquiries();
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
            <p className="text-taupe text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Inquiries Manager</p>
          </div>
          <a href="/admin" className="text-xs tracking-widest uppercase border border-gold/30 text-gold px-4 py-2 rounded hover:bg-gold hover:text-navy transition-colors font-[family-name:var(--font-montserrat)]">← Dashboard</a>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-2 font-[family-name:var(--font-montserrat)]">Triage</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal flex items-center gap-4">
              Incoming <span className="text-gold italic">inquiries</span>
              {counts.new > 0 && <span className="text-[10px] bg-gold text-navy px-2 py-1 tracking-widest uppercase font-[family-name:var(--font-montserrat)]">{counts.new} new</span>}
            </h1>
          </div>
        </div>

        {message && (
          <p className="border border-gold/30 bg-gold/10 text-gold text-sm px-4 py-3 mb-6">{message}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-8 border-b border-gold/10 pb-4">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-4 py-2 rounded transition-colors ${filter === tab.key ? "bg-gold text-navy" : "border border-gold/30 text-gold hover:bg-gold/10"}`}
            >
              {tab.label} <span className="opacity-70">({counts[tab.key]})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-taupe text-sm text-center py-12">Loading inquiries...</p>
        ) : visible.length === 0 ? (
          <div className="border border-gold/20 p-12 text-center">
            <p className="text-champagne/70 mb-4">{inquiries.length === 0 ? "No inquiries yet." : `No ${filter} inquiries.`}</p>
            <p className="text-taupe text-sm">{inquiries.length === 0 ? "Submissions from the homepage contact form will appear here." : "Try another filter."}</p>
          </div>
        ) : (
          <div className="border border-gold/20 divide-y divide-gold/10">
            {visible.map((inq) => {
              const isOpen = expandedId === inq.id;
              return (
                <div key={inq.id}>
                  <button
                    onClick={() => toggleExpand(inq)}
                    className="w-full text-left px-5 py-4 hover:bg-gold/5 transition-colors flex items-center gap-4 flex-wrap"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <p className="text-pearl text-sm font-medium">{inq.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 tracking-widest uppercase font-[family-name:var(--font-montserrat)] ${STATUS_STYLES[inq.status]}`}>{inq.status}</span>
                      </div>
                      <p className="text-taupe text-xs truncate">{inq.email}{inq.projectType && ` · ${inq.projectType}`}</p>
                    </div>
                    <p className="text-taupe text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)] shrink-0">{timeAgo(inq.createdAt)}</p>
                    <span className="text-gold text-xs shrink-0">{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && inq.id && (
                    <div className="px-5 pb-6 pt-2 bg-graphite/30 space-y-5">
                      {inq.company && (
                        <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Company: <span className="text-pearl normal-case tracking-normal">{inq.company}</span></p>
                      )}

                      <div>
                        <p className="text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Message</p>
                        <p className="text-champagne text-sm leading-relaxed whitespace-pre-wrap border border-gold/10 p-4 bg-navy">{inq.message}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Status</label>
                          <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as InquiryStatus)} className="w-full bg-navy border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold">
                            {INQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        <div className="flex items-end">
                          <a href={`mailto:${inq.email}?subject=Re: your inquiry to Millennia Works`} className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-gold hover:text-navy transition-colors">Reply via email</a>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Admin notes</label>
                        <textarea rows={3} value={editNotes} onChange={(e) => setEditNotes(e.target.value)} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold resize-none" placeholder="Internal notes about this inquiry..." />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button onClick={() => handleSave(inq.id!)} disabled={saving} className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-pearl transition-colors disabled:opacity-50">
                          {saving ? "Saving..." : "Save changes"}
                        </button>
                        <button onClick={() => handleDelete(inq.id!, inq.name)} className="border border-red-400/30 text-red-400 text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-6 py-3 rounded hover:bg-red-400/10 transition-colors">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
