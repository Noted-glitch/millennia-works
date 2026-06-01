"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { updateSettings } from "@/lib/settings";
import { useSettings } from "@/lib/settings-context";
import { PROJECT_CATEGORIES, type HeroMediaType, type SiteSettings } from "@/lib/types";
import ImageUpload from "@/components/ImageUpload";

function SectionCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="text-xs tracking-[0.4em] uppercase text-gold mb-2 font-[family-name:var(--font-montserrat)]">{eyebrow}</p>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl mb-5">{title}</h2>
      <div className="border border-gold/20 p-6 md:p-8 space-y-5">{children}</div>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder, hint, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; hint?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">{label}{required && " *"}</label>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
      {hint && <p className="text-taupe text-xs mt-2">{hint}</p>}
    </div>
  );
}

function TextareaField({ label, value, onChange, rows = 4, placeholder, hint, required }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; hint?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">{label}{required && " *"}</label>
      <textarea required={required} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold resize-none" />
      {hint && <p className="text-taupe text-xs mt-2">{hint}</p>}
    </div>
  );
}

export default function SettingsManager() {
  const router = useRouter();
  const { settings, loading: settingsLoading, refresh } = useSettings();
  const [authChecked, setAuthChecked] = useState(false);
  const [form, setForm] = useState<SiteSettings>(settings);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
      else setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!hydrated && !settingsLoading) {
      setForm(settings);
      setHydrated(true);
    }
  }, [settings, settingsLoading, hydrated]);

  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, []);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateAnnouncement<K extends keyof SiteSettings["announcementBar"]>(key: K, value: SiteSettings["announcementBar"][K]) {
    setForm((prev) => ({ ...prev, announcementBar: { ...prev.announcementBar, [key]: value } }));
  }

  function toggleServiceEnabled(category: string, enabled: boolean) {
    setForm((prev) => ({ ...prev, servicesEnabled: { ...prev.servicesEnabled, [category]: enabled } }));
  }

  function addSocialLink() {
    setForm((prev) => ({ ...prev, socialLinks: [...prev.socialLinks, { label: "", url: "" }] }));
  }

  function updateSocialLink(index: number, field: "label" | "url", value: string) {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    }));
  }

  function removeSocialLink(index: number) {
    setForm((prev) => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const cleanedLinks = form.socialLinks.filter((l) => l.label.trim() && l.url.trim());
      await updateSettings({ ...form, socialLinks: cleanedLinks });
      await refresh();
      setSuccessMessage("Settings updated.");
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      dismissTimer.current = setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!authChecked || !hydrated) {
    return (
      <main className="min-h-screen bg-navy text-pearl flex items-center justify-center">
        <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Loading settings...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy text-pearl pb-32">
      <nav className="border-b border-gold/10 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/admin" className="font-[family-name:var(--font-playfair)] text-xl tracking-wider text-gold">MW</a>
            <p className="text-taupe text-[10px] tracking-widest uppercase font-[family-name:var(--font-montserrat)]">Site Settings</p>
          </div>
          <a href="/admin" className="text-xs tracking-widest uppercase border border-gold/30 text-gold px-4 py-2 rounded hover:bg-gold hover:text-navy transition-colors font-[family-name:var(--font-montserrat)]">← Dashboard</a>
        </div>
      </nav>

      <form onSubmit={handleSave} className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-2 font-[family-name:var(--font-montserrat)]">Configure</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal">Site <span className="text-gold italic">settings</span></h1>
          <p className="text-champagne/70 text-sm max-w-2xl mt-4">Edit site-wide copy, hero media, contact info, and homepage toggles. Changes go live across all pages on save.</p>
        </div>

        <SectionCard eyebrow="Brand" title="Brand & identity">
          <TextField label="Contact email" type="email" value={form.contactEmail} onChange={(v) => update("contactEmail", v)} required />
          <TextField label="Tagline" value={form.tagline} onChange={(v) => update("tagline", v)} hint="Used in the footer." required />
        </SectionCard>

        <SectionCard eyebrow="Hero" title="Hero — text">
          <TextField label="Eyebrow" value={form.heroEyebrow} onChange={(v) => update("heroEyebrow", v)} />
          <div className="grid md:grid-cols-2 gap-5">
            <TextField label="Title line 1" value={form.heroTitleLine1} onChange={(v) => update("heroTitleLine1", v)} required />
            <TextField label="Title line 2" value={form.heroTitleLine2} onChange={(v) => update("heroTitleLine2", v)} hint="Rendered in gold italic." required />
          </div>
          <TextareaField label="Subtitle" rows={3} value={form.heroSubtitle} onChange={(v) => update("heroSubtitle", v)} required />
          <div className="grid md:grid-cols-2 gap-5">
            <TextField label="Primary CTA label" value={form.heroCtaPrimaryLabel} onChange={(v) => update("heroCtaPrimaryLabel", v)} required />
            <TextField label="Secondary CTA label" value={form.heroCtaSecondaryLabel} onChange={(v) => update("heroCtaSecondaryLabel", v)} required />
          </div>
        </SectionCard>

        <SectionCard eyebrow="Hero" title="Hero — media">
          <div>
            <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Media type *</label>
            <select required value={form.heroMediaType} onChange={(e) => update("heroMediaType", e.target.value as HeroMediaType)} className="w-full bg-navy border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold">
              <option value="color">Color (solid navy — current default)</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
            </select>
            <p className="text-taupe text-xs mt-2">Use &ldquo;color&rdquo; until you have a high-quality custom video. Bad video is worse than no video.</p>
          </div>

          {form.heroMediaType === "video" && (
            <>
              <TextField label="Video URL" type="url" value={form.heroVideoUrl} onChange={(v) => update("heroVideoUrl", v)} placeholder="https://... (self-hosted MP4)" hint="MP4, H.264 encoded. Hosted on R2/Cloudinary/Vercel Blob. Skipped on mobile in favor of the poster." />
              <ImageUpload category="settings" label="Video poster" value={form.heroVideoPoster} onChange={(v) => update("heroVideoPoster", v)} />
            </>
          )}

          {form.heroMediaType === "image" && (
            <ImageUpload category="settings" label="Hero image" value={form.heroImageUrl} onChange={(v) => update("heroImageUrl", v)} />
          )}

          {form.heroMediaType !== "color" && (
            <div>
              <label className="block text-xs tracking-widest uppercase text-taupe mb-2 font-[family-name:var(--font-montserrat)]">Overlay opacity ({form.heroOverlayOpacity}%)</label>
              <input type="range" min={0} max={100} value={form.heroOverlayOpacity} onChange={(e) => update("heroOverlayOpacity", parseInt(e.target.value))} className="w-full accent-gold" />
              <p className="text-taupe text-xs mt-2">Darker overlay = better text contrast. Lighter overlay = more of the media visible.</p>
            </div>
          )}
        </SectionCard>

        <SectionCard eyebrow="About" title="About section">
          <TextField label="Eyebrow" value={form.aboutEyebrow} onChange={(v) => update("aboutEyebrow", v)} />
          <TextField label="Title" value={form.aboutTitle} onChange={(v) => update("aboutTitle", v)} required />
          <TextareaField label="Body" rows={5} value={form.aboutBody} onChange={(v) => update("aboutBody", v)} required />
        </SectionCard>

        <SectionCard eyebrow="Contact" title="Contact & CTA">
          <TextField label="Headline" value={form.contactCtaHeadline} onChange={(v) => update("contactCtaHeadline", v)} required />
          <TextField label="Subhead" value={form.contactCtaSubhead} onChange={(v) => update("contactCtaSubhead", v)} />
          <div className="grid md:grid-cols-2 gap-5">
            <TextField label="Submit button label" value={form.contactCtaButtonLabel} onChange={(v) => update("contactCtaButtonLabel", v)} required />
            <TextField label="Response time promise" value={form.responseTimePromise} onChange={(v) => update("responseTimePromise", v)} hint="Shown next to the form." />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <TextField label="WhatsApp number" value={form.whatsappNumber} onChange={(v) => update("whatsappNumber", v)} placeholder="+234..." hint="Include country code. Adds a WhatsApp button when set." />
            <TextField label="Booking link" type="url" value={form.bookingLink} onChange={(v) => update("bookingLink", v)} placeholder="https://cal.com/..." hint="Calendly / Cal.com URL. Adds a 'Book a call' button when set." />
          </div>
        </SectionCard>

        <SectionCard eyebrow="SEO" title="SEO & social sharing">
          <p className="text-taupe text-xs border-l-2 border-gold/40 pl-3">Stored now, but won&apos;t drive the actual &lt;head&gt; tags until the SSR migration. Edit freely — values will be picked up when that lands.</p>
          <TextField label="Meta title" value={form.metaTitle} onChange={(v) => update("metaTitle", v)} hint="Browser tab title + search result heading." />
          <TextareaField label="Meta description" rows={3} value={form.metaDescription} onChange={(v) => update("metaDescription", v)} hint="Search result snippet. Aim for 150-160 characters." />
          <ImageUpload category="settings" label="OG image" value={form.ogImageUrl} onChange={(v) => update("ogImageUrl", v)} />
          <p className="text-taupe text-xs">1200×630 image shown when the site is shared on WhatsApp / X / LinkedIn.</p>
        </SectionCard>

        <SectionCard eyebrow="Notice" title="Announcement bar">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.announcementBar.enabled} onChange={(e) => updateAnnouncement("enabled", e.target.checked)} className="w-5 h-5 accent-gold" />
            <span className="text-pearl text-sm">Show announcement bar above the nav</span>
          </label>
          <TextField label="Text" value={form.announcementBar.text} onChange={(v) => updateAnnouncement("text", v)} placeholder="Booking January cohort —" />
          <div className="grid md:grid-cols-2 gap-5">
            <TextField label="Link label" value={form.announcementBar.linkLabel} onChange={(v) => updateAnnouncement("linkLabel", v)} placeholder="Reserve your spot" />
            <TextField label="Link URL" value={form.announcementBar.linkUrl} onChange={(v) => updateAnnouncement("linkUrl", v)} placeholder="/#contact" />
          </div>
        </SectionCard>

        <SectionCard eyebrow="Homepage" title="Services">
          <p className="text-taupe text-xs">Toggle which service categories appear on the homepage grid. A service in /admin/services is only shown if BOTH its category is enabled here AND its &ldquo;Featured on homepage&rdquo; flag is on.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {PROJECT_CATEGORIES.map((cat) => {
              const enabled = form.servicesEnabled[cat] !== false;
              return (
                <label key={cat} className="flex items-center gap-3 cursor-pointer border border-gold/20 px-4 py-3 hover:border-gold/40 transition-colors">
                  <input type="checkbox" checked={enabled} onChange={(e) => toggleServiceEnabled(cat, e.target.checked)} className="w-5 h-5 accent-gold" />
                  <span className="text-pearl text-sm">{cat}</span>
                </label>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard eyebrow="Footer" title="Social links">
          <p className="text-taupe text-xs">Appear in the footer across all public pages. Leave empty to hide the social row entirely.</p>
          {form.socialLinks.length === 0 ? (
            <p className="text-taupe text-xs italic">No links yet.</p>
          ) : (
            <div className="space-y-3">
              {form.socialLinks.map((link, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <input type="text" value={link.label} onChange={(e) => updateSocialLink(i, "label", e.target.value)} placeholder="Label (e.g. LinkedIn)" className="flex-1 bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
                  <input type="url" value={link.url} onChange={(e) => updateSocialLink(i, "url", e.target.value)} placeholder="https://..." className="flex-[2] bg-transparent border border-gold/30 text-pearl px-4 py-3 focus:outline-none focus:border-gold" />
                  <button type="button" onClick={() => removeSocialLink(i)} className="border border-red-400/30 text-red-400 text-xs tracking-widest uppercase px-4 py-3 hover:bg-red-400/10 transition-colors font-[family-name:var(--font-montserrat)]">Remove</button>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={addSocialLink} className="border border-gold/30 text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-4 py-2 rounded hover:bg-gold/10 transition-colors">+ Add link</button>
        </SectionCard>
      </form>

      <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-navy/90 border-t border-gold/20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            {successMessage && (
              <p className="border border-gold/40 bg-gold/10 text-gold text-sm px-4 py-2 rounded inline-block">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="border border-red-400/40 bg-red-400/10 text-red-400 text-sm px-4 py-2 rounded inline-block">{errorMessage}</p>
            )}
          </div>
          <button type="button" onClick={handleSave} disabled={saving} className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-8 py-3 rounded hover:bg-pearl transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </div>
    </main>
  );
}
