"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Network, Lock, Zap, LayoutPanelLeft, ChevronRight, Play, Briefcase, Shield, Cpu, AlertCircle, Clock, Menu, X } from "lucide-react";

// 1. ADDED: Import your custom AppLoader
import AppLoader from "@/components/AppLoader";

/* --- Apple-style Easing --- */
// 2. ADDED: 'as const' to fix the TypeScript error
const ease = [0.16, 1, 0.3, 1] as const;

/* --- Components --- */

function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 mt-[-90px] z-50 flex items-center justify-between px-6 md:px-10 py-6 pointer-events-none">
        {/* Logo */}
        <div className="pointer-events-auto flex ml-[-25px] items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center"
          >
            <a href="#home">
              <img
                src="/logofive.png"
                alt="three AI logo"
                className="h-[220px] w-[200px] font-bold"
              />
            </a>
          </motion.div>
        </div>

        {/* Navigation - Glass Oval (desktop only) */}
        <nav className="hidden lg:flex pointer-events-auto items-center gap-11 px-8 py-3.5 w-[600px] h-[70px] rounded-full bg-black/[0.02] border border-black/[0.07] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] text-[13px] font-medium text-[#1C1B18]/55">
          <a href="#home" className="hover:text-[#D97706] transition-colors">Home</a>
          <a href="#engine" className="hover:text-[#D97706] transition-colors">The Engine</a>
          <a href="#refinement" className="hover:text-[#D97706] transition-colors">Refinement</a>
          <a href="/use-case" className="hover:text-[#D97706] transition-colors">Use Cases</a>
          <a href="/pricing" className="hover:text-[#D97706] transition-colors">Pricing</a>
          <a href="/blog" className="hover:text-[#D97706] transition-colors">Blog</a>
        </nav>

        {/* Auth (desktop) + Burger (mobile) */}
        <div className="pointer-events-auto flex items-center gap-6">
          {/* Auth — desktop only */}
          <a href="/signin?mode=login" className="hidden lg:block">
            <button className="hidden lg:block text-[13px] font-medium text-[#1C1B18]/60 hover:text-[#1C1B18] transition-colors">
              Sign In
            </button>
          </a>

          <a href="/signin?mode=signup" className="hidden lg:block">
            <button className="text-[13px] font-semibold px-6 py-2.5 rounded-full bg-black/[0.05] border border-black/[0.1] text-[#1C1B18] backdrop-blur-xl hover:bg-black/[0.09] hover:scale-105 transition-all">
              Sign Up
            </button>
          </a>

          {/* Burger — mobile only */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-black/[0.04] border border-black/[0.08] backdrop-blur-xl text-[#1C1B18] hover:bg-black/[0.08] transition-all"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
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
                { label: "Home", href: "#home" },
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
                  className="px-4 py-3 rounded-2xl hover:bg-black/[0.04] hover:text-[#D97706] transition-all"
                >
                  {label}
                </a>
              ))}

              <div className="mt-4 pt-4 border-t border-black/[0.06] flex flex-col gap-3">
                <a href="/signin?mode=login" className="hidden lg:block">
                  <button className="hidden lg:block text-[13px] font-medium text-[#1C1B18]/60 hover:text-[#1C1B18] transition-colors">
                    Sign In
                  </button>
                </a>

                <a href="/signin?mode=signup" className="hidden lg:block">
                  <button className="text-[13px] font-semibold px-6 py-2.5 rounded-full bg-black/[0.05] border border-black/[0.1] text-[#1C1B18] backdrop-blur-xl hover:bg-black/[0.09] hover:scale-105 transition-all">
                    Sign Up
                  </button>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  return (
    <section id="home" className="relative pt-52 pb-24 px-4 flex flex-col items-center text-center overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#E58A6A]/[0.07] blur-[150px] rounded-[100%] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E58A6A]/10 border border-[#E58A6A]/25 text-[#D97757] text-xs font-medium mb-8"
      >
        <Zap className="w-3 h-3" />
        The Finance Decision Engine
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1, ease }}
        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#1C1B18] max-w-5xl leading-[1.05]"
      >
        We think through <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C1B18] via-[#E58A6A] to-[#D97757]">
          so you can do.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease }}
        className="mt-8 text-lg md:text-xl text-[#1C1B18]/45 max-w-2xl font-light leading-relaxed"
      >
        Move beyond generic chatbots. three AI reads financial documents, synced context, and prior decisions to produce clear verdicts with risks, conditions, and next steps.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease }}
        className="mt-12 flex flex-col sm:flex-row items-center gap-4"
      >
        <a href="/signin?mode=signup">
          <button className="h-12 px-8 rounded-full bg-[#E58A6A] text-white font-semibold text-sm hover:bg-[#D97757] transition-colors flex items-center gap-2 shadow-[0_0_24px_rgba(229,138,106,0.25)]">
            Start your first decision
            <ChevronRight className="w-4 h-4" />
          </button>
        </a>
      </motion.div>
    </section>
  );
}

function VideoSpace() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.3, 1]);

  return (
    <section id="engine" className="px-4 md:px-8 pb-20 flex justify-center">
      <motion.div
        style={{ scale, opacity }}
        className="relative w-full max-w-6xl aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-black/[0.07] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] group"
      >
        <img
          src="/dash.png"
          alt="three AI Dashboard"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>
    </section>
  );
}

function TrustedBy() {
  return (
    <section className="py-16 mb-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/[0.01] to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <h3 className="text-xl md:text-2xl font-semibold text-[#1C1B18] mb-3">
          Built for finance, strategy, and operations teams.
        </h3>
        <p className="text-[13px] font-medium text-[#1C1B18]/40 mb-10 max-w-2xl mx-auto">
          From fundraising and pricing to diligence and cost control, three AI helps turn scattered context into a structured recommendation.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-25 grayscale">
          <span className="text-xl font-bold tracking-tighter text-[#1C1B18]">Fundraising</span>
          <span className="text-xl font-serif italic text-[#1C1B18]">Diligence</span>
          <span className="text-xl font-bold uppercase tracking-widest text-[#1C1B18]">Pricing</span>
          <span className="text-xl font-medium tracking-wide text-[#1C1B18]">Runway</span>
        </div>
      </div>
    </section>
  );
}

function ProblemSolution() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-[#1C1B18] tracking-tight mb-4">
          Why generic AI falls short on financial decisions.
        </h2>
        <p className="text-[#1C1B18]/45 text-lg">Text generation is not a decision record. Generic chat does not preserve conditions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The Problem */}
        <div className="p-10 rounded-[2rem] border border-black/[0.05] bg-[#F2F1ED] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><AlertCircle className="w-32 h-32 text-rose-500" /></div>
          <div className="relative z-10">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-rose-500/70 mb-4">The Status Quo</h3>
            <h4 className="text-2xl font-semibold text-[#1C1B18] mb-4">The Cost of Ambiguity</h4>
            <p className="text-[#1C1B18]/50 leading-relaxed text-[15px] mb-8">
              Generic AI tools return polished answers but do not preserve the path behind the call. Finance teams still end up reconciling spreadsheets, memos, and assumptions by hand before they can trust the output.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-[#1C1B18]/40">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400/60" />
                Disconnected context across documents, spreadsheets, and notes.
              </li>
              <li className="flex items-center gap-3 text-sm text-[#1C1B18]/40">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400/60" />
                Hard to trace why a recommendation changed.
              </li>
            </ul>
          </div>
        </div>

        {/* The Solution */}
        <div className="p-10 rounded-[2rem] border border-[#E58A6A]/20 bg-gradient-to-br from-[#E58A6A]/[0.06] to-[#F5F4F0] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Clock className="w-32 h-32 text-[#E58A6A]" /></div>
          <div className="relative z-10">
            <h3 className="text-[11px] font-bold tracking-widest text-[#D97757] mb-4">THE three AI WAY</h3>
            <h4 className="text-2xl font-semibold text-[#1C1B18] mb-4">Structured Financial Reasoning</h4>
            <p className="text-[#1C1B18]/60 leading-relaxed text-[15px] mb-8">
              three AI organizes the decision into branches, challenges the initial answer, and returns risks, upsides, confidence, and next steps in a workspace built for action.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-[#1C1B18]/60">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E58A6A]" />
                Document-aware finance context.
              </li>
              <li className="flex items-center gap-3 text-sm text-[#1C1B18]/60">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E58A6A]" />
                Actionable verdicts, not passive summaries.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function BentoGrid() {
  return (
    <section id="refinement" className="px-4 md:px-8 py-24 max-w-7xl mx-auto border-t border-black/[0.05]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-2 relative h-[420px] rounded-[2rem] border border-black/[0.05] bg-[#F2F1EE] overflow-hidden group">
          <div className="relative z-10 h-full p-10 md:p-12 flex flex-col justify-between">
            <div>
              <Network className="w-8 h-8 text-[#E58A6A] mb-5" />
              <h3 className="text-2xl font-semibold text-[#1C1B18] mb-3">Recursive Refinement</h3>
              <p className="text-[#1C1B18]/45 max-w-md leading-relaxed text-sm">
                The engine challenges its own logic. It generates branching scenarios, stress-tests assumptions, and calculates decision stakes before presenting the final verdict.
              </p>
            </div>
            {/* Minimalist SVG Art */}
            <div className="absolute right-0 bottom-0 w-[60%] h-[60%] opacity-25 translate-x-8 translate-y-8 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700 ease-out">
              <svg viewBox="0 0 200 200" className="w-full h-full stroke-black/[0.2] fill-none" strokeWidth="1">
                <path d="M10 100 Q 50 100 100 50 T 190 20" />
                <path d="M10 100 Q 50 100 100 150 T 190 180" />
                <circle cx="10" cy="100" r="4" className="fill-[#E58A6A] stroke-none" />
                <circle cx="100" cy="50" r="3" className="fill-black/30 stroke-none" />
                <circle cx="100" cy="150" r="3" className="fill-black/30 stroke-none" />
                <circle cx="190" cy="20" r="4" className="fill-emerald-500 stroke-none" />
                <circle cx="190" cy="180" r="4" className="fill-rose-500 stroke-none" />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative h-[420px] rounded-[2rem] border border-black/[0.05] bg-[#F2F1EE] overflow-hidden" id="aside">
          <div className="relative z-10 h-full p-8 flex flex-col justify-between">
            <div>
              <LayoutPanelLeft className="w-8 h-8 text-[#1C1B18]/50 mb-5" />
              <h3 className="text-xl font-semibold text-[#1C1B18] mb-3">The Decision Workspace</h3>
              <p className="text-[#1C1B18]/45 leading-relaxed text-sm">
                A focused workspace for long-form financial prompts, uploads, and verdict cards without crowding the rest of your screen.
              </p>
            </div>
            <div className="w-full h-36 rounded-2xl border border-black/[0.06] bg-black/[0.02] flex items-stretch overflow-hidden">
              <div className="w-2/3 bg-transparent p-3 space-y-3">
                <div className="w-full h-2 bg-black/10 rounded-sm" />
                <div className="w-3/4 h-2 bg-black/10 rounded-sm" />
              </div>
              <div className="w-1/3 bg-black/[0.03] border-l border-black/[0.05] p-3 flex flex-col justify-end">
                <div className="w-full h-10 rounded-lg bg-[#E58A6A]/20 border border-[#E58A6A]/30" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function PrivacySection() {
  return (
    <section className="py-32 relative border-t border-black/[0.05]" id="security">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/[0.02] via-[#FAFAF8] to-[#FAFAF8] pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#F2F1ED] border border-black/[0.07] mb-8 shadow-[0_0_32px_rgba(0,0,0,0.04)]">
          <Lock className="w-8 h-8 text-[#1C1B18]/70" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-[#1C1B18] tracking-tight mb-6">
          Built for sensitive financial context.
        </h2>
        <p className="text-lg text-[#1C1B18]/45 max-w-2xl mx-auto leading-relaxed mb-16">
          three AI keeps uploaded documents, synced finance data, and verdict history scoped to your workspace so you can review decisions without scattering context across tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {["Isolated workspaces", "Audit-ready history", "Optional email delivery"].map((feature, i) => (
            <div key={i} className="px-6 py-5 rounded-2xl bg-black/[0.02] border border-black/[0.05] backdrop-blur-3xl flex items-center gap-4 hover:bg-black/[0.04] transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.25)]" />
              <span className="text-[14px] font-medium text-[#1C1B18]/75">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
                src="/logofive.png"
                alt="three AI logo"
                className="h-[80px] w-auto"
              />
            </motion.div>
          </div>
          <p className="text-[#1C1B18]/40 text-sm leading-relaxed max-w-xs mb-8">
            Document-backed financial reasoning and structured verdicts in one workspace.
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
            <li><a href="#aside" className="hover:text-[#E58A6A] transition-colors">Decision Workspace</a></li>
            <li><a href="#security" className="hover:text-[#E58A6A] transition-colors">Security & Trust</a></li>
            <li><a href="/pricing" className="hover:text-[#E58A6A] transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-[#E58A6A] transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#1C1B18] font-semibold text-sm mb-6">Use Cases</h4>
          <ul className="space-y-4 text-sm text-[#1C1B18]/50">
            <li><a href="/use-case#features" className="hover:text-[#E58A6A] transition-colors">Enterprise Strategy</a></li>
            <li><a href="/use-case#features" className="hover:text-[#E58A6A] transition-colors">Fundraising Strategy</a></li>
            <li><a href="/use-case#features" className="hover:text-[#E58A6A] transition-colors">M&amp;A Diligence</a></li>
            <li><a href="/use-case#features" className="hover:text-[#E58A6A] transition-colors">Runway Planning</a></li>
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
        </div>
      </div>
    </footer>
  );
}

// 3. ADDED: Wrap the main page content inside the AppLoader
export default function LandingPage() {
  return (
    <AppLoader>
      <div className="min-h-screen bg-[#FAFAF8] selection:bg-[#E58A6A]/20 selection:text-[#1C1B18] font-sans">
        <NavBar />
        <main>
          <Hero />
          <VideoSpace />
          <TrustedBy />
          <ProblemSolution />
          <BentoGrid />
          <PrivacySection />
        </main>
        <EnterpriseFooter />
      </div>
    </AppLoader>
  );
}
