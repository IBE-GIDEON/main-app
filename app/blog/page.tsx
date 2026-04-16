"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowRight,
  Zap,
  X,
  Menu,
  Clock,
  Tag,
  ArrowUpRight,
} from "lucide-react";

/* ─────────────────────────────────────────
   TOKENS
───────────────────────────────────────── */
const CREAM = "#F2F0EA";
const INK = "#0F0E0B";
const LILAC = "#B9A7FF";
const MUTED = "#8A8780";
const PANEL = "#F7F5F0";
const PANEL_2 = "#FCFBF8";

/* ─────────────────────────────────────────
   EASING
───────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────
   FADE UP
───────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
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

/* ─────────────────────────────────────────
   BLOG POSTS
   Matching contextual photos added
───────────────────────────────────────── */
const POSTS = [
  {
    id: 1,
    image: {
      src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
      alt: "Executives reviewing branching strategy options in a boardroom",
    },
    tag: "Decision Science",
    readTime: "6 min read",
    date: "Feb 28, 2026",
    featured: true,
    title: "Why Branching Logic Beats Prompting for High-Stakes Decisions",
    excerpt:
      "A chatbot gives you an answer. A decision engine maps the entire possibility space. Here is why the architecture difference matters when the stakes are real.",
    href: "#post-1",
  },
  {
    id: 2,
    image: {
      src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      alt: "Leadership team in strategic planning session",
    },
    tag: "Strategy",
    readTime: "5 min read",
    date: "Feb 20, 2026",
    featured: false,
    title: "The Real Cost of Strategic Ambiguity Inside Scaling Companies",
    excerpt:
      "Most teams do not fail on execution. They fail because nobody could agree on which decision was actually on the table. We ran the numbers.",
    href: "#post-2",
  },
  {
    id: 3,
    image: {
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      alt: "Engineers evaluating technical architecture on screens",
    },
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
    image: {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      alt: "Team collaborating around a product and systems diagram",
    },
    tag: "Product",
    readTime: "4 min read",
    date: "Feb 5, 2026",
    featured: false,
    title: "Recursive Refinement: How three AI Stress-Tests Its Own Conclusions",
    excerpt:
      "The engine does not just generate an answer — it challenges itself. A deep-dive into the architecture that makes our verdicts defensible.",
    href: "#post-4",
  },
  {
    id: 5,
    image: {
      src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
      alt: "Cybersecurity interface representing enterprise data protection",
    },
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

/* ─────────────────────────────────────────
   TAG STYLING
───────────────────────────────────────── */
function TagPill({ tag }: { tag: string }) {
  return (
    <span className="tag-pill">
      <Tag size={11} />
      {tag}
    </span>
  );
}

/* ─────────────────────────────────────────
   IMAGE BLOCK
───────────────────────────────────────── */
function ImageBlock({
  image,
  aspect = "aspect-[16/9]",
  className = "",
}: {
  image: { src: string; alt: string };
  aspect?: string;
  className?: string;
}) {
  return (
    <div className={`image-shell ${aspect} ${className}`}>
      <img src={image.src} alt={image.alt} className="image-fill" />
      <div className="image-overlay" />
    </div>
  );
}

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home", href: "/" },
    { label: "The Engine", href: "/#engine" },
    { label: "Refinement", href: "/#refinement" },
    { label: "Use Cases", href: "/use-case" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog", active: true },
  ];

  return (
    <>
      <header className="nav-shell">
        <a href="/">
               <div className="flex items-center gap-3 mb-6">
                 <motion.div
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ duration: 0.8, ease: "easeOut" }}
                   className="flex items-center"
                 >
                   {/* Added 'nav-logo' class here for CSS targeting */}
                   <img src="/logofive.png" alt="three AI logo" className="h-[30px] w-auto mt-5 nav-logo" />
                 </motion.div>
               </div></a>

        <nav className="desktop-nav">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="nav-link"
              style={{
                color: l.active ? INK : "rgba(15,14,11,0.58)",
                fontWeight: l.active ? 600 : 500,
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="desktop-auth">
          <a href="/signin?mode=login" className="nav-link">
            Sign In
          </a>
          <a href="/signin?mode=signup">
            <button className="btn-dark btn-sm">
              Get Started <ArrowUpRight size={12} />
            </button>
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          className="mobile-menu-btn"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="mobile-backdrop"
            />

            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease }}
              className="mobile-drawer"
            >
              <div className="mobile-drawer-head">
                <a href="/">
                       <div className="flex items-center gap-3 mb-6">
                         <motion.div
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           transition={{ duration: 0.8, ease: "easeOut" }}
                           className="flex items-center"
                         >
                           {/* Added 'nav-logo' class here for CSS targeting */}
                           <img src="/logofive.png" alt="three AI logo" className="h-[30px] w-auto mt-5 nav-logo" />
                         </motion.div>
                       </div></a>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="mobile-close-btn"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="mobile-drawer-links">
                {links.map((l, i) => (
                  <motion.a
                    key={l.label}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease }}
                    className="mobile-link"
                    style={{
                      color: l.active ? INK : "rgba(15,14,11,0.72)",
                      fontWeight: l.active ? 600 : 500,
                    }}
                  >
                    {l.label}
                    <ChevronRight size={14} />
                  </motion.a>
                ))}
              </nav>

              <div className="mobile-auth">
                <a href="/signin?mode=login">
                  <button className="btn-light mobile-full-width">Sign In</button>
                </a>
                <a href="/signin?mode=signup">
                  <button className="btn-dark mobile-full-width">Sign Up</button>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero-shell">
      <div className="hero-glow" />

      <div className="container-wide hero-inner">
        <FadeUp>
          <div className="hero-kicker">
            <Zap size={13} color={LILAC} />
            <span>Blog & Research</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <h1 className="font-display hero-title">
            Thinking out loud
            <br />
            so you do not have to.
          </h1>
        </FadeUp>

        <FadeUp delay={0.14}>
          <p className="font-editorial hero-copy">
            Decision science, product thinking, and the architecture behind the engine —
            written for operators who take financial strategy seriously.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FEATURED POST
───────────────────────────────────────── */
function FeaturedPost({ post }: { post: (typeof POSTS)[number] }) {
  return (
    <FadeUp>
      <a href={post.href} className="featured-post">
        <div className="featured-grid">
          <div className="featured-image-wrap">
            <ImageBlock
              image={post.image}
              aspect="aspect-[4/3] md:aspect-auto"
              className="featured-image"
            />
          </div>

          <div className="featured-content">
            <div>
              <div className="featured-meta-top">
                <span className="featured-label">Featured</span>
                <TagPill tag={post.tag} />
              </div>

              <h2 className="featured-title">{post.title}</h2>
              <p className="featured-copy">{post.excerpt}</p>
            </div>

            <div className="featured-bottom">
              <div className="post-meta-row">
                <span><Clock size={13} /> {post.readTime}</span>
                <span>{post.date}</span>
              </div>

              <span className="featured-cta">
                Read article <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </a>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────
   POST CARD
───────────────────────────────────────── */
function PostCard({
  post,
  delay,
}: {
  post: (typeof POSTS)[number];
  delay?: number;
}) {
  return (
    <FadeUp delay={delay}>
      <a href={post.href} className="post-card">
        <div className="post-card-image-wrap">
          <ImageBlock image={post.image} aspect="aspect-[16/9]" className="post-card-image" />
        </div>

        <div className="post-card-body">
          <div className="post-card-top">
            <TagPill tag={post.tag} />
            <div className="post-time">
              <Clock size={12} />
              {post.readTime}
            </div>
          </div>

          <h3 className="post-card-title">{post.title}</h3>
          <p className="post-card-copy">{post.excerpt}</p>

          <div className="post-card-bottom">
            <span className="post-date">{post.date}</span>
            <span className="post-read">
              Read <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </a>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────
   BLOG SECTION
───────────────────────────────────────── */
function BlogSection() {
  const featured = POSTS.find((p) => p.featured);
  const grid = POSTS.filter((p) => !p.featured);

  return (
    <section className="blog-section">
      <div className="container-wide blog-stack">
        {featured && <FeaturedPost post={featured} />}

        <FadeUp>
          <div className="section-divider">
            <div className="divider-line" />
            <span className="divider-label">More articles</span>
            <div className="divider-line" />
          </div>
        </FadeUp>

        <div className="blog-grid">
          {grid.map((post, i) => (
            <PostCard key={post.id} post={post} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   NEWSLETTER
───────────────────────────────────────── */
function Newsletter() {
  return (
    <section className="newsletter-shell">
      <div className="container-narrow newsletter-inner">
        <FadeUp>
          <div className="newsletter-icon">
            <Zap size={18} color={LILAC} />
          </div>
          <h2 className="newsletter-title">Decision intelligence, in your inbox.</h2>
          <p className="newsletter-copy">
            New articles on strategy, branching logic, and the science of high-stakes decisions.
            No noise. One email, twice a month.
          </p>

          <div className="newsletter-form">
            <input
              type="email"
              placeholder="your@company.com"
              className="newsletter-input"
            />
            <button className="btn-dark newsletter-btn">
              Subscribe <ChevronRight size={14} />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
function EnterpriseFooter() {
  return (
    <footer className="footer-shell">
      <div className="container-wide">
        <div className="footer-grid">
          <div>
            <a href="/">
                   <div className="flex items-center gap-3 mb-6">
                     <motion.div
                       initial={{ scale: 0 }}
                       animate={{ scale: 1 }}
                       transition={{ duration: 0.8, ease: "easeOut" }}
                       className="flex items-center"
                     >
                       {/* Added 'nav-logo' class here for CSS targeting */}
            <img src="/logosix.png" alt="three AI logo" className="h-[30px] w-auto mt-5 nav-logo" />
                     </motion.div>
                   </div></a>
            <p className="footer-copy">
              The decision engine built for the modern enterprise. We think through so you can do.
            </p>

            <div className="footer-status">
              <span className="footer-status-dot" />
              <span className="footer-status-text">Systems Operational</span>
            </div>
          </div>

          {[
            {
              heading: "Product",
              links: [
                { label: "The Engine", href: "/#engine" },
                { label: "Aside AI UI", href: "/#aside" },
                { label: "Security & Trust", href: "/#security" },
                { label: "Pricing", href: "/pricing" },
                { label: "Changelog", href: "#" },
              ],
            },
            {
              heading: "Use Cases",
              links: [
                { label: "Enterprise Strategy", href: "/use-case#features" },
                { label: "Engineering & Tech Debt", href: "/use-case#features" },
                { label: "Risk Mitigation", href: "/use-case#features" },
                { label: "Startup Scaling", href: "/use-case#features" },
              ],
            },
            {
              heading: "Company",
              links: [
                { label: "About Us", href: "/blog" },
                { label: "Blog & Research", href: "/blog" },
                { label: "Careers", href: "/blog" },
                { label: "Contact Sales", href: "/pricing#contactsales" },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="footer-heading">{col.heading}</h4>
              <ul className="footer-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-bottom-copy">© 2026 three AI Inc. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="/pandt" className="footer-link">Privacy Policy</a>
            <a href="/pandt" className="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function BlogPage() {
  return (
    <div className="page-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }

        .page-shell {
          min-height: 100vh;
          background: ${CREAM};
          color: ${INK};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .page-shell ::selection {
          background: rgba(185,167,255,0.22);
          color: ${INK};
        }

        .font-display {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.03em;
        }

        .font-editorial {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        .font-mono {
          font-family: 'IBM Plex Mono', monospace;
          letter-spacing: 0.12em;
        }

        .container-wide {
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto;
        }

        .container-narrow {
          width: min(760px, calc(100% - 48px));
          margin: 0 auto;
        }

        .brand-mark {
          display: flex;
          align-items: baseline;
          gap: 2px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .brand-think {
          font-size: 22px;
          font-weight: 800;
          color: ${INK};
          letter-spacing: -0.03em;
        }

        .brand-ai {
          font-size: 22px;
          font-weight: 600;
          color: ${LILAC};
          letter-spacing: -0.03em;
        }

        .nav-shell {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          background: rgba(242,240,234,0.88);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(15,14,11,0.08);
        }

        .desktop-nav,
        .desktop-auth {
          display: flex;
          align-items: center;
        }

        .desktop-nav {
          gap: 34px;
        }

        .desktop-auth {
          gap: 14px;
        }

        .nav-link {
          position: relative;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.25s ease;
          white-space: nowrap;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 1px;
          background: ${INK};
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .btn-dark,
        .btn-light {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: none;
          cursor: pointer;
          padding: 14px 26px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .btn-dark {
          background: ${INK};
          color: ${CREAM};
          border: 1px solid rgba(15,14,11,0.1);
        }

        .btn-dark:hover {
          background: ${LILAC};
          color: ${CREAM};
          box-shadow: 0 12px 30px rgba(185,167,255,0.18);
        }

        .btn-light {
          background: transparent;
          color: ${INK};
          border: 1px solid rgba(15,14,11,0.12);
        }

        .btn-light:hover {
          background: rgba(15,14,11,0.04);
        }

        .btn-sm {
          padding: 10px 18px;
          font-size: 10px;
        }

        .mobile-menu-btn {
          display: none;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          background: rgba(15,14,11,0.03);
          color: ${INK};
          border: 1px solid rgba(15,14,11,0.1);
          cursor: pointer;
        }

        .mobile-backdrop {
          position: fixed;
          inset: 0;
          z-index: 90;
          background: rgba(15,14,11,0.16);
          backdrop-filter: blur(4px);
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 99;
          width: min(84vw, 340px);
          background: rgba(242,240,234,0.98);
          border-left: 1px solid rgba(15,14,11,0.08);
          box-shadow: -18px 0 40px rgba(15,14,11,0.12);
          display: flex;
          flex-direction: column;
        }

        .mobile-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 20px;
          border-bottom: 1px solid rgba(15,14,11,0.08);
        }

        .mobile-close-btn {
          width: 38px;
          height: 38px;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(15,14,11,0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mobile-drawer-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px;
        }

        .mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          text-decoration: none;
          padding: 14px 14px;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(15,14,11,0.02);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .mobile-auth {
          margin-top: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid rgba(15,14,11,0.08);
        }

        .mobile-full-width {
          width: 100%;
        }

        .hero-shell {
          position: relative;
          overflow: hidden;
          padding: 152px 24px 64px;
          background: linear-gradient(to bottom, ${CREAM} 0%, ${PANEL_2} 100%);
          border-bottom: 1px solid rgba(15,14,11,0.08);
        }

        .hero-glow {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: min(900px, 90vw);
          height: 380px;
          background: rgba(185,167,255,0.12);
          filter: blur(120px);
          border-radius: 999px;
          pointer-events: none;
        }

        .hero-inner {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(185,167,255,0.35);
          background: rgba(185,167,255,0.08);
          margin-bottom: 24px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${LILAC};
        }

        .hero-title {
          font-size: clamp(40px, 7vw, 78px);
          line-height: 0.97;
          letter-spacing: -0.045em;
          color: ${INK};
          font-weight: 800;
          margin-bottom: 18px;
          text-transform: uppercase;
        }

        .hero-copy {
          font-size: 18px;
          line-height: 1.65;
          color: rgba(15,14,11,0.55);
          max-width: 650px;
          margin: 0 auto;
        }

        .blog-section {
          padding: 40px 24px 92px;
          background: ${CREAM};
        }

        .blog-stack {
          display: grid;
          gap: 28px;
        }

        .featured-post {
          display: block;
          text-decoration: none;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(255,255,255,0.44);
          overflow: hidden;
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .featured-post:hover {
          border-color: rgba(185,167,255,0.26);
          box-shadow: 0 14px 34px rgba(15,14,11,0.06);
        }

        .featured-grid {
          display: grid;
          grid-template-columns: 1.06fr 0.94fr;
        }

        .featured-image-wrap {
          min-height: 100%;
        }

        .featured-image {
          height: 100%;
          min-height: 420px;
        }

        .featured-content {
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 22px;
        }

        .featured-meta-top {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .featured-label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 10px;
          border: 1px solid rgba(185,167,255,0.22);
          background: rgba(185,167,255,0.08);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${INK};
        }

        .featured-title {
          font-size: clamp(28px, 3vw, 40px);
          line-height: 1.08;
          color: ${INK};
          font-weight: 800;
          letter-spacing: -0.035em;
          margin-bottom: 14px;
        }

        .featured-copy {
          font-size: 15px;
          line-height: 1.72;
          color: rgba(15,14,11,0.56);
          max-width: 520px;
        }

        .featured-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .featured-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${INK};
        }

        .post-meta-row {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          font-size: 12px;
          color: rgba(15,14,11,0.34);
        }

        .post-meta-row span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .section-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 2px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(15,14,11,0.08);
        }

        .divider-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.28);
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .post-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(255,255,255,0.44);
          overflow: hidden;
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .post-card:hover {
          border-color: rgba(185,167,255,0.22);
          box-shadow: 0 12px 28px rgba(15,14,11,0.05);
        }

        .post-card-image-wrap {
          overflow: hidden;
        }

        .post-card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 14px;
          padding: 20px;
        }

        .post-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .post-time {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(15,14,11,0.28);
        }

        .post-card-title {
          font-size: 17px;
          line-height: 1.25;
          color: ${INK};
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .post-card-copy {
          font-size: 13.5px;
          line-height: 1.68;
          color: rgba(15,14,11,0.5);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-card-bottom {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid rgba(15,14,11,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .post-date {
          font-size: 11.5px;
          color: rgba(15,14,11,0.28);
        }

        .post-read {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${INK};
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(15,14,11,0.03);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.52);
        }

        .image-shell {
          width: 100%;
          overflow: hidden;
          position: relative;
          background: #ece8df;
        }

        .image-fill {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s ease;
        }

        .post-card:hover .image-fill,
        .featured-post:hover .image-fill {
          transform: scale(1.03);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15,14,11,0.08), transparent 45%);
          pointer-events: none;
        }

        .newsletter-shell {
          padding: 88px 24px;
          border-top: 1px solid rgba(15,14,11,0.08);
          background: ${PANEL};
        }

        .newsletter-inner {
          text-align: center;
        }

        .newsletter-icon {
          width: 52px;
          height: 52px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(185,167,255,0.25);
          background: rgba(185,167,255,0.08);
        }

        .newsletter-title {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(30px, 5vw, 46px);
          line-height: 1.05;
          color: ${INK};
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 14px;
        }

        .newsletter-copy {
          font-size: 15px;
          line-height: 1.68;
          color: rgba(15,14,11,0.5);
          max-width: 560px;
          margin: 0 auto 24px;
        }

        .newsletter-form {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 560px;
          margin: 0 auto;
        }

        .newsletter-input {
          flex: 1;
          height: 50px;
          padding: 0 16px;
          border: 1px solid rgba(15,14,11,0.12);
          background: rgba(255,255,255,0.6);
          font-size: 14px;
          color: ${INK};
          outline: none;
        }

        .newsletter-input::placeholder {
          color: rgba(15,14,11,0.28);
        }

        .newsletter-input:focus {
          border-color: rgba(185,167,255,0.5);
          box-shadow: 0 0 0 3px rgba(185,167,255,0.1);
        }

        .newsletter-btn {
          height: 50px;
          padding-inline: 20px;
        }

        .footer-shell {
          background: ${INK};
          border-top: 1px solid rgba(242,240,234,0.08);
          padding: 76px 24px 34px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 56px;
          border-bottom: 1px solid rgba(242,240,234,0.08);
        }

        .footer-brand {
          margin-bottom: 18px;
        }

        .footer-brand-think {
          font-size: 22px;
          font-weight: 800;
          color: ${CREAM};
          letter-spacing: -0.03em;
        }

        .footer-brand-ai {
          font-size: 22px;
          font-weight: 600;
          color: ${LILAC};
          letter-spacing: -0.03em;
        }

        .footer-copy {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(242,240,234,0.42);
          max-width: 320px;
          margin-bottom: 24px;
        }

        .footer-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 10px rgba(34,197,94,0.35);
        }

        .footer-status-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(242,240,234,0.32);
        }

        .footer-heading {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${MUTED};
          margin-bottom: 22px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-link {
          text-decoration: none;
          color: rgba(242,240,234,0.45);
          font-size: 15px;
          transition: color 0.25s ease;
        }

        .footer-link:hover {
          color: ${CREAM};
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          padding-top: 24px;
        }

        .footer-bottom-copy {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(242,240,234,0.28);
        }

        .footer-bottom-links {
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${INK}; }
        ::-webkit-scrollbar-thumb { background: rgba(242,240,234,0.22); }

        @media (max-width: 1100px) {
          .featured-grid {
            grid-template-columns: 1fr;
          }

          .featured-image {
            min-height: 320px;
          }

          .blog-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 900px) {
          .desktop-nav,
          .desktop-auth {
            display: none !important;
          }

          .mobile-menu-btn {
            display: inline-flex;
          }
        }

        @media (max-width: 768px) {
          .nav-shell {
            padding: 0 16px;
          }

          .container-wide,
          .container-narrow {
            width: min(100%, calc(100% - 32px));
          }

          .blog-grid {
            grid-template-columns: 1fr !important;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-form .newsletter-input,
          .newsletter-form .newsletter-btn {
            width: 100%;
          }

          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 34px !important;
          }

          .footer-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .featured-content,
          .post-card-body {
            padding: 20px;
          }
        }

        @media (max-width: 560px) {
          .hero-shell,
          .blog-section,
          .newsletter-shell,
          .footer-shell {
            padding-left: 16px;
            padding-right: 16px;
          }

          .hero-title {
            line-height: 0.99;
          }

          .featured-image {
            min-height: 250px;
          }
        }
      `}</style>

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
