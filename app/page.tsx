"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const services = [
  {
    tag: "01",
    title: "Brand & Creative",
    description:
      "Identity systems, logos, visual language, and brand strategy that signal authority from first impression.",
  },
  {
    tag: "02",
    title: "AI Content & Media",
    description:
      "AI-powered UGC, influencer models, product videos, book trailers, music videos, and cinematic content.",
  },
  {
    tag: "03",
    title: "Web & App Development",
    description:
      "Custom websites and web apps built with modern stacks. Owned, scalable, and built for performance.",
  },
  {
    tag: "04",
    title: "Digital Marketing",
    description:
      "Email campaigns, social media strategy, content marketing, and paid ads that convert ambition into revenue.",
  },
  {
    tag: "05",
    title: "Publishing & Books",
    description:
      "Writing, editing, formatting, interior design, publishing, and sales optimization for authors and brands.",
  },
  {
    tag: "06",
    title: "Apps & Games",
    description:
      "Native and web-based apps, plus original games. From MVP to launch, ready for app stores.",
  },
];

const workPlaceholders = [
  { category: "AI Media", title: "Coming soon" },
  { category: "Brand Identity", title: "Coming soon" },
  { category: "Web Design", title: "Coming soon" },
];

const testimonialPlaceholders = [
  {
    quote: "Working with Millennia Works elevated our brand beyond what we thought possible.",
    name: "Client Name",
    role: "Founder, Coming Soon",
  },
  {
    quote: "The level of craft and strategic thinking we received was second to none.",
    name: "Client Name",
    role: "CEO, Coming Soon",
  },
];

export default function Home() {
  const [firebaseStatus, setFirebaseStatus] = useState<string>("");

  useEffect(() => {
    async function checkConnection() {
      try {
        await getDocs(collection(db, "test"));
        setFirebaseStatus("connected");
      } catch {
        setFirebaseStatus("error");
      }
    }
    checkConnection();
  }, []);

  return (
    <main className="min-h-screen bg-navy text-pearl">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-navy/70 border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="#" className="font-[family-name:var(--font-playfair)] text-xl tracking-wider text-gold">MW</a>
          <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] text-pearl/80">
            <a href="#services" className="hover:text-gold transition-colors">Services</a>
            <a href="#about" className="hover:text-gold transition-colors">About</a>
            <a href="#work" className="hover:text-gold transition-colors">Work</a>
            <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
          </div>
          <a href="#contact" className="text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] bg-gold text-navy px-5 py-2.5 rounded hover:bg-gold/90 transition-colors">Start a project</a>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="font-[family-name:var(--font-playfair)] text-xs tracking-[0.4em] uppercase text-gold mb-8">Millennia Works</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-normal leading-tight tracking-tight mb-6">
            From Idea<br />
            <span className="text-gold italic">To Empire.</span>
          </h1>
          <p className="text-base md:text-lg text-champagne max-w-xl mx-auto mb-10 leading-relaxed">
            Premium brand, content, and digital agency for founders building what lasts.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#contact" className="bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-7 py-3.5 rounded hover:bg-gold/90 transition-colors">Start a project</a>
            <a href="#work" className="border border-gold text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-7 py-3.5 rounded hover:bg-gold hover:text-navy transition-colors">View our work</a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-12 left-0 right-0 px-6"
        >
          <div className="max-w-5xl mx-auto pt-6 border-t border-gold/20 flex justify-center gap-6 md:gap-10 flex-wrap text-[10px] tracking-[0.3em] text-taupe font-[family-name:var(--font-montserrat)]">
            <span>BRAND</span>
            <span>AI MEDIA</span>
            <span>WEB</span>
            <span>MARKETING</span>
            <span>PUBLISHING</span>
            <span>APPS</span>
          </div>
        </motion.div>
      </section>

      <section id="services" className="py-24 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-[family-name:var(--font-montserrat)]">What we do</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal">
              Six disciplines.<br />
              <span className="text-gold italic">One vision.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10">
            {services.map((service, i) => (
              <motion.div
                key={service.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-navy p-8 md:p-10 hover:bg-graphite transition-colors group cursor-pointer"
              >
                <p className="text-gold text-xs tracking-widest mb-6 font-[family-name:var(--font-montserrat)]">{service.tag}</p>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl mb-4 group-hover:text-gold transition-colors">{service.title}</h3>
                <p className="text-champagne/80 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 border-t border-gold/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Who we are</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal mb-8 leading-tight">
              We build the digital infrastructure<br />
              <span className="text-gold italic">behind ambitious brands.</span>
            </h2>
            <p className="text-champagne/80 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Millennia Works is a full-service creative and digital agency built for founders who refuse to compete on price. We combine brand strategy, AI-powered content, world-class development, and sharp marketing into a single, integrated practice — so every piece of your empire moves in the same direction.
            </p>
            <a href="#contact" className="inline-block text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] border-b border-gold pb-1 hover:text-pearl hover:border-pearl transition-colors">Learn more →</a>
          </motion.div>
        </div>
      </section>

      <section id="work" className="py-24 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-[family-name:var(--font-montserrat)]">Selected work</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal">
              Work that speaks<br />
              <span className="text-gold italic">for itself.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {workPlaceholders.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="aspect-[4/5] bg-graphite border border-gold/10 flex flex-col justify-end p-6 hover:border-gold/40 transition-colors cursor-pointer group"
              >
                <p className="text-xs tracking-widest text-gold mb-2 font-[family-name:var(--font-montserrat)]">{item.category}</p>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-champagne/60 group-hover:text-pearl transition-colors">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-gold/10 bg-graphite/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-[family-name:var(--font-montserrat)]">In their words</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal">What clients say.</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonialPlaceholders.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="border border-gold/20 p-8 md:p-10"
              >
                <p className="text-gold text-3xl font-[family-name:var(--font-playfair)] mb-4">&ldquo;</p>
                <p className="text-champagne text-base md:text-lg leading-relaxed italic font-[family-name:var(--font-playfair)] mb-6">{t.quote}</p>
                <div>
                  <p className="text-pearl text-sm font-medium">{t.name}</p>
                  <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] mt-1">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 px-6 border-t border-gold/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6 font-[family-name:var(--font-montserrat)]">Let&apos;s build</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-normal mb-8 leading-tight">
            Ready to build<br />
            <span className="text-gold italic">your empire?</span>
          </h2>
          <p className="text-champagne/80 text-base md:text-lg mb-10 max-w-xl mx-auto">
            Tell us about what you&apos;re building. We respond within 24 hours.
          </p>
          <a href="mailto:david@millenniaworks.com" className="inline-block bg-gold text-navy text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)] px-10 py-4 rounded hover:bg-pearl transition-colors">
            david@millenniaworks.com
          </a>
        </motion.div>
      </section>

      <footer className="py-12 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-[family-name:var(--font-playfair)] text-xl tracking-wider text-gold mb-1">Millennia Works</p>
            <p className="text-taupe text-xs tracking-widest uppercase font-[family-name:var(--font-montserrat)]">From Idea To Empire</p>
          </div>
          <p className="text-taupe text-xs">© {new Date().getFullYear()} Millennia Works. All rights reserved.</p>
        </div>
        {firebaseStatus === "error" && (
          <p className="text-center text-red-400 text-xs mt-4">Firebase connection issue — check console</p>
        )}
      </footer>
    </main>
  );
}