"use client";

import ReactMarkdown from "react-markdown";
import { Message, DecisionBox, VerdictCard, NextStep, VerdictColor } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown, TrendingUp, AlertTriangle, CheckCircle, XCircle,
  RefreshCw, ChevronDown, ChevronRight, Zap, Search,
} from "lucide-react";

interface Props {
  messages: Message[];
  isTyping: boolean;
  onSpawnQuestion?: (q: string) => void;
}

const V: Record<VerdictColor, { bg: string; border: string; text: string; dot: string; badge: string }> = {
  Green:  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300",  dot: "bg-emerald-400", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  Yellow: { bg: "bg-amber-500/10",   border: "border-amber-500/30",   text: "text-amber-300",    dot: "bg-amber-400",   badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  Orange: { bg: "bg-orange-500/10",  border: "border-orange-500/30",  text: "text-orange-300",   dot: "bg-orange-400",  badge: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
  Red:    { bg: "bg-rose-500/10",    border: "border-rose-500/30",    text: "text-rose-300",     dot: "bg-rose-400",    badge: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
};

/* ─────────────────────────── Source card (replaces BoxCard) ─────────────────────────── */
function SourceCard({ box, type, onSpawn }: { box: DecisionBox; type: "upside" | "risk"; onSpawn?: (q: string) => void }) {
  const [open, setOpen] = useState(false);
  const cfg = V[(box as any).badge?.raw as VerdictColor] ?? V[(box as any).color as VerdictColor] ?? V.Yellow;
  const Icon = type === "upside" ? TrendingUp : AlertTriangle;
  const label = type === "upside" ? "Upside" : "Risk";

  return (
    <div
      className="rounded-2xl border border-white/[0.07] overflow-hidden flex flex-col transition-all duration-200 hover:border-white/[0.12]"
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
    >
      <button onClick={() => setOpen(!open)} className="flex-1 text-left p-4">
        {/* Header row */}
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
        {/* Body */}
        <p className="text-[13px] font-medium text-white/80 leading-snug mb-1">{box.title}</p>
        <p className="text-[11.5px] text-white/40 leading-relaxed line-clamp-2">{box.claim}</p>
      </button>

      {/* Expanded detail */}
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

      {/* Footer: source-style meta row */}
      <div className="px-4 py-2.5 border-t border-white/[0.05] flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        <span className="text-[10px] text-white/20">{type === "upside" ? "Opportunity" : "Risk factor"}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────── Verdict ─────────────────────────── */
function VerdictView({ verdict }: { verdict: VerdictCard }) {
  const cfg = V[verdict.badge?.raw as VerdictColor] ?? V[verdict.color as VerdictColor] ?? V.Yellow;
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border ${cfg.border} overflow-hidden`}
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          <span className={`text-[9px] font-bold uppercase tracking-widest ${cfg.text} opacity-70`}>Verdict</span>
        </div>
        <h3 className="text-[14px] font-semibold text-white/85 leading-snug mb-1.5">{verdict.headline}</h3>
        <p className="text-[12px] text-white/40 leading-relaxed">{verdict.rationale}</p>
        <button
          onClick={() => setOpen(!open)}
          className="mt-3 flex items-center gap-1.5 text-[10px] text-white/20 hover:text-white/45 transition-colors"
        >
          {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          <span className="uppercase tracking-widest">Conditions &amp; triggers</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.05] px-4 pb-4 pt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Go if",       items: verdict.go_conditions,   Icon: CheckCircle, color: "text-emerald-400" },
            { label: "Stop if",     items: verdict.stop_conditions,  Icon: XCircle,    color: "text-rose-400" },
            { label: "Review when", items: verdict.review_triggers,  Icon: RefreshCw,  color: "text-amber-400" },
          ].map(({ label, items, Icon, color }) => (
            <div key={label}>
              <div className={`flex items-center gap-1.5 mb-2 ${color}`}>
                <Icon className="w-3 h-3" />
                <span className="text-[9px] uppercase tracking-widest font-bold">{label}</span>
              </div>
              <ul className="space-y-1.5">
                {items?.map((item, i) => (
                  <li key={i} className="text-[11px] text-white/35 leading-snug">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {(verdict.key_unknown || verdict.flip_factor) && (
        <div className="border-t border-white/[0.05] px-4 py-3 grid grid-cols-2 gap-4">
          {verdict.key_unknown && (
            <div>
              <p className="text-[9px] uppercase tracking-widest text-white/15 mb-1">Key unknown</p>
              <p className="text-[11px] text-white/35 leading-snug">{verdict.key_unknown}</p>
            </div>
          )}
          {verdict.flip_factor && (
            <div>
              <p className="text-[9px] uppercase tracking-widest text-white/15 mb-1">Flip factor</p>
              <p className="text-[11px] text-white/35 leading-snug">{verdict.flip_factor}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Next step ─────────────────────────── */
function NextStepView({ step }: { step: NextStep }) {
  return (
    <div
      className="rounded-2xl border border-sky-500/15 p-4"
      style={{ background: "rgba(14,165,233,0.04)", backdropFilter: "blur(12px)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-3 h-3 text-sky-400/70" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-sky-400/50">Next step</span>
      </div>
      <p className="text-[13px] text-white/70 font-medium leading-snug">{step.immediate_action}</p>
      {step.test_if_uncertain && (
        <p className="mt-2 text-[11px] text-white/30">
          <span className="text-white/15 uppercase text-[9px] tracking-widest mr-2">Validate by</span>
          {step.test_if_uncertain}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────── Decision board ─────────────────────────── */
function DecisionBoard({ message, onSpawn }: { message: Message; onSpawn?: (q: string) => void }) {
  const d = message.decision!;

  const summaryText = typeof d.summary_box === "string"
    ? d.summary_box
    : (d.summary_box as any)?.claim ?? "";

  const verdict  = d.verdict_card as any;
  const nextStep = (d as any).next_step ?? d.next_step_box;

  return (
    <div className="w-full space-y-3">
      {/* Summary card */}
      <div
        className="rounded-2xl border border-white/[0.07] px-4 py-3.5"
        style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
      >
        <p className="text-[9px] uppercase tracking-widest text-white/18 mb-1.5">Summary</p>
        <p className="text-[13px] text-white/60 leading-relaxed">{summaryText}</p>
      </div>

      {/* 2-column source card grid */}
      {(d.upside_boxes?.length > 0 || d.risk_boxes?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {d.upside_boxes?.map((box, i) => (
            <SourceCard key={`up-${i}`} box={box} type="upside" onSpawn={onSpawn} />
          ))}
          {d.risk_boxes?.map((box, i) => (
            <SourceCard key={`risk-${i}`} box={box} type="risk" onSpawn={onSpawn} />
          ))}
        </div>
      )}

      {verdict  && <VerdictView verdict={verdict} />}
      {nextStep && <NextStepView step={nextStep} />}
    </div>
  );
}

/* ─────────────────────────── Message bubble ─────────────────────────── */
function MessageBubble({ message, onSpawn }: { message: Message; onSpawn?: (q: string) => void }) {
  const isUser  = message.role === "user";
  const isError = message.role === "error";

  /* User */
  if (isUser) {
    return (
      <div className="flex flex-col items-start gap-1">
        <span className="text-[10px] text-white/20 ml-1 select-none">You</span>
        <div
          className="max-w-[85%] px-4 py-2.5 rounded-[1.1rem] text-[13.5px] text-white/65 border border-white/[0.09] leading-relaxed"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  /* Error */
  if (isError) {
    return (
      <div
        className="max-w-[85%] px-4 py-3 rounded-[1.1rem] border border-rose-500/30 text-rose-200/80 text-[13px] leading-relaxed"
        style={{ background: "rgba(239,68,68,0.06)" }}
      >
        {message.content}
      </div>
    );
  }

  /* Decision board */
  if (message.decision) {
    return (
      <div className="w-full">
        {/* Search indicator — mirrors image's "Searched …" row */}
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-3 h-3 text-white/20" />
          <span className="text-[11px] text-white/25 italic">Analysing decision factors…</span>
        </div>
        <DecisionBoard message={message} onSpawn={onSpawn} />
      </div>
    );
  }

  /* Standard assistant message → "Suggested Answer" style */
  return (
    <div className="w-full">
      {/* Label row */}
      <div className="flex items-center gap-2 mb-2 ml-1">
        <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
        <span className="text-[10.5px] font-semibold text-sky-400/80 tracking-wide">Suggested Answer</span>
      </div>

      {/* Answer card */}
      <div
        className="w-full px-4 py-3.5 rounded-[1.2rem] border border-white/[0.07] leading-relaxed"
        style={{ background: "rgba(255,255,255,0.045)", backdropFilter: "blur(10px)" }}
      >
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown components={{
            p: ({ children }) => (
              <p className="mb-3 last:mb-0 text-white/70 text-[13.5px] leading-relaxed">{children}</p>
            ),
            code: ({ children }) => (
              <code className="bg-white/8 px-1.5 py-0.5 rounded font-mono text-[12px] text-sky-300/80">{children}</code>
            ),
          }}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Root component ─────────────────────────── */
export default function Aicontentspace({ messages, isTyping, onSpawnQuestion }: Props) {
  const bottomRef          = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    if (!showScrollButton) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, showScrollButton]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 300);
    }
  };

  return (
    <div
      className="relative mt-3 h-full w-full max-w-7xl mx-auto overflow-hidden rounded-[2rem] border border-white/[0.08] shadow-2xl"
      style={{
        background: "rgba(10, 11, 16, 0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Top gloss line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      {/* Inner top-fade */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.015] to-transparent" />

      {/* Scrollable message list */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-5 md:px-8 py-8 space-y-6 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-white/8 font-light tracking-widest uppercase text-[10px]" />
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onSpawn={onSpawnQuestion} />
        ))}

        {/* Typing / thinking indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <Search className="w-3 h-3 text-white/25 animate-pulse" />
            <span className="text-[11px] text-white/25 italic animate-pulse">Thinking through…</span>
          </div>
        )}

        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Scroll-to-bottom button */}
      {showScrollButton && (
        <button
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border border-white/[0.1] backdrop-blur-md hover:bg-white/8 transition-all active:scale-95 shadow-lg flex items-center gap-2"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <ArrowDown className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll down</span>
        </button>
      )}
    </div>
  );
}