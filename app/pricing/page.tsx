"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Zap, CheckCircle, Lock, ArrowRight,
  Plus, Minus, Sparkles, Building2, Rocket, Shield,
  GitBranch, Network, Target, Clock, Users, BarChart3,
  Globe, Cpu, DollarSign, Star, Menu, X,
} from "lucide-react";

/* ─── Easing ─────────────────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1];

/* ─── FadeUp helper ──────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
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

/* ─── NavBar ─────────────────────────────────────────────────────── */
function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 mt-[-90px] z-50 flex items-center justify-between px-6 md:px-10 py-6 pointer-events-none">
        <div className="pointer-events-auto flex ml-[-25px] items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center"
          >
            <img src="/logofive.png" alt="Think AI Logo" className="h-[220px] w-[200px] font-bold" />
          </motion.div>
        </div>

        <nav className="hidden lg:flex pointer-events-auto items-center gap-11 px-8 py-3.5 w-[600px] h-[70px] rounded-full bg-black/[0.02] border border-black/[0.07] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] text-[13px] font-medium text-[#1C1B18]/55">
          <a href="/" className="hover:text-[#1C1B18] transition-colors">Home</a>
          <a href="#engine" className="hover:text-[#1C1B18] transition-colors">The Engine</a>
          <a href="#refinement" className="hover:text-[#1C1B18] transition-colors">Refinement</a>
          <a href="/use-case" className="hover:text-[#1C1B18] transition-colors">Use Cases</a>
          <a href="/pricing" className="text-[#E58A6A] font-semibold">Pricing</a>
          <a href="/blog" className="hover:text-[#1C1B18] transition-colors">Blog</a>
        </nav>

        <div className="pointer-events-auto flex items-center gap-6">
          <button className="hidden lg:block text-[13px] font-medium text-[#1C1B18]/60 hover:text-[#1C1B18] transition-colors">
            Sign In
          </button>
          <button className="hidden lg:block text-[13px] font-semibold px-6 py-2.5 rounded-full bg-black/[0.05] border border-black/[0.1] text-[#1C1B18] backdrop-blur-xl hover:bg-black/[0.09] hover:scale-105 transition-all">
            Sign Up
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-black/[0.04] border border-black/[0.08] backdrop-blur-xl text-[#1C1B18] hover:bg-black/[0.08] transition-all"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease }}
            className="fixed inset-x-4 top-[100px] z-40 lg:hidden rounded-[2rem] bg-white/80 border border-black/[0.07] backdrop-blur-3xl shadow-[0_16px_48px_rgba(0,0,0,0.1)] overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-6 gap-1 text-[15px] font-medium text-[#1C1B18]/60">
              {[
                { label: "Home", href: "/" },
                { label: "The Engine", href: "#engine" },
                { label: "Refinement", href: "#refinement" },
                { label: "Use Cases", href: "/use-case" },
                { label: "Pricing", href: "/pricing" },
                { label: "Blog", href: "/blog" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-2xl hover:bg-black/[0.04] transition-all ${label === "Pricing" ? "text-[#E58A6A] font-semibold" : "hover:text-[#D97706]"}`}
                >
                  {label}
                </a>
              ))}
              <div className="mt-4 pt-4 border-t border-black/[0.06] flex flex-col gap-3">
                <button className="text-[13px] font-medium text-[#1C1B18]/60 hover:text-[#1C1B18] transition-colors text-left px-4">
                  Sign In
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full text-[13px] font-semibold px-6 py-3 rounded-full bg-black/[0.05] border border-black/[0.1] text-[#1C1B18] hover:bg-black/[0.09] transition-all"
                >
                  Sign Up
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative pt-52 pb-20 px-4 flex flex-col items-center text-center overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#E58A6A]/[0.06] blur-[160px] rounded-[100%] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E58A6A]/10 border border-[#E58A6A]/25 text-[#D97757] text-xs font-medium mb-8"
      >
        <DollarSign className="w-3 h-3" />
        Simple, transparent pricing
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1, ease }}
        className="text-5xl md:text-7xl font-bold tracking-tight text-[#1C1B18] max-w-4xl leading-[1.05]"
      >
        Invest in decisions,<br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C1B18] via-[#E58A6A] to-[#D97757]">
          not consultants.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease }}
        className="mt-8 text-lg md:text-xl text-[#1C1B18]/45 max-w-2xl font-light leading-relaxed"
      >
        Start free and experience the engine firsthand. When the stakes get real, upgrade to the plan that matches them.
      </motion.p>
    </section>
  );
}

/* ─── Feature lists ──────────────────────────────────────────────── */
const basicFeatures = [
  { icon: GitBranch,   text: "Up to 5 decisions per month" },
  { icon: Target,      text: "Basic branching — 2 decision paths per query" },
  { icon: CheckCircle, text: "Simplified verdict cards (go / stop only)" },
  { icon: Zap,         text: "Standard response latency" },
  { icon: Shield,      text: "Zero-leakage data isolation" },
  { icon: Clock,       text: "7-day decision history" },
  { icon: Users,       text: "Single-user workspace" },
  { icon: Network,     text: "Web interface access" },
];

const mvpFeatures = [
  { icon: GitBranch,   text: "Unlimited recursive branching decision engine" },
  { icon: Target,      text: "Full upside & risk scoring per branch" },
  { icon: CheckCircle, text: "Verdict cards with go / stop / review conditions" },
  { icon: Network,     text: "Aside AI panel — live alongside your workflow" },
  { icon: Zap,         text: "Next-step execution recommendations" },
  { icon: Shield,      text: "Zero-leakage data isolation" },
  { icon: BarChart3,   text: "Up to 50 decisions per month" },
  { icon: Clock,       text: "Full decision history & audit trail" },
  { icon: Users,       text: "Single-user workspace" },
  { icon: Cpu,         text: "Groq-powered ultra-low latency responses" },
];

const betaFeatures = [
  { icon: GitBranch,  text: "Everything in MVP, plus:" },
  { icon: Globe,      text: "Slack & Jira 'Do' button — one-click execution" },
  { icon: Building2,  text: "Multi-user team workspaces" },
  { icon: Network,    text: "Company knowledge base RAG integration" },
  { icon: Star,       text: "Multi-agent debate mode (experimental)" },
  { icon: BarChart3,  text: "Unlimited decisions per month" },
  { icon: Sparkles,   text: "Proactive background decision monitoring" },
  { icon: Users,      text: "C-suite multiplayer sessions" },
  { icon: Shield,     text: "SOC2 Type II compliance (in progress)" },
  { icon: Rocket,     text: "Priority onboarding & dedicated support" },
];

const basicMarkets = ["Solo founders exploring AI-assisted thinking", "Students & researchers stress-testing ideas", "Early-stage operators not yet at scale", "Anyone curious before they commit"];
const mvpMarkets = ["Founders & solo operators", "CTOs making architectural bets", "Strategy leads at Series A–C", "Consultants who bill by the decision"];
const betaMarkets = ["Enterprise strategy teams", "VC firms & deal rooms", "Multi-department orgs", "Regulated industries (finance, health, legal)"];

/* ─── Pricing Section ────────────────────────────────────────────── */
function PricingSection() {
  return (
    <section className="pb-28 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

        {/* ── Basic / Free Card ── */}
        <FadeUp delay={0.05}>
          <div className="relative rounded-[2rem] border border-black/[0.08] bg-[#F5F4F1] overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-black/10 to-black/5" />
            <div className="p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.08] text-[#1C1B18]/45 text-[11px] font-bold uppercase tracking-widest mb-6">
                <Zap className="w-3 h-3" />
                Basic — Free Forever
              </div>

              <div className="mb-2">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-[#1C1B18] tracking-tight">$0</span>
                  <span className="text-[#1C1B18]/35 text-sm mb-2 font-medium">/ month</span>
                </div>
                <p className="text-[12px] text-[#1C1B18]/30 mt-1">No card required · Free forever</p>
              </div>

              <p className="text-[14px] text-[#1C1B18]/50 leading-relaxed mb-8 pt-4 border-t border-black/[0.05]">
                Dip your toes into structured decision-making. The Basic plan gives you a real taste of the engine — branching logic, verdicts, and risk framing — before you commit to a full seat.
              </p>

              <div className="mb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1B18]/25 mb-3">Best for</p>
                <div className="flex flex-wrap gap-2">
                  {basicMarkets.map((m) => (
                    <span key={m} className="text-[11.5px] px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.07] text-[#1C1B18]/40 font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <a href="/signin">
                <button className="w-full py-3.5 rounded-2xl bg-black/[0.06] border border-black/[0.1] text-[#1C1B18]/70 font-semibold text-[15px] hover:bg-black/[0.1] hover:text-[#1C1B18] transition-colors flex items-center justify-center gap-2 mb-8">
                  Get started free
                  <ChevronRight className="w-4 h-4" />
                </button>
              </a>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1B18]/25 mb-4">What&apos;s included</p>
                <ul className="space-y-3">
                  {basicFeatures.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-black/[0.04] border border-black/[0.07] flex items-center justify-center shrink-0">
                        <f.icon className="w-3.5 h-3.5 text-[#1C1B18]/35" />
                      </div>
                      <span className="text-[13px] text-[#1C1B18]/50">{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── MVP Card ── */}
        <FadeUp delay={0.1}>
          <div className="relative rounded-[2rem] border-2 border-[#E58A6A]/30 bg-[#FAFAF8] overflow-hidden shadow-[0_16px_48px_rgba(229,138,106,0.1)]">
            <div className="absolute top-4 right-4 z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#E58A6A] text-white shadow-[0_4px_12px_rgba(229,138,106,0.35)]">
                Most Popular
              </span>
            </div>

            <div className="h-1 w-full bg-gradient-to-r from-[#E58A6A] to-[#D97757]" />

            <div className="p-8 md:p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E58A6A]/10 border border-[#E58A6A]/25 text-[#D97757] text-[11px] font-bold uppercase tracking-widest mb-6">
                <Rocket className="w-3 h-3" />
                MVP — Available Now
              </div>

              <div className="mb-2">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-[#1C1B18] tracking-tight">$560</span>
                  <span className="text-[#1C1B18]/35 text-sm mb-2 font-medium">/ month</span>
                </div>
                <p className="text-[12px] text-[#1C1B18]/30 mt-1">Billed monthly · Cancel anytime</p>
              </div>

              <p className="text-[14px] text-[#1C1B18]/55 leading-relaxed mb-8 pt-4 border-t border-black/[0.05]">
                The full three AI decision engine — unlimited branching logic, full risk scoring, verdict cards with review triggers, and the Aside panel. Built for operators who make consequential decisions every week and need more than a chatbot.
              </p>

              <div className="mb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1B18]/25 mb-3">Best for</p>
                <div className="flex flex-wrap gap-2">
                  {mvpMarkets.map((m) => (
                    <span key={m} className="text-[11.5px] px-3 py-1 rounded-full bg-[#E58A6A]/8 border border-[#E58A6A]/20 text-[#D97757] font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <a href="/signin">
                <button className="w-full py-3.5 rounded-2xl bg-[#E58A6A] text-white font-semibold text-[15px] hover:bg-[#D97757] transition-colors flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(229,138,106,0.25)] mb-8">
                  Get started
                  <ChevronRight className="w-4 h-4" />
                </button>
              </a>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1B18]/25 mb-4">What&apos;s included</p>
                <ul className="space-y-3">
                  {mvpFeatures.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-[#E58A6A]/10 border border-[#E58A6A]/20 flex items-center justify-center shrink-0">
                        <f.icon className="w-3.5 h-3.5 text-[#E58A6A]" />
                      </div>
                      <span className="text-[13px] text-[#1C1B18]/60">{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── Beta V2 Card (blurred / locked) ── */}
        <FadeUp delay={0.2}>
          <div className="relative rounded-[2rem] border border-black/[0.07] bg-[#F2F1ED] overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-black/10 to-black/5" />

            <div className="absolute inset-0 z-20 rounded-[2rem] backdrop-blur-[6px] bg-[#F2F1ED]/60 flex flex-col items-center justify-center gap-4 pointer-events-none">
              <div className="w-14 h-14 rounded-2xl bg-[#1C1B18]/[0.06] border border-black/[0.08] flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#1C1B18]/30" />
              </div>
              <div className="text-center px-8">
                <p className="text-[13px] font-semibold text-[#1C1B18]/40 mb-1">Coming in Beta V2</p>
                <p className="text-[11.5px] text-[#1C1B18]/25 leading-relaxed max-w-[220px] mx-auto">
                  Join the waitlist to get early access and lock in the founding price.
                </p>
              </div>
              <div className="pointer-events-auto">
                <button className="h-10 px-6 rounded-full border border-black/[0.12] text-[#1C1B18]/50 text-[13px] font-medium hover:bg-black/[0.04] hover:text-[#1C1B18]/70 transition-all flex items-center gap-2">
                  Join waitlist
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-8 select-none pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.08] text-[#1C1B18]/35 text-[11px] font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3 h-3" />
                Beta V2 — Founding Price
              </div>

              <div className="mb-2">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-[#1C1B18]/40 tracking-tight">$480</span>
                  <span className="text-[#1C1B18]/25 text-sm mb-2 font-medium">/ month</span>
                </div>
                <p className="text-[12px] text-[#1C1B18]/20 mt-1">Early-access pricing · Locked for founding members</p>
              </div>

              <p className="text-[14px] text-[#1C1B18]/30 leading-relaxed mb-8 pt-4 border-t border-black/[0.05]">
                The full V2 platform with team collaboration, live integrations, and autonomous background monitoring. Built for organisations where decisions happen at scale across multiple stakeholders.
              </p>

              <div className="mb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1B18]/20 mb-3">Best for</p>
                <div className="flex flex-wrap gap-2">
                  {betaMarkets.map((m) => (
                    <span key={m} className="text-[11.5px] px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.06] text-[#1C1B18]/25 font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full py-3.5 rounded-2xl bg-black/[0.05] border border-black/[0.06] text-[#1C1B18]/20 font-semibold text-[15px] flex items-center justify-center gap-2 mb-8 cursor-not-allowed">
                Get started
                <ChevronRight className="w-4 h-4" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1B18]/20 mb-4">What&apos;s included</p>
                <ul className="space-y-3">
                  {betaFeatures.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-black/[0.03] border border-black/[0.06] flex items-center justify-center shrink-0">
                        <f.icon className="w-3.5 h-3.5 text-[#1C1B18]/20" />
                      </div>
                      <span className={`text-[13px] ${i === 0 ? "text-[#1C1B18]/30 font-semibold" : "text-[#1C1B18]/25"}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeUp>

      </div>

      <FadeUp delay={0.3}>
        <div className="mt-8 p-6 rounded-2xl border border-black/[0.05] bg-[#F5F4F1] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <p className="text-[13px] text-[#1C1B18]/50">
              <span className="text-[#1C1B18] font-semibold">No contracts. No per-seat fees.</span> Start free, upgrade when your decisions demand it.
            </p>
          </div>
          <p className="text-[12px] text-[#1C1B18]/30 shrink-0">Questions? <a href="mailto:hello@thinkai.com" className="text-[#E58A6A] hover:underline" id="contactsales">Talk to us →</a></p>
        </div>
      </FadeUp>
    </section>
  );
}

/* ─── Comparison table ───────────────────────────────────────────── */
const compareRows = [
  { feature: "Branching decision engine",     basic: true,      mvp: true,  beta: true  },
  { feature: "Verdict cards",                  basic: "Basic",   mvp: true,  beta: true  },
  { feature: "Risk & upside scoring",          basic: false,     mvp: true,  beta: true  },
  { feature: "Aside AI panel",                 basic: false,     mvp: true,  beta: true  },
  { feature: "Decision history",               basic: "7 days",  mvp: true,  beta: true  },
  { feature: "Zero-leakage data isolation",    basic: true,      mvp: true,  beta: true  },
  { feature: "Decisions per month",            basic: "5",       mvp: "50",  beta: "∞"   },
  { feature: "Decision paths per query",       basic: "2",       mvp: "∞",   beta: "∞"   },
  { feature: "Users",                          basic: "1",       mvp: "1",   beta: "Team"},
  { feature: "Groq ultra-low latency",         basic: false,     mvp: true,  beta: true  },
  { feature: "Slack / Jira 'Do' button",       basic: false,     mvp: false, beta: true  },
  { feature: "Company knowledge base RAG",     basic: false,     mvp: false, beta: true  },
  { feature: "Multi-agent debate mode",        basic: false,     mvp: false, beta: true  },
  { feature: "Background monitoring",          basic: false,     mvp: false, beta: true  },
  { feature: "SOC2 Type II",                   basic: false,     mvp: false, beta: true  },
];

function CompareTable() {
  return (
    <section className="py-24 border-t border-black/[0.05] bg-[#F5F4F1]">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#E58A6A] mb-3">Side by Side</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C1B18] tracking-tight">What you get at each tier.</h2>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="rounded-[2rem] border border-black/[0.06] overflow-hidden bg-[#FAFAF8]">
            <div className="grid grid-cols-4 border-b border-black/[0.06] bg-[#F2F1ED]">
              <div className="p-5 text-[11px] font-bold uppercase tracking-widest text-[#1C1B18]/30">Feature</div>
              <div className="p-5 text-center">
                <p className="text-[12px] font-bold text-[#1C1B18]/40 uppercase tracking-widest">Basic</p>
                <p className="text-[11px] text-[#1C1B18]/25 font-medium mt-0.5">Free</p>
              </div>
              <div className="p-5 text-center">
                <p className="text-[12px] font-bold text-[#E58A6A] uppercase tracking-widest">MVP</p>
                <p className="text-[11px] text-[#1C1B18]/30 font-medium mt-0.5">$560 / mo</p>
              </div>
              <div className="p-5 text-center">
                <p className="text-[12px] font-bold text-[#1C1B18]/30 uppercase tracking-widest">Beta V2</p>
                <p className="text-[11px] text-[#1C1B18]/20 font-medium mt-0.5">$480 / mo</p>
              </div>
            </div>

            {compareRows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 border-b border-black/[0.04] last:border-b-0 ${i % 2 === 0 ? "bg-[#FAFAF8]" : "bg-[#F7F6F3]"}`}
              >
                <div className="p-4 text-[13px] text-[#1C1B18]/55 font-medium">{row.feature}</div>
                <div className="p-4 flex items-center justify-center">
                  {typeof row.basic === "boolean" ? (
                    row.basic
                      ? <CheckCircle className="w-4 h-4 text-[#1C1B18]/30" />
                      : <div className="w-4 h-px bg-black/10 rounded-full" />
                  ) : (
                    <span className="text-[13px] font-semibold text-[#1C1B18]/40">{row.basic}</span>
                  )}
                </div>
                <div className="p-4 flex items-center justify-center">
                  {typeof row.mvp === "boolean" ? (
                    row.mvp
                      ? <CheckCircle className="w-4 h-4 text-[#E58A6A]" />
                      : <div className="w-4 h-px bg-black/15 rounded-full" />
                  ) : (
                    <span className="text-[13px] font-semibold text-[#E58A6A]">{row.mvp}</span>
                  )}
                </div>
                <div className="p-4 flex items-center justify-center">
                  {typeof row.beta === "boolean" ? (
                    row.beta
                      ? <CheckCircle className="w-4 h-4 text-[#1C1B18]/20" />
                      : <div className="w-4 h-px bg-black/10 rounded-full" />
                  ) : (
                    <span className="text-[13px] font-semibold text-[#1C1B18]/25">{row.beta}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────────── */
const faqs = [
  {
    q: "What exactly is three AI — is it another AI chatbot?",
    a: "No. three AI is a structured decision engine, not a chatbot. A chatbot generates text responses based on probability. three AI runs recursive branching logic — it generates multiple decision paths based on company data, stress-tests each one, scores the upside and downside exposure, and returns a verdict with explicit conditions. The output is a decision, not a conversation.",
  },
  {
    q: "What do I get on the free Basic plan?",
    a: "The Basic plan gives you 5 full decisions per month — each one runs through the engine with up to 2 branching paths and returns a simplified verdict card. It's not a watered-down demo. It's the real engine with guardrails, so you can experience structured decision-making before committing to the MVP. No credit card required.",
  },
  {
    q: "What's the difference between Basic and MVP?",
    a: "Basic caps you at 5 decisions per month, 2 decision paths per query, and simplified verdict cards with no risk scoring or audit trail. The MVP removes all those limits — you get unlimited branching depth, full upside and downside scoring, the Aside AI panel for working live alongside your workflow, and Groq-powered speed. The MVP is built for operators who rely on the engine daily.",
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
    a: "General LLMs give you a single confident answer based on pattern matching. They don't branch, they don't stress-test, and they don't calculate stakes. three AI's engine is architecturally different — it generates competing decision paths based on your company data, assigns probability and impact weights to each, surfaces edge cases the LLM wouldn't catch, and produces a verdict with documented reasoning. It shows its work.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no cancellation fees, no per-seat charges. Cancel from your account dashboard at any time and your access continues until the end of the billing period. The Basic plan is free forever — nothing to cancel.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-28 max-w-3xl mx-auto px-4 md:px-8">
      <FadeUp>
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#E58A6A] mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1B18] tracking-tight mb-4">
            Everything you need to know.
          </h2>
          <p className="text-[#1C1B18]/40 text-[15px] leading-relaxed">
            Still have questions? <a href="mailto:hello@thinkai.com" className="text-[#E58A6A] hover:underline">Email us directly →</a>
          </p>
        </div>
      </FadeUp>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <FadeUp key={i} delay={i * 0.04}>
            <div
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                open === i
                  ? "border-[#E58A6A]/25 bg-[#FEFDF9]"
                  : "border-black/[0.06] bg-[#F5F4F1] hover:border-black/[0.1]"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
              >
                <span className={`text-[14px] font-semibold leading-snug transition-colors ${open === i ? "text-[#1C1B18]" : "text-[#1C1B18]/70"}`}>
                  {faq.q}
                </span>
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    open === i ? "bg-[#E58A6A]" : "bg-black/[0.05]"
                  }`}
                >
                  {open === i
                    ? <Minus className="w-3.5 h-3.5 text-white" />
                    : <Plus className="w-3.5 h-3.5 text-[#1C1B18]/40" />
                  }
                </div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="w-full h-px bg-[#E58A6A]/15 mb-4" />
                      <p className="text-[13.5px] text-[#1C1B18]/55 leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="py-28 border-t border-black/[0.05] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#E58A6A]/[0.06] blur-[120px] rounded-[100%]" />
      </div>
      <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
        <FadeUp>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F2F1ED] border border-black/[0.07] mb-8">
            <Zap className="w-7 h-7 text-[#E58A6A]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1B18] tracking-tight mb-5">
            Your next decision is already costing you time.
          </h2>
          <p className="text-[15px] text-[#1C1B18]/40 max-w-lg mx-auto leading-relaxed mb-10">
            Start free. No credit card, no commitment. When your decisions carry real stakes, one upgrade is all it takes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/signin">
              <button className="h-12 px-8 rounded-full bg-[#E58A6A] text-white font-semibold text-sm hover:bg-[#D97757] transition-colors flex items-center gap-2 shadow-[0_0_24px_rgba(229,138,106,0.25)]">
                Start free
                <ChevronRight className="w-4 h-4" />
              </button>
            </a>
            <button className="h-12 px-8 rounded-full border border-black/[0.1] text-[#1C1B18]/60 text-sm font-medium hover:bg-black/[0.03] transition-colors flex items-center gap-2">
              Join V2 waitlist
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-6 text-[11px] text-[#1C1B18]/25 uppercase tracking-widest">No contracts · Cancel anytime · Data stays yours</p>
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

        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center"
            >
              <img src="/logofive.PNG" alt="ThinkAI Logo" className="h-[80px] w-auto" />
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
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] selection:bg-[#E58A6A]/20 selection:text-[#1C1B18] font-sans">
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