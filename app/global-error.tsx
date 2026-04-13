"use client";

import { RefreshCw, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          backgroundColor: "#ECECEC",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          {/* Rectangular Card */}
          <div
            style={{
              width: "100%",
              maxWidth: "720px",
              backgroundColor: "#F5F5F5",
              borderRadius: "28px",
              padding: "40px",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "999px",
                backgroundColor: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.08)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(28,27,24,0.6)",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "999px",
                  backgroundColor: "#9CA3AF",
                }}
              />
              Critical error
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "40px",
                lineHeight: "1.05",
                fontWeight: 700,
                color: "#1C1B18",
                marginBottom: "12px",
              }}
            >
              Something broke.
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "15px",
                color: "rgba(28,27,24,0.5)",
                lineHeight: "1.7",
                maxWidth: "520px",
                marginBottom: "28px",
              }}
            >
              three AI encountered a critical system error. This has been logged.
              Try again or refresh the page to continue safely.
            </p>

            {/* Info Box */}
            <div
              style={{
                display: "flex",
                gap: "14px",
                padding: "18px",
                borderRadius: "18px",
                backgroundColor: "rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.08)",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={18} color="#1C1B18" />
              </div>

              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(28,27,24,0.4)",
                    marginBottom: "6px",
                  }}
                >
                  System state
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(28,27,24,0.55)",
                    lineHeight: "1.6",
                  }}
                >
                  A failure interrupted the application lifecycle. Retrying will
                  attempt to recover the state.
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={reset}
              style={{
                width: "100%",
                height: "52px",
                borderRadius: "16px",
                backgroundColor: "#0F1113",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}