"use client";

import { useRouter } from "next/navigation";
import { TrendingUp, AlertTriangle, ChevronDown, ChevronRight, BarChart2 } from "lucide-react";
import { useState } from "react";
import { DecisionBox, VerdictColor } from "@/types/chat";

const V: Record<VerdictColor, { bg: string; border: string; text: string; dot: string; badge: string }> = {
  Green:  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300",  dot: "bg-emerald-400", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  Yellow: { bg: "bg-amber-500/10",   border: "border-amber-500/30",   text: "text-amber-300",    dot: "bg-amber-400",   badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  Orange: { bg: "bg-orange-500/10",  border: "border-orange-500/30",  text: "text-orange-300",   dot: "bg-orange-400",  badge: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
  Red:    { bg: "bg-rose-500/10",    border: "border-rose-500/30",    text: "text-rose-300",     dot: "bg-rose-400",    badge: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
};

interface Props {
  box: DecisionBox;
  type: "upside" | "risk";
  query?: string;
  audit?: any;
  onSpawn?: (q: string) => void;
}

export function SourceCard({ box, type, query = "", audit, onSpawn }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const cfg   = V[(box as any).badge?.raw as VerdictColor] ?? V[(box as any).color as VerdictColor] ?? V.Yellow;
  const Icon  = type === "upside" ? TrendingUp : AlertTriangle;
  const label = type === "upside" ? "Upside" : "Risk";

  const goToMetrics = (e: React.MouseEvent) => {
    e.stopPropagation();
    const data = encodeURIComponent(JSON.stringify({ box, audit, query }));
    router.push(`/metrics?data=${data}`);
  };

  return (
    <div
      className="rounded-2xl border border-white/[0.07] overflow-hidden flex flex-col transition-all duration-200 hover:border-white/[0.12]"
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
    >
      <button onClick={() => setOpen(!open)} className="flex-1 text-left p-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Icon className={`w-3 h-3 ${cfg.text}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${cfg.text} opacity-80`}>{label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${cfg.badge}`}>
              {box.probability}% · {box.impact}/10
            </span>
            {open
              ? <ChevronDown className="w-3 h-3 text-white/20" />
              : <ChevronRight className="w-3 h-3 text-white/20" />}
          </div>
        </div>
        <p className="text-[13px] font-medium text-white/80 leading-snug mb-1">{box.title}</p>
        <p className="text-[11.5px] text-white/40 leading-relaxed line-clamp-2">{box.claim}</p>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-white/[0.05] space-y-3">
          <p className="text-[11.5px] text-white/50 leading-relaxed">{box.evidence_or_reasoning}</p>
          {box.follow_up_actions?.length > 0 && (
            <div>
              <p className="text-[9px] uppercase tracking-widest text-white/18 mb-1.5">Actions</p>
              <ul className="space-y-1">
                {box.follow_up_actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11.5px] text-white/40">
                    <span className={`mt-1.5 w-1 h-1 rounded-full ${cfg.dot} shrink-0`} />{a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {box.spawn_questions?.length > 0 && onSpawn && (
            <div>
              <p className="text-[9px] uppercase tracking-widest text-white/18 mb-1.5">Dig deeper</p>
              <div className="flex flex-wrap gap-1.5">
                {box.spawn_questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => onSpawn(q)}
                    className="text-[10.5px] px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-white/30 hover:text-white/60 hover:border-white/15 hover:bg-white/8 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer — View Metrics button */}
      <div className="px-4 py-2.5 border-t border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          <span className="text-[10px] text-white/20">{type === "upside" ? "Opportunity" : "Risk factor"}</span>
        </div>
        <button
          onClick={goToMetrics}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] text-white/30 border border-white/[0.07] hover:text-white/60 hover:border-white/15 transition-all"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <BarChart2 size={10} />
          View metrics
        </button>
      </div>
    </div>
  );
}