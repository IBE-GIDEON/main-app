// File: /app/pricing/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import TrustedBySection from "@/components/TrustedbySection";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "Free",
    priceSub: "",
    bullets: [
      "Basic AI assistant",
      "Task management",
      "File, Bank Transfers",
      "3 app integrations",
      "Limited voice commands",
    ],
    emphasized: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    priceSub: "/month",
    bullets: [
      "Everything in Free",
      "Unlimited integrations",
      "Voice + automation triggers",
      "Custom daily AI summaries",
      "Smart notification filtering",
    ],
    emphasized: true, // Most Popular
  },
  {
    id: "premium",
    name: "Premium",
    price: "$19",
    priceSub: "/month",
    bullets: [
      "Everything in Pro",
      "Advanced voice AI",
      "Custom automations (ZenFlows)",
      "Team collaboration",
      "Early access to decentralized data vaults",
    ],
    emphasized: false,
  },
];

const faqs = [
  {
    q: "Will ZenOS replace my other productivity apps?",
    a:
      "Not unless you want it to. ZenOS connects and enhances your existing apps — it unifies them under one AI-powered interface so you can keep what you love and automate the rest.",
  },
  {
    q: "Can I connect Notion, Google, or TikTok?",
    a:
      "Yes — ZenOS supports major integrations (Notion, Gmail, Google Calendar, TikTok, Slack, Zoom and more). New connectors are added frequently via our integrations hub.",
  },
  {
    q: "How is my data protected?",
    a:
      "Your data is encrypted at rest and in transit. We use industry-standard encryption, strict access controls, and optional end-to-end or decentralized vaults for the highest privacy scenarios.",
  },
  {
    q: "Does the AI work offline?",
    a:
      "Core local features (offline caching, basic automations) can work without a connection. Advanced AI features require a network (server or cloud model access) — we aim for graceful degradation when offline.",
  },
  {
    q: "Can I upgrade or cancel anytime?",
    a:
      "Yes. Upgrade, downgrade, or cancel from your account dashboard at any time. Billing is prorated for upgrades and your data remains available after cancellation.",
  },
  {
    q: "How does ZenOS differ from Siri or ChatGPT?",
    a:
      "Siri is a device assistant, ChatGPT is a generalized LLM. ZenOS combines a focused AI assistant + deep app integrations + automation flows to manage your whole digital life end-to-end.",
  },
  {
    q: "Will it work on mobile devices?",
    a:
      "Absolutely. ZenOS is designed to be fully responsive and ships native mobile apps for iOS and Android with parity features (plus a lightweight PWA).",
  },
  {
    q: "Is Zen Ai always active?",
    a:
      "Yes Zen Ai is always active weather in the dashboard or outside the app dashboard, call it at your pace its always active to serve you.",
  },
];

export default function PricingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-50 text-gray-900">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4"></div>
        </div>
      </header>

      {/* Pricing Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold">Choose a plan that fits</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Start free, scale to Pro for power users, or go Premium for teams and advanced automations.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-8 mx-auto h-[260px] max-w-6xl rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-purple-50 opacity-60 pointer-events-none -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
            {plans.map((p) => (
              <article
                key={p.id}
                className={`rounded-2xl p-8 shadow-xl border ${
                  p.emphasized
                    ? "transform scale-105 border-transparent bg-gradient-to-br from-white/60 to-white/50"
                    : "bg-white/70 border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{p.name}</h3>

                  {p.emphasized && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-600 text-white">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-baseline gap-x-3">
                  <span className="text-4xl md:text-5xl font-extrabold">{p.price}</span>
                  <span className="text-gray-500">{p.priceSub}</span>
                </div>

                <ul className="mt-6 space-y-3 text-gray-700">
                  {p.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </span>
                      <span className="text-sm">{b}</span>
                    </li>
                  ))}
                </ul>

                {/* ---- 🔥 Button Now Linkable ---- */}
                <div className="mt-8">
                  <Link href={`/create-account?plan=${p.id}`}>
                    <button
                      className={`w-full rounded-xl py-3 font-semibold transition transform hover:-translate-y-0.5 ${
                        p.emphasized
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                          : "bg-white border border-gray-200 text-gray-900 hover:shadow"
                      }`}
                    >
                      {p.emphasized
                        ? "Start Your Free Trial"
                        : p.price === "Free"
                        ? "Get Started"
                        : "Choose plan"}
                    </button>
                  </Link>

                  {p.emphasized && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                      No credit card required.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 py-14">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Start your ZenOS journey</h3>
            <p className="text-gray-600 mt-1">Try Pro for 14 days. Cancel anytime.</p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/create-account" className="inline-block">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-indigo-700 transition">
                Start Your Free Trial
              </button>
            </Link>

            <Link href="/contact-sales" className="text-sm text-gray-700 underline">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <div><TrustedBySection /></div>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center mb-8">Frequently asked questions</h3>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="group bg-white/70 p-5 rounded-lg shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-lg font-semibold">{f.q}</span>
                <svg
                  className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div><Footer /></div>
    </main>
  );
}
