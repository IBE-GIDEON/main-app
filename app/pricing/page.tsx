"use client";

import React, { useRef, useState, ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Zap,
  CheckCircle,
  Lock,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  Building2,
  Rocket,
  Shield,
  GitBranch,
  Network,
  Target,
  Clock,
  Users,
  BarChart3,
  Globe,
  Cpu,
  DollarSign,
  Star,
  Menu,
  X,
  Database,
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
  children: ReactNode;
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
   DATA
───────────────────────────────────────── */
const basicFeatures = [
  { icon: GitBranch, text: "2 decisions per day" },
  { icon: Target, text: "Basic branching — 3 decision paths per query" },
  { icon: CheckCircle, text: "Simplified verdict cards (go / stop only)" },
  { icon: Zap, text: "Standard response latency" },
  { icon: Shield, text: "Zero-leakage data isolation" },
  { icon: Database, text: "Company knowledge base RAG integration" },
  { icon: Clock, text: "5-day decision history" },
  { icon: Users, text: "Single-user workspace" },
  { icon: Network, text: "Web interface access" },
];

const mvpFeatures = [
  { icon: GitBranch, text: "Unlimited recursive branching decision engine" },
  { icon: Target, text: "Full upside & risk scoring per branch" },
  { icon: CheckCircle, text: "Verdict cards with go / stop / review conditions" },
  { icon: Network, text: "Aside AI panel — live alongside your workflow (Beta)" },
  { icon: Database, text: "Company knowledge base RAG integration" },
  { icon: Zap, text: "Next-step execution recommendations" },
  { icon: Shield, text: "Zero-leakage data isolation" },
  { icon: BarChart3, text: "Up to 50 decisions per month" },
  { icon: Clock, text: "Full decision history & audit trail" },
  { icon: Users, text: "Single-user workspace" },
  { icon: Cpu, text: "Groq-powered ultra-low latency responses" },
];

const betaFeatures = [
  { icon: GitBranch, text: "Everything in MVP, plus:" },
  { icon: Globe, text: "Slack & Jira 'Do' button — one-click execution" },
  { icon: Building2, text: "Multi-user team workspaces" },
  { icon: Network, text: "Company knowledge base RAG integration" },
  { icon: Star, text: "Multi-agent debate mode (experimental)" },
  { icon: BarChart3, text: "Unlimited decisions per month" },
  { icon: Sparkles, text: "Proactive background decision monitoring" },
  { icon: Users, text: "C-suite multiplayer sessions" },
  { icon: Shield, text: "SOC2 Type II compliance (in progress)" },
  { icon: Rocket, text: "Priority onboarding & dedicated support" },
];

const basicMarkets = [
  "Solo founders exploring AI-assisted thinking",
  "Students & researchers stress-testing ideas",
  "Early-stage operators not yet at scale",
  "Anyone curious before they commit",
];

const mvpMarkets = [
  "Founders & solo operators",
  "CTOs making architectural bets",
  "Strategy leads at Series A–C",
  "Consultants who bill by the decision",
];

const betaMarkets = [
  "Enterprise strategy teams",
  "VC firms & deal rooms",
  "Multi-department orgs",
  "Regulated industries (finance, health, legal)",
];

const compareRows = [
  { feature: "Branching decision engine", basic: true, mvp: true, beta: true },
  { feature: "Verdict cards", basic: "Basic", mvp: true, beta: true },
  { feature: "Risk & upside scoring", basic: false, mvp: true, beta: true },
  { feature: "Aside AI panel", basic: false, mvp: true, beta: true },
  { feature: "Decision history", basic: "5 days", mvp: true, beta: true },
  { feature: "Zero-leakage data isolation", basic: true, mvp: true, beta: true },
  { feature: "Decisions per month", basic: "2/day", mvp: "50", beta: "∞" },
  { feature: "Decision paths per query", basic: "3", mvp: "∞", beta: "∞" },
  { feature: "Users", basic: "1", mvp: "1", beta: "Team" },
  { feature: "Groq ultra-low latency", basic: false, mvp: true, beta: true },
  { feature: "Slack / Jira 'Do' button", basic: false, mvp: false, beta: true },
  { feature: "Company knowledge base RAG", basic: true, mvp: true, beta: true },
  { feature: "Multi-agent debate mode", basic: false, mvp: false, beta: true },
  { feature: "Background monitoring", basic: false, mvp: false, beta: true },
  { feature: "SOC2 Type II", basic: false, mvp: false, beta: true },
];

const faqs = [
  {
    q: "What exactly is three AI — is it another AI chatbot?",
    a: "No. three AI is a structured decision engine, not a chatbot. A chatbot generates text responses based on probability. three AI runs recursive branching logic — it generates multiple decision paths based on company data, stress-tests each one, scores the upside and downside exposure, and returns a verdict with explicit conditions. The output is a decision, not a conversation.",
  },
  {
    q: "What do I get on the free Basic plan?",
    a: "The Basic plan gives you 2 full decisions per day — each one runs through the engine with up to 3 branching paths and returns a simplified verdict card. It's not a watered-down demo. It's the real engine with guardrails, so you can experience structured decision-making before committing to the MVP. No credit card required.",
  },
  {
    q: "What's the difference between Basic and MVP?",
    a: "Basic caps you at 2 decisions per day, 3 decision paths per query, and simplified verdict cards with no risk scoring or audit trail. The MVP removes all those limits — you get unlimited branching depth, full upside and downside scoring, the Aside AI panel for working live alongside your workflow, and Groq-powered speed. The MVP is built for operators who rely on the engine daily.",
  },
  {
    q: "What does '50 decisions per month' mean in practice?",
    a: "Each time you submit a business problem to three AI and receive a full branching analysis with verdict, that counts as one decision. For most founders and operators, 50 decisions per month is significantly more than they'll use. Heavy power users — think strategy consultants running multiple client engagements — are the ones who'll hit that ceiling.",
  },
  {
    q: "How is my data handled? Can three AI train on my company's information?",
    a: "Never. three AI operates on a strict zero-leakage architecture. Your decision context, strategic branches, company data, and verdicts are fully isolated per account and encrypted at rest. They are never used to train any public model — Anthropic's, Groq's, or ours. This applies to all plans, including Basic.",
  },
  {
    q: "Why is Beta V2 cheaper than the MVP?",
    a: "Beta V2 is a founding-member price — a thank-you for early adopters willing to help shape the product. The $480 rate is locked in permanently for anyone who joins the waitlist and converts. When V2 launches publicly, it will be priced higher to reflect the added integrations, team features, and compute cost of the multi-agent engine.",
  },
  {
    q: "What is the 'Do button' in Beta V2?",
    a: "The Do button is the execution layer. Once three AI delivers a verdict, Beta V2 lets you approve and act in one click — drafting and sending a strategic summary to your Slack exec channel, or translating the winning decision branch into assigned Jira tickets. Think AI stops being a passive analyser and becomes an active agent.",
  },
  {
    q: "Can I use three AI for my whole team right now?",
    a: "The Basic and MVP plans are single-user workspaces. Team multiplayer functionality — shared decision rooms, role-based access, and C-suite collaborative sessions — is coming in Beta V2. You can join the waitlist today and get early access when it ships.",
  },
  {
    q: "What makes three AI different from asking ChatGPT or Claude a strategy question?",
    a: 'General LLMs give you a single confident answer based on pattern matching. They do not branch, they do not stress-test, and they do not calculate stakes. three AI\'s engine is architecturally different — it generates competing decision paths based on your company data, assigns probability and impact weights to each, surfaces edge cases the LLM would not catch, and produces a verdict with documented reasoning. It shows its work.',
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no cancellation fees, no per-seat charges. Cancel from your account dashboard at any time and your access continues until the end of the billing period. The Basic plan is free forever — nothing to cancel.",
  },
];

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
function NavBar() {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "Home", href: "/" },
    { label: "The Engine", href: "#engine" },
    { label: "Refinement", href: "#refinement" },
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
                    <img src="/logofive.PNG" alt="threeAI Logo" className="h-[30px] w-auto mt-5 nav-logo" />
                  </motion.div>
                </div></a>

        <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 34 }}>
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="nav-link"
              style={{
                textDecoration: "none",
                color: item.label === "Pricing" ? INK : "rgba(15,14,11,0.58)",
                fontWeight: item.label === "Pricing" ? 600 : 500,
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="desktop-auth" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/signin?mode=login" className="nav-link" style={{ textDecoration: "none", color: "rgba(15,14,11,0.58)" }}>
            Sign In
          </a>
          <a href="/signin?mode=signup">
            <button className="btn-dark">
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
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="nav-link"
                  style={{
                    textDecoration: "none",
                    color: item.label === "Pricing" ? INK : "rgba(15,14,11,0.75)",
                    fontWeight: item.label === "Pricing" ? 600 : 500,
                  }}
                >
                  {item.label}
                </a>
              ))}

              <div style={{ height: 1, background: "rgba(15,14,11,0.08)", margin: "6px 0" }} />

              <a href="/signin?mode=login" onClick={() => setOpen(false)} className="nav-link" style={{ textDecoration: "none", color: INK }}>
                Sign In
              </a>
              <a href="/signin?mode=signup" onClick={() => setOpen(false)}>
                <button className="btn-dark" style={{ width: "100%", marginTop: 4 }}>
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
        padding: "168px 24px 96px",
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

      <div className="hero-grid" style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <FadeUp>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              border: "1px solid rgba(185,167,255,0.35)",
              background: "rgba(185,167,255,0.08)",
              marginBottom: 28,
            }}
          >
            <DollarSign size={14} color={LILAC} />
            <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: LILAC }}>
              Transparent pricing for institutional teams
            </span>
          </div>
        </FadeUp>

        <div className="hero-layout" style={{ display: "grid", gridTemplateColumns: "1.25fr 0.95fr", gap: 48, alignItems: "end" }}>
          <FadeUp delay={0.06}>
            <div>
              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(44px, 8vw, 92px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.045em",
                  color: INK,
                  fontWeight: 800,
                  marginBottom: 24,
                  textTransform: "uppercase",
                }}
              >
                Invest in decisions,<br />
                not consultants.
              </h1>

              <p
                className="font-editorial"
                style={{
                  fontSize: 20,
                  lineHeight: 1.6,
                  color: "rgba(15,14,11,0.58)",
                  maxWidth: 660,
                  marginBottom: 34,
                }}
              >
                Start free and experience the engine firsthand. When the stakes get real,
                upgrade to the plan built for deeper reasoning, cleaner execution, and
                enterprise-grade control.
              </p>

              <div className="hero-actions" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <a href="/signin?mode=signup">
                  <button className="btn-dark">
                    Start Free <ChevronRight size={14} />
                  </button>
                </a>
                <a href="#plans">
                  <button className="btn-light">Compare Plans</button>
                </a>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.12}>
            <div
              className="hero-panel"
              style={{
                border: "1px solid rgba(15,14,11,0.08)",
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(12px)",
                padding: 28,
              }}
            >
              <p
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: MUTED,
                  marginBottom: 18,
                }}
              >
                Why teams upgrade
              </p>

              <div style={{ display: "grid", gap: 16 }}>
                {[
                  "Move from exploratory usage to production-grade decisions.",
                  "Unlock full branching depth, verdict logic, and audit history.",
                  "Match stakeholder complexity with cleaner governance.",
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "22px 1fr",
                      gap: 14,
                      alignItems: "start",
                      paddingBottom: 16,
                      borderBottom: i < 2 ? "1px solid rgba(15,14,11,0.08)" : "none",
                    }}
                  >
                    <span style={{ color: LILAC, marginTop: 1 }}>
                      <CheckCircle size={16} />
                    </span>
                    <p className="font-editorial" style={{ fontSize: 16, lineHeight: 1.55, color: "rgba(15,14,11,0.68)" }}>
                      {item}
                    </p>
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
   PRICING CARD
───────────────────────────────────────── */
function FeatureItem({
  icon: Icon,
  text,
  muted = false,
  accent = false,
}: {
  icon: any;
  text: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div
        style={{
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${accent ? "rgba(185,167,255,0.28)" : "rgba(15,14,11,0.08)"}`,
          background: accent ? "rgba(185,167,255,0.08)" : "rgba(15,14,11,0.03)",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <Icon size={14} color={accent ? LILAC : muted ? "rgba(15,14,11,0.3)" : "rgba(15,14,11,0.55)"} />
      </div>
      <span
        className="font-editorial"
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: muted ? "rgba(15,14,11,0.32)" : "rgba(15,14,11,0.66)",
          fontWeight: accent ? 500 : 400,
        }}
      >
        {text}
      </span>
    </li>
  );
}

function MarketPill({ text, accent = false, muted = false }: { text: string; accent?: boolean; muted?: boolean }) {
  return (
    <span
      style={{
        fontSize: 11.5,
        padding: "7px 11px",
        border: `1px solid ${accent ? "rgba(185,167,255,0.24)" : "rgba(15,14,11,0.08)"}`,
        background: accent ? "rgba(185,167,255,0.07)" : "rgba(15,14,11,0.03)",
        color: muted ? "rgba(15,14,11,0.26)" : accent ? INK : "rgba(15,14,11,0.5)",
        fontWeight: 500,
        display: "inline-block",
      }}
    >
      {text}
    </span>
  );
}

function PricingSection() {
  return (
    <section
      id="plans"
      style={{
        padding: "88px 24px 96px",
        background: CREAM,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <FadeUp>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: LILAC,
                marginBottom: 14,
              }}
            >
              Pricing
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(34px, 5vw, 58px)",
                color: INK,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                marginBottom: 16,
              }}
            >
              The right plan for how you decide.
            </h2>
            <p
              className="font-editorial"
              style={{
                fontSize: 18,
                lineHeight: 1.65,
                color: "rgba(15,14,11,0.55)",
                maxWidth: 700,
                margin: "0 auto",
              }}
            >
              Clean entry at the free tier. Full operating leverage at MVP. Team-scale
              coordination in Beta V2.
            </p>
          </div>
        </FadeUp>

        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, alignItems: "stretch" }}>
          {/* Basic */}
          <FadeUp delay={0.04}>
            <div className="price-card">
              <div className="price-top-rule" />
              <div className="price-inner">
                <div className="pill-neutral">
                  <Zap size={12} />
                  <span>Basic — Free for 7 days</span>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <span className="font-display" style={{ fontSize: 54, lineHeight: 1, color: INK, fontWeight: 800, letterSpacing: "-0.04em" }}>
                      $0
                    </span>
                    <span className="font-mono" style={{ fontSize: 11, color: "rgba(15,14,11,0.35)", textTransform: "uppercase", marginBottom: 7 }}>
                      / month
                    </span>
                  </div>
                  <p className="font-mono" style={{ fontSize: 10, color: "rgba(15,14,11,0.28)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>
                    No card required
                  </p>
                </div>

                <p className="body-copy">
                  Dip your toes into structured decision-making. The Basic plan gives you a real
                  taste of the engine — branching logic, verdicts, and risk framing — before you
                  commit to a full seat.
                </p>

                <div className="price-block">
                  <p className="section-label">Best for</p>
                  <div className="pill-wrap">
                    {basicMarkets.map((m) => (
                      <MarketPill key={m} text={m} />
                    ))}
                  </div>
                </div>

                <a href="/signin?mode=signup">
                  <button className="btn-soft full-btn">
                    Get Started Free <ChevronRight size={14} />
                  </button>
                </a>

                <div className="price-block">
                  <p className="section-label">What&apos;s included</p>
                  <ul className="feature-list">
                    {basicFeatures.map((f, i) => (
                      <FeatureItem key={i} icon={f.icon} text={f.text} />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* MVP */}
          <FadeUp delay={0.08}>
            <div className="price-card featured-card">
              <div className="featured-badge">Most Popular</div>
              <div className="price-top-rule featured-rule" />
              <div className="price-inner">
                <div className="pill-accent">
                  <Rocket size={12} />
                  <span>MVP — Available Now</span>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <span className="font-display" style={{ fontSize: 54, lineHeight: 1, color: INK, fontWeight: 800, letterSpacing: "-0.04em" }}>
                      $560
                    </span>
                    <span className="font-mono" style={{ fontSize: 11, color: "rgba(15,14,11,0.35)", textTransform: "uppercase", marginBottom: 7 }}>
                      / month
                    </span>
                  </div>
                  <p className="font-mono" style={{ fontSize: 10, color: "rgba(15,14,11,0.28)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>
                    Billed monthly · Cancel anytime
                  </p>
                </div>

                <p className="body-copy">
                  The full decision engine — unlimited branching logic, full risk scoring, verdict
                  cards with review triggers, and the Aside panel. Built for operators making
                  consequential decisions every week.
                </p>

                <div className="price-block">
                  <p className="section-label">Best for</p>
                  <div className="pill-wrap">
                    {mvpMarkets.map((m) => (
                      <MarketPill key={m} text={m} accent />
                    ))}
                  </div>
                </div>

                <a href="/checkout">
                  <button className="btn-dark full-btn">
                    Get Started <ChevronRight size={14} />
                  </button>
                </a>

                <div className="price-block">
                  <p className="section-label">What&apos;s included</p>
                  <ul className="feature-list">
                    {mvpFeatures.map((f, i) => (
                      <FeatureItem key={i} icon={f.icon} text={f.text} accent />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Beta */}
          <FadeUp delay={0.12}>
            <div className="price-card beta-card">
              <div className="price-top-rule" />
              <div className="beta-lock-layer">
                <div className="beta-lock-box">
                  <div className="lock-icon-wrap">
                    <Lock size={22} color="rgba(15,14,11,0.38)" />
                  </div>
                  <p className="font-mono" style={{ fontSize: 10, color: "rgba(15,14,11,0.38)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
                    Coming in Beta V2
                  </p>
                  <p className="font-editorial" style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(15,14,11,0.42)", maxWidth: 240, textAlign: "center", marginBottom: 18 }}>
                    Join the waitlist to lock in the founding price and get early access.
                  </p>
                  <button className="btn-soft">
                    Join Waitlist <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="price-inner beta-muted">
                <div className="pill-neutral">
                  <Sparkles size={12} />
                  <span>Beta V2 — Founding Price</span>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <span className="font-display" style={{ fontSize: 54, lineHeight: 1, color: "rgba(15,14,11,0.38)", fontWeight: 800, letterSpacing: "-0.04em" }}>
                      $480
                    </span>
                    <span className="font-mono" style={{ fontSize: 11, color: "rgba(15,14,11,0.25)", textTransform: "uppercase", marginBottom: 7 }}>
                      / month
                    </span>
                  </div>
                  <p className="font-mono" style={{ fontSize: 10, color: "rgba(15,14,11,0.2)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>
                    Founding member pricing
                  </p>
                </div>

                <p className="body-copy" style={{ color: "rgba(15,14,11,0.3)" }}>
                  The full V2 platform with team collaboration, live integrations, and autonomous
                  background monitoring. Built for organisations where decisions happen at scale.
                </p>

                <div className="price-block">
                  <p className="section-label">Best for</p>
                  <div className="pill-wrap">
                    {betaMarkets.map((m) => (
                      <MarketPill key={m} text={m} muted />
                    ))}
                  </div>
                </div>

                <div>
                  <button className="btn-disabled full-btn">
                    Get Started <ChevronRight size={14} />
                  </button>
                </div>

                <div className="price-block">
                  <p className="section-label">What&apos;s included</p>
                  <ul className="feature-list">
                    {betaFeatures.map((f, i) => (
                      <FeatureItem key={i} icon={f.icon} text={f.text} muted />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.16}>
          <div className="pricing-note">
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 10px rgba(34,197,94,0.35)",
                  display: "inline-block",
                }}
              />
              <p className="font-editorial" style={{ fontSize: 15, color: "rgba(15,14,11,0.6)" }}>
                <span style={{ color: INK, fontWeight: 600 }}>No contracts. No per-seat fees.</span>{" "}
                Start free, upgrade when your decisions demand it.
              </p>
            </div>
            <p className="font-editorial" style={{ fontSize: 14, color: "rgba(15,14,11,0.42)" }}>
              Questions?{" "}
              <a href="mailto:hello@thinkai.com" style={{ color: INK, textDecoration: "none", borderBottom: "1px solid rgba(15,14,11,0.18)" }} id="contactsales">
                Talk to us →
              </a>
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   COMPARE TABLE
───────────────────────────────────────── */
function renderCompareCell(value: boolean | string, accent?: boolean, muted?: boolean) {
  if (typeof value === "boolean") {
    return value ? (
      <CheckCircle size={16} color={accent ? LILAC : muted ? "rgba(15,14,11,0.24)" : "rgba(15,14,11,0.52)"} />
    ) : (
      <div style={{ width: 18, height: 1, background: "rgba(15,14,11,0.12)" }} />
    );
  }

  return (
    <span
      className="font-mono"
      style={{
        fontSize: 12,
        color: accent ? INK : muted ? "rgba(15,14,11,0.26)" : "rgba(15,14,11,0.5)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {value}
    </span>
  );
}

function CompareTable() {
  return (
    <section
      style={{
        background: PANEL,
        borderTop: "1px solid rgba(15,14,11,0.08)",
        borderBottom: "1px solid rgba(15,14,11,0.08)",
        padding: "88px 24px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <FadeUp>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: LILAC, marginBottom: 12 }}>
              Side by Side
            </p>
            <h2 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 54px)", color: INK, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 14 }}>
              What you get at each tier.
            </h2>
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <div className="compare-shell">
            <div className="compare-table">
              <div className="compare-head compare-row">
                <div className="compare-feature-head">Feature</div>
                <div className="compare-plan-head">
                  <p>Basic</p>
                  <span>Free</span>
                </div>
                <div className="compare-plan-head compare-accent-head">
                  <p>MVP</p>
                  <span>$560 / mo</span>
                </div>
                <div className="compare-plan-head compare-muted-head">
                  <p>Beta V2</p>
                  <span>$480 / mo</span>
                </div>
              </div>

              {compareRows.map((row, i) => (
                <div
                  key={row.feature}
                  className="compare-row"
                  style={{
                    background: i % 2 === 0 ? "rgba(255,255,255,0.45)" : "rgba(15,14,11,0.015)",
                  }}
                >
                  <div className="compare-feature">{row.feature}</div>
                  <div className="compare-cell">{renderCompareCell(row.basic)}</div>
                  <div className="compare-cell">{renderCompareCell(row.mvp, true)}</div>
                  <div className="compare-cell">{renderCompareCell(row.beta, false, true)}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FAQ
───────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section style={{ padding: "96px 24px", background: CREAM }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeUp>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: LILAC, marginBottom: 12 }}>
              FAQ
            </p>
            <h2 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 54px)", color: INK, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16 }}>
              Everything you need to know.
            </h2>
            <p className="font-editorial" style={{ fontSize: 17, lineHeight: 1.65, color: "rgba(15,14,11,0.5)" }}>
              Still have questions?{" "}
              <a href="mailto:hello@thinkai.com" style={{ color: INK, textDecoration: "none", borderBottom: "1px solid rgba(15,14,11,0.18)" }}>
                Email us directly →
              </a>
            </p>
          </div>
        </FadeUp>

        <div style={{ display: "grid", gap: 10 }}>
          {faqs.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.03}>
              <div
                style={{
                  border: `1px solid ${open === i ? "rgba(185,167,255,0.32)" : "rgba(15,14,11,0.08)"}`,
                  background: open === i ? "rgba(185,167,255,0.05)" : "rgba(255,255,255,0.36)",
                  transition: "all 0.25s ease",
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: "100%",
                    padding: "22px 22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    className="font-editorial"
                    style={{
                      fontSize: 15.5,
                      lineHeight: 1.5,
                      color: INK,
                      fontWeight: 500,
                    }}
                  >
                    {faq.q}
                  </span>

                  <div
                    style={{
                      width: 30,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: open === i ? LILAC : "rgba(15,14,11,0.05)",
                      color: open === i ? CREAM : "rgba(15,14,11,0.48)",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {open === i ? <Minus size={15} /> : <Plus size={15} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <div style={{ padding: "0 22px 22px" }}>
                        <div style={{ height: 1, background: "rgba(15,14,11,0.08)", marginBottom: 16 }} />
                        <p
                          className="font-editorial"
                          style={{
                            fontSize: 14.5,
                            lineHeight: 1.7,
                            color: "rgba(15,14,11,0.6)",
                          }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px",
        background: INK,
        borderTop: "1px solid rgba(242,240,234,0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(15,14,11,0.98), rgba(15,14,11,0.88))",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(760px, 88vw)",
          height: 280,
          background: "rgba(185,167,255,0.12)",
          filter: "blur(110px)",
          borderRadius: "999px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <FadeUp>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: LILAC, marginBottom: 16 }}>
            Precision AI for consequential decisions
          </p>
          <h2 className="font-display" style={{ fontSize: "clamp(38px, 7vw, 74px)", lineHeight: 0.97, color: CREAM, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 18 }}>
            Your next decision is already
            <br />
            costing you time.
          </h2>
          <p className="font-editorial" style={{ fontSize: 18, lineHeight: 1.65, color: "rgba(242,240,234,0.62)", maxWidth: 620, margin: "0 auto 34px" }}>
            Start free. No credit card, no commitment. When your decisions carry real stakes,
            one upgrade is all it takes.
          </p>

          <div className="cta-actions" style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <a href="/signin?mode=signup">
              <button className="btn-cream">
                Start Free <ChevronRight size={14} />
              </button>
            </a>
            <button className="btn-outline-dark">
              Join V2 Waitlist <ArrowRight size={14} />
            </button>
          </div>

          <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(242,240,234,0.34)", marginTop: 22 }}>
            No contracts · Cancel anytime · Data stays yours
          </p>
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
    <footer
      style={{
        background: INK,
        borderTop: "1px solid rgba(242,240,234,0.08)",
        padding: "76px 24px 34px",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, paddingBottom: 56, borderBottom: "1px solid rgba(242,240,234,0.08)" }}>
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
                       <img src="/logosix.PNG" alt="threeAI Logo" className="h-[30px] w-auto mt-5 nav-logo" />
                     </motion.div>
                   </div></a>
            <p className="font-editorial" style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(242,240,234,0.42)", maxWidth: 320, marginBottom: 24 }}>
              The decision engine built for the modern enterprise. We think through so you can do.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 10px rgba(34,197,94,0.35)",
                }}
              />
              <span className="font-mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(242,240,234,0.32)" }}>
                Systems Operational
              </span>
            </div>
          </div>

          {[
            {
              heading: "Product",
              links: [
                { label: "The Engine", href: "#engine" },
                { label: "Aside AI UI", href: "#aside" },
                { label: "Security & Trust", href: "#security" },
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
              <h4 className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginBottom: 22 }}>
                {col.heading}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="footer-link"
                      style={{
                        textDecoration: "none",
                        color: "rgba(242,240,234,0.45)",
                        fontSize: 15,
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", paddingTop: 24 }}>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(242,240,234,0.28)" }}>
            © 2026 three AI Inc. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            <a href="/pandt" className="footer-link" style={{ textDecoration: "none", color: "rgba(242,240,234,0.36)", fontSize: 13 }}>
              Privacy Policy
            </a>
            <a href="/pandt" className="footer-link" style={{ textDecoration: "none", color: "rgba(242,240,234,0.36)", fontSize: 13 }}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function PricingPage() {
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

        .nav-link {
          position: relative;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
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

        .nav-link:hover::after { width: 100%; }

        .btn-dark,
        .btn-light,
        .btn-soft,
        .btn-cream,
        .btn-outline-dark,
        .btn-disabled {
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
          border: 1px solid rgba(15,14,11,0.14);
        }

        .btn-light:hover {
          background: rgba(15,14,11,0.04);
        }

        .btn-soft {
          background: rgba(15,14,11,0.04);
          color: ${INK};
          border: 1px solid rgba(15,14,11,0.1);
        }

        .btn-soft:hover {
          background: rgba(15,14,11,0.08);
        }

        .btn-cream {
          background: ${CREAM};
          color: ${INK};
          border: 1px solid rgba(242,240,234,0.16);
        }

        .btn-cream:hover {
          background: ${LILAC};
          color: ${CREAM};
          border-color: rgba(185,167,255,0.25);
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

        .btn-disabled {
          background: rgba(15,14,11,0.04);
          color: rgba(15,14,11,0.24);
          border: 1px solid rgba(15,14,11,0.07);
          cursor: not-allowed;
        }

        .full-btn {
          width: 100%;
          margin: 2px 0 0;
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
          padding: 20px;
        }

        .price-card {
          position: relative;
          background: rgba(255,255,255,0.48);
          border: 1px solid rgba(15,14,11,0.08);
          overflow: hidden;
          height: 100%;
        }

        .featured-card {
          background: ${PANEL_2};
          border-color: rgba(185,167,255,0.26);
          box-shadow: 0 18px 60px rgba(185,167,255,0.14);
        }

        .beta-card {
          background: rgba(255,255,255,0.32);
        }

        .price-top-rule {
          height: 2px;
          background: rgba(15,14,11,0.08);
        }

        .featured-rule {
          background: linear-gradient(90deg, rgba(185,167,255,0.5), rgba(185,167,255,1));
        }

        .price-inner {
          padding: 28px;
        }

        .featured-badge {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 3;
          background: ${INK};
          color: ${CREAM};
          padding: 7px 10px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .pill-neutral,
        .pill-accent {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          margin-bottom: 24px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .pill-neutral {
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(15,14,11,0.03);
          color: rgba(15,14,11,0.62);
        }

        .pill-accent {
          border: 1px solid rgba(185,167,255,0.28);
          background: rgba(185,167,255,0.08);
          color: ${INK};
        }

        .body-copy {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(15,14,11,0.56);
          padding-top: 18px;
          border-top: 1px solid rgba(15,14,11,0.07);
          margin-bottom: 28px;
        }

        .price-block {
          margin-top: 0;
          margin-bottom: 24px;
        }

        .section-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.32);
          margin-bottom: 12px;
        }

        .pill-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .feature-list {
          list-style: none;
          display: grid;
          gap: 12px;
        }

        .beta-lock-layer {
          position: absolute;
          inset: 0;
          z-index: 2;
          backdrop-filter: blur(5px);
          background: rgba(242,240,234,0.56);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .beta-lock-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .lock-icon-wrap {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15,14,11,0.05);
          border: 1px solid rgba(15,14,11,0.08);
          margin-bottom: 14px;
        }

        .beta-muted {
          filter: grayscale(0.15);
        }

        .pricing-note {
          margin-top: 20px;
          padding: 18px 20px;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(255,255,255,0.4);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .compare-shell {
          border: 1px solid rgba(15,14,11,0.08);
          overflow: hidden;
          background: rgba(255,255,255,0.42);
        }

        .compare-table {
          width: 100%;
        }

        .compare-row {
          display: grid;
          grid-template-columns: 1.4fr 0.8fr 0.8fr 0.8fr;
          border-bottom: 1px solid rgba(15,14,11,0.06);
        }

        .compare-row:last-child {
          border-bottom: none;
        }

        .compare-head {
          background: rgba(15,14,11,0.035);
        }

        .compare-feature-head,
        .compare-feature {
          padding: 18px 18px;
        }

        .compare-feature-head {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.34);
          display: flex;
          align-items: center;
        }

        .compare-feature {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          color: rgba(15,14,11,0.62);
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .compare-plan-head,
        .compare-cell {
          padding: 18px 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .compare-plan-head {
          flex-direction: column;
          gap: 6px;
        }

        .compare-plan-head p {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.52);
        }

        .compare-plan-head span {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.3);
        }

        .compare-accent-head p,
        .compare-accent-head span {
          color: ${INK};
        }

        .compare-muted-head p {
          color: rgba(15,14,11,0.34);
        }

        .footer-link {
          transition: color 0.25s ease;
        }

        .footer-link:hover {
          color: ${CREAM} !important;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${INK}; }
        ::-webkit-scrollbar-thumb { background: rgba(242,240,234,0.22); }

        @media (max-width: 1100px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }

          .hero-layout {
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

          .compare-shell {
            overflow-x: auto;
          }

          .compare-table {
            min-width: 760px;
          }
        }

        @media (max-width: 768px) {
          .nav-shell {
            padding: 0 16px !important;
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

          .price-inner {
            padding: 24px;
          }

          .pricing-note {
            align-items: flex-start;
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
          .hero-panel {
            padding: 22px !important;
          }

          .compare-table {
            min-width: 680px;
          }

          .compare-feature,
          .compare-feature-head,
          .compare-plan-head,
          .compare-cell {
            padding: 14px 12px !important;
          }
        }
      `}</style>

      <NavBar />
      <main>
        <Hero />
        <PricingSection />
        <CompareTable />
        <FAQ />
        <CTA />
      </main>
      <EnterpriseFooter />
    </div>
  );
}