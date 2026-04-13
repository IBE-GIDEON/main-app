"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle, MapPin } from 'lucide-react';

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You don't have permission to sign in.",
  Verification: "The sign in link is no longer valid.",
  OAuthSignin: "Could not connect to the auth provider.",
  OAuthCallback: "Something went wrong during sign in.",
  OAuthCreateAccount: "Could not create your account.",
  EmailCreateAccount: "Could not create your account.",
  Callback: "Something went wrong during sign in.",
  Default: "An unexpected error occurred.",
};

// 1. The main content component that uses useSearchParams
function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") ?? "Default";
  const message = ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default;

  return (
    <div className="error-page-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }

        :root {
          --bg: #111315;
          --bg-soft: #171a1d;
          --panel: #f3f4f6;
          --panel-2: #eef0f2;
          --text: #111315;
          --muted: #5f6670;
          --line: rgba(255,255,255,0.07);
          --line-dark: rgba(17,19,21,0.09);
          --ash-1: #d7dbe0;
          --ash-2: #9aa3ad;
          --ash-3: #6b7280;
          --success: #22c55e;
          --danger: #dc2626;
        }

        .error-page-shell {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 28px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 12% 18%, rgba(255,255,255,0.04), transparent 28%),
            radial-gradient(circle at 86% 82%, rgba(255,255,255,0.03), transparent 24%),
            linear-gradient(180deg, #101214 0%, #131619 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .error-page-shell::selection {
          background: rgba(255,255,255,0.18);
          color: white;
        }

        .bg-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.07;
          background-image:
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(circle at center, black 42%, transparent 100%);
          -webkit-mask-image: radial-gradient(circle at center, black 42%, transparent 100%);
        }

        .bg-glow-left,
        .bg-glow-right {
          position: absolute;
          border-radius: 999px;
          filter: blur(120px);
          pointer-events: none;
        }

        .bg-glow-left {
          top: -8%;
          left: -6%;
          width: 480px;
          height: 480px;
          background: rgba(255,255,255,0.05);
        }

        .bg-glow-right {
          right: -8%;
          bottom: -10%;
          width: 420px;
          height: 420px;
          background: rgba(255,255,255,0.035);
        }

        .outer-shell {
          position: relative;
          z-index: 2;
          width: min(1200px, 100%);
          min-height: min(760px, calc(100vh - 72px));
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          border-radius: 40px;
          overflow: hidden;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(14px);
          box-shadow:
            0 30px 90px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .left-panel {
          position: relative;
          padding: 44px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%);
          border-right: 1px solid var(--line);
        }

        .brand {
          display: inline-flex;
          align-items: baseline;
          gap: 2px;
          text-decoration: none;
          width: fit-content;
        }

        .brand-think {
          font-size: 24px;
          font-weight: 800;
          color: #f5f7fa;
          letter-spacing: -0.03em;
        }

        .brand-ai {
          font-size: 24px;
          font-weight: 600;
          color: #c8cfd7;
          letter-spacing: -0.03em;
        }

        .status-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 999px;
          width: fit-content;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
          margin-bottom: 22px;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #9aa3ad;
          box-shadow: 0 0 10px rgba(154,163,173,0.35);
        }

        .left-main {
          max-width: 560px;
        }

        .left-title {
          font-size: clamp(42px, 6vw, 82px);
          line-height: 0.96;
          letter-spacing: -0.05em;
          font-weight: 800;
          color: #f8fafc;
          margin-bottom: 18px;
          text-transform: uppercase;
        }

        .left-copy {
          font-size: 17px;
          line-height: 1.72;
          color: rgba(255,255,255,0.58);
          max-width: 480px;
        }

        .left-bottom {
          max-width: 520px;
          display: grid;
          gap: 12px;
        }

        .info-card-dark {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 14px;
          align-items: start;
          padding: 18px 18px;
          border-radius: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .info-icon-dark {
          width: 42px;
          height: 42px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #d8dde3;
          flex-shrink: 0;
        }

        .info-title-dark {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.76);
          margin-bottom: 7px;
        }

        .info-copy-dark {
          font-size: 13px;
          line-height: 1.65;
          color: rgba(255,255,255,0.52);
        }

        .right-panel {
          position: relative;
          background: linear-gradient(180deg, var(--panel) 0%, var(--panel-2) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 44px;
        }

        .right-panel::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(520px, 80%);
          height: 220px;
          background: rgba(17,19,21,0.04);
          filter: blur(90px);
          border-radius: 999px;
          pointer-events: none;
        }

        .error-card {
          position: relative;
          z-index: 2;
          width: min(100%, 540px);
          min-height: 560px;
          border-radius: 34px;
          padding: 34px;
          background: rgba(255,255,255,0.62);
          border: 1px solid var(--line-dark);
          box-shadow:
            0 22px 60px rgba(17,19,21,0.12),
            inset 0 1px 0 rgba(255,255,255,0.55);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .error-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          padding: 9px 12px;
          border-radius: 999px;
          background: rgba(17,19,21,0.04);
          border: 1px solid rgba(17,19,21,0.08);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(17,19,21,0.68);
          margin-bottom: 22px;
        }

        .error-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--ash-3);
        }

        .error-title {
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.02;
          letter-spacing: -0.045em;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 14px;
        }

        .error-message {
          font-size: 15px;
          line-height: 1.72;
          color: rgba(17,19,21,0.56);
          margin-bottom: 24px;
          max-width: 460px;
        }

        .support-grid {
          display: grid;
          gap: 12px;
          margin-bottom: 26px;
        }

        .info-card-light {
          display: grid;
          grid-template-columns: 40px 1fr;
          gap: 12px;
          align-items: start;
          padding: 16px;
          border-radius: 22px;
          background: rgba(17,19,21,0.03);
          border: 1px solid rgba(17,19,21,0.08);
        }

        .info-icon-light {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(17,19,21,0.04);
          border: 1px solid rgba(17,19,21,0.08);
          color: #3f4750;
          flex-shrink: 0;
        }

        .info-title-light {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(17,19,21,0.72);
          margin-bottom: 6px;
        }

        .info-copy-light {
          font-size: 12.5px;
          line-height: 1.65;
          color: rgba(17,19,21,0.5);
        }

        .btn-stack {
          display: grid;
          gap: 10px;
        }

        .primary-btn,
        .secondary-btn {
          width: 100%;
          min-height: 54px;
          border-radius: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .primary-btn {
          background: var(--text);
          color: white;
          border: 1px solid rgba(17,19,21,0.1);
        }

        .primary-btn:hover {
          background: #2a2f35;
        }

        .secondary-btn {
          background: transparent;
          color: rgba(17,19,21,0.66);
          border: 1px solid rgba(17,19,21,0.1);
        }

        .secondary-btn:hover {
          background: rgba(17,19,21,0.04);
          color: var(--text);
        }

        .footer-note {
          position: relative;
          z-index: 2;
          margin-top: 18px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
          text-align: center;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #101214; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.22); }

        @media (max-width: 1100px) {
          .outer-shell {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .left-panel {
            min-height: 340px;
          }

          .right-panel {
            padding-top: 28px;
          }
        }

        @media (max-width: 768px) {
          .error-page-shell {
            padding: 16px;
          }

          .outer-shell {
            border-radius: 28px;
          }

          .left-panel,
          .right-panel {
            padding: 26px 20px;
          }

          .error-card {
            min-height: auto;
            border-radius: 26px;
            padding: 22px;
          }

          .left-title {
            font-size: clamp(34px, 9vw, 58px);
          }
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-glow-left" />
      <div className="bg-glow-right" />

      <div className="outer-shell">
        <div className="left-panel">
          <div>
            <a href="/" className="brand">
              <span className="brand-think">Three</span>
              <span className="brand-ai">AI</span>
            </a>
          </div>

          <div className="left-main">
            <div className="status-kicker">
              <span className="status-dot" />
              Sign in status
            </div>

            <h1 className="left-title">Access could not be completed.</h1>
            <p className="left-copy">
              This usually means a session, provider, or verification step did not
              complete successfully. You can retry sign in or return to the homepage.
            </p>
          </div>

          <div className="left-bottom">
            <div className="info-card-dark">
              <div className="info-icon-dark">
                <Lock size={18} />
              </div>
              <div>
                <p className="info-title-dark">Secure by default</p>
                <p className="info-copy-dark">
                  Authentication errors do not expose account details or sensitive workspace data.
                </p>
              </div>
            </div>

            <div className="info-card-dark">
              <div className="info-icon-dark">
                <Mail size={18} />
              </div>
              <div>
                <p className="info-title-dark">Need help?</p>
                <p className="info-copy-dark">
                  Contact your internal admin or support if this issue keeps appearing.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="error-card">
            <div className="error-badge">
              <span className="error-badge-dot" />
              Sign in error
            </div>

            <h1 className="error-title">Something interrupted sign in.</h1>
            <p className="error-message">{message}</p>

            <div className="support-grid">
              <div className="info-card-light">
                <div className="info-icon-light">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <p className="info-title-light">What happened</p>
                  <p className="info-copy-light">
                    The current request could not be completed. This can happen when a provider
                    callback fails, a verification link expires, or account access is restricted.
                  </p>
                </div>
              </div>

              <div className="info-card-light">
                <div className="info-icon-light">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="info-title-light">What to do next</p>
                  <p className="info-copy-light">
                    Retry sign in first. If the issue persists, return home and restart the flow,
                    or contact support with the error code: <strong>{errorCode}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="btn-stack">
              <button
                onClick={() => router.push("/signin")}
                className="primary-btn"
              >
                Try Signing In Again
              </button>

              <button
                onClick={() => router.push("/")}
                className="secondary-btn"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="footer-note">Three AI · Decision Engine</p>
    </div>
  );
}

// 2. The protective Suspense boundary
export default function AuthErrorPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#111315]">
          <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-[rgba(255,255,255,0.5)]">
            Loading error status...
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}