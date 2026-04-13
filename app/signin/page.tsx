"use client";

import { Suspense } from 'react';
import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import {
  Loader2,
  Sparkles,
  AlertCircle,
  Lock,
  ArrowUpRight,
  Menu,
  X,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

/* ─────────────────────────────────────────
   TOKENS
───────────────────────────────────────── */
const CREAM = "#F2F0EA";
const INK = "#0F0E0B";
const LILAC = "#B9A7FF";
const MUTED = "#8A8780";

// 1. Rename your main function and remove 'export default'
function AuthPageContent() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "signup" || modeParam === "login") {
      setMode(modeParam);
    }

    const errorParam = searchParams.get("error");
    if (errorParam) setError("Authentication failed. Please try again.");
  }, [searchParams]);

  const handleSocialAuth = async (provider: string) => {
    try {
      setIsLoading(provider);
      setError(null);
      await signIn(provider, {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch {
      setError("An unexpected error occurred.");
      setIsLoading(null);
    }
  };

  return (
    <div className="auth-page-shell">
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

        .auth-page-shell {
          min-height: 100vh;
          background: ${CREAM};
          color: ${INK};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow: hidden;
          position: relative;
          selection: none;
        }

        .auth-page-shell ::selection {
          background: rgba(185,167,255,0.22);
          color: ${INK};
        }

        .auth-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 60;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          background: rgba(242,240,234,0.88);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(15,14,11,0.08);
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
          color: rgba(15,14,11,0.58);
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

        .nav-link:hover {
          color: ${INK};
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
          z-index: 59;
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

        .auth-layout {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
        }

        .left-panel {
          position: relative;
          overflow: hidden;
          padding: 116px 48px 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid rgba(242,240,234,0.08);
          background: ${INK};
        }

        .left-bg-image {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(180deg, rgba(15,14,11,0.18) 0%, rgba(15,14,11,0.48) 38%, rgba(15,14,11,0.82) 100%),
            url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80');
          background-size: cover;
          background-position: center;
          transform: scale(1.02);
        }

        .left-bg-grid {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(242,240,234,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(242,240,234,0.8) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .left-panel::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(185,167,255,0.12), transparent 40%, transparent 60%, rgba(185,167,255,0.06));
          pointer-events: none;
        }

        .left-content {
          position: relative;
          z-index: 2;
        }

        .left-panel-logo {
          display: flex;
          align-items: baseline;
          gap: 2px;
          margin-bottom: 56px;
        }

        .left-panel-logo .brand-think {
          color: ${CREAM};
        }

        .left-panel-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(242,240,234,0.16);
          background: rgba(242,240,234,0.05);
          margin-bottom: 22px;
        }

        .left-panel-headline {
          font-size: clamp(34px, 4vw, 58px);
          line-height: 0.96;
          letter-spacing: -0.045em;
          font-weight: 800;
          margin-bottom: 16px;
          text-transform: uppercase;
          max-width: 500px;
          color: ${CREAM};
        }

        .left-panel-copy {
          font-size: 16px;
          line-height: 1.7;
          color: rgba(242,240,234,0.7);
          max-width: 430px;
        }

        .left-panel-bottom {
          position: relative;
          z-index: 2;
          max-width: 420px;
        }

        .left-panel-bottom-line {
          width: 100%;
          height: 1px;
          background: rgba(242,240,234,0.12);
          margin-bottom: 18px;
        }

        .left-panel-trust {
          display: grid;
          gap: 12px;
        }

        .trust-item {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 10px;
          align-items: start;
        }

        .trust-item p {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(242,240,234,0.62);
        }

        .right-panel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 28px 40px;
          background: linear-gradient(to bottom, ${CREAM} 0%, #f7f5ef 100%);
        }

        .right-panel::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(520px, 70vw);
          height: 280px;
          border-radius: 999px;
          background: rgba(185,167,255,0.1);
          filter: blur(100px);
          pointer-events: none;
        }

        .auth-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 430px;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(255,255,255,0.44);
          backdrop-filter: blur(10px);
          padding: 28px;
        }

        .mobile-brand {
          display: none;
          justify-content: center;
          align-items: baseline;
          gap: 2px;
          margin-bottom: 28px;
        }

        .mode-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          padding: 6px;
          background: rgba(15,14,11,0.04);
          border: 1px solid rgba(15,14,11,0.08);
          margin-bottom: 30px;
        }

        .mode-button {
          border: none;
          background: transparent;
          padding: 12px 14px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.38);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .mode-button-active {
          background: ${CREAM};
          color: ${INK};
          border: 1px solid rgba(15,14,11,0.08);
        }

        .auth-heading {
          font-size: 30px;
          line-height: 1.02;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: ${INK};
          margin-bottom: 10px;
        }

        .auth-subheading {
          font-size: 15px;
          line-height: 1.65;
          color: rgba(15,14,11,0.5);
          margin-bottom: 24px;
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 14px;
          border: 1px solid rgba(220,38,38,0.18);
          background: rgba(220,38,38,0.05);
          color: #b42318;
          font-size: 13px;
          margin-bottom: 18px;
        }

        .provider-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .provider-btn,
        .provider-btn-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: 1px solid rgba(15,14,11,0.08);
          padding: 15px 18px;
          background: rgba(15,14,11,0.03);
          color: ${INK};
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .provider-btn-primary {
          background: ${INK};
          color: ${CREAM};
          border-color: rgba(15,14,11,0.12);
          box-shadow: 0 10px 24px rgba(15,14,11,0.08);
        }

        .provider-btn-primary:hover:not(:disabled) {
          background: #1c1b19;
        }

        .provider-btn:hover:not(:disabled) {
          background: rgba(15,14,11,0.06);
        }

        .provider-btn:disabled,
        .provider-btn-primary:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .provider-btn-blurred {
          filter: blur(1.5px);
          opacity: 0.45;
          pointer-events: none;
        }

        .divider-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 20px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(15,14,11,0.08);
        }

        .divider-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.28);
        }

        .trust-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .trust-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.38);
          text-align: center;
          line-height: 1.6;
        }

        .trust-copy {
          font-size: 12px;
          line-height: 1.7;
          color: rgba(15,14,11,0.34);
          text-align: center;
          max-width: 300px;
        }

        .trust-copy a {
          color: ${INK};
          text-decoration: none;
          border-bottom: 1px solid rgba(15,14,11,0.14);
          transition: border-color 0.2s ease, color 0.2s ease;
        }

        .trust-copy a:hover {
          color: ${INK};
          border-color: rgba(15,14,11,0.34);
        }

        .soft-animate {
          animation: fadeSlide 0.55s ease;
        }

        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${INK}; }
        ::-webkit-scrollbar-thumb { background: rgba(242,240,234,0.22); }

        @media (max-width: 1100px) {
          .auth-layout {
            grid-template-columns: 1fr;
          }

          .left-panel {
            display: none;
          }

          .mobile-brand {
            display: flex;
          }

          .right-panel {
            padding-top: 110px;
            padding-bottom: 32px;
            min-height: 100vh;
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

        @media (max-width: 640px) {
          .auth-nav {
            padding: 0 16px;
          }

          .right-panel {
            padding: 98px 16px 24px;
          }

          .auth-card {
            padding: 22px 18px;
          }

          .auth-heading {
            font-size: 26px;
          }

          .provider-btn,
          .provider-btn-primary {
            font-size: 13.5px;
            padding: 14px 16px;
          }
        }
      `}</style>

      <div className="auth-layout">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="left-bg-image" />
          <div className="left-bg-grid" />

          <div className="left-content">
             <a href="/">
                    <div className="flex items-center gap-3 mb-6 mt-[-30]">

                        <img src="/logofive.PNG" alt="threeAI Logo" className="h-[30px] w-auto mt-5 nav-logo" />
                    
                    </div></a>

            <div className="left-panel-kicker">
              <Lock size={13} color={LILAC} />
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(242,240,234,0.78)",
                }}
              >
                Trusted enterprise access
              </span>
            </div>

            <h1 className="font-display left-panel-headline">
              Decide with
              <br />
              confidence.
            </h1>

            <p className="font-editorial left-panel-copy">
              Secure access for modern teams.
            </p>
          </div>

          <div className="left-panel-bottom">
            <div className="left-panel-bottom-line" />
            <div className="left-panel-trust">
              <div className="trust-item">
                <CheckCircle size={14} color={LILAC} />
                <p className="font-editorial">Private by design.</p>
              </div>
              <div className="trust-item">
                <CheckCircle size={14} color={LILAC} />
                <p className="font-editorial">Built for executive workflows.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="auth-card">
            <div className="mobile-brand">
            <img src="/logofive.PNG" alt="threeAI Logo" className="h-[30px] w-auto mt-5 nav-logo" />
                               
            </div>

            <div className="mode-toggle">
              <button
                onClick={() => setMode("login")}
                className={cn("mode-button", mode === "login" && "mode-button-active")}
              >
                Login
              </button>
              <button
                onClick={() => setMode("signup")}
                className={cn("mode-button", mode === "signup" && "mode-button-active")}
              >
                Sign Up
              </button>
            </div>

            <div className="soft-animate" key={mode}>
              <h2 className="font-display auth-heading">
                {mode === "login" ? "Welcome back." : "Start deciding smarter."}
              </h2>
              <p className="font-editorial auth-subheading">
                {mode === "login"
                  ? "Sign in to your three AI workspace."
                  : "Create your account and get started in seconds."}
              </p>
            </div>

            {error && (
              <div className="error-box soft-animate">
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="provider-stack">
              <button
                disabled={!!isLoading}
                onClick={() => handleSocialAuth("google")}
                className="provider-btn-primary"
              >
                {isLoading === "google" ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <button
                disabled={true}
                onClick={() => handleSocialAuth("apple")}
                className="provider-btn provider-btn-blurred"
                title="Coming soon"
              >
                {isLoading === "apple" ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 384 512" fill="currentColor">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-82.3-20.1-41.2.9-79.1 24.7-100.2 61.5-42.5 74.2-10.9 184.4 30.1 244.2 20 29 43.6 61.4 75 61 30.2-.5 41.8-18.6 78.3-18.6 36.3 0 46.9 18.6 78.8 17.9 32.7-.8 52.8-29.3 72.8-58.4 23.2-33.8 32.7-66.6 33.1-68.2-.7-.3-64-24.7-64.3-97.7zM286.7 71.7c16.2-19.7 27.2-47.2 24.3-74.7-23.7 1-52.6 15.8-69.6 35.6-15.1 17.7-28.3 45.4-24.7 72.3 26.2 2 53.8-13.5 70-33.2z" />
                    </svg>
                    Continue with Apple
                  </>
                )}
              </button>

              <button
                disabled={true}
                onClick={() => handleSocialAuth("azure-ad")}
                className="provider-btn provider-btn-blurred"
                title="Coming soon"
              >
                {isLoading === "azure-ad" ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                    </svg>
                    Continue with Microsoft
                  </>
                )}
              </button>
            </div>

            <div className="divider-row">
              <div className="divider-line" />
              <span className="divider-text">Secured by</span>
              <div className="divider-line" />
            </div>

            <div className="trust-block">
              <div className="trust-row">
                <Sparkles size={11} color={LILAC} />
                Zero-leakage · Data stays yours · SOC2 ready
              </div>

              <p className="font-editorial trust-copy">
                By continuing you agree to our{" "}
                <a href="/pandt">Terms</a> and{" "}
                <a href="/pandt">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. The protective Suspense boundary wrap
export default function AuthPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F2F0EA]">
          <div className="text-[10px] font-mono tracking-[0.16em] uppercase text-[#0F0E0B] opacity-50">
            Loading...
          </div>
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}

function AuthNav() {
  const [open, setOpen] = useState(false);

  const items = [
    { label: "Home", href: "/" },
    { label: "Use Cases", href: "/use-case" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      {open && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-inner">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="nav-link mobile-nav-link"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <div className="mobile-divider" />

            <a
              href="/signin?mode=login"
              className="nav-link mobile-nav-link"
              onClick={() => setOpen(false)}
            >
              Sign In
            </a>

            <a href="/signin?mode=signup" onClick={() => setOpen(false)}>
              <button className="btn-dark mobile-full-width">
                Contact Sales <ArrowUpRight size={12} />
              </button>
            </a>
          </div>
        </div>
      )}
    </>
  );
}