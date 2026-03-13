"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ChevronRight, Zap, Network, GitBranch, Target, TrendingUp,
  Shield, Cpu, Users, BarChart3, Briefcase, Building2,
  ArrowRight, CheckCircle, Lightbulb, AlertTriangle, FlaskConical,
  DollarSign, Globe, Layers, Lock,
} from "lucide-react";

/* ─── Shared easing ─────────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1];

/* ─── Fade-up helper ─────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
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

/* ─── NavBar (identical to landing page) ────────────────────────── */
function NavBar() {
  return (
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
        <a href="/#engine" className="hover:text-[#1C1B18] transition-colors">The Engine</a>
        <a href="/#refinement" className="hover:text-[#1C1B18] transition-colors">Refinement</a>
        <a href="/use-case" className="text-[#E58A6A] font-semibold">Use Cases</a>
        <a href="/pricing" className="hover:text-[#1C1B18] transition-colors">Pricing</a>
        <a href="/blog" className="hover:text-[#1C1B18] transition-colors">Blog</a>
      </nav>

      <div className="pointer-events-auto flex items-center gap-6">
        <button className="text-[13px] font-medium text-[#1C1B18]/60 hover:text-[#1C1B18] transition-colors">
          Sign In
        </button>
        <button className="text-[13px] font-semibold px-6 py-2.5 rounded-full bg-black/[0.05] border border-black/[0.1] text-[#1C1B18] backdrop-blur-xl hover:bg-black/[0.09] hover:scale-105 transition-all">
          Sign Up
        </button>
      </div>
    </header>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative pt-52 pb-28 px-4 flex flex-col items-center text-center overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#E58A6A]/[0.06] blur-[160px] rounded-[100%] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E58A6A]/10 border border-[#E58A6A]/25 text-[#D97757] text-xs font-medium mb-8"
      >
        <Target className="w-3 h-3" />
        Use Cases
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1, ease }}
        className="text-5xl md:text-7xl font-bold tracking-tight text-[#1C1B18] max-w-4xl leading-[1.05]"
      >
        Built for those <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C1B18] via-[#E58A6A] to-[#D97757]">
          who decide.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease }}
        className="mt-8 text-lg md:text-xl text-[#1C1B18]/45 max-w-2xl font-light leading-relaxed"
      >
        three AI is not a chatbot. It is a structured decision engine. Here is exactly who uses it, what they use it for, and how it transforms ambiguity into executed strategy.
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7, ease }}
        className="mt-16 flex flex-col items-center gap-2"
      >
        <span className="text-[11px] uppercase tracking-widest text-[#1C1B18]/25 font-medium">Explore use cases</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[#E58A6A]/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}

/* ─── Who It's For ───────────────────────────────────────────────── */
const audiences = [
  {
    icon: Briefcase,
    role: "Founders & CEOs",
    tag: "High-Stakes Execution",
    description:
      "You make 30 consequential decisions a week with incomplete data. three AI stress-tests your instincts, maps every downstream risk based on company data, and gives you a defensible verdict before you commit resources.",
    examples: ["Pivot vs. stay-the-course decisions", "Fundraising round strategy", "Co-founder equity splits"],
    color: "#E58A6A",
  },
  {
    icon: Cpu,
    role: "CTOs & Eng. Leads",
    tag: "Technical Strategy",
    description:
      "Build vs. buy, monolith vs. microservices, migrate now vs. later — these decisions carry years of consequence. The engine models your constraints and returns a ranked verdict with edge-case exposure.",
    examples: ["Tech stack migration planning", "Build vs. buy analysis", "Zero-downtime architecture decisions"],
    color: "#6A9EE5",
  },
  {
    icon: BarChart3,
    role: "Strategy & Operations",
    tag: "Competitive Intelligence",
    description:
      "Market entry, resource allocation, pricing model changes — decisions that move entire business units. three AI branches the competitive landscape and calculates execution risk before you move.",
    examples: ["Market entry sequencing", "Pricing model restructuring", "Resource allocation trade-offs"],
    color: "#6AE5B0",
  },
  {
    icon: Shield,
    role: "Risk & Compliance Officers",
    tag: "Regulated Decision-Making",
    description:
      "In regulated industries, the wrong decision path costs more than money. three AI provides a documented, auditable chain of reasoning — reducing liability and accelerating sign-off.",
    examples: ["Regulatory compliance pathways", "Third-party vendor risk scoring", "Data governance decisions"],
    color: "#A86AE5",
  },
  {
    icon: Layers,
    role: "Product Managers",
    tag: "Roadmap Clarity",
    description:
      "Feature prioritization is a trade-off engine. three AI quantifies the stakes of shipping vs. delaying, maps upstream and downstream dependencies, and removes opinion from the room.",
    examples: ["Feature vs. tech debt prioritization", "Release timing decisions", "Platform vs. point solution bets"],
    color: "#E5C86A",
  },
  {
    icon: DollarSign,
    role: "Investors & Finance Leads",
    tag: "Capital Allocation",
    description:
      "Deploy capital into the right bet, at the right stage, with the right structure. three AI maps portfolio risk exposure, models competitive displacement, and sharpens your conviction.",
    examples: ["M&A diligence acceleration", "Portfolio risk concentration", "Capital deployment sequencing"],
    color: "#E56A6A",
  },
];

function WhoSection() {
  return (
    <section className="py-28 max-w-7xl mx-auto px-4 md:px-8 border-t border-black/[0.05]">
      <FadeUp>
        <div className="mb-16">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#E58A6A] mb-3">Who It&apos;s For</p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1C1B18] tracking-tight mb-4 max-w-2xl">
            Six roles. One engine.
          </h2>
          <p className="text-[#1C1B18]/45 text-lg max-w-xl leading-relaxed">
            three AI is purpose-built for anyone accountable for decisions that carry real consequences.
          </p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {audiences.map((a, i) => (
          <FadeUp key={a.role} delay={i * 0.07}>
            <div className="group h-full p-8 rounded-[2rem] border border-black/[0.05] bg-[#F2F1ED] hover:bg-[#EEECEA] transition-all duration-300 flex flex-col gap-5 relative overflow-hidden">
              {/* Glow accent */}
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-15 transition-opacity duration-500"
                style={{ background: a.color }}
              />
              <div className="relative z-10 flex flex-col gap-5 h-full">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: `${a.color}15`, border: `1px solid ${a.color}30` }}
                  >
                    <a.icon className="w-5 h-5" style={{ color: a.color }} />
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                    style={{ color: a.color, background: `${a.color}10`, borderColor: `${a.color}30` }}
                  >
                    {a.tag}
                  </span>
                </div>

                {/* Role */}
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1C1B18] mb-2">{a.role}</h3>
                  <p className="text-[13px] text-[#1C1B18]/50 leading-relaxed">{a.description}</p>
                </div>

                {/* Examples */}
                <ul className="mt-auto space-y-2">
                  {a.examples.map((ex, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[12.5px] text-[#1C1B18]/40">
                      <div className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: a.color }} />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ─── What For (deep use-case cards) ────────────────────────────── */
const useCases = [
  {
    icon: Globe,
    title: "Market Entry Decisions",
    industry: "Strategy",
    problem: "You have a new geography or vertical in mind, but three viable sequencing options and no clean framework to choose.",
    howThinkAI: "The engine branches each entry path — direct, partnership, or acquisition — stress-tests market timing, competitive density, and capital efficiency, then returns a ranked verdict with explicit go / stop / review conditions.",
    outcome: "A boardroom-ready decision rationale in under 10 minutes instead of 3 weeks of consultant decks.",
    accent: "#E58A6A",
  },
  {
    icon: Cpu,
    title: "Tech Stack Migration",
    industry: "Engineering",
    problem: "Migrating a production system is a 12-month bet with hidden dependencies, team capability gaps, and real downtime risk.",
    howThinkAI: "three AI models the migration as a branching tree: incremental strangler pattern vs. big-bang rewrite vs. parallel run. It surfaces the edge cases your team hasn't considered and calculates the exact risk exposure at each stage.",
    outcome: "An engineering decision your CTO can defend to the board, with documented trade-off logic and rollback triggers pre-defined.",
    accent: "#6A9EE5",
  },
  {
    icon: TrendingUp,
    title: "Fundraising Strategy",
    industry: "Finance",
    problem: "Raise now at a down round, wait for better metrics, or explore strategic alternatives — three paths with very different consequences.",
    howThinkAI: "The engine maps the capital landscape: dilution impact per path, runway exposure, investor signal risk, and competitor funding velocity. It delivers a stakes-weighted verdict with the exact conditions that should flip your decision.",
    outcome: "Founders walk into term sheet negotiations knowing exactly when to push and when to walk away.",
    accent: "#6AE5B0",
  },
  {
    icon: Users,
    title: "Hiring & Org Design",
    industry: "Operations",
    problem: "Hire a VP of Sales now to accelerate growth, or keep the lean structure until product-market fit is tighter?",
    howThinkAI: "three AI branches the organizational impact: cost burn rate, ramp time, culture dilution risk, and the downstream effect on your next raise. It surfaces the hidden costs of both action and inaction.",
    outcome: "An org chart decision grounded in numbers, not gut feel, with a clear trigger for revisiting the call.",
    accent: "#A86AE5",
  },
  {
    icon: FlaskConical,
    title: "Build vs. Buy vs. Partner",
    industry: "Product",
    problem: "A core capability gap exists. Do you build it in-house, license a vendor, or acquire a startup? Each path has compounding consequences.",
    howThinkAI: "The engine runs a full three-branch analysis — TCO over 36 months, integration complexity, competitive moat impact, and vendor dependency risk — and delivers a verdict with explicit review triggers if the landscape shifts.",
    outcome: "A product roadmap bet with documented logic your entire leadership team can align on.",
    accent: "#E5C86A",
  },
  {
    icon: AlertTriangle,
    title: "M&A Risk Assessment",
    industry: "Corporate Strategy",
    problem: "Due diligence surfaces three red flags. Are they deal-killers, negotiation leverage, or acceptable risks given the strategic upside?",
    howThinkAI: "three AI stress-tests each risk vector — integration cost, key-person dependency, regulatory exposure, cultural clash — against the strategic upside scenarios. It quantifies which flags change the verdict and which are noise.",
    outcome: "Deal teams move from gut-feel risk tolerance to structured, defensible go / no-go decisions.",
    accent: "#E56A6A",
  },
];

function WhatForSection() {
  return (
    <section className="py-28 border-t border-black/[0.05] bg-[#F5F4F1]" id="features">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <FadeUp>
          <div className="mb-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#E58A6A] mb-3">What It&apos;s For</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1C1B18] tracking-tight mb-4 max-w-2xl">
              The decisions that keep you up at night.
            </h2>
            <p className="text-[#1C1B18]/45 text-lg max-w-xl leading-relaxed">
              Every use case below is a decision with high stakes, multiple viable paths, and real consequences for getting it wrong.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {useCases.map((uc, i) => (
            <FadeUp key={uc.title} delay={i * 0.06}>
              <div className="group h-full p-8 rounded-[2rem] border border-black/[0.05] bg-[#FAFAF8] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col gap-6 relative overflow-hidden">
                <div
                  className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ background: uc.accent }}
                />
                <div className="relative z-10 flex flex-col gap-6 h-full">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${uc.accent}12`, border: `1px solid ${uc.accent}28` }}
                    >
                      <uc.icon className="w-5 h-5" style={{ color: uc.accent }} />
                    </div>
                    <div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: uc.accent }}
                      >
                        {uc.industry}
                      </span>
                      <h3 className="text-[16px] font-semibold text-[#1C1B18] leading-snug mt-0.5">{uc.title}</h3>
                    </div>
                  </div>

                  {/* Three-part breakdown */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1B18]/25 mb-1.5">The Problem</p>
                      <p className="text-[13px] text-[#1C1B18]/55 leading-relaxed">{uc.problem}</p>
                    </div>
                    <div className="w-full h-px bg-black/[0.04]" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1B18]/25 mb-1.5">How three AI Solves It</p>
                      <p className="text-[13px] text-[#1C1B18]/55 leading-relaxed">{uc.howThinkAI}</p>
                    </div>
                    <div className="w-full h-px bg-black/[0.04]" />
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: uc.accent }} />
                      <p className="text-[13px] text-[#1C1B18]/65 leading-relaxed font-medium">{uc.outcome}</p>
                    </div>
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

/* ─── How It Works ───────────────────────────────────────────────── */
const steps = [
  {
    number: "01",
    icon: Lightbulb,
    title: "Input your decision context",
    description:
      "Describe the decision you're facing — the options on the table, your constraints, your timeline, and what a bad outcome looks like. The more context, the sharper the analysis.",
    detail: "Natural language. No templates. No forms. Just describe the situation as you would to a trusted advisor.",
  },
  {
    number: "02",
    icon: GitBranch,
    title: "The engine branches and stress-tests",
    description:
      "three AI's recursive refinement engine generates distinct decision branches, assigns probability and impact weights to each path, and automatically surfaces the edge cases and second-order effects you haven't considered.",
    detail: "This is not summarisation. It is structural analysis — the engine challenges its own conclusions before presenting them.",
  },
  {
    number: "03",
    icon: Network,
    title: "Stakes are calculated and visualised",
    description:
      "Every branch is scored across upside potential, downside risk, execution complexity, and reversal cost. The Aside AI panel maps the full decision landscape so you can see exactly what you're trading off.",
    detail: "Branching logic with explicit probability-impact scoring. Not a list of pros and cons. A calculated risk map.",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Verdict delivered. You execute.",
    description:
      "A clear, defensible verdict is returned — with explicit go conditions, stop conditions, and review triggers. You walk away knowing exactly what to do, and under which conditions to revisit the call.",
    detail: "We think through so you can do. The final output is not a summary. It is a decision, ready for execution.",
  },
];

function HowItWorksSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-28 max-w-7xl mx-auto px-4 md:px-8 border-t border-black/[0.05]">
      <FadeUp>
        <div className="mb-20 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#E58A6A] mb-3">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1C1B18] tracking-tight mb-4">
            Four steps from ambiguity to execution.
          </h2>
          <p className="text-[#1C1B18]/45 text-lg max-w-xl mx-auto leading-relaxed">
            The engine is designed to be invisible. What you see is clarity. What runs underneath is structured recursive analysis.
          </p>
        </div>
      </FadeUp>

      <div className="relative">
        {/* Animated vertical line */}
        <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-black/[0.04] hidden md:block -translate-x-px">
          <motion.div style={{ height: lineHeight }} className="w-full bg-gradient-to-b from-[#E58A6A] to-[#E58A6A]/20 origin-top" />
        </div>

        <div className="space-y-14">
          {steps.map((step, i) => (
            <FadeUp key={step.number} delay={i * 0.1}>
              <div className={`flex flex-col md:flex-row items-start gap-8 md:gap-16 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                {/* Text side */}
                <div className="flex-1 md:text-right" style={i % 2 === 1 ? { textAlign: "left" } : {}}>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E58A6A]/60 mb-2 block">Step {step.number}</span>
                  <h3 className="text-[20px] font-semibold text-[#1C1B18] mb-3 leading-snug">{step.title}</h3>
                  <p className="text-[14px] text-[#1C1B18]/50 leading-relaxed mb-3">{step.description}</p>
                  <p className="text-[12.5px] text-[#1C1B18]/30 leading-relaxed italic">{step.detail}</p>
                </div>

                {/* Centre node */}
                <div className="hidden md:flex shrink-0 w-14 h-14 rounded-full bg-[#F2F1ED] border border-black/[0.07] items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.05)] z-10">
                  <step.icon className="w-5 h-5 text-[#E58A6A]" />
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Proof stat strip ───────────────────────────────────────────── */
const stats = [
  { value: "40hrs", label: "Saved per major strategic decision" },
  { value: "3×",   label: "More edge-case risks surfaced" },
  { value: "<10m", label: "From input to defensible verdict" },
  { value: "100%", label: "Data isolation — zero model training" },
];

function StatStrip() {
  return (
    <section className="border-t border-black/[0.05] bg-[#F5F4F1] py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.08}>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-[#1C1B18] tracking-tight mb-2">{s.value}</p>
                <p className="text-[12.5px] text-[#1C1B18]/40 leading-snug">{s.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="py-32 relative border-t border-black/[0.05] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#E58A6A]/[0.06] blur-[120px] rounded-[100%]" />
      </div>
      <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
        <FadeUp>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F2F1ED] border border-black/[0.07] mb-8">
            <Zap className="w-7 h-7 text-[#E58A6A]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1C1B18] tracking-tight mb-6">
            Your next high-stakes decision<br className="hidden md:block" /> starts here.
          </h2>
          <p className="text-lg text-[#1C1B18]/45 max-w-xl mx-auto leading-relaxed mb-12">
            Stop deliberating in the dark. Give three AI the context and walk away with a verdict you can act on today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/signin">
            <button className="h-12 px-8 rounded-full bg-[#E58A6A] text-white font-semibold text-sm hover:bg-[#D97757] transition-colors flex items-center gap-2 shadow-[0_0_24px_rgba(229,138,106,0.25)]">
              Start building decisions
              <ChevronRight className="w-4 h-4" />
            </button>
            </a>
            <button className="h-12 px-8 rounded-full border border-black/[0.1] text-[#1C1B18]/70 text-sm font-medium hover:bg-black/[0.03] transition-colors flex items-center gap-2" id="contactsales">
              Talk to sales
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─── Footer (identical to landing page) ────────────────────────── */
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
export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] selection:bg-[#E58A6A]/20 selection:text-[#1C1B18] font-sans">
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