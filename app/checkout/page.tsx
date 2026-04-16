"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Lock,
  Sparkles,
  Loader2,
  AlertCircle,
  GitBranch,
  Target,
  Network,
  Shield,
  BarChart3,
  Clock,
  Users,
  Cpu,
  Zap,
  ChevronRight,
  ArrowLeft,
  ArrowUpRight,
  CreditCard,
  MapPin,
  Mail,
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
   PAYSTACK CONFIG
───────────────────────────────────────── */
const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "pk_test_REPLACE_ME";

const AMOUNT_IN_CENTS = 56000;
const CURRENCY = "USD";

/* ─────────────────────────────────────────
   PLAN DETAILS
───────────────────────────────────────── */
const PLAN = {
  name: "MVP Plan",
  price: "$560",
  period: "/ month",
  description:
    "The full three AI decision engine — branching logic, risk scoring, verdict cards, and the Aside panel.",
  badge: "Available Now",
  features: [
    { icon: GitBranch, text: "Unlimited recursive branching engine" },
    { icon: Target, text: "Full upside & risk scoring per branch" },
    { icon: CheckCircle, text: "Verdict cards with go / stop / review" },
    { icon: Network, text: "Aside AI panel — live alongside your workflow" },
    { icon: Zap, text: "Next-step execution recommendations" },
    { icon: Shield, text: "Zero-leakage data isolation" },
    { icon: BarChart3, text: "Up to 50 decisions per month" },
    { icon: Clock, text: "Full decision history & audit trail" },
    { icon: Users, text: "Single-user workspace" },
    { icon: Cpu, text: "Groq-powered ultra-low latency" },
  ],
};

