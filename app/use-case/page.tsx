"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Zap,
  Network,
  GitBranch,
  Target,
  TrendingUp,
  Shield,
  Cpu,
  Users,
  BarChart3,
  Briefcase,
  Building2,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  AlertTriangle,
  FlaskConical,
  DollarSign,
  Globe,
  Layers,
  Lock,
  Menu,
  X,
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
   SHARED EASING
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
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const audiences = [
  {
    icon: Briefcase,
    role: "Founders & CEOs",
    tag: "High-Stakes Execution",
    description:
      "three AI helps leaders stress-test major business calls, map downside exposure, and move with clearer conviction.",
    examples: ["Pivot vs. stay-the-course", "Fundraising strategy", "Executive hiring decisions"],
  },
  {
    icon: Cpu,
    role: "CTOs & Engineering Leads",
    tag: "Technical Strategy",
    description:
      "For complex technical bets where architecture, reliability, cost, and timing all matter at once.",
    examples: ["Build vs. buy", "Migration planning", "Platform architecture decisions"],
  },
  {
    icon: BarChart3,
    role: "Strategy & Operations",
    tag: "Competitive Clarity",
    description:
      "Used to model strategic moves, compare paths, and create more defensible operational decisions.",
    examples: ["Market entry", "Pricing changes", "Resource allocation"],
  },
  {
    icon: Shield,
    role: "Risk & Compliance",
    tag: "Regulated Environments",
    description:
      "Helps regulated teams document trade-offs, reduce ambiguity, and support audit-ready decision logic.",
    examples: ["Compliance pathways", "Vendor risk", "Governance decisions"],
  },
  {
    icon: Layers,
    role: "Product Leaders",
    tag: "Roadmap Decisions",
    description:
      "Designed for prioritisation calls where timing, dependencies, and business impact all compete.",
    examples: ["Feature prioritisation", "Release planning", "Platform trade-offs"],
  },
  {
    icon: DollarSign,
    role: "Investors & Finance Leads",
    tag: "Capital Allocation",
    description:
      "Useful for evaluating upside, downside, and timing across complex capital deployment decisions.",
    examples: ["Portfolio risk", "M&A diligence", "Capital sequencing"],
  },
];

const useCases = [
  {
    icon: Globe,
    title: "Market Entry Decisions",
    industry: "Strategy",
    problem:
      "Multiple entry paths, incomplete information, and no clear way to compare trade-offs.",
    howThinkAI:
      "three AI branches each option, stress-tests timing and execution risk, and returns a ranked decision path.",
    outcome:
      "A cleaner strategic verdict in minutes instead of weeks of fragmented analysis.",
  },
  {
    icon: Cpu,
    title: "Tech Stack Migration",
    industry: "Engineering",
    problem:
      "A technical migration carries hidden dependencies, downtime risk, and long-term architecture consequences.",
    howThinkAI:
      "The engine evaluates competing migration paths and highlights operational risk, reversibility, and complexity.",
    outcome:
      "A migration decision leadership can defend with more confidence.",
  },
  {
    icon: TrendingUp,
    title: "Fundraising Strategy",
    industry: "Finance",
    problem:
      "Raise now, wait, or explore alternatives — each option changes dilution, runway, and signal risk.",
    howThinkAI:
      "three AI compares capital scenarios, weights their trade-offs, and identifies the conditions that change the call.",
    outcome:
      "Sharper fundraising decisions with clearer timing and stronger negotiation posture.",
  },
  {
    icon: Users,
    title: "Hiring & Org Design",
    industry: "Operations",
    problem:
      "Leadership hires and team structure changes create cost, culture, and execution trade-offs.",
    howThinkAI:
      "The engine maps organisational impact across burn, ramp time, capability gaps, and strategic timing.",
    outcome:
      "A more structured people decision instead of a purely intuition-led one.",
  },
  {
    icon: FlaskConical,
    title: "Build vs. Buy vs. Partner",
    industry: "Product",
    problem:
      "A capability gap exists, but each path creates very different operating and strategic implications.",
    howThinkAI:
      "three AI compares total cost, integration complexity, speed, and dependency risk across all options.",
    outcome:
      "A product decision the broader leadership team can align around.",
  },
  {
    icon: AlertTriangle,
    title: "M&A Risk Assessment",
    industry: "Corporate Strategy",
    problem:
      "A deal has upside, but the risk picture is uneven and difficult to quantify clearly.",
    howThinkAI:
      "The engine weighs integration risk, regulatory exposure, concentration risk, and strategic fit in one framework.",
    outcome:
      "More defensible go / no-go decisions for acquisition and diligence teams.",
  },
];

