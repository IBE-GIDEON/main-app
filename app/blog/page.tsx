"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ArrowRight, Zap, X, Menu,
  Clock, Tag, ArrowUpRight,
} from "lucide-react";

/* ─── Easing ─────────────────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1];

/* ─── FadeUp ─────────────────────────────────────────────────────── */
function FadeUp({
  children, delay = 0, className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ▸ BLOG POSTS — EDIT HERE
   Each object is one post. Change any field freely.
   - image: put your image path in src, e.g. "/blog/post-1.jpg"
   - tag: category label shown on the card
   - readTime: estimated read time string
   - date: publish date string
   - title: headline
   - excerpt: short description shown on the card
   - href: link to the full post page
═══════════════════════════════════════════════════════════════════ */
const POSTS = [
  {
    id: 1,
    image: { src: "", alt: "Why Branching Beats Prompting" },
    tag: "Decision Science",
    readTime: "6 min read",
    date: "Feb 28, 2026",
    featured: true, // makes this the hero card
    title: "Why Branching Logic Beats Prompting for High-Stakes Decisions",
    excerpt:
      "A chatbot gives you an answer. A decision engine maps the entire possibility space. Here is why the architecture difference matters when the stakes are real.",
    href: "#post-1",
  },
  {
    id: 2,
    image: { src: "", alt: "The Real Cost of Strategic Ambiguity" },
    tag: "Strategy",
    readTime: "5 min read",
    date: "Feb 20, 2026",
    featured: false,
    title: "The Real Cost of Strategic Ambiguity Inside Scaling Companies",
    excerpt:
      "Most teams don't fail on execution. They fail because nobody could agree on which decision was actually on the table. We ran the numbers.",
    href: "#post-2",
  },
  {
    id: 3,
    image: { src: "", alt: "Build vs Buy Framework" },
    tag: "Engineering",
    readTime: "8 min read",
    date: "Feb 12, 2026",
    featured: false,
    title: "A Rigorous Framework for Build vs. Buy vs. Partner Decisions",
    excerpt:
      "Stop arguing about it in Slack. Here is the exact branching model three AI uses to score every make-or-buy decision — and how to run it yourself.",
    href: "#post-3",
  },
  {
    id: 4,
    image: { src: "", alt: "Recursive Refinement Explained" },
    tag: "Product",
    readTime: "4 min read",
    date: "Feb 5, 2026",
    featured: false,
    title: "Recursive Refinement: How three AI Stress-Tests Its Own Conclusions",
    excerpt:
      "The engine doesn't just generate an answer — it challenges itself. A deep-dive into the architecture that makes our verdicts defensible.",
    href: "#post-4",
  },
  {
    id: 5,
    image: { src: "", alt: "Zero Leakage Data Architecture" },
    tag: "Security",
    readTime: "5 min read",
    date: "Jan 29, 2026",
    featured: false,
    title: "Zero-Leakage: How We Built an AI That Enterprises Can Actually Trust",
    excerpt:
      "Enterprise AI adoption stalls at the data question. Here is the exact architecture we use to ensure your strategic decisions never leave your orbit.",
    href: "#post-5",
  },
];
/* ═══════════════════════════════════════════════════════════════════
   END EDITABLE POSTS
═══════════════════════════════════════════════════════════════════ */

/* Tag colour map — add more tags here as needed */
const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Decision Science": { bg: "bg-[#E58A6A]/10", text: "text-[#D97757]",    border: "border-[#E58A6A]/25" },
  "Strategy":         { bg: "bg-blue-500/8",   text: "text-blue-600",     border: "border-blue-400/20"  },
  "Engineering":      { bg: "bg-violet-500/8", text: "text-violet-600",   border: "border-violet-400/20"},
  "Product":          { bg: "bg-emerald-500/8",text: "text-emerald-700",  border: "border-emerald-400/20"},
  "Security":         { bg: "bg-rose-500/8",   text: "text-rose-600",     border: "border-rose-400/20"  },
};
function TagPill({ tag }: { tag: string }) {
  const c = TAG_COLORS[tag] ?? { bg: "bg-black/5", text: "text-[#1C1B18]/50", border: "border-black/10" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      <Tag className="w-2.5 h-2.5" />
      {tag}
    </span>
  );
}

/* Placeholder image block */
function ImageBlock({ image, aspect = "aspect-[16/9]", className = "" }: {
  image: { src: string; alt: string };
  aspect?: string;
  className?: string;
}) {
  return (
    <div className={`${aspect} ${className} w-full rounded-2xl overflow-hidden bg-[#EAE9E4] border border-black/[0.05] relative`}>
      {image.src ? (
        <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
      ) : (
        /* Placeholder — replace src above to swap in a real image */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black/[0.06] border border-black/[0.07] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#1C1B18]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 16.5V19a.75.75 0 00.75.75h16.5A.75.75 0 0021 19v-2.625M3 16.5V6a.75.75 0 01.75-.75h16.5A.75.75 0 0121 6v10.5" />
            </svg>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-[#1C1B18]/20 font-medium">{image.alt}</p>
        </div>
      )}
    </div>
  );
}

/* ─── NavBar with mobile burger ──────────────────────────────────── */
function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home",        href: "/"          },
    { label: "The Engine",  href: "/#engine"   },
    { label: "Refinement",  href: "/#refinement"},
    { label: "Use Cases",   href: "/use-case" },
    { label: "Pricing",     href: "/pricing"   },
    { label: "Blog",        href: "/blog",  active: true },
  ];

  return (
    <>
      {/* ── Desktop nav ── */}
      <header className="fixed top-0 inset-x-0 mt-[-90px] z-50 flex items-center justify-between px-6 md:px-10 py-6 pointer-events-none">
        <div className="pointer-events-auto flex ml-[-25px] items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center"
          >
            <img src="/logofive.png" alt="Think AI Logo" className="h-[220px] w-[200px]" />
          </motion.div>
        </div>

        {/* Desktop pill nav */}
        <nav className="hidden lg:flex pointer-events-auto items-center gap-11 px-8 py-3.5 w-[600px] h-[70px] rounded-full bg-black/[0.02] border border-black/[0.07] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] text-[13px] font-medium text-[#1C1B18]/55">
          {links.map((l) => (
            <a key={l.label} href={l.href} className={`transition-colors ${l.active ? "text-[#E58A6A] font-semibold" : "hover:text-[#1C1B18]"}`}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="pointer-events-auto flex items-center gap-4">
          <button className="text-[13px] font-medium text-[#1C1B18]/60 hover:text-[#1C1B18] transition-colors">
          Sign In
        </button>
       
          <a href="/signin">
           <button className="text-[13px] font-semibold px-6 py-2.5 rounded-full bg-black/[0.05] border border-black/[0.1] text-[#1C1B18] backdrop-blur-xl hover:bg-black/[0.09] hover:scale-105 transition-all">
          Sign Up
          </button>
          </a>

          {/* Burger — mobile only */}
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden pointer-events-auto w-10 h-10 rounded-full bg-black/[0.05] border border-black/[0.1] flex items-center justify-center hover:bg-black/[0.08] transition-all"
            aria-label="Open menu"
          >
            <Menu className="w-4.5 h-4.5 text-[#1C1B18]" />
          </button>
        </div>
      </header>

      {/* ── Mobile slide-in menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-[80vw] max-w-[340px] bg-[#FAFAF8] border-l border-black/[0.07] shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.06]">
                <img src="/logofive.png" alt="Think AI" className="h-10 w-auto" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-black/[0.05] flex items-center justify-center hover:bg-black/[0.09] transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4 text-[#1C1B18]" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 px-6 py-8 space-y-1">
                {links.map((l, i) => (
                  <motion.a
                    key={l.label}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease }}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-[15px] font-medium transition-colors ${
                      l.active
                        ? "bg-[#E58A6A]/10 text-[#D97757] border border-[#E58A6A]/20"
                        : "text-[#1C1B18]/65 hover:bg-black/[0.04] hover:text-[#1C1B18]"
                    }`}
                  >
                    {l.label}
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </motion.a>
                ))}
              </nav>

              {/* Drawer footer auth */}
              <div className="px-6 py-6 border-t border-black/[0.06] space-y-3">
                <button className="w-full py-3 rounded-2xl border border-black/[0.1] text-[14px] font-medium text-[#1C1B18]/65 hover:bg-black/[0.04] transition-all">
                  Sign In
                </button>
                <button className="w-full py-3 rounded-2xl bg-[#E58A6A] text-white text-[14px] font-semibold hover:bg-[#D97757] transition-colors shadow-[0_0_16px_rgba(229,138,106,0.2)]">
                  Sign Up
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative pt-44 md:pt-52 pb-16 px-4 flex flex-col items-center text-center overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E58A6A]/[0.05] blur-[140px] rounded-[100%] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E58A6A]/10 border border-[#E58A6A]/25 text-[#D97757] text-xs font-medium mb-7"
      >
        <Zap className="w-3 h-3" />
        Blog & Research
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1, ease }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1C1B18] max-w-3xl leading-[1.07]"
      >
        Thinking out loud<br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C1B18] via-[#E58A6A] to-[#D97757]">
          so you don't have to.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease }}
        className="mt-6 text-base md:text-lg text-[#1C1B18]/40 max-w-xl font-light leading-relaxed"
      >
        Decision science, product thinking, and the philosophy behind the engine — written for operators who take strategy seriously.
      </motion.p>
    </section>
  );
}

/* ─── Featured Post (post with featured: true) ───────────────────── */
function FeaturedPost({ post }: { post: typeof POSTS[number] }) {
  return (
    <FadeUp>
      {/*
        ┌─────────────────────────────────────────────────────────┐
        │  FEATURED POST CARD                                     │
        │  To edit: change the object with featured: true        │
        │  in the POSTS array at the top of this file.           │
        └─────────────────────────────────────────────────────────┘
      */}
      <a
        href={post.href}
        className="group block rounded-[2rem] border border-black/[0.06] bg-[#F5F4F1] overflow-hidden hover:border-[#E58A6A]/25 hover:shadow-[0_12px_40px_rgba(229,138,106,0.08)] transition-all duration-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image side */}
          <div className="relative overflow-hidden md:rounded-r-none rounded-t-[2rem] md:rounded-tl-[2rem] md:rounded-bl-[2rem]">
            <ImageBlock
              image={post.image}
              aspect="aspect-[4/3] md:aspect-auto md:h-full"
              className="h-64 md:h-full rounded-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>

          {/* Content side */}
          <div className="p-8 md:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E58A6A] bg-[#E58A6A]/10 border border-[#E58A6A]/20 px-2.5 py-1 rounded-full">
                  Featured
                </span>
                <TagPill tag={post.tag} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1C1B18] leading-snug group-hover:text-[#D97757] transition-colors duration-300">
                {post.title}
              </h2>
              <p className="text-[14px] text-[#1C1B18]/50 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4 text-[12px] text-[#1C1B18]/30">
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{post.readTime}</span>
                <span>{post.date}</span>
              </div>
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#E58A6A] group-hover:gap-2.5 transition-all">
                Read article <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </a>
    </FadeUp>
  );
}

/* ─── Post Grid Card ─────────────────────────────────────────────── */
function PostCard({ post, delay }: { post: typeof POSTS[number]; delay?: number }) {
  return (
    <FadeUp delay={delay}>
      {/*
        ┌──────────────────────────────────────────────────┐
        │  BLOG POST CARD                                  │
        │  To edit: find this post by id in POSTS array   │
        │  and change its fields directly.                │
        └──────────────────────────────────────────────────┘
      */}
      <a
        href={post.href}
        className="group flex flex-col rounded-[1.75rem] border border-black/[0.06] bg-[#F5F4F1] overflow-hidden hover:border-[#E58A6A]/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-400 h-full"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <ImageBlock
            image={post.image}
            aspect="aspect-[16/9]"
            className="rounded-none group-hover:scale-[1.02] transition-transform duration-700"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <TagPill tag={post.tag} />
            <div className="flex items-center gap-3 text-[11px] text-[#1C1B18]/25">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
            </div>
          </div>

          <h3 className="text-[16px] font-semibold text-[#1C1B18] leading-snug group-hover:text-[#D97757] transition-colors duration-300 flex-1">
            {post.title}
          </h3>

          <p className="text-[13px] text-[#1C1B18]/45 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-black/[0.05]">
            <span className="text-[11.5px] text-[#1C1B18]/25">{post.date}</span>
            <span className="flex items-center gap-1 text-[12px] font-semibold text-[#E58A6A] group-hover:gap-2 transition-all">
              Read <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </a>
    </FadeUp>
  );
}

/* ─── Blog Grid section ──────────────────────────────────────────── */
function BlogSection() {
  const featured = POSTS.find((p) => p.featured);
  const grid     = POSTS.filter((p) => !p.featured);

  return (
    <section className="py-8 pb-28 max-w-7xl mx-auto px-4 md:px-8 space-y-8">
      {/* Featured */}
      {featured && <FeaturedPost post={featured} />}

      {/* Divider */}
      <FadeUp>
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-black/[0.05]" />
          <span className="text-[10.5px] uppercase tracking-widest text-[#1C1B18]/25 font-medium">More articles</span>
          <div className="flex-1 h-px bg-black/[0.05]" />
        </div>
      </FadeUp>

      {/* Grid — 2 cols on tablet, 3 on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {grid.map((post, i) => (
          <PostCard key={post.id} post={post} delay={i * 0.07} />
        ))}
      </div>
    </section>
  );
}

/* ─── Newsletter strip ───────────────────────────────────────────── */
function Newsletter() {
  return (
    <section className="border-t border-black/[0.05] bg-[#F5F4F1] py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <FadeUp>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F2F1ED] border border-black/[0.07] mb-6">
            <Zap className="w-5 h-5 text-[#E58A6A]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C1B18] tracking-tight mb-3">
            Decision intelligence, in your inbox.
          </h2>
          <p className="text-[14px] text-[#1C1B18]/40 leading-relaxed mb-8 max-w-md mx-auto">
            New articles on strategy, branching logic, and the science of high-stakes decisions. No noise. One email, twice a month.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@company.com"
              className="flex-1 w-full h-12 px-5 rounded-2xl border border-black/[0.1] bg-[#FAFAF8] text-[13.5px] text-[#1C1B18] placeholder:text-[#1C1B18]/25 focus:outline-none focus:border-[#E58A6A]/50 focus:ring-1 focus:ring-[#E58A6A]/20 transition-all"
            />
            <button className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-[#E58A6A] text-white text-[13.5px] font-semibold hover:bg-[#D97757] transition-colors shadow-[0_0_16px_rgba(229,138,106,0.2)] shrink-0 flex items-center justify-center gap-2">
              Subscribe <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────── */
function EnterpriseFooter() {
  return (
     <footer className="border-t border-black/[0.07] bg-[#F5F4F0] pt-20 pb-12 px-6 md:px-12">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 mb-16">
   
           {/* Logo & Info Column */}
           <div className="md:col-span-2">
             <div className="flex items-center gap-3 mb-6">
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ duration: 0.8, ease: "easeOut" }}
                 className="flex items-center"
               >
                 <img
                   src="/logofive.PNG"
                   alt="ThinkAI Logo"
                   className="h-[80px] w-auto"
                 />
               </motion.div>
             </div>
             <p className="text-[#1C1B18]/40 text-sm leading-relaxed max-w-xs mb-8">
               The Decision Engine for the modern enterprise. We think through so you can do.
             </p>
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-xs font-medium text-[#1C1B18]/30 uppercase tracking-widest">Systems Operational</span>
             </div>
           </div>
   
           {/* Links Columns */}
           <div>
             <h4 className="text-[#1C1B18] font-semibold text-sm mb-6">Product</h4>
             <ul className="space-y-4 text-sm text-[#1C1B18]/50">
               <li><a href="#engine" className="hover:text-[#E58A6A] transition-colors">The Engine</a></li>
               <li><a href="#aside" className="hover:text-[#E58A6A] transition-colors">Aside AI UI</a></li>
               <li><a href="#security" className="hover:text-[#E58A6A] transition-colors">Security & Trust</a></li>
               <li><a href="/pricing" className="hover:text-[#E58A6A] transition-colors">Pricing</a></li>
               <li><a href="#" className="hover:text-[#E58A6A] transition-colors">Changelog</a></li>
             </ul>
           </div>
   
           <div>
             <h4 className="text-[#1C1B18] font-semibold text-sm mb-6">Use Cases</h4>
             <ul className="space-y-4 text-sm text-[#1C1B18]/50">
               <li><a href="/use-case#features" className="hover:text-[#E58A6A] transition-colors">Enterprise Strategy</a></li>
               <li><a href="/use-case#features" className="hover:text-[#E58A6A] transition-colors">Engineering & Tech Debt</a></li>
               <li><a href="/use-case#features" className="hover:text-[#E58A6A] transition-colors">Risk Mitigation</a></li>
               <li><a href="/use-case#features" className="hover:text-[#E58A6A] transition-colors">Startup Scaling</a></li>
             </ul>
           </div>
   
           <div>
             <h4 className="text-[#1C1B18] font-semibold text-sm mb-6">Company</h4>
             <ul className="space-y-4 text-sm text-[#1C1B18]/50">
               <li><a href="/blog" className="hover:text-[#E58A6A] transition-colors">About Us</a></li>
               <li><a href="/blog" className="hover:text-[#E58A6A] transition-colors">Blog & Research</a></li>
               <li><a href="/blog" className="hover:text-[#E58A6A] transition-colors">Careers</a></li>
               <li><a href="/pricing#contactsales" className="hover:text-[#E58A6A] transition-colors">Contact Sales</a></li>
             </ul>
           </div>
         </div>
   
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-black/[0.05] text-xs text-[#1C1B18]/30">
           <p>© 2026 three AI Inc. All rights reserved.</p>
           <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-[#1C1B18] transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-[#1C1B18] transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-[#1C1B18] transition-colors">Cookie Settings</a>
           </div>
         </div>
       </footer>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] selection:bg-[#E58A6A]/20 selection:text-[#1C1B18] font-sans">
      <NavBar />
      <main>
        <Hero />
        <BlogSection />
        <Newsletter />
      </main>
      <EnterpriseFooter />
    </div>
  );
}