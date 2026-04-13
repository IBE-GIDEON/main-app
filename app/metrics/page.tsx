"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap } from "lucide-react";

// --- TYPES (Unchanged) ---
type VerdictColor = "Green" | "Yellow" | "Orange" | "Red";

type BoxReasoningTrail = {
  box_title:         string;
  box_type:          "upside" | "risk";
  draft_claim:       string;
  draft_probability: number;
  draft_impact:      number;
  draft_reasoning:   string;
  attack_weakness:   string;
  attack_correction: string;
  claim_changed:     boolean;
  probability_delta: number;
  impact_delta:      number;
  what_changed:      string;
  lenses_applied:    string[];
};

type ReasoningTrail = {
  box_trails:                BoxReasoningTrail[];
  company_industry:          string | null;
  company_size:              string | null;
  risk_appetite:             string | null;
  extra_context:             Record<string, string>;
  lenses_used:               string[];
  framework:                 string;
  decision_type:             string;
  stake_level:               string;
  router_confidence:         number;
  refiner_confidence:        number;
  combined_confidence:       number;
  confidence_explanation:    string;
  overall_attack_assessment: string;
  real_world_failure_modes:  string[];
  missing_risks_found:       string[];
};

type DecisionBox = {
  id:                    string;
  box_type:              "upside" | "risk";
  title:                 string;
  badge:                 { label: string; color: string; raw: VerdictColor };
  claim:                 string;
  evidence_or_reasoning: string;
  probability:           number;
  impact:                number;
  risk_score:            number;
  follow_up_actions:     string[];
  spawn_questions:       string[];
};

type AuditData = {
  model_used:        string;
  pass_latencies_ms: number[];
  total_tokens_in:   number;
  total_tokens_out:  number;
  timestamp_utc:     string;
};

// --- ENTERPRISE COLOR PALETTE (Harsh, high contrast) ---
const COLOR: Record<VerdictColor, { text: string; border: string; bg: string }> = {
  Green:  { text: "text-emerald-500", border: "border-emerald-500", bg: "bg-emerald-950" },
  Yellow: { text: "text-yellow-500",  border: "border-yellow-500",  bg: "bg-yellow-950" },
  Orange: { text: "text-orange-500",  border: "border-orange-500",  bg: "bg-orange-950" },
  Red:    { text: "text-red-500",     border: "border-red-500",     bg: "bg-red-950" },
};

function DeltaBadge({ delta, unit = "" }: { delta: number; unit?: string }) {
  if (delta === 0) return <span className="font-mono text-zinc-500">UNCH</span>;
  const positive = delta > 0;
  return (
    <span className={`font-mono ${positive ? "text-emerald-500" : "text-red-500"}`}>
      {positive ? "+" : ""}{delta}{unit}
    </span>
  );
}

// --- COMPONENTS ---
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-zinc-800 pb-1 mb-3 mt-8">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{title}</h2>
    </div>
  );
}

function DataRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-zinc-900 last:border-0">
      <span className="text-[11px] text-zinc-500">{label}</span>
      <span className={`text-[12px] text-zinc-300 ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

export default function MetricsPage() {
  const router = useRouter();

  const [box,   setBox]   = useState<DecisionBox | null>(null);
  const [audit, setAudit] = useState<AuditData | null>(null);
  const [query, setQuery] = useState<string>("");
  const [trail, setTrail] = useState<ReasoningTrail | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("metrics_data");
      if (raw) {
        const parsed = JSON.parse(raw);
        setBox(parsed.box     ?? null);
        setAudit(parsed.audit ?? null);
        setQuery(parsed.query ?? "");
        setTrail(parsed.trail ?? null);
      }
    } catch (e) {
      console.error("Failed to parse metrics data", e);
    }
  }, []);

  if (!box) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-xs text-zinc-600 uppercase tracking-widest">
        [ Awaiting Telemetry ]
      </div>
    );
  }

  const cfg         = COLOR[box.badge?.raw] ?? COLOR.Yellow;
  const totalMs     = audit?.pass_latencies_ms?.reduce((a, b) => a + b, 0) ?? 0;
  const totalTokens = (audit?.total_tokens_in ?? 0) + (audit?.total_tokens_out ?? 0);

  const boxTrail = trail?.box_trails?.find(
    (t) => t.box_title.toLowerCase().trim() === box.title.toLowerCase().trim()
  ) ?? trail?.box_trails?.[0] ?? null;

  return (
    <div className="min-h-screen w-full bg-black text-zinc-300 font-sans selection:bg-zinc-800">
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* COMMAND BAR */}
        <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[11px] text-zinc-500 hover:text-white uppercase tracking-widest transition-none"
          >
            <ArrowLeft size={12} />
            [ Esc ] Return to Board
          </button>
          <div className="text-[10px] font-mono text-zinc-600 uppercase">
            SYS.AUDIT.TRAIL // {new Date().toISOString()}
          </div>
        </div>

        {/* DOSSIER HEADER */}
        <div className={`border-l-4 ${cfg.border} pl-4 mb-8`}>
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-[10px] font-bold font-mono uppercase tracking-widest px-1.5 py-0.5 border ${cfg.border} ${cfg.text} ${cfg.bg}`}>
              {box.box_type === "upside" ? "OPPORTUNITY_NODE" : "RISK_NODE"}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">ID: {box.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-2">{box.title}</h1>
          <p className="text-xs text-zinc-400 mt-2 max-w-2xl">{box.claim}</p>
        </div>

        {/* TOP LEVEL METRICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800">
          <div className="bg-black p-4">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Probability</div>
            <div className={`text-2xl font-mono ${cfg.text}`}>{box.probability}%</div>
          </div>
          <div className="bg-black p-4">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Impact</div>
            <div className={`text-2xl font-mono ${cfg.text}`}>{box.impact}<span className="text-sm text-zinc-600">/10</span></div>
          </div>
          <div className="bg-black p-4">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Net Risk Score</div>
            <div className={`text-2xl font-mono ${cfg.text}`}>{box.risk_score}</div>
          </div>
          <div className="bg-black p-4">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Sys. Confidence</div>
            <div className="text-2xl font-mono text-white">{(trail?.combined_confidence ?? 0) * 100}%</div>
          </div>
        </div>

        {/* UNROLLED PIPELINE ANALYSIS */}
        {boxTrail && (
          <div className="mt-8">
            <SectionHeader title="Pipeline Execution Log (3-Pass Refinement)" />
            
            <div className="border border-zinc-800 divide-y divide-zinc-800">
              {/* PASS 1 */}
              <div className="p-4 bg-[#0a0a0a]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-yellow-600 border border-yellow-600/30 px-1.5 bg-yellow-900/20">PASS_01 // DRAFT</span>
                  {audit && <span className="font-mono text-[10px] text-zinc-500">{((audit.pass_latencies_ms[0] ?? 0) / 1000).toFixed(2)}s</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                  <div className="md:col-span-3 text-xs text-zinc-400">{boxTrail.draft_claim}</div>
                  <div className="font-mono text-[10px] text-zinc-500 border-l border-zinc-800 pl-4 space-y-1">
                    <div>PROB: {boxTrail.draft_probability}%</div>
                    <div>IMPACT: {boxTrail.draft_impact}/10</div>
                  </div>
                </div>
              </div>

              {/* PASS 2 */}
              <div className="p-4 bg-[#0f0a0a]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-red-500 border border-red-500/30 px-1.5 bg-red-950/30">PASS_02 // ATTACK_VECTOR</span>
                  {audit && <span className="font-mono text-[10px] text-zinc-500">{((audit.pass_latencies_ms[1] ?? 0) / 1000).toFixed(2)}s</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                  <div>
                    <div className="text-[10px] text-zinc-500 mb-1 uppercase">Identified Weakness</div>
                    <div className="text-xs text-red-400/80">{boxTrail.attack_weakness}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 mb-1 uppercase">System Correction</div>
                    <div className="text-xs text-zinc-400">{boxTrail.attack_correction}</div>
                  </div>
                </div>
              </div>

              {/* PASS 3 */}
              <div className="p-4 bg-[#0a0f0a]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-emerald-500 border border-emerald-500/30 px-1.5 bg-emerald-950/30">PASS_03 // SYNTHESIS</span>
                  {audit && <span className="font-mono text-[10px] text-zinc-500">{((audit.pass_latencies_ms[2] ?? 0) / 1000).toFixed(2)}s</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                  <div className="md:col-span-3 text-xs text-zinc-300">{boxTrail.what_changed}</div>
                  <div className="font-mono text-[10px] text-zinc-500 border-l border-zinc-800 pl-4 space-y-1">
                    <div>Δ PROB: <DeltaBadge delta={boxTrail.probability_delta} unit="%" /></div>
                    <div>Δ IMPACT: <DeltaBadge delta={boxTrail.impact_delta} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* CONTEXT INJECTION */}
          <div>
            <SectionHeader title="Context Variables" />
            <div className="border border-zinc-800 bg-[#050505] p-3 space-y-0.5">
              <DataRow label="Industry" value={trail?.company_industry || "NULL"} />
              <DataRow label="Scale" value={trail?.company_size || "NULL"} />
              <DataRow label="Risk Profile" value={trail?.risk_appetite || "NULL"} />
              <DataRow label="Framework" value={trail?.framework || "NULL"} />
              <DataRow label="Analysis Depth" value={`Level ${trail?.stake_level}`} />
              <DataRow label="Lenses Applied" value={trail?.lenses_used?.join(", ") || "NULL"} />
            </div>
          </div>

          {/* TELEMETRY */}
          {audit && (
            <div>
              <SectionHeader title="System Telemetry" />
              <div className="border border-zinc-800 bg-[#050505] p-3 space-y-0.5">
                <DataRow label="Engine" value={audit.model_used} mono />
                <DataRow label="Execution Time" value={`${(totalMs / 1000).toFixed(3)}s`} mono />
                <DataRow label="Input Tokens" value={audit.total_tokens_in.toLocaleString()} mono />
                <DataRow label="Output Tokens" value={audit.total_tokens_out.toLocaleString()} mono />
                <DataRow label="Total Payload" value={totalTokens.toLocaleString()} mono />
              </div>
            </div>
          )}
        </div>

        {/* DIG DEEPER ACTIONS */}
        {box.spawn_questions?.length > 0 && (
          <div className="mt-8">
            <SectionHeader title="Targeted Deep Dives" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {box.spawn_questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    localStorage.setItem("pending_spawn_question", q);
                    router.back();
                  }}
                  className="flex items-start gap-3 p-3 text-left border border-zinc-800 bg-[#0a0a0a] hover:bg-zinc-900 transition-colors group"
                >
                  <Zap size={14} className="text-zinc-600 group-hover:text-sky-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-200">{q}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  );
}