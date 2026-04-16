"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  Network, Lock, LayoutPanelLeft, Menu, X, ArrowRight,
  ShieldCheck, ChevronDown, ArrowUpRight, Brain, Zap,
  BarChart3, Globe, FileText, Users, TrendingUp, Shield
} from "lucide-react";

/* ─────────────────────────────────────────
   TOKENS & CONFIG
───────────────────────────────────────── */
const CREAM = "#F2F0EA";
const INK   = "#0F0E0B";
const GOLD  = "#B9A7FF";
const MUTED = "#8A8780";

/* ─────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────── */
const ease = [0.76, 0, 0.24, 1];

const reveal = {
  hidden: { opacity: 0, y: 48 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease, delay: i * 0.12 }
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease } }
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease } }
};

/* ─────────────────────────────────────────
   UTILITY: USE-IN-VIEW WRAPPER
───────────────────────────────────────── */
function InView({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={reveal}
      custom={delay}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   ROOT
───────────────────────────────────────── */
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isNavLight, setIsNavLight] = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrollY(window.scrollY);
      
      // Check if navbar is overlapping a white section
      const navHeight = 64;
      const lightSections = document.querySelectorAll('.light-section');
      let overLight = false;
      
      lightSections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= navHeight && rect.bottom >= 0) {
          overLight = true;
        }
      });
      setIsNavLight(overLight);
    };
    
    window.addEventListener("scroll", fn, { passive: true });
    fn(); // init
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden font-sans"
      style={{ background: INK, color: CREAM, fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }

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

        .page-shell { width: 100%; overflow-x: hidden; }
        .container-wide { width: min(1280px, calc(100% - 48px)); margin: 0 auto; }
        .container-mid { width: min(1200px, calc(100% - 48px)); margin: 0 auto; }
        .container-narrow { width: min(1100px, calc(100% - 48px)); margin: 0 auto; }

        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-inner { animation: ticker 22s linear infinite; }
        .ticker-inner:hover { animation-play-state: paused; }

        .nav-link {
          position: relative;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(242,240,234,0.55);
          transition: color 0.3s;
          white-space: nowrap;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: ${CREAM};
          transition: width 0.35s ease;
        }
        .nav-link:hover { color: ${CREAM}; }
        .nav-link:hover::after { width: 100%; }

        /* --- DYNAMIC LIGHT NAVBAR STYLES --- */
        .nav-light .nav-link { color: rgba(15,14,11,0.6); }
        .nav-light .nav-link:hover { color: #0F0E0B; }
        .nav-light .nav-link::after { background: #0F0E0B; }
        .nav-light .btn-primary { background: #0F0E0B; color: ${CREAM}; }
        .nav-light .btn-primary:hover { background: ${GOLD}; color: #0F0E0B; box-shadow: 0 10px 30px rgba(15,14,11,0.18); }
        .nav-light .mobile-menu-btn { color: #0F0E0B; border-color: rgba(15,14,11,0.15); background: rgba(15,14,11,0.02); }
        .nav-light .nav-logo { filter: invert(1); }
        /* ----------------------------------- */

        .img-wrap { overflow: hidden; position: relative; }
        .img-wrap img { transition: transform 0.9s ease, filter 0.6s ease; filter: grayscale(20%); }
        .img-wrap:hover img { transform: scale(1.04); filter: grayscale(0%); }

        .stat-card { transition: background 0.3s, border-color 0.3s; }
        .stat-card:hover { background: rgba(242,240,234,0.04); border-color: rgba(185,167,255,0.5); }

        .btn-primary {
          background: ${CREAM};
          color: ${INK};
          padding: 14px 32px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: background 0.25s, color 0.25s, transform 0.2s, box-shadow 0.25s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          white-space: nowrap;
        }
        .btn-primary:hover {
          background: ${GOLD};
          color: ${CREAM};
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(185,167,255,0.18);
        }

        .btn-secondary {
          background: transparent;
          color: ${CREAM};
          padding: 13px 32px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid rgba(242,240,234,0.25);
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s, transform 0.2s, color 0.25s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          white-space: nowrap;
        }
        .btn-secondary:hover {
          border-color: ${GOLD};
          background: rgba(185,167,255,0.08);
          color: ${CREAM};
          transform: translateY(-1px);
        }

        .mobile-menu-btn {
          display: none;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(242,240,234,0.15);
          background: rgba(242,240,234,0.02);
          color: ${CREAM};
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .mobile-drawer {
          position: fixed;
          top: 64px;
          left: 16px;
          right: 16px;
          z-index: 99;
          background: rgba(15,14,11,0.96);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(242,240,234,0.08);
          padding: 20px;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${INK}; }
        ::-webkit-scrollbar-thumb { background: rgba(242,240,234,0.2); }

        .section-rule { border: none; border-top: 1px solid rgba(242,240,234,0.1); }

        .bento-card {
          border: 1px solid rgba(242,240,234,0.08);
          transition: border-color 0.4s, transform 0.3s, background 0.3s;
        }
        .bento-card:hover { border-color: rgba(185,167,255,0.35); }

        .feature-row { border-bottom: 1px solid rgba(242,240,234,0.08); }
        .feature-row:hover { background: rgba(242,240,234,0.025); }

        @keyframes logoPulse { 0%,100%{opacity:0.35} 50%{opacity:0.6} }
        .logo-item { animation: logoPulse 3s ease-in-out infinite; }
        .logo-item:nth-child(2) { animation-delay: 0.5s; }
        .logo-item:nth-child(3) { animation-delay: 1s; }
        .logo-item:nth-child(4) { animation-delay: 1.5s; }
        .logo-item:nth-child(5) { animation-delay: 2s; }

        .desktop-only { display: flex; }
        .mobile-only { display: none; }

        @media (max-width: 1200px) {
          .hero-panel-grid { grid-template-columns: 1fr 1.4fr 1fr 1fr !important; }
          .editorial-stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .footer-grid { grid-template-columns: 1.6fr 1fr 1fr 1fr !important; }
        }

        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .desktop-auth { display: none !important; }
          .mobile-menu-btn { display: inline-flex; }
          .product-grid { grid-template-columns: 1fr !important; }
          .product-sidebar {
            position: relative !important;
            top: 0 !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(242,240,234,0.08);
            padding: 32px 0 !important;
          }
          .editorial-stats-grid { grid-template-columns: 1fr !important; }
          .editorial-stats-grid > * {
            border-right: none !important;
            border-bottom: 1px solid rgba(15,14,11,0.12);
          }
          .quote-grid { grid-template-columns: 1fr !important; min-height: auto !important; }
          .bento-grid { grid-template-columns: 1fr !important; grid-template-rows: auto !important; }
          .bento-tall { grid-row: span 1 !important; min-height: auto !important; }
          .testimonial-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }

        @media (max-width: 768px) {
          .container-wide, .container-mid, .container-narrow {
            width: min(100%, calc(100% - 32px));
          }
          .hero-section {
            min-height: 760px !important;
            height: auto !important;
            padding-top: 112px;
            padding-bottom: 96px;
          }
          .hero-panel-grid {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: 1fr 1fr;
            gap: 2px !important;
          }
          .hero-copy {
            padding: 0 16px !important;
          }
          .hero-actions {
            flex-direction: column;
            align-items: stretch !important;
            width: min(100%, 360px);
            margin: 0 auto;
          }
          .hero-actions a,
          .hero-actions button {
            width: 100%;
          }
          .feature-row-responsive {
            grid-template-columns: 36px 1fr !important;
            gap: 18px !important;
            align-items: start !important;
          }
          .feature-row-responsive .feature-desc {
            grid-column: 2 / -1;
          }
          .security-pillars {
            flex-direction: column !important;
          }
          .security-pillars > * {
            width: 100%;
            justify-content: center;
            border-right: none !important;
            border-bottom: 1px solid rgba(15,14,11,0.12);
          }
          .security-pillars > *:last-child { border-bottom: none !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .footer-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .cta-actions {
            flex-direction: column;
            align-items: stretch !important;
            width: min(100%, 360px);
            margin: 40px auto 0 !important;
          }
          .cta-actions button { width: 100%; }
        }

        @media (max-width: 560px) {
          .nav-shell {
            padding: 0 16px !important;
          }
          .hero-kicker {
            margin-bottom: 24px !important;
            padding: 6px 12px !important;
          }
          .hero-paragraph {
            font-size: 18px !important;
            line-height: 1.55 !important;
            margin-bottom: 32px !important;
          }
          .logo-bar-section,
          .features-section,
          .bento-section,
          .testimonials-section,
          .footer-section {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .product-content {
            padding: 32px 20px !important;
          }
          .bento-card-mobile {
            padding: 28px 22px !important;
          }
          .testimonial-card {
            padding: 28px 22px !important;
            min-height: auto !important;
          }
          .cta-inner {
            padding: 72px 20px !important;
          }
          .footer-main {
            padding: 56px 0 28px !important;
          }
          .mobile-full-width {
            width: 100%;
          }
          .legal-links {
            gap: 14px !important;
          }
        }
      `}</style>

      {/* Passed dynamic boolean here */}
      <NavBar scrolled={scrollY > 60} isLight={isNavLight} />
      
      <HeroSection />
      <LogoBar />
      <EditorialStats />
      <ProductShowcase />
      <FeaturesTable />
      <BentoSection />
      <SecuritySection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
function NavBar({ scrolled, isLight }) {
  const [open, setOpen] = useState(false);
  
  // UPDATED: Now an array of objects linking to exact paths
  const navItems = [
    { name: "Product", path: "#product" },
    { name: "Solutions", path: "#solutions" },
    { name: "Use-case", path: "/use-case" },
    { name: "Pricing", path: "/pricing" },
    { name: "Blog", path: "/blog" }
  ];

  // Determine dynamic styling based on section intersect
  const navClass = `nav-shell ${isLight ? 'nav-light' : ''}`;
  const bg = isLight
    ? "rgba(242,240,234,0.92)"
    : (scrolled ? "rgba(15,14,11,0.92)" : "transparent");
  const border = isLight
    ? "1px solid rgba(15,14,11,0.08)"
    : (scrolled ? "1px solid rgba(242,240,234,0.08)" : "1px solid transparent");

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
        className={navClass}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "0 40px",
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: bg,
          backdropFilter: "blur(20px)",
          borderBottom: border,
          transition: "all 0.4s ease"
        }}
      >
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

        <nav
          className="desktop-nav"
          style={{ display: "flex", gap: 36, alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          {/* UPDATED: Mapping the new object array */}
          {navItems.map(item => (
            <a key={item.name} href={item.path} className="nav-link" style={{ textDecoration: "none" }}>
              {item.name}
            </a>
          ))}
        </nav>

        <div className="desktop-auth" style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
          <a href="/signin?mode=login" className="nav-link" style={{
            textDecoration: "none",
            padding: "8px 18px",
            border: `1px solid ${isLight ? 'rgba(15,14,11,0.15)' : 'rgba(242,240,234,0.15)'}`,
            transition: "border 0.3s"
          }}>Sign In</a>
          <a href="/signin?mode=signup">
            <button className="btn-primary" style={{ padding: "9px 22px", fontSize: 10 }}>
              Get Started <ArrowUpRight size={12} />
            </button>
          </a>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-drawer"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* UPDATED: Mapping the new object array for mobile */}
              {navItems.map(item => (
                <a
                  key={item.name}
                  href={item.path}
                  className="nav-link"
                  style={{ textDecoration: "none", color: CREAM }}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              <div style={{ height: 1, background: "rgba(242,240,234,0.08)", margin: "4px 0" }} />

              <a
                href="/signin?mode=login"
                className="nav-link"
                style={{ textDecoration: "none", color: CREAM }}
                onClick={() => setOpen(false)}
              >
                Sign In
              </a>

              <a href="/signin?mode=signup" onClick={() => setOpen(false)} style={{ width: "100%" }}>
                <button className="btn-primary mobile-full-width" style={{ width: "100%", marginTop: 6 }}>
                  Get Started <ArrowUpRight size={12} />
                </button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, 160]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section
      id="home"
      className="hero-section"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 700,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        style={{ position: "absolute", inset: 0, y: y1 }}
      >
        <div
          className="hero-panel-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 1fr 1.2fr",
            height: "100%",
            gap: 3,
          }}
        >
          {[
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80",
            "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=600&q=80",
            "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=600&q=80",
          ].map((src, i) => (
            <motion.div
              key={i}
              className="img-wrap"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: i * 0.1, ease }}
              style={{ overflow: "hidden", position: "relative" }}
            >
              <img
                src={src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(15,14,11,0.55)",
              }} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(15,14,11,0.2) 0%, rgba(15,14,11,0.6) 100%)",
        zIndex: 2,
      }} />

      <motion.div
        className="hero-copy"
        style={{ position: "relative", zIndex: 3, textAlign: "center", padding: "0 24px", opacity, width: "100%" }}
      >
        <motion.div
          className="hero-kicker"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px",
            border: "1px solid rgba(185,167,255,0.4)",
            marginBottom: 36,
            maxWidth: "calc(100vw - 48px)",
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: GOLD, display: "block",
            animation: "logoPulse 2s ease-in-out infinite"
          }} />
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase" }}>
            Institutional Decision Intelligence
          </span>
        </motion.div>

        <motion.h1
          className="font-display"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease }}
          style={{
            fontSize: "clamp(42px, 8vw, 96px)",
            fontWeight: 800,
            lineHeight: 0.96,
            letterSpacing: "-0.04em",
            color: CREAM,
            textTransform: "uppercase",
            maxWidth: 900,
            margin: "0 auto 28px",
          }}
        >
          A New Era of<br />
          Decision<br />
          Intelligence.
        </motion.h1>

        <motion.p
          className="font-editorial hero-paragraph"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease }}
          style={{
            fontSize: 20,
            color: "rgba(242,240,234,0.65)",
            maxWidth: 560,
            margin: "0 auto 48px",
            lineHeight: 1.55,
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}
        >
          Precision AI for billion-dollar financial decisions. We think through so you can move with clarity, speed, and control.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <a href="/signin?mode=signup">
            <button className="btn-primary">
              Get Started <ArrowRight size={14} />
            </button>
          </a>
          
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: "absolute", bottom: 36, left: "50%",
          transform: "translateX(-50%)", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}
      >
        <span className="font-mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,234,0.35)", textTransform: "uppercase" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={16} color="rgba(242,240,234,0.35)" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────
   LOGO BAR
───────────────────────────────────────── */
function LogoBar() {
  const logos = [
    "Global FinTech", "Vertex Capital", "AeroSpace Def.", "Sovereign Partners", "Meridian Law"
  ];

  return (
    <section
      className="logo-bar-section"
      style={{ padding: "64px 40px", borderBottom: "1px solid rgba(242,240,234,0.08)" }}
    >
      <InView>
        <p className="font-mono" style={{
          fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase",
          color: MUTED, textAlign: "center", marginBottom: 40,
        }}>
          Trusted by top-tier financial teams worldwide
        </p>
      </InView>
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        gap: "clamp(24px, 6vw, 80px)", flexWrap: "wrap",
      }}>
        {logos.map((logo, i) => (
          <motion.span
            key={i}
            className="logo-item font-display"
            whileHover={{ opacity: 0.9, scale: 1.04 }}
            style={{
              fontSize: "clamp(14px, 2vw, 19px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "rgba(242,240,234,0.38)",
              cursor: "default",
              transition: "color 0.3s",
              textAlign: "center",
            }}
          >
            {logo}
          </motion.span>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   EDITORIAL STATS
───────────────────────────────────────── */
function EditorialStats() {
  const stats = [
    {
      metric: "$30T",
      label: "AUM of firms using three AI",
      img: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80",
    },
    {
      metric: "40 hrs",
      label: "Average time saved per decision cycle",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    },
    {
      metric: "3×",
      label: "More edge-case risks identified",
      img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    },
  ];

  return (
    // Added className "light-section" here
    <section id="product" className="light-section" style={{ background: CREAM, color: INK }}>
      <div style={{
        padding: "clamp(64px, 10vw, 120px) 24px",
        borderBottom: `1px solid rgba(15,14,11,0.12)`,
        textAlign: "center",
      }}>
        <InView>
          <h2 className="font-display" style={{
            fontSize: "clamp(40px, 7vw, 84px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 0.96,
            color: INK,
            marginBottom: 24,
          }}>
            High reasoning,<br />
            without friction.
          </h2>
        </InView>
        <InView delay={0.15}>
          <p className="font-editorial" style={{
            fontSize: 20,
            color: "rgba(15,14,11,0.55)", maxWidth: 560, margin: "0 auto",
            lineHeight: 1.65,
            fontWeight: 400,
          }}>
            Standard LLMs hide complexity and hallucinate facts. three AI automatically stress-tests
            financial ideas via recursive refinement before you even ask.
          </p>
        </InView>
      </div>

      <div
        className="editorial-stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderBottom: `1px solid rgba(15,14,11,0.12)`,
        }}
      >
        {stats.map((s, i) => (
          <InView key={i} delay={i * 0.1}>
            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.01 }}
              style={{
                borderRight: i < 2 ? `1px solid rgba(15,14,11,0.12)` : "none",
                padding: "clamp(28px, 5vw, 64px)",
                cursor: "default",
                height: "100%",
              }}
            >
              <div className="img-wrap" style={{ height: 220, marginBottom: 32, overflow: "hidden" }}>
                <img
                  src={s.img}
                  alt={s.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div className="font-display" style={{
                fontSize: "clamp(48px, 6vw, 72px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: INK,
                marginBottom: 12,
              }}>
                {s.metric}
              </div>
              <p className="font-mono" style={{
                fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(15,14,11,0.45)",
              }}>
                {s.label}
              </p>
            </motion.div>
          </InView>
        ))}
      </div>

      <div
        className="quote-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          borderBottom: `1px solid rgba(15,14,11,0.12)`,
          minHeight: 480,
        }}
      >
        <div className="img-wrap" style={{ overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80"
            alt="Executive"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 420 }}
          />
        </div>
        <div style={{
          padding: "clamp(40px, 6vw, 80px)",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <InView>
            <span className="font-display" style={{ fontSize: 64, color: GOLD, lineHeight: 1, display: "block", marginBottom: 8 }}>
              "
            </span>
            <blockquote className="font-editorial" style={{
              fontSize: "clamp(20px, 2.5vw, 30px)",
              lineHeight: 1.5,
              color: INK,
              marginBottom: 32,
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}>
              three AI has not only increased the speed at which analysts can perform,
              but also created visual insights into our various positions that have
              fundamentally improved our strategic execution process.
            </blockquote>
            <div>
              <p className="font-mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: INK, fontWeight: 500 }}>
                Sarah Chen
              </p>
              <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED }}>
                CIO — Vertex Capital Partners
              </p>
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PRODUCT SHOWCASE
───────────────────────────────────────── */
function ProductShowcase() {
  const tabs = [
    { label: "Enterprise Decision", key: "collab" },
    { label: "Unmatched scale", key: "scale" },
    { label: "Automated workflows", key: "workflows" },
    { label: "Financial context", key: "finance" },
  ];
  const [active, setActive] = useState("collab");

  const tabContent = {
    collab: {
      title: "Enterprise decision",
      desc: "Shared workspaces, permissioned access, and audit trails — built for the way institutional teams actually operate.",
      img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80",
    },
    scale: {
      title: "Unmatched analytical scale",
      desc: "Uncover insights others miss with the power to reason over limitless context — documents, data, and decisions at once.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
    },
    workflows: {
      title: "Workflows that run like your best people",
      desc: "Encode your firm's financial processes once and three AI runs them continuously, in just one prompt.",
      img: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=900&q=80",
    },
    finance: {
      title: "Deep Enterprice context",
      desc: "three AI ingests your proprietary data alongside market signals to deliver verdicts grounded in your actual position.",
      img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80",
    },
  };

  return (
    <section id="solutions" style={{
      background: INK,
      borderTop: "1px solid rgba(242,240,234,0.08)",
      borderBottom: "1px solid rgba(242,240,234,0.08)",
    }}>
      <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: 600 }}>
        <div
          className="product-sidebar"
          style={{
            borderRight: "1px solid rgba(242,240,234,0.08)",
            padding: "64px 0",
            position: "sticky", top: 64, alignSelf: "start",
          }}
        >
          <p className="font-mono" style={{
            fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
            color: MUTED, padding: "0 32px", marginBottom: 28,
          }}>
            Platform
          </p>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className="font-editorial"
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "14px 32px",
                fontSize: 16,
                fontWeight: active === t.key ? 600 : 400,
                color: active === t.key ? CREAM : "rgba(242,240,234,0.35)",
                background: active === t.key ? "rgba(242,240,234,0.04)" : "transparent",
                border: "none",
                borderLeft: active === t.key ? `2px solid ${GOLD}` : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="product-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease }}
            style={{ padding: "64px 56px" }}
          >
            <h3 className="font-display" style={{
              fontSize: "clamp(28px, 3vw, 42px)",
              fontWeight: 700, letterSpacing: "-0.035em",
              color: CREAM, marginBottom: 16,
            }}>
              {tabContent[active].title}
            </h3>
            <p className="font-editorial" style={{
              fontSize: 18,
              color: "rgba(242,240,234,0.55)", marginBottom: 40,
              lineHeight: 1.6, maxWidth: 560,
              fontWeight: 400,
            }}>
              {tabContent[active].desc}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="img-wrap"
              style={{
                border: "1px solid rgba(242,240,234,0.1)",
                overflow: "hidden",
                height: "clamp(260px, 42vw, 380px)",
              }}
            >
              <img
                src={tabContent[active].img}
                alt={tabContent[active].title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, rgba(15,14,11,0.3), transparent)",
                pointerEvents: "none",
              }} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FEATURES TABLE
───────────────────────────────────────── */
function FeaturesTable() {
  const features = [
    { icon: <Brain size={18} />, title: "Recursive Refinement Engine", desc: "Challenges its own logic — generates branching scenarios before presenting the final verdict." },
    { icon: <BarChart3 size={18} />, title: "Multi-Document Synthesis", desc: "Ingest thousands of pages simultaneously. Earnings calls, legal briefs, market data — at once." },
    { icon: <Zap size={18} />, title: "Automated Decision Workflows", desc: "Encode your analysts' best thinking. three AI runs it continuously, on one prompt." },
    { icon: <Globe size={18} />, title: "Cross-Portfolio Analysis", desc: "Reason across your entire portfolio in one query. Surface correlations others miss entirely." },
    { icon: <FileText size={18} />, title: "Audit-Ready Outputs", desc: "Every verdict is explainable, traceable, and structured for regulatory review." },
    { icon: <Users size={18} />, title: "Enterprise Collaboration", desc: "Permissioned workspaces, shared memory, and team-level reasoning chains." },
  ];

  return (
    <section
      className="features-section"
      style={{
        background: INK,
        padding: "0 40px",
        borderBottom: "1px solid rgba(242,240,234,0.08)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <InView>
          <div style={{ padding: "80px 0 48px", borderBottom: "1px solid rgba(242,240,234,0.08)" }}>
            <h2 className="font-display" style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800, letterSpacing: "-0.04em",
              color: CREAM,
            }}>
              The full decision stack.
            </h2>
          </div>
        </InView>

        {features.map((f, i) => (
          <InView key={i} delay={i * 0.06}>
            <motion.div
              className="feature-row feature-row-responsive"
              whileHover={{ paddingLeft: 8 }}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 2fr",
                gap: 32,
                padding: "28px 0",
                alignItems: "center",
                cursor: "default",
                transition: "padding 0.3s ease",
              }}
            >
              <span style={{ color: GOLD }}>{f.icon}</span>
              <span className="font-display" style={{
                fontSize: 17, fontWeight: 600, color: CREAM, letterSpacing: "-0.02em",
              }}>
                {f.title}
              </span>
              <span
                className="font-editorial feature-desc"
                style={{
                  fontSize: 16,
                  color: "rgba(242,240,234,0.45)", lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                {f.desc}
              </span>
            </motion.div>
          </InView>
        ))}

        <div style={{ padding: "40px 0" }} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   BENTO GRID
───────────────────────────────────────── */
function BentoSection() {
  return (
    <section
      className="bento-section"
      style={{
        background: INK,
        padding: "80px 40px",
        borderBottom: "1px solid rgba(242,240,234,0.08)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <InView>
          <p className="font-mono" style={{
            fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase",
            color: MUTED, marginBottom: 16,
          }}>
            Core Architecture
          </p>
          <h2 className="font-display" style={{
            fontSize: "clamp(32px, 5vw, 54px)",
            fontWeight: 800, letterSpacing: "-0.04em",
            color: CREAM, marginBottom: 48,
          }}>
            Built for the hardest calls.
          </h2>
        </InView>

        <div
          className="bento-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: 16,
          }}
        >
          <InView>
            <motion.div
              className="bento-card bento-tall bento-card-mobile"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: "52px 44px",
                minHeight: 520,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                background: "rgba(242,240,234,0.02)",
                gridRow: "span 2",
              }}
            >
              <div>
                <div style={{
                  width: 44, height: 44,
                  border: `1px solid rgba(185,167,255,0.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 32, color: GOLD,
                }}>
                  <Network size={20} />
                </div>
                <h3 className="font-display" style={{
                  fontSize: 26, fontWeight: 700, color: CREAM,
                  letterSpacing: "-0.03em", marginBottom: 16,
                }}>
                  Recursive Refinement
                </h3>
                <p className="font-editorial" style={{
                  fontSize: 17,
                  color: "rgba(242,240,234,0.45)", lineHeight: 1.7,
                  fontWeight: 400,
                }}>
                  The engine challenges its own logic. It generates branching scenarios and
                  stress-tests assumptions based on your raw company data before presenting the final verdict.
                </p>
              </div>
              <div className="img-wrap" style={{
                height: 220, marginTop: 36,
                border: "1px solid rgba(242,240,234,0.06)",
                overflow: "hidden",
              }}>
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80"
                  alt="Refinement"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </motion.div>
          </InView>

          <InView delay={0.1}>
            <motion.div
              className="bento-card bento-card-mobile"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: "44px",
                background: "rgba(242,240,234,0.02)",
                display: "flex", flexDirection: "column",
              }}
            >
              <div style={{
                width: 44, height: 44,
                border: `1px solid rgba(185,167,255,0.3)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 28, color: GOLD,
              }}>
                <LayoutPanelLeft size={20} />
              </div>
              <h3 className="font-display" style={{
                fontSize: 22, fontWeight: 700, color: CREAM, marginBottom: 14, letterSpacing: "-0.03em",
              }}>
                The Aside AI Interface
              </h3>
              <p className="font-editorial" style={{
                fontSize: 16,
                color: "rgba(242,240,234,0.45)", lineHeight: 1.65,
                fontWeight: 400,
              }}>
                Designed to live alongside your work — a spatial interface ensuring AI acts
                as a collaborative partner, not a distraction.
              </p>
            </motion.div>
          </InView>

          <InView delay={0.15}>
            <motion.div
              className="bento-card bento-card-mobile"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: "44px",
                background: `linear-gradient(135deg, rgba(185,167,255,0.09), rgba(242,240,234,0.02))`,
                display: "flex", flexDirection: "column",
              }}
            >
              <div style={{
                width: 44, height: 44,
                border: `1px solid rgba(185,167,255,0.3)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 28, color: GOLD,
              }}>
                <TrendingUp size={20} />
              </div>
              <h3 className="font-display" style={{
                fontSize: 22, fontWeight: 700, color: CREAM, marginBottom: 14, letterSpacing: "-0.03em",
              }}>
                Verdict-Driven Output
              </h3>
              <p className="font-editorial" style={{
                fontSize: 16,
                color: "rgba(242,240,234,0.45)", lineHeight: 1.65,
                fontWeight: 400,
              }}>
                No more ambiguous summaries. three AI delivers a defensible position — with the
                chain of reasoning fully visible and auditable.
              </p>
            </motion.div>
          </InView>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SECURITY
───────────────────────────────────────── */
function SecuritySection() {
  const pillars = [
    { icon: <Lock size={16} />, label: "Zero-Leakage Architecture" },
    { icon: <ShieldCheck size={16} />, label: "SOC2 Type II Ready" },
    { icon: <Shield size={16} />, label: "End-to-End Encryption" },
    { icon: <Globe size={16} />, label: "Local Execution Mode" },
  ];

  return (
    // Added className "light-section" here
    <section id="security" className="light-section" style={{
      background: CREAM, color: INK,
      padding: "clamp(80px, 12vw, 140px) 24px",
      borderTop: `1px solid rgba(15,14,11,0.1)`,
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
        <InView>
          <div style={{
            width: 64, height: 64,
            border: `1px solid rgba(15,14,11,0.15)`,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 36px",
          }}>
            <Lock size={24} color={INK} />
          </div>
          <h2 className="font-display" style={{
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 800, letterSpacing: "-0.04em",
            color: INK, marginBottom: 24, lineHeight: 0.98,
          }}>
            Absolute Data<br />
            Sovereignty.
          </h2>
          <p className="font-editorial" style={{
            fontSize: 20,
            color: "rgba(15,14,11,0.5)", maxWidth: 560, margin: "0 auto 56px",
            lineHeight: 1.65,
            fontWeight: 400,
          }}>
            Enterprise financial decisions require uncompromising privacy. three AI operates on a
            strict zero-leakage architecture — your data, never used to train public models.
          </p>
        </InView>

        <InView delay={0.15}>
          <div
            className="security-pillars"
            style={{
              display: "flex", justifyContent: "center",
              flexWrap: "wrap", gap: 0,
              border: `1px solid rgba(15,14,11,0.12)`,
            }}
          >
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ background: "rgba(15,14,11,0.04)" }}
                style={{
                  padding: "24px 36px",
                  display: "flex", alignItems: "center", gap: 10,
                  borderRight: i < pillars.length - 1 ? `1px solid rgba(15,14,11,0.12)` : "none",
                  transition: "background 0.25s",
                }}
              >
                <span style={{ color: GOLD }}>{p.icon}</span>
                <span className="font-mono" style={{
                  fontSize: 10, letterSpacing: "0.16em",
                  textTransform: "uppercase", color: INK,
                }}>
                  {p.label}
                </span>
              </motion.div>
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────── */
function TestimonialSection() {
  const testimonials = [
    {
      quote: "The recursive refinement alone has replaced three layers of analyst review. We ship strategy 60% faster.",
      name: "Marcus Webb",
      role: "Head of Strategy — Global FinTech",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    {
      quote: "three AI surfaces risks in our M&A pipeline we simply weren't seeing. The branching logic is like having a war room available 24/7.",
      name: "Priya Nair",
      role: "Managing Director — Vertex Capital",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
    },
    {
      quote: "Data sovereignty wasn't optional for us. three AI was the only system our compliance team approved on first review.",
      name: "Thomas Brandt",
      role: "GC — Meridian Law LLP",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    },
  ];

  return (
    <section
      className="testimonials-section"
      style={{
        background: INK,
        padding: "100px 40px",
        borderTop: "1px solid rgba(242,240,234,0.08)",
        borderBottom: "1px solid rgba(242,240,234,0.08)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <InView>
          <h2 className="font-display" style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            color: CREAM, marginBottom: 64,
            letterSpacing: "-0.03em",
          }}>
            What the room thinks.
          </h2>
        </InView>

        <div
          className="testimonial-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}
        >
          {testimonials.map((t, i) => (
            <InView key={i} delay={i * 0.1}>
              <motion.div
                className="bento-card testimonial-card"
                whileHover={{ y: -3 }}
                style={{
                  padding: "44px 36px",
                  background: "rgba(242,240,234,0.02)",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  minHeight: 280,
                  transition: "all 0.3s",
                }}
              >
                <blockquote className="font-editorial" style={{
                  fontSize: 18,
                  color: "rgba(242,240,234,0.7)", lineHeight: 1.65,
                  marginBottom: 36,
                  fontWeight: 400,
                }}>
                  "{t.quote}"
                </blockquote>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div className="img-wrap" style={{
                    width: 44, height: 44, borderRadius: "50%", overflow: "hidden",
                    flexShrink: 0,
                  }}>
                    <img src={t.img} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <p className="font-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: CREAM, textTransform: "uppercase" }}>
                      {t.name}
                    </p>
                    <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: MUTED, textTransform: "uppercase" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CTA
───────────────────────────────────────── */
function CTASection() {
  return (
    <section style={{
      position: "relative",
      overflow: "hidden",
      minHeight: 540,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1485628390555-1a7bd503f9fe?w=1400&q=80"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(15,14,11,0.9) 0%, rgba(15,14,11,0.72) 100%)",
        }} />
      </div>

      <div className="cta-inner" style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "80px 40px", width: "100%" }}>
        <InView>
          <p className="font-mono" style={{
            fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase",
            color: GOLD, marginBottom: 24,
          }}>
            Precision AI for Billion-Dollar financial Decisions
          </p>
          <h2 className="font-display" style={{
            fontSize: "clamp(40px, 7vw, 80px)",
            fontWeight: 800, letterSpacing: "-0.04em",
            color: CREAM, lineHeight: 0.96, marginBottom: 36,
          }}>
            Ready to think<br />
            at scale?
          </h2>

          <div className="cta-actions" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 40 }}>
            <a href="/pricing">
            <button className="btn-primary">
              Contact Sales <ArrowUpRight size={14} />
            </button>
          </a>
          </div>
        </InView>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
function Footer() {
  // UPDATED: Now an array of objects linking to exact paths for the footer
  return (
    <footer
      className="footer-section"
      style={{
        background: INK,
        borderTop: "1px solid rgba(242,240,234,0.08)",
        padding: "80px 40px 40px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="footer-grid footer-main"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 72,
            paddingBottom: 64,
            borderBottom: "1px solid rgba(242,240,234,0.08)",
          }}
        >  
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
            <img src="/logosix.png" alt="three AI logo" className="h-[20px] w-15 mt-5 nav-logo" />
          </motion.div>
        </div></a>


            <p className="font-editorial" style={{
              fontSize: 15,
              color: "rgba(242,240,234,0.35)", lineHeight: 1.7,
              maxWidth: 320, marginBottom: 32,
              fontWeight: 400,
            }}>
              The decision engine built for the modern enterprise. We think through so you can do.
            </p>
            <a href="/signin">
            <button className="btn-primary" style={{ fontSize: 10, padding: "11px 24px" }}>
              Get Started <ArrowUpRight size={12} />
            </button></a>
          </div>

          {[
            { 
              heading: "Product", 
              links: [
                { name: "Decision Engine", path: "#product" }, 
                { name: "Aside AI UI", path: "#solutions" }, 
                { name: "Security", path: "#security" }, 
                { name: "Pricing", path: "/pricing" }
              ] 
            },
            { 
              heading: "Solutions", 
              links: [
                { name: "For Finance", path: "#solutions" }, 
                { name: "For Corporate", path: "#solutions" }, 
                { name: "Enterprise", path: "#solutions" }
              ] 
            },
            { 
              heading: "Company", 
              links: [
                { name: "About", path: "#product" }, 
                { name: "Careers", path: "/" }, 
                { name: "Partnerships", path: "/" }, 
                { name: "Blog", path: "/blog" }, 
                { name: "Forum", path: "/" }
              ] 
            },
          ].map(col => (
            <div key={col.heading}>
              <h4 className="font-mono" style={{
                fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                color: MUTED, marginBottom: 28,
              }}>
                {col.heading}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
                {col.links.map(link => (
                  <li key={link.name}>
                    {/* UPDATED: Mapping the new object array for footer */}
                    <a
                      href={link.path}
                      className="font-editorial"
                      style={{
                        fontSize: 15,
                        color: "rgba(242,240,234,0.4)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                        fontWeight: 400,
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = CREAM}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(242,240,234,0.4)"}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="footer-bottom"
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 16,
          }}
        >
          <div className="legal-links" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {["Terms of Service", "Privacy Policy"].map(link => (
              <a
                key={link}
                href="/pandt"
                className="font-mono"
                style={{
                  fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase",
                  color: MUTED, textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = CREAM}
                onMouseLeave={e => e.currentTarget.style.color = MUTED}
              >
                {link}
              </a>
            ))}
          </div>
          <p className="font-mono" style={{
            fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED,
          }}>
            © Copyright {new Date().getFullYear()} three AI Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