/* ─────────────────────────────────────────
   PAYSTACK HOOK
───────────────────────────────────────── */
function usePaystack() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (document.getElementById("paystack-inline-js")) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "paystack-inline-js";
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);
  }, []);

  const pay = ({
    email,
    name,
    onSuccess,
    onClose,
  }: {
    email: string;
    name: string;
    onSuccess: (reference: string) => void;
    onClose: () => void;
  }) => {
    if (!ready || !(window as any).PaystackPop) return;

    const handler = (window as any).PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: AMOUNT_IN_CENTS,
      currency: CURRENCY,
      ref: `thinkai_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      metadata: {
        custom_fields: [
          { display_name: "Full Name", variable_name: "full_name", value: name },
          { display_name: "Plan", variable_name: "plan", value: "MVP" },
        ],
      },
      callback: (response: { reference: string }) => {
        onSuccess(response.reference);
      },
      onClose,
    });

    handler.openIframe();
  };

  return { ready, pay };
}

/* ─────────────────────────────────────────
   INFO BOX
───────────────────────────────────────── */
function InfoBox({
  icon: Icon,
  title,
  body,
}: {
  icon: any;
  title: string;
  body: string;
}) {
  return (
    <div className="info-box">
      <div className="info-icon">
        <Icon size={15} color={LILAC} />
      </div>
      <div>
        <p className="info-title">{title}</p>
        <p className="info-body">{body}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CHECKOUT FORM
───────────────────────────────────────── */
function CheckoutForm() {
  const { ready, pay } = usePaystack();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;

    setIsLoading(true);
    setError(null);

    pay({
      email,
      name,
      onSuccess: async (reference) => {
        try {
          const res = await fetch("/api/paystack/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference }),
          });
          if (!res.ok) throw new Error("Verification failed.");
          setSuccess(true);
        } catch (err: any) {
          setError(
            err.message ??
              "Payment verified on Paystack but confirmation failed. Contact support."
          );
        } finally {
          setIsLoading(false);
        }
      },
      onClose: () => {
        setIsLoading(false);
      },
    });
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="success-shell"
      >
        <div className="success-icon">
          <CheckCircle size={30} color="#16a34a" />
        </div>

        <div>
          <h3 className="success-title">You&apos;re in.</h3>
          <p className="success-copy">
            Your three AI workspace is ready. Start making your first decision now.
          </p>
        </div>

        <a href="/dashboard">
          <button className="btn-dark">
            Go to Dashboard <ChevronRight size={14} />
          </button>
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-box"
        >
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </motion.div>
      )}

      <div className="field-wrap">
        <label className="field-label">Full name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ada Lovelace"
          className="field-input"
        />
      </div>

      <div className="field-wrap">
        <label className="field-label">Email address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ada@company.com"
          className="field-input"
        />
      </div>

      <div className="summary-row">
        <div>
          <p className="summary-title">{PLAN.name}</p>
          <p className="summary-sub">Billed monthly · Cancel anytime</p>
        </div>
        <div className="summary-price-wrap">
          <p className="summary-price">{PLAN.price}</p>
          <p className="summary-period">{PLAN.period}</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!ready || isLoading}
        className="pay-btn"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : !ready ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Loading payment
          </>
        ) : (
          <>
            <Lock size={15} />
            Pay $560 Securely
          </>
        )}
      </button>

      <div className="trust-block">
        <div className="trust-row">
          <Sparkles size={11} color={LILAC} />
          Secured by Paystack · Cancel anytime · Data stays yours
        </div>

        <p className="trust-copy">
          By continuing you agree to our{" "}
          <a href="/pandt">Terms</a> and{" "}
          <a href="/pandt">Privacy Policy</a>.
        </p>
      </div>
    </form>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function CheckoutPage() {
  return (
    <div className="page-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }

        .page-shell {
          min-height: 100vh;
          background: ${CREAM};
          color: ${INK};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .page-shell ::selection {
          background: rgba(185,167,255,0.22);
          color: ${INK};
        }

        .font-display {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: -0.03em;
        }

        .brand-mark {
          display: flex;
          align-items: baseline;
          gap: 2px;
          text-decoration: none;
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

        .btn-dark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: none;
          cursor: pointer;
          padding: 14px 24px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.25s ease;
          white-space: nowrap;
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgba(15,14,11,0.12);
          background: transparent;
          color: ${INK};
          cursor: pointer;
          padding: 14px 24px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .btn-light:hover {
          background: rgba(15,14,11,0.04);
        }

        .checkout-layout {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
        }

        .left-panel {
          position: relative;
          background: ${INK};
          color: ${CREAM};
          padding: 112px 48px 48px;
          border-right: 1px solid rgba(242,240,234,0.08);
          overflow: hidden;
        }

        .left-panel::before {
          content: "";
          position: absolute;
          top: -10%;
          left: -10%;
          width: 500px;
          height: 500px;
          border-radius: 999px;
          background: rgba(185,167,255,0.13);
          filter: blur(120px);
          pointer-events: none;
        }

        .left-panel::after {
          content: "";
          position: absolute;
          right: -10%;
          bottom: -10%;
          width: 420px;
          height: 420px;
          border-radius: 999px;
          background: rgba(185,167,255,0.07);
          filter: blur(110px);
          pointer-events: none;
        }

        .left-grid {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(242,240,234,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(242,240,234,0.8) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .left-inner {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .left-top {
          max-width: 520px;
        }

        .left-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(185,167,255,0.25);
          background: rgba(185,167,255,0.08);
          margin-bottom: 24px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${LILAC};
        }

        .left-title {
          font-size: clamp(38px, 5vw, 64px);
          line-height: 0.96;
          letter-spacing: -0.045em;
          font-weight: 800;
          margin-bottom: 18px;
          text-transform: uppercase;
          color: ${CREAM};
        }

        .left-copy {
          font-size: 16px;
          line-height: 1.72;
          color: rgba(242,240,234,0.64);
          max-width: 500px;
          margin-bottom: 30px;
        }

        .price-block {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          margin-bottom: 12px;
        }

        .price-main {
          font-size: 54px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: ${CREAM};
        }

        .price-period {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(242,240,234,0.34);
          margin-bottom: 8px;
        }

        .plan-desc {
          font-size: 14px;
          line-height: 1.72;
          color: rgba(242,240,234,0.52);
          max-width: 460px;
        }

        .feature-list {
          display: grid;
          gap: 12px;
          margin-top: 28px;
        }

        .feature-row {
          display: grid;
          grid-template-columns: 30px 1fr;
          gap: 12px;
          align-items: start;
        }

        .feature-icon {
          width: 30px;
          height: 30px;
          border: 1px solid rgba(242,240,234,0.12);
          background: rgba(242,240,234,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${LILAC};
        }

        .feature-row span {
          font-size: 13px;
          line-height: 1.55;
          color: rgba(242,240,234,0.58);
        }

        .left-bottom {
          display: grid;
          gap: 12px;
          max-width: 520px;
          margin-top: 28px;
        }

        .right-panel {
          position: relative;
          background: linear-gradient(to bottom, ${CREAM} 0%, ${PANEL_2} 100%);
          padding: 112px 28px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .right-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 440px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
          text-decoration: none;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.38);
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: ${INK};
        }

        .mobile-summary {
          display: none;
          margin-bottom: 18px;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(255,255,255,0.45);
          padding: 18px;
        }

        .panel-card {
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(255,255,255,0.48);
          backdrop-filter: blur(10px);
          padding: 24px;
        }

        .checkout-head {
          margin-bottom: 22px;
        }

        .checkout-title {
          font-size: 30px;
          line-height: 1.03;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: ${INK};
          margin-bottom: 10px;
        }

        .checkout-copy {
          font-size: 15px;
          line-height: 1.65;
          color: rgba(15,14,11,0.5);
        }

        .important-grid {
          display: grid;
          gap: 10px;
          margin-bottom: 18px;
        }

        .info-box {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 12px;
          align-items: start;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(15,14,11,0.02);
          padding: 14px;
        }

        .info-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(185,167,255,0.25);
          background: rgba(185,167,255,0.08);
        }

        .info-title {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${INK};
          margin-bottom: 6px;
        }

        .info-body {
          font-size: 12.5px;
          line-height: 1.65;
          color: rgba(15,14,11,0.48);
        }

        .checkout-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.34);
        }

        .field-input {
          width: 100%;
          height: 52px;
          padding: 0 14px;
          border: 1px solid rgba(15,14,11,0.1);
          background: rgba(15,14,11,0.03);
          font-size: 14px;
          color: ${INK};
          outline: none;
          transition: all 0.2s ease;
        }

        .field-input::placeholder {
          color: rgba(15,14,11,0.28);
        }

        .field-input:focus {
          border-color: rgba(185,167,255,0.5);
          background: rgba(255,255,255,0.65);
          box-shadow: 0 0 0 3px rgba(185,167,255,0.1);
        }

        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px;
          border: 1px solid rgba(15,14,11,0.08);
          background: rgba(15,14,11,0.03);
        }

        .summary-title {
          font-size: 14px;
          font-weight: 700;
          color: ${INK};
          margin-bottom: 4px;
        }

        .summary-sub {
          font-size: 12px;
          color: rgba(15,14,11,0.4);
        }

        .summary-price-wrap {
          text-align: right;
        }

        .summary-price {
          font-size: 22px;
          font-weight: 800;
          line-height: 1;
          color: ${INK};
          letter-spacing: -0.03em;
        }

        .summary-period {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.28);
          margin-top: 4px;
        }

        .pay-btn {
          width: 100%;
          height: 54px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: ${INK};
          color: ${CREAM};
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.25s ease;
        }

        .pay-btn:hover:not(:disabled) {
          background: ${LILAC};
          color: ${CREAM};
        }

        .pay-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          border: 1px solid rgba(220,38,38,0.18);
          background: rgba(220,38,38,0.05);
          color: #b42318;
          font-size: 13px;
        }

        .trust-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding-top: 2px;
        }

        .trust-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(15,14,11,0.36);
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
        }

        .success-shell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 52px 0 18px;
          gap: 22px;
        }

        .success-icon {
          width: 78px;
          height: 78px;
          border: 1px solid rgba(34,197,94,0.18);
          background: rgba(34,197,94,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-title {
          font-size: 28px;
          line-height: 1.04;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: ${INK};
          margin-bottom: 8px;
        }

        .success-copy {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(15,14,11,0.5);
          max-width: 300px;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${INK}; }
        ::-webkit-scrollbar-thumb { background: rgba(242,240,234,0.22); }

        @media (max-width: 1100px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }

          .left-panel {
            display: none;
          }

          .mobile-summary {
            display: block;
          }

          .right-panel {
            min-height: 100vh;
            padding-top: 108px;
            padding-bottom: 32px;
          }
        }

        @media (max-width: 640px) {
          .right-panel {
            padding: 94px 16px 24px;
          }

          .right-inner {
            max-width: 100%;
          }

          .panel-card {
            padding: 20px 18px;
          }

          .checkout-title {
            font-size: 26px;
          }

          .summary-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .summary-price-wrap {
            text-align: left;
          }
        }
      `}</style>

      <div className="checkout-layout">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="left-grid" />

          <div className="left-inner">
            <div className="left-top">
                <a href="/">
                    <div className="flex items-center gap-3 mb-6 mt-[-30]">

                        <img src="/logofive.png" alt="three AI logo" className="h-[30px] w-auto mt-5 nav-logo" />
                    
                    </div></a>

              <div className="left-kicker">
                <Sparkles size={12} color={LILAC} />
                <span>{PLAN.badge}</span>
              </div>

              <h1 className="left-title">Complete your order.</h1>
              <p className="left-copy">
                Secure checkout for the MVP plan. Access the full decision engine,
                audit trail, and structured reasoning workflow.
              </p>

              <div className="price-block">
                <span className="price-main">{PLAN.price}</span>
                <span className="price-period">{PLAN.period}</span>
              </div>

              <p className="plan-desc">{PLAN.description}</p>

              <div className="feature-list">
                {PLAN.features.slice(0, 6).map(({ icon: Icon, text }) => (
                  <div key={text} className="feature-row">
                    <div className="feature-icon">
                      <Icon size={14} />
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="left-bottom">
              <InfoBox
                icon={Shield}
                title="No lock-in"
                body="Cancel anytime from your dashboard. No contracts, no exit fees."
              />
              <InfoBox
                icon={Mail}
                title="Support"
                body="Need invoicing or help with billing? Contact hello@thinkai.com."
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="right-inner">
            <a href="/pricing" className="back-link">
              <ArrowLeft size={13} />
              Back to Pricing
            </a>

            <div className="mobile-summary">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: INK }}>{PLAN.name}</p>
                  <p style={{ fontSize: 12, color: "rgba(15,14,11,0.42)", marginTop: 4 }}>{PLAN.description}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", color: INK }}>{PLAN.price}</p>
                  <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(15,14,11,0.28)", marginTop: 4 }}>
                    {PLAN.period}
                  </p>
                </div>
              </div>
            </div>

            <div className="panel-card">
              <div className="checkout-head">
                <h2 className="checkout-title">Complete your order.</h2>
                <p className="checkout-copy">
                  You&apos;re one step away from your first defensible decision.
                </p>
              </div>

              <div className="important-grid">
                <InfoBox
                  icon={CreditCard}
                  title="Payment"
                  body="Secure Paystack checkout. Your transaction is verified before access is granted."
                />
                <InfoBox
                  icon={MapPin}
                  title="Billing details"
                  body="Use your active work email. Add company billing details later inside your workspace if needed."
                />
              </div>

              <CheckoutForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