const steps = [
  {
    number: "01",
    icon: Lightbulb,
    title: "Input your decision context",
    description:
      "Describe the decision, your constraints, the available options, and what success or failure looks like.",
    detail:
      "Natural language in. No rigid templates required.",
  },
  {
    number: "02",
    icon: GitBranch,
    title: "The engine branches and stress-tests",
    description:
      "The system generates competing decision paths and tests the logic behind each one.",
    detail:
      "It challenges assumptions before presenting an answer.",
  },
  {
    number: "03",
    icon: Network,
    title: "Trade-offs are scored and visualised",
    description:
      "Every branch is evaluated across upside, downside, complexity, and execution cost.",
    detail:
      "The result is a clearer map of risk, not a generic summary.",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Verdict delivered. You execute.",
    description:
      "You receive a clearer recommendation with explicit conditions for action, pause, or review.",
    detail:
      "The output is designed to support execution, not just discussion.",
  },
];

const stats = [
  { value: "40hrs", label: "Saved per major strategic decision" },
  { value: "3×", label: "More edge-case risks surfaced" },
  { value: "<10m", label: "From input to defensible verdict" },
  { value: "100%", label: "Data isolation — zero model training" },
];

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
function NavBar() {
  const [open, setOpen] = useState(false);

  const items = [
    { label: "Home", href: "/" },
    { label: "The Engine", href: "/#engine" },
    { label: "Refinement", href: "/#refinement" },
    { label: "Use Cases", href: "/use-case" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
        className="nav-shell"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          background: "rgba(242,240,234,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(15,14,11,0.08)",
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

        <nav className="desktop-nav">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="nav-link"
              style={{
                color: item.label === "Use Cases" ? INK : "rgba(15,14,11,0.58)",
                fontWeight: item.label === "Use Cases" ? 600 : 500,
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="desktop-auth">
          <a href="/signin?mode=login" className="nav-link">
            Sign In
          </a>
          <a href="/signin?mode=signup">
            <button className="btn-dark btn-sm">
              Get Started<ArrowUpRight size={12} />
            </button>
          </a>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="mobile-drawer"
          >
            <div className="mobile-drawer-inner">
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="nav-link mobile-nav-link"
                  onClick={() => setOpen(false)}
                  style={{
                    color: item.label === "Use Cases" ? INK : "rgba(15,14,11,0.76)",
                    fontWeight: item.label === "Use Cases" ? 600 : 500,
                  }}
                >
                  {item.label}
                </a>
              ))}

              <div className="mobile-divider" />

              <a href="/signin?mode=login" className="nav-link mobile-nav-link" onClick={() => setOpen(false)}>
                Sign In
              </a>

              <a href="/signin?mode=signup" onClick={() => setOpen(false)}>
                <button className="btn-dark mobile-full-width">
                  Contact Sales <ArrowUpRight size={12} />
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
function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "168px 24px 104px",
        background: `linear-gradient(to bottom, ${CREAM} 0%, ${PANEL_2} 100%)`,
        borderBottom: "1px solid rgba(15,14,11,0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(980px, 90vw)",
          height: 420,
          background: "rgba(185,167,255,0.12)",
          filter: "blur(120px)",
          borderRadius: "999px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 2 }}>
      

        <div className="hero-layout">
          <FadeUp delay={0.06}>
            <div>
              <h1 className="font-display hero-title">
                Built for teams
                <br />
                who decide.
              </h1>

              <p className="font-editorial hero-copy">
                three AI is not a chatbot. It is a structured decision engine for
                leaders, operators, and teams working through complex financial choices with
                real business consequences.
              </p>

              <div className="hero-actions">
                <a href="/signin?mode=signup">
                  <button className="btn-dark">
                    Start Free <ChevronRight size={14} />
                  </button>
                </a>
                <a href="#features">
                  <button className="btn-light">
                    Explore Use Cases
                  </button>
                </a>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.12}>
            <div className="hero-panel">
              <p className="font-mono hero-panel-label">Designed for high-consequence work</p>

              <div className="hero-panel-list">
                {[
                  "Strategic decisions with multiple viable paths.",
                  "Technical and operational trade-offs that need clearer logic.",
                  "Executive environments where confidence and accountability matter.",
                ].map((item, i) => (
                  <div key={i} className="hero-panel-item">
                    <span className="hero-panel-check">
                      <CheckCircle size={15} />
                    </span>
                    <p className="font-editorial">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   WHO IT'S FOR
───────────────────────────────────────── */
function WhoSection() {
  return (
    <section className="section-shell">
      <div className="container-wide">
        <FadeUp>
          <div className="section-head">
            <p className="section-kicker">Who It&apos;s For</p>
            <h2 className="section-title">Six roles. One engine.</h2>
            <p className="section-copy">
              Built for people accountable for decisions that carry cost, timing,
              and reputational consequences.
            </p>
          </div>
        </FadeUp>

        <div className="card-grid card-grid-three">
          {audiences.map((a, i) => (
            <FadeUp key={a.role} delay={i * 0.06}>
              <div className="soft-card">
                <div className="soft-card-top">
                  <div className="icon-box">
                    <a.icon size={18} color={LILAC} />
                  </div>
                  <span className="mini-pill">{a.tag}</span>
                </div>

                <div>
                  <h3 className="card-title">{a.role}</h3>
                  <p className="card-copy">{a.description}</p>
                </div>

                <ul className="micro-list">
                  {a.examples.map((ex) => (
                    <li key={ex}>
                      <span className="micro-dot" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   WHAT FOR
───────────────────────────────────────── */
function WhatForSection() {
  return (
    <section className="section-shell section-panel" id="features">
      <div className="container-wide">
        <FadeUp>
          <div className="section-head">
            <p className="section-kicker">What It&apos;s For</p>
            <h2 className="section-title">The decisions that keep financial teams up at night.</h2>
            <p className="section-copy">
              These are not casual prompts. They are business financial decisions with multiple
              paths, uneven trade-offs, and real downside for getting them wrong.
            </p>
          </div>
        </FadeUp>

        <div className="card-grid card-grid-two">
          {useCases.map((uc, i) => (
            <FadeUp key={uc.title} delay={i * 0.05}>
              <div className="case-card">
                <div className="case-head">
                  <div className="icon-box">
                    <uc.icon size={18} color={LILAC} />
                  </div>
                  <div>
                    <p className="case-industry">{uc.industry}</p>
                    <h3 className="card-title">{uc.title}</h3>
                  </div>
                </div>

                <div className="case-sections">
                  <div>
                    <p className="case-label">The Problem</p>
                    <p className="card-copy">{uc.problem}</p>
                  </div>

                  <div className="case-rule" />

                  <div>
                    <p className="case-label">How three AI Solves It</p>
                    <p className="card-copy">{uc.howThinkAI}</p>
                  </div>

                  <div className="case-rule" />

                  <div className="outcome-row">
                    <CheckCircle size={15} color={LILAC} />
                    <p className="outcome-copy">{uc.outcome}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────── */
function HowItWorksSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="section-shell">
      <div className="container-wide">
        <FadeUp>
          <div className="section-head section-head-center">
            <p className="section-kicker">How It Works</p>
            <h2 className="section-title">From ambiguity to execution.</h2>
            <p className="section-copy">
              The system is designed to feel simple on the surface while doing
              structured analysis underneath.
            </p>
          </div>
        </FadeUp>

        <div className="timeline-shell">
          <div className="timeline-line">
            <motion.div style={{ height: lineHeight }} className="timeline-line-fill" />
          </div>

          <div className="timeline-list">
            {steps.map((step, i) => (
              <FadeUp key={step.number} delay={i * 0.08}>
                <div className={`timeline-row ${i % 2 === 1 ? "timeline-row-reverse" : ""}`}>
                  <div className={`timeline-text ${i % 2 === 1 ? "timeline-text-left" : ""}`}>
                    <span className="timeline-step">Step {step.number}</span>
                    <h3 className="timeline-title">{step.title}</h3>
                    <p className="timeline-copy">{step.description}</p>
                    <p className="timeline-detail">{step.detail}</p>
                  </div>

                  <div className="timeline-node">
                    <step.icon size={18} color={LILAC} />
                  </div>

                  <div className="timeline-spacer" />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   STAT STRIP
───────────────────────────────────────── */
function StatStrip() {
  return (
    <section className="stat-strip">
      <div className="container-wide">
        <div className="stat-grid">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.06}>
              <div className="stat-item">
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CTA
───────────────────────────────────────── */
function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-glow" />
      <div className="cta-inner">
        <FadeUp>
          <p className="cta-kicker">Precision AI for consequential decisions</p>
          <h2 className="cta-title">
            Your next high-stakes
            <br />
            decision starts here.
          </h2>
          <p className="cta-copy">
            Stop deliberating in the dark. Give three AI the context and move
            forward with a clearer verdict.
          </p>

          <div className="cta-actions">
            <a href="/signin?mode=signup">
              <button className="btn-cream">
                Start Building Decisions <ChevronRight size={14} />
              </button>
            </a>
            <a href="/pricing">
              <button className="btn-outline-dark" id="contactsales">
                Talk to Sales <ArrowRight size={14} />
              </button>
            </a>
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
export default function UseCasesPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: CREAM,
        color: INK,
        fontFamily: "'Inter', sans-serif",
      }}
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

        .container-wide {
          width: min(1240px, calc(100% - 48px));
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

        .btn-dark,
        .btn-light,
        .btn-cream,
        .btn-outline-dark {
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

        .btn-cream {
          background: ${CREAM};
          color: ${INK};
          border: 1px solid rgba(242,240,234,0.16);
        }

        .btn-cream:hover {
          background: ${LILAC};
          color: ${CREAM};
          border-color: rgba(185,167,255,0.28);
        }

        .btn-outline-dark {
          background: transparent;
          color: ${CREAM};
          border: 1px solid rgba(242,240,234,0.18);
        }

        .btn-outline-dark:hover {
          background: rgba(242,240,234,0.06);
          border-color: rgba(185,167,255,0.34);
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

        .mobile-drawer {
          position: fixed;
          top: 82px;
          left: 16px;
          right: 16px;
          z-index: 99;
          background: rgba(242,240,234,0.96);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(15,14,11,0.08);
        }

        .mobile-drawer-inner {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 20px;
        }

        .mobile-divider {
          height: 1px;
          background: rgba(15,14,11,0.08);
          margin: 4px 0;
        }

        .mobile-nav-link {
          color: rgba(15,14,11,0.76);
        }

        .mobile-full-width {
          width: 100%;
        }

        .hero-kicker,
        .section-kicker,
        .cta-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(185,167,255,0.35);
          background: rgba(185,167,255,0.08);
          margin-bottom: 26px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${LILAC};
        }

        .hero-layout {
          display: grid;
          grid-template-columns: 1.24fr 0.96fr;
          gap: 48px;
          align-items: end;
        }

        .hero-title {
          font-size: clamp(44px, 8vw, 92px);
          line-height: 0.95;
          letter-spacing: -0.045em;
          color: ${INK};
          font-weight: 800;
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        .hero-copy {
          font-size: 20px;
          line-height: 1.6;
          color: rgba(15,14,11,0.58);
          max-width: 660px;
          margin-bottom: 34px;
        }

        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .hero-panel {
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(12px);
          padding: 28px;
        }

        .hero-panel-label {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${MUTED};
          margin-bottom: 18px;
        }

        .hero-panel-list {
          display: grid;
          gap: 16px;
        }

        .hero-panel-item {
          display: grid;
          grid-template-columns: 22px 1fr;
          gap: 14px;
          align-items: start;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(15,14,11,0.08);
        }

        .hero-panel-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .hero-panel-check {
          color: ${LILAC};
          margin-top: 1px;
        }

        .hero-panel-item p {
          font-size: 16px;
          line-height: 1.55;
          color: rgba(15,14,11,0.68);
        }

        .section-shell {
          padding: 88px 24px;
          background: ${CREAM};
        }

        .section-panel {
          background: ${PANEL};
          border-top: 1px solid rgba(15,14,11,0.08);
          border-bottom: 1px solid rgba(15,14,11,0.08);
        }

        .section-head {
          margin-bottom: 48px;
        }

        .section-head-center {
          text-align: center;
        }

        .section-title {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(34px, 5vw, 58px);
          color: ${INK};
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 16px;
          max-width: 860px;
        }

        .section-head-center .section-title,
        .section-head-center .section-copy {
          margin-left: auto;
          margin-right: auto;
        }

        .section-copy {
          font-size: 18px;
          line-height: 1.65;
          color: rgba(15,14,11,0.55);
          max-width: 700px;
        }

        .card-grid {
          display: grid;
          gap: 18px;
        }

        .card-grid-three {
          grid-template-columns: repeat(3, 1fr);
        }

        .card-grid-two {
          grid-template-columns: repeat(2, 1fr);
        }

        .soft-card,
        .case-card {
          height: 100%;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(255,255,255,0.44);
          padding: 26px;
        }

        .case-card {
          background: ${PANEL_2};
        }

        .soft-card-top,
        .case-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 20px;
        }

        .case-head {
          justify-content: flex-start;
        }

        .icon-box {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(185,167,255,0.25);
          background: rgba(185,167,255,0.08);
          flex-shrink: 0;
        }

        .mini-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 10px;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(15,14,11,0.03);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.46);
          text-align: right;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: ${INK};
          letter-spacing: -0.02em;
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .card-copy {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(15,14,11,0.56);
        }

        .micro-list {
          list-style: none;
          display: grid;
          gap: 10px;
          margin-top: 20px;
        }

        .micro-list li {
          display: grid;
          grid-template-columns: 10px 1fr;
          gap: 10px;
          align-items: start;
          font-size: 13px;
          line-height: 1.55;
          color: rgba(15,14,11,0.5);
        }

        .micro-dot {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: ${LILAC};
          margin-top: 8px;
        }

        .case-industry {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${LILAC};
          margin-bottom: 6px;
        }

        .case-sections {
          display: grid;
          gap: 16px;
        }

        .case-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.34);
          margin-bottom: 8px;
        }

        .case-rule {
          height: 1px;
          background: rgba(15,14,11,0.08);
        }

        .outcome-row {
          display: grid;
          grid-template-columns: 20px 1fr;
          gap: 12px;
          align-items: start;
        }

        .outcome-copy {
          font-size: 14px;
          line-height: 1.65;
          color: rgba(15,14,11,0.7);
          font-weight: 500;
        }

        .timeline-shell {
          position: relative;
        }

        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(15,14,11,0.08);
          transform: translateX(-0.5px);
        }

        .timeline-line-fill {
          width: 100%;
          background: linear-gradient(to bottom, ${LILAC}, rgba(185,167,255,0.12));
          transform-origin: top;
        }

        .timeline-list {
          display: grid;
          gap: 56px;
        }

        .timeline-row {
          display: flex;
          align-items: flex-start;
          gap: 40px;
        }

        .timeline-row-reverse {
          flex-direction: row-reverse;
        }

        .timeline-text,
        .timeline-spacer {
          flex: 1;
        }

        .timeline-text {
          text-align: right;
        }

        .timeline-text-left {
          text-align: left;
        }

        .timeline-step {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${LILAC};
          margin-bottom: 10px;
        }

        .timeline-title {
          font-size: 21px;
          font-weight: 700;
          color: ${INK};
          letter-spacing: -0.02em;
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .timeline-copy {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(15,14,11,0.56);
          margin-bottom: 10px;
        }

        .timeline-detail {
          font-size: 13px;
          line-height: 1.7;
          color: rgba(15,14,11,0.36);
        }

        .timeline-node {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(255,255,255,0.7);
          box-shadow: 0 10px 22px rgba(15,14,11,0.05);
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        .stat-strip {
          padding: 68px 24px;
          background: ${PANEL};
          border-top: 1px solid rgba(15,14,11,0.08);
          border-bottom: 1px solid rgba(15,14,11,0.08);
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(38px, 5vw, 56px);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.04em;
          color: ${INK};
          margin-bottom: 10px;
        }

        .stat-label {
          font-size: 13px;
          line-height: 1.55;
          color: rgba(15,14,11,0.42);
          max-width: 180px;
          margin: 0 auto;
        }

        .cta-section {
          position: relative;
          overflow: hidden;
          padding: 104px 24px;
          background: ${INK};
          border-top: 1px solid rgba(242,240,234,0.08);
        }

        .cta-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(760px, 88vw);
          height: 280px;
          background: rgba(185,167,255,0.12);
          filter: blur(110px);
          border-radius: 999px;
          pointer-events: none;
        }

        .cta-inner {
          position: relative;
          z-index: 2;
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-title {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(38px, 7vw, 74px);
          line-height: 0.97;
          color: ${CREAM};
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 18px;
        }

        .cta-copy {
          font-size: 18px;
          line-height: 1.65;
          color: rgba(242,240,234,0.62);
          max-width: 620px;
          margin: 0 auto 34px;
        }

        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
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
          .hero-layout {
            grid-template-columns: 1fr;
          }

          .card-grid-three,
          .card-grid-two {
            grid-template-columns: 1fr !important;
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

          .timeline-line {
            left: 26px;
          }

          .timeline-row,
          .timeline-row-reverse {
            flex-direction: row;
            gap: 18px;
          }

          .timeline-text,
          .timeline-text-left {
            text-align: left;
          }

          .timeline-spacer {
            display: none;
          }

          .timeline-node {
            width: 44px;
            height: 44px;
          }

          .stat-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .nav-shell {
            padding: 0 16px !important;
          }

          .container-wide {
            width: min(100%, calc(100% - 32px));
          }

          .hero-actions,
          .cta-actions {
            flex-direction: column;
            width: min(100%, 340px);
            margin-inline: auto;
          }

          .hero-actions a,
          .hero-actions button,
          .cta-actions a,
          .cta-actions button {
            width: 100%;
          }

          .hero-panel,
          .soft-card,
          .case-card {
            padding: 22px;
          }

          .section-shell,
          .stat-strip,
          .cta-section,
          .footer-shell {
            padding-left: 16px;
            padding-right: 16px;
          }

          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }

          .footer-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }

        @media (max-width: 560px) {
          .hero-title,
          .section-title,
          .cta-title {
            line-height: 0.98;
          }

          .stat-grid {
            grid-template-columns: 1fr;
          }

          .mini-pill {
            text-align: left;
          }
        }
      `}</style>

      <NavBar />
      <main>
        <Hero />
        <WhoSection />
        <WhatForSection />
        <HowItWorksSection />
        <StatStrip />
        <CTA />
      </main>
      <EnterpriseFooter />
    </div>
  );
}
