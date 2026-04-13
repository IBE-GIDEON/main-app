"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";

export default function ErrorCard({
  reset,
}: {
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center px-4">

      {/* Container (RECTANGULAR, not tall card) */}
      <div className="w-full max-w-2xl rounded-[28px] bg-[#F5F5F5] border border-black/[0.06] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.08] text-[11px] font-semibold uppercase tracking-widest text-[#1C1B18]/60 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
          System error
        </div>

        {/* Title */}
        <h1 className="text-[44px] leading-[1.05] font-bold text-[#1C1B18] tracking-tight mb-4">
          That was not<br />supposed to happen.
        </h1>

        {/* Description */}
        <p className="text-[15px] text-[#1C1B18]/50 leading-relaxed max-w-xl mb-8">
          three AI hit an unexpected application error. This has been noted.
          Try again, or return to the dashboard and continue from a safe state.
        </p>

        {/* Info box */}
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-black/[0.03] border border-black/[0.08] mb-8">
          <div className="w-10 h-10 rounded-xl bg-black/[0.05] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-[#1C1B18]/50" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#1C1B18]/40 mb-1">
              What happened
            </p>
            <p className="text-[13px] text-[#1C1B18]/55 leading-relaxed">
              A render or runtime issue interrupted this page. In many cases,
              reloading or retrying resolves it.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full h-[52px] rounded-2xl bg-[#0F1113] text-white text-[13px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1A1D21] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full h-[52px] rounded-2xl border border-black/[0.1] text-[13px] font-semibold uppercase tracking-wider text-[#1C1B18]/60 hover:bg-black/[0.04] transition-all flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}