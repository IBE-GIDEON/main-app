"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Loader2, Sparkles, AlertCircle, GitBranch, Network, Target, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

/* ─── Quotes shown on the left panel — edit freely ────────────────
   Add or remove objects. The panel cycles through them on mount.    */
const PANEL_QUOTES = [
  {
    text: "The quality of your decisions is the ceiling on everything else. three AI removes the ceiling.",
    author: "three AI",
    role: "Decision Engine",
  },
  {
    text: "We don't give you answers. We map the entire possibility space so the right answer becomes obvious.",
    author: "three AI",
    role: "Recursive Refinement",
  },
  {
    text: "Every hour spent in ambiguity is an hour your competitor spent executing. Close the gap.",
    author: "three AI",
    role: "Enterprise Strategy",
  },
];

export default function AuthPage() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) setError("Authentication failed. Please try again.");
  }, [searchParams]);

  /* Rotate quote every 6 seconds */
  useEffect(() => {
    const t = setInterval(() => setQuoteIndex((i) => (i + 1) % PANEL_QUOTES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const handleSocialAuth = async (provider: string) => {
    try {
      setIsLoading(provider);
      setError(null);
      await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsLoading(null);
    }
  };

  const quote = PANEL_QUOTES[quoteIndex];

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex selection:bg-[#E58A6A]/20 selection:text-[#1C1B18] font-sans overflow-hidden">

      {/* ══════════════════════════════════════════
          LEFT PANEL — decorative / brand side
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden bg-[#1C1B18]">

        {/* Background texture layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Warm glow */}
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#E58A6A]/[0.12] blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#E58A6A]/[0.07] blur-[120px]" />

          {/* Subtle grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Branching SVG — mirrors the landing page bento art */}
          <svg viewBox="0 0 400 300" className="absolute right-[-40px] bottom-[15%] w-[340px] opacity-[0.08] stroke-white fill-none" strokeWidth="1">
            <path d="M20 150 Q 100 150 200 80 T 380 30" />
            <path d="M20 150 Q 100 150 200 220 T 380 270" />
            <circle cx="20"  cy="150" r="5" className="fill-[#E58A6A] stroke-none opacity-60" />
            <circle cx="200" cy="80"  r="4" className="fill-white/30 stroke-none" />
            <circle cx="200" cy="220" r="4" className="fill-white/30 stroke-none" />
            <circle cx="380" cy="30"  r="5" className="fill-emerald-400 stroke-none opacity-50" />
            <circle cx="380" cy="270" r="5" className="fill-rose-400 stroke-none opacity-50" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Image
            src="/logofive.PNG"
            alt="three AI"
            width={100}
            height={34}
            priority
            className="opacity-90"
          />
        </div>

        {/* Feature pills — midpoint */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: GitBranch, label: "Recursive branching engine" },
            { icon: Target,    label: "Stakes-weighted verdicts"   },
            { icon: Network,   label: "Visualised risk & upside"   },
            { icon: Lock,      label: "Zero-leakage data isolation" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-[#E58A6A]" />
              </div>
              <span className="text-[13px] text-white/50 font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Rotating quote */}
        <div className="relative z-10">
          <div
            key={quoteIndex}
            className="animate-in fade-in slide-in-from-bottom-3 duration-700"
          >
            {/* Quote mark */}
            <div className="text-[64px] leading-none text-[#E58A6A]/20 font-serif mb-2 select-none">&ldquo;</div>
            <blockquote className="text-[15px] text-white/70 leading-relaxed font-light mb-5 max-w-xs">
              {quote.text}
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#E58A6A]/20 border border-[#E58A6A]/30 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-[#E58A6A]" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-white/60">{quote.author}</p>
                <p className="text-[10px] text-white/25 uppercase tracking-widest">{quote.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — auth form
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">

        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#E58A6A]/[0.04] blur-[100px] rounded-[100%] pointer-events-none" />

        <div className="w-full max-w-[400px] relative z-10">

          {/* Mobile-only logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <Image src="/tw.png" alt="three AI" width={100} height={34} priority />
          </div>

          {/* Mode toggle */}
          <div className="flex bg-[#F0EFE9] p-1.5 rounded-2xl mb-10 border border-black/[0.06]">
            <button
              onClick={() => setMode("login")}
              className={cn(
                "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] rounded-xl transition-all duration-300",
                mode === "login"
                  ? "bg-[#FAFAF8] text-[#E58A6A] shadow-sm border border-black/[0.06]"
                  : "text-[#1C1B18]/35 hover:text-[#1C1B18]/60"
              )}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={cn(
                "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] rounded-xl transition-all duration-300",
                mode === "signup"
                  ? "bg-[#FAFAF8] text-[#E58A6A] shadow-sm border border-black/[0.06]"
                  : "text-[#1C1B18]/35 hover:text-[#1C1B18]/60"
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2
              key={mode}
              className="text-[26px] font-bold text-[#1C1B18] tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500 mb-2"
            >
              {mode === "login" ? "Welcome back." : "Start deciding smarter."}
            </h2>
            <p className="text-[14px] text-[#1C1B18]/40 leading-relaxed">
              {mode === "login"
                ? "Sign in to your three AI workspace."
                : "Create your account. It takes 10 seconds."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-500/8 border border-rose-400/20 text-rose-600 text-[12.5px] mb-6 animate-in zoom-in-95 duration-300">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          {/* ── Social providers ── */}
          <div className="flex flex-col gap-3">

            {/* Google */}
            <button
              disabled={!!isLoading}
              onClick={() => handleSocialAuth("google")}
              className="group flex items-center justify-center gap-3 bg-[#1C1B18] text-white text-[13.5px] font-semibold py-4 rounded-2xl hover:bg-[#2C2B28] transition-all active:scale-[0.98] disabled:opacity-40 shadow-[0_2px_12px_rgba(28,27,24,0.12)]"
            >
              {isLoading === "google" ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Apple */}
            <button
              disabled={!!isLoading}
              onClick={() => handleSocialAuth("apple")}
              className="group flex items-center justify-center gap-3 bg-[#F2F1ED] border border-black/[0.08] text-[#1C1B18] text-[13.5px] font-semibold py-4 rounded-2xl hover:bg-[#EAEAE4] transition-all active:scale-[0.98] disabled:opacity-40"
            >
              {isLoading === "apple" ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <svg className="w-[18px] h-[18px] mb-0.5" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-82.3-20.1-41.2.9-79.1 24.7-100.2 61.5-42.5 74.2-10.9 184.4 30.1 244.2 20 29 43.6 61.4 75 61 30.2-.5 41.8-18.6 78.3-18.6 36.3 0 46.9 18.6 78.8 17.9 32.7-.8 52.8-29.3 72.8-58.4 23.2-33.8 32.7-66.6 33.1-68.2-.7-.3-64-24.7-64.3-97.7zM286.7 71.7c16.2-19.7 27.2-47.2 24.3-74.7-23.7 1-52.6 15.8-69.6 35.6-15.1 17.7-28.3 45.4-24.7 72.3 26.2 2 53.8-13.5 70-33.2z"/>
                  </svg>
                  Continue with Apple
                </>
              )}
            </button>

            {/* Microsoft — new, same logic pattern */}
            <button
              disabled={!!isLoading}
              onClick={() => handleSocialAuth("azure-ad")}
              className="group flex items-center justify-center gap-3 bg-[#F2F1ED] border border-black/[0.08] text-[#1C1B18] text-[13.5px] font-semibold py-4 rounded-2xl hover:bg-[#EAEAE4] transition-all active:scale-[0.98] disabled:opacity-40"
            >
              {isLoading === "azure-ad" ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  {/* Official Microsoft 4-square logo */}
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1"  y="1"  width="9" height="9" fill="#F25022"/>
                    <rect x="11" y="1"  width="9" height="9" fill="#7FBA00"/>
                    <rect x="1"  y="11" width="9" height="9" fill="#00A4EF"/>
                    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                  </svg>
                  Continue with Microsoft
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-black/[0.07]" />
            <span className="text-[10.5px] uppercase tracking-widest text-[#1C1B18]/20 font-medium">secured by</span>
            <div className="flex-1 h-px bg-black/[0.07]" />
          </div>

          {/* Footer trust line */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-[10.5px] text-[#1C1B18]/30 font-medium uppercase tracking-widest">
              <Sparkles size={11} className="text-[#E58A6A]" />
              Zero-leakage · Data stays yours · SOC2 ready
            </div>
            <p className="text-[11px] text-[#1C1B18]/20 text-center leading-relaxed max-w-[280px]">
              By continuing you agree to our{" "}
              <a href="#" className="hover:text-[#E58A6A] transition-colors underline underline-offset-2">Terms</a>
              {" "}and{" "}
              <a href="#" className="hover:text-[#E58A6A] transition-colors underline underline-offset-2">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}