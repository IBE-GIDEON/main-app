"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: "#1C1B18" }}
    >
      {/* Tile background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.08 }}>
          <defs>
            <pattern id="tiles" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#E58A6A" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tiles)" />
        </svg>
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[130px]" style={{ backgroundColor: "rgba(229,138,106,0.06)" }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[120px]" style={{ backgroundColor: "rgba(229,138,106,0.04)" }} />
      </div>

   

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl p-10 text-center"
        style={{
          backgroundColor: "#FAFAF8",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        }}
      >
        {/* Error code */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6"
          style={{ backgroundColor: "rgba(229,138,106,0.1)", border: "1px solid rgba(229,138,106,0.2)", color: "#E58A6A" }}
        >
          404
        </div>

        <h1 className="text-[28px] font-bold tracking-tight mb-3" style={{ color: "#1C1B18" }}>
          This page doesn't exist
        </h1>
        <p className="text-[13px] leading-relaxed mb-8" style={{ color: "rgba(28,27,24,0.45)" }}>
          Looks like this path leads nowhere. The page may have moved or the link is broken.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3.5 rounded-xl text-[14px] font-bold transition-all"
            style={{ backgroundColor: "#E58A6A", color: "#fff" }}
          >
            Back to dashboard
          </button>
          <button
            onClick={() => router.back()}
            className="w-full py-3 rounded-xl text-[13px] font-semibold transition-all"
            style={{ color: "rgba(28,27,24,0.4)", border: "1px solid rgba(28,27,24,0.1)" }}
          >
            Go back
          </button>
        </div>
      </div>

      <p className="relative z-10 mt-6 text-[11px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.15)" }}>
        three AI · Decision Engine
      </p>
    </div>
  );
}