"use client";

import { Check, Sparkles, Zap, ShieldCheck, Box } from "lucide-react";

export default function UpgradePage() {
  const mvpFeatures = [
    "Unlimited recursive refinement layers",
    "Unlock premium Image & Video generation models",
    "Advanced decision frameworks & custom lenses",
    "Priority API access with higher rate limits",
    "Extended data retention & export capabilities",
    "Zero queue times during peak hours",
  ];

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-4xl pb-20">
      
      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <h1 className="text-[24px] font-semibold text-zinc-100 tracking-tight mb-2 flex items-center gap-3">
          Three AI <span className="text-[11px] font-bold uppercase tracking-widest text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2 py-0.5 rounded-md">MVP</span>
        </h1>
        <p className="text-[14px] text-zinc-400 leading-relaxed">
          Unlock the full power of the Decision Engine. Think through faster, visualize outcomes deeper, and remove all limits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left Column: Current Plan */}
        <div className="md:col-span-2 rounded-2xl border border-white/5 bg-[#121212] p-6 flex flex-col">
          <h2 className="text-[14px] font-medium text-zinc-400 mb-1">Current Plan</h2>
          <div className="text-[20px] font-semibold text-zinc-100 mb-6">Basic</div>
          
          <ul className="flex flex-col gap-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-[13px] text-zinc-500">
              <Check size={16} className="text-zinc-600 shrink-0 mt-0.5" />
              Standard decision routing
            </li>
            <li className="flex items-start gap-3 text-[13px] text-zinc-500">
              <Check size={16} className="text-zinc-600 shrink-0 mt-0.5" />
              Basic framework access
            </li>
            <li className="flex items-start gap-3 text-[13px] text-zinc-500">
              <Check size={16} className="text-zinc-600 shrink-0 mt-0.5" />
              Limited daily queries
            </li>
          </ul>

          <div className="pt-6 border-t border-white/5">
            <div className="text-[13px] text-zinc-500 text-center">
              Free forever
            </div>
          </div>
        </div>

        {/* Right Column: MVP Plan (Highlighted) */}
        <div className="md:col-span-3 rounded-2xl border border-purple-500/30 bg-[#121212] p-6 sm:p-8 flex flex-col relative shadow-[0_0_40px_rgba(168,85,247,0.05)] overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[20px] font-semibold text-zinc-100 flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" />
                MVP Plan
              </h2>
            </div>
            
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-[32px] font-bold text-white">$560</span>
              <span className="text-[13px] text-zinc-500 font-medium">/year</span>
            </div>

            <ul className="flex flex-col gap-4 mb-10">
              {mvpFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-zinc-300 font-medium">
                  <Check size={18} className="text-purple-500 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className="w-full rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-semibold py-3.5 text-[14px] transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(168,85,247,0.25)]">
              Upgrade to MVP Plan
            </button>
            <p className="text-center text-[12px] text-zinc-500 mt-4">
              Secure payment processed via Stripe. Cancel anytime.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}