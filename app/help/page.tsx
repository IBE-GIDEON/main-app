"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  CreditCard,
  Settings,
  FileText,
  Users,
  Mail,
  ArrowRight,
  BookOpen,
  Lock,
  MessageSquare
} from "lucide-react";
import clsx from "clsx";

/* ─────────────────────────────────────────
   THREE AI DATA
───────────────────────────────────────── */
const HELP_CATEGORIES = [
  {
    icon: Zap,
    title: "The Decision Engine",
    description: "Learn how recursive refinement and branching logic visualize outcomes.",
    articles: [
      { title: "Starting your first decision flow", href: "#" },
      { title: "Understanding Upside vs. Risk boxes", href: "#" },
      { title: "How the routing engine classifies stakes", href: "#" },
    ],
  },
  {
    icon: Shield,
    title: "Privacy & Zero-Leakage",
    description: "How we protect your context and guarantee data isolation.",
    articles: [
      { title: "Our zero-leakage architecture", href: "#" },
      { title: "Data retention and export policies", href: "#" },
      { title: "Enterprise compliance overview", href: "#" },
    ],
  },
  {
    icon: FileText,
    title: "Context & Integrations",
    description: "Upload documents and connect supported finance data sources.",
    articles: [
      { title: "Uploading financial documents", href: "#" },
      { title: "Connecting Stripe, QuickBooks, or CSV data", href: "#" },
      { title: "Supported file types and limits", href: "#" },
    ],
  },
  {
    icon: CreditCard,
    title: "Billing & MVP Plan",
    description: "Manage your subscription, invoices, and premium access.",
    articles: [
      { title: "Upgrading to the MVP Plan", href: "#" },
      { title: "Understanding query limits", href: "#" },
      { title: "Updating payment methods", href: "#" },
    ],
  },
  {
    icon: Users,
    title: "History & Workspace",
    description: "Manage saved decisions and keep your workspace organized.",
    articles: [
      { title: "Renaming a recent decision", href: "#" },
      { title: "Restoring decisions from the Audit Ledger", href: "#" },
      { title: "Deleting a saved decision", href: "#" },
    ],
  },
  {
    icon: Settings,
    title: "Account Settings",
    description: "Manage your personal profile and system preferences.",
    articles: [
      { title: "Changing your password", href: "#" },
      { title: "Notification preferences", href: "#" },
      { title: "Deleting your account", href: "#" },
    ],
  },
];

const FAQS = [
  {
    q: "How does Three AI use my uploaded company data?",
    a: "Your uploaded files and company context are strictly used to improve decision analysis inside your isolated workspace. They are never used to train public models, ensuring a zero-leakage environment.",
  },
  {
    q: "What is the difference between Chat and a Decision?",
    a: "The engine automatically routes your queries. Chat is best for finance Q&A, document follow-ups, and clarifying context. Decision mode is triggered when you are weighing a real choice, launching recursive refinement so the engine can return Upside and Risk boxes, verdict cards, conditions, and next steps.",
  },
  {
    q: "What do I get with the MVP Plan?",
    a: "The MVP Plan ($560/month) unlocks unlimited recursive refinement, full upside and downside scoring, a full audit trail, faster response performance, supported finance document uploads, and optional verdict email delivery when the backend mail integration is configured.",
  },
  {
    q: "How do I restore a previous decision?",
    a: "Open the sidebar and look at your 'Audit Ledger'. Clicking any past query will instantly restore the full decision board, including all risk factors, upsides, and triggers.",
  },
];

/* ─────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-white/[0.02] overflow-hidden transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
          {question}
        </span>
        <span
          className={clsx(
            "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
            open
              ? "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400"
              : "bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400"
          )}
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <div className="h-px w-full bg-zinc-100 dark:bg-white/5 mb-4" />
          <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0D0D0D] transition-colors duration-300">
      
      {/* HEADER / HERO */}
      <div className="relative overflow-hidden border-b border-zinc-200 dark:border-white/5 bg-white dark:bg-[#121212] pt-24 pb-16 transition-colors duration-300">
        {/* Subtle Purple Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 text-[11px] font-bold uppercase tracking-widest mb-6">
            <MessageSquare size={12} /> Support Center
          </div>
          
          <h1 className="text-[36px] md:text-[48px] font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            How can we help?
          </h1>
          
          <p className="text-[16px] text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
            Find answers, understand how the engine works, and get help with onboarding, documents, delivery, and workspace setup.
          </p>

          {/* SEARCH BAR */}
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search for articles, features, or billing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-zinc-50 dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        
        {/* CATEGORIES GRID */}
        <section>
          <div className="mb-10">
            <h2 className="text-[24px] font-bold text-zinc-900 dark:text-white mb-2">Browse by topic</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-[14px]">Explore guides tailored to the Decision Engine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HELP_CATEGORIES.map((category) => (
              <div
                key={category.title}
                className="group p-6 rounded-3xl bg-white dark:bg-[#121212] border border-zinc-200 dark:border-white/5 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all shadow-sm hover:shadow-md flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center mb-6">
                  <category.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                
                <h3 className="text-[18px] font-bold text-zinc-900 dark:text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 flex-1">
                  {category.description}
                </p>

                <div className="space-y-3">
                  {category.articles.map((article) => (
                    <a
                      key={article.title}
                      href={article.href}
                      className="flex items-start gap-2.5 text-[13px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50 mt-1.5 shrink-0" />
                      {article.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TWO-COLUMN: CONTACT & FAQ */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Left: Contact Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-zinc-900 dark:text-white mb-2">Need more help?</h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-[14px]">Get in touch with our team.</p>
            </div>

            {/* Email Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121212] border border-zinc-200 dark:border-white/5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <h3 className="text-[16px] font-bold text-zinc-900 dark:text-white mb-2">Email Support</h3>
              <p className="text-[13px] text-zinc-600 dark:text-zinc-400 mb-6">
                Expect a response within 24 hours for MVP Plan members.
              </p>
              <a href="mailto:hello@threeai.com" className="block">
                <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[13px] font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors active:scale-[0.98]">
                  hello@threeai.com <ArrowRight size={14} />
                </button>
              </a>
            </div>

            {/* Quick Rules Box */}
            <div className="p-6 rounded-3xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-500/20">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-[14px] font-bold text-purple-900 dark:text-purple-300">Support Guidelines</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Use your workspace email address.",
                  "Do not send raw API keys via email.",
                  "Include decision context if debugging the engine.",
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-purple-800/80 dark:text-purple-300/70">
                    <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-purple-500/60" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: FAQs */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-zinc-900 dark:text-white mb-2">Frequently Asked Questions</h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-[14px]">Common questions about Three AI.</p>
            </div>
            
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
