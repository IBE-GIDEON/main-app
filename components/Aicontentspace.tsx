"use client";

import { AgentBlock, BlockTone, Message, DecisionBox, VerdictCard, NextStep, VerdictColor } from "@/types/chat";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Zap,
  BarChart2,
  Loader2,
  BrainCircuit,
  Wallet,
  Database,
  Clock3,
  Gauge,
  Activity,
} from "lucide-react";
import clsx from "clsx";

interface Props {
  messages: Message[];
  isTyping: boolean;
  onSpawnQuestion?: (q: string) => void;
}

type HealthSummaryItem = {
  metric_name: string;
  label: string;
  value: number | string | null;
  unit: string;
  status?: "green" | "yellow" | "red" | null;
  description?: string;
};

type FinanceSnapshot = {
  as_of_utc?: string | null;
  currency?: string | null;
  reporting_period?: string | null;
  analysis_horizon_days?: number | null;
  is_live_data?: boolean;
  sources_used?: string[];
  source_freshness?: Record<string, string>;

  cash_balance?: number | null;
  available_liquidity?: number | null;
  monthly_burn?: number | null;
  runway_months?: number | null;

  mrr?: number | null;
  arr?: number | null;
  revenue_last_30d?: number | null;
  revenue_prev_30d?: number | null;
  revenue_growth_pct?: number | null;

  gross_margin_pct?: number | null;
  ebitda_margin_pct?: number | null;
  net_margin_pct?: number | null;

  opex_last_30d?: number | null;
  opex_prev_30d?: number | null;
  opex_growth_pct?: number | null;

  ar_total?: number | null;
  ar_overdue_30_plus?: number | null;
  ap_total?: number | null;
  ap_due_30d?: number | null;

  failed_payment_rate_pct?: number | null;
  customer_concentration_pct?: number | null;
  top_customer_share_pct?: number | null;
  logo_churn_pct?: number | null;
  revenue_churn_pct?: number | null;
  nrr_pct?: number | null;

  pipeline_coverage?: number | null;
  forecast_vs_actual_pct?: number | null;

  debt_service_coverage_ratio?: number | null;
  current_ratio?: number | null;
  quick_ratio?: number | null;
  covenant_headroom_pct?: number | null;

  headcount?: number | null;
  notes?: string[];
  health_summary?: HealthSummaryItem[];
};

const V: Record<VerdictColor, { bg: string; border: string; text: string; dot: string; badge: string }> = {
  Green: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/30",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  Yellow: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/30",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    badge:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  Orange: {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-500/30",
    text: "text-orange-700 dark:text-orange-400",
    dot: "bg-orange-500",
    badge:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
  },
  Red: {
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-500/30",
    text: "text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500",
    badge:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
};

const HEALTH_STATUS_STYLES: Record<string, string> = {
  green:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  yellow:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  red:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
};

function formatMoney(value?: number | null, currency?: string | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency || "USD"} ${value.toLocaleString()}`;
  }
}

function formatNumber(value?: number | null, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${value}${suffix}`;
}

function prettyDate(value?: string | null) {
  if (!value) return "Unknown";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function formatHealthValue(item: HealthSummaryItem, currency?: string | null) {
  if (item.value === null || item.value === undefined) return "—";

  if (item.unit === "currency" && typeof item.value === "number") {
    return formatMoney(item.value, currency);
  }
  if (item.unit === "percent") return `${item.value}%`;
  if (item.unit === "months") return `${item.value} mo`;
  if (item.unit === "x") return `${item.value}x`;
  return String(item.value);
}

function MetricPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#141414] px-3 py-2 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500 mb-1">
        {label}
      </p>
      <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
    </div>
  );
}

function HealthSummaryView({
  items,
  currency,
}: {
  items?: HealthSummaryItem[];
  currency?: string | null;
}) {
  const [open, setOpen] = useState(true);

  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#141414] shadow-sm overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Finance health
            </p>
            <p className="text-[12px] text-zinc-600 dark:text-zinc-400 mt-0.5">
              KPI status from current finance snapshot
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span className="uppercase tracking-widest">{open ? "Collapse" : "Expand"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-100 dark:border-white/5 px-5 py-4 bg-zinc-50 dark:bg-[#111111] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.metric_name}
              className="rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#141414] px-4 py-3 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">{item.label}</p>
                {item.status && (
                  <span
                    className={clsx(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                      HEALTH_STATUS_STYLES[item.status] || HEALTH_STATUS_STYLES.yellow
                    )}
                  >
                    {item.status}
                  </span>
                )}
              </div>
              <p className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">
                {formatHealthValue(item, currency)}
              </p>
              {item.description && (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FinanceSnapshotView({ snapshot }: { snapshot?: FinanceSnapshot | null }) {
  const [open, setOpen] = useState(true);

  if (!snapshot) return null;

  const currency = snapshot.currency || "USD";
  const sources = snapshot.sources_used || [];
  const notes = snapshot.notes || [];
  const freshness = snapshot.source_freshness || {};

  const hasCoreMetrics =
    snapshot.cash_balance != null ||
    snapshot.runway_months != null ||
    snapshot.monthly_burn != null ||
    snapshot.revenue_last_30d != null ||
    snapshot.revenue_growth_pct != null ||
    snapshot.gross_margin_pct != null ||
    snapshot.ar_overdue_30_plus != null ||
    snapshot.failed_payment_rate_pct != null ||
    snapshot.customer_concentration_pct != null;

  if (!hasCoreMetrics && sources.length === 0 && notes.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#141414] shadow-sm overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Finance snapshot
            </p>
            <p className="text-[12px] text-zinc-600 dark:text-zinc-400 mt-0.5">
              {snapshot.is_live_data ? "Live finance context loaded" : "Finance context loaded"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span className="uppercase tracking-widest">{open ? "Collapse" : "Expand"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-100 dark:border-white/5 px-5 py-4 space-y-4 bg-zinc-50 dark:bg-[#111111]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricPill label="Cash" value={formatMoney(snapshot.cash_balance, currency)} />
            <MetricPill label="Runway" value={formatNumber(snapshot.runway_months, " mo")} />
            <MetricPill label="Burn" value={formatMoney(snapshot.monthly_burn, currency)} />
            <MetricPill label="Revenue 30d" value={formatMoney(snapshot.revenue_last_30d, currency)} />

            <MetricPill label="Revenue Growth" value={formatNumber(snapshot.revenue_growth_pct, "%")} />
            <MetricPill label="Gross Margin" value={formatNumber(snapshot.gross_margin_pct, "%")} />
            <MetricPill label="Overdue AR" value={formatMoney(snapshot.ar_overdue_30_plus, currency)} />
            <MetricPill label="Failed Payments" value={formatNumber(snapshot.failed_payment_rate_pct, "%")} />

            <MetricPill label="Concentration" value={formatNumber(snapshot.customer_concentration_pct, "%")} />
            <MetricPill label="NRR" value={formatNumber(snapshot.nrr_pct, "%")} />
            <MetricPill label="Quick Ratio" value={formatNumber(snapshot.quick_ratio)} />
            <MetricPill label="Forecast vs Actual" value={formatNumber(snapshot.forecast_vs_actual_pct, "%")} />
          </div>

          {(snapshot.as_of_utc || snapshot.analysis_horizon_days || snapshot.reporting_period) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#141414] px-3 py-2 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500 mb-1">
                  As of
                </p>
                <p className="text-[12px] text-zinc-700 dark:text-zinc-300">{prettyDate(snapshot.as_of_utc)}</p>
              </div>
              <div className="rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#141414] px-3 py-2 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500 mb-1">
                  Horizon
                </p>
                <p className="text-[12px] text-zinc-700 dark:text-zinc-300">
                  {snapshot.analysis_horizon_days ? `${snapshot.analysis_horizon_days} days` : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#141414] px-3 py-2 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500 mb-1">
                  Reporting period
                </p>
                <p className="text-[12px] text-zinc-700 dark:text-zinc-300">{snapshot.reporting_period || "—"}</p>
              </div>
            </div>
          )}

          {(sources.length > 0 || Object.keys(freshness).length > 0) && (
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#141414] px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2.5">
                <Database className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500">
                  Sources & freshness
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {sources.map((src) => (
                  <span
                    key={src}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-md border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#1A1A1A] text-zinc-700 dark:text-zinc-300"
                  >
                    {src}
                  </span>
                ))}
              </div>

              {Object.keys(freshness).length > 0 && (
                <div className="space-y-1.5">
                  {Object.entries(freshness).map(([src, ts]) => (
                    <div
                      key={src}
                      className="flex items-center justify-between gap-3 text-[11px] text-zinc-600 dark:text-zinc-400"
                    >
                      <span className="font-medium">{src}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="w-3 h-3" />
                        {prettyDate(ts)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {notes.length > 0 && (
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#141414] px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2.5">
                <Gauge className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500">
                  Evidence notes
                </p>
              </div>
              <ul className="space-y-2">
                {notes.map((note, i) => (
                  <li key={i} className="text-[12px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const BLOCK_TONE_STYLES: Record<BlockTone, string> = {
  neutral: "border-zinc-200 dark:border-white/10 bg-white dark:bg-[#141414] text-zinc-800 dark:text-zinc-200",
  positive: "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  warning: "border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-200",
  critical: "border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-200",
  info: "border-sky-200 dark:border-sky-500/20 bg-sky-50 dark:bg-sky-500/10 text-sky-800 dark:text-sky-200",
};

function BlockCard({
  tone = "neutral",
  children,
}: {
  tone?: BlockTone | null;
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border shadow-sm overflow-hidden",
        BLOCK_TONE_STYLES[tone || "neutral"]
      )}
    >
      {children}
    </div>
  );
}

function StatusBlockView({ block }: { block: AgentBlock }) {
  return (
    <BlockCard tone={block.tone || "info"}>
      <div className="px-5 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/70 dark:bg-black/20 flex items-center justify-center">
          <BrainCircuit className="w-4 h-4" />
        </div>
        <div>
          {block.title && (
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{block.title}</p>
          )}
          <p className="text-[14px] font-medium leading-relaxed">{block.text}</p>
        </div>
      </div>
    </BlockCard>
  );
}

function MarkdownBlockView({ block }: { block: AgentBlock }) {
  return (
    <BlockCard tone={block.tone}>
      <div className="px-5 py-5">
        {block.title && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            {block.title}
          </p>
        )}
        <div className="prose prose-sm max-w-none prose-headings:mb-3 prose-headings:mt-0 prose-p:leading-7 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-li:text-zinc-700 dark:prose-li:text-zinc-300 prose-code:text-zinc-900 dark:prose-code:text-zinc-100 prose-pre:bg-zinc-950 prose-pre:text-zinc-50 dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.text || ""}</ReactMarkdown>
        </div>
      </div>
    </BlockCard>
  );
}

function TableBlockView({ block }: { block: AgentBlock }) {
  if (!block.table) return null;

  return (
    <BlockCard tone={block.tone}>
      <div className="px-5 py-5">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {block.title || "Structured table"}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-separate border-spacing-0">
            <thead>
              <tr>
                {block.table.columns.map((column) => (
                  <th
                    key={column}
                    className="text-left text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 pb-3 border-b border-zinc-200 dark:border-white/10"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.table.rows.map((row, rowIndex) => (
                <tr key={`${block.id}-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${block.id}-${rowIndex}-${cellIndex}`}
                      className="py-3 pr-4 text-[13px] text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-white/5 align-top"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BlockCard>
  );
}

function MetricGridBlockView({ block }: { block: AgentBlock }) {
  const metrics = block.metrics || [];
  if (metrics.length === 0) return null;

  return (
    <BlockCard tone={block.tone}>
      <div className="px-5 py-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {block.title || "Metric grid"}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {metrics.map((metric) => (
            <div
              key={`${block.id}-${metric.label}`}
              className={clsx(
                "rounded-xl border px-3.5 py-3",
                BLOCK_TONE_STYLES[metric.tone || "neutral"]
              )}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{metric.label}</p>
              <p className="text-[15px] font-semibold">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </BlockCard>
  );
}

function CalloutBlockView({ block }: { block: AgentBlock }) {
  return (
    <BlockCard tone={block.tone}>
      <div className="px-5 py-5">
        <div className="flex items-center gap-2 mb-2.5">
          <Zap className="w-4 h-4" />
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
            {block.title || "Callout"}
          </p>
        </div>
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{block.text}</p>
      </div>
    </BlockCard>
  );
}

function AssistantBlocksView({ blocks }: { blocks?: AgentBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      {blocks.map((block) => {
        if (block.type === "status") {
          return <StatusBlockView key={block.id} block={block} />;
        }
        if (block.type === "table") {
          return <TableBlockView key={block.id} block={block} />;
        }
        if (block.type === "metric_grid") {
          return <MetricGridBlockView key={block.id} block={block} />;
        }
        if (block.type === "callout") {
          return <CalloutBlockView key={block.id} block={block} />;
        }
        return <MarkdownBlockView key={block.id} block={block} />;
      })}
    </div>
  );
}

function AuditMiniView({ audit }: { audit?: any }) {
  if (!audit) return null;

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#141414] px-5 py-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Clock3 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Audit
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricPill label="Model" value={audit.model_used || "—"} />
        <MetricPill label="Input Tokens" value={String(audit.total_tokens_in ?? "—")} />
        <MetricPill label="Output Tokens" value={String(audit.total_tokens_out ?? "—")} />
        <MetricPill label="Cache" value={audit.cache_bypassed ? "Bypassed" : "Used/Unknown"} />
      </div>

      {(audit.timestamp_utc || audit.data_as_of_utc) && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#111111] px-3 py-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500 mb-1">
              Audit time
            </p>
            <p className="text-[12px] text-zinc-700 dark:text-zinc-300">{prettyDate(audit.timestamp_utc)}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#111111] px-3 py-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500 mb-1">
              Data as of
            </p>
            <p className="text-[12px] text-zinc-700 dark:text-zinc-300">{prettyDate(audit.data_as_of_utc)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SourceCard({
  box,
  type,
  query,
  audit,
  trail,
  onSpawn,
}: {
  box: DecisionBox;
  type: "upside" | "risk";
  query?: string;
  audit?: any;
  trail?: any;
  onSpawn?: (q: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const cfg =
    V[(box as any).badge?.raw as VerdictColor] ??
    V[(box as any).color as VerdictColor] ??
    V.Yellow;
  const Icon = type === "upside" ? TrendingUp : AlertTriangle;
  const label = type === "upside" ? "Upside" : "Risk";

  const goToMetrics = (e: React.MouseEvent) => {
    e.stopPropagation();
    sessionStorage.setItem(
      "metrics_data",
      JSON.stringify({
        box,
        audit,
        query: query ?? "",
        trail,
      })
    );
    router.push("/metrics");
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-white/10 overflow-hidden flex flex-col transition-all duration-200 hover:border-zinc-300 dark:hover:border-white/20 bg-white dark:bg-[#141414] shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex-1 text-left p-4 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className={`w-3.5 h-3.5 ${cfg.text}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.text} opacity-90`}>
              {label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cfg.badge} shadow-sm`}>
              {box.probability}% · {box.impact}/10
            </span>
            {open ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            )}
          </div>
        </div>
        <p className="text-[13.5px] font-semibold text-zinc-900 dark:text-zinc-100 leading-snug mb-1.5">
          {box.title}
        </p>
        <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
          {box.claim}
        </p>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-[#111111] space-y-4">
          <p className="text-[12px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {box.evidence_or_reasoning}
          </p>

          {box.follow_up_actions?.length > 0 && (
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                Actions
              </p>
              <ul className="space-y-1.5">
                {box.follow_up_actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[12px] text-zinc-700 dark:text-zinc-300">
                    <span className={`mt-1.5 w-1 h-1 rounded-full ${cfg.dot} shrink-0`} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {box.spawn_questions?.length > 0 && onSpawn && (
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                Dig deeper
              </p>
              <div className="flex flex-wrap gap-2">
                {box.spawn_questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => onSpawn(q)}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-md bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-white/25 hover:bg-zinc-50 dark:hover:bg-[#222222] transition-all shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="px-4 py-3 border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-500">
            {type === "upside" ? "Opportunity" : "Risk factor"}
          </span>
        </div>
        <button
          onClick={goToMetrics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/10 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 transition-all shadow-sm"
        >
          <BarChart2 size={12} />
          View metrics
        </button>
      </div>
    </div>
  );
}

function VerdictView({ verdict }: { verdict: VerdictCard }) {
  const cfg =
    V[(verdict as any).badge?.raw as VerdictColor] ??
    V[(verdict as any).color as VerdictColor] ??
    V.Yellow;
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-xl border ${cfg.border} overflow-hidden bg-white dark:bg-[#141414] shadow-md`}>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${cfg.dot} shadow-[0_0_8px_currentColor]`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.text}`}>Verdict</span>
        </div>
        <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-white leading-snug mb-2">
          {(verdict as any).headline}
        </h3>
        <p className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {(verdict as any).rationale}
        </p>
        <button
          onClick={() => setOpen(!open)}
          className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span className="uppercase tracking-widest">Conditions & triggers</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-[#111111] px-5 pb-5 pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Go if",
              items: (verdict as any).go_conditions,
              Icon: CheckCircle,
              color: "text-emerald-600 dark:text-emerald-500",
            },
            {
              label: "Stop if",
              items: (verdict as any).stop_conditions,
              Icon: XCircle,
              color: "text-rose-600 dark:text-rose-500",
            },
            {
              label: "Review when",
              items: (verdict as any).review_triggers,
              Icon: RefreshCw,
              color: "text-amber-600 dark:text-amber-500",
            },
          ].map(({ label, items, Icon, color }) => (
            <div key={label}>
              <div className={`flex items-center gap-2 mb-2.5 ${color}`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
              </div>
              <ul className="space-y-2">
                {items?.map((item: string, i: number) => (
                  <li key={i} className="text-[12px] text-zinc-600 dark:text-zinc-400 leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {(((verdict as any).key_unknown) || ((verdict as any).flip_factor)) && (
        <div className="border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-[#141414] px-5 py-4 grid grid-cols-2 gap-6">
          {(verdict as any).key_unknown && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
                Key unknown
              </p>
              <p className="text-[12px] text-zinc-700 dark:text-zinc-300 leading-snug">
                {(verdict as any).key_unknown}
              </p>
            </div>
          )}
          {(verdict as any).flip_factor && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
                Flip factor
              </p>
              <p className="text-[12px] text-zinc-700 dark:text-zinc-300 leading-snug">
                {(verdict as any).flip_factor}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NextStepView({ step }: { step: NextStep }) {
  return (
    <div className="rounded-xl border border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-950/10 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2.5">
        <Zap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400/80">
          Next step
        </span>
      </div>
      <p className="text-[14px] text-sky-900 dark:text-sky-50 font-medium leading-snug">
        {(step as any).immediate_action}
      </p>
      {(step as any).test_if_uncertain && (
        <div className="mt-3 pt-3 border-t border-sky-200 dark:border-sky-500/10">
          <p className="text-[12px] text-sky-800 dark:text-sky-200/60">
            <span className="text-sky-600 dark:text-sky-400/50 uppercase font-bold text-[10px] tracking-widest mr-2">
              Validate by
            </span>
            {(step as any).test_if_uncertain}
          </p>
        </div>
      )}
    </div>
  );
}

function DecisionBoard({ message, onSpawn }: { message: Message; onSpawn?: (q: string) => void }) {
  const d = (message as any).decision ?? {};
  const summaryText = typeof d.summary_box === "string" ? d.summary_box : d.summary_box?.claim ?? "";
  const verdict = d.verdict_card as any;
  const nextStep = d.next_step ?? d.next_step_box;
  const reasoningTrail = d.reasoning_trail ?? null;
  const financeSnapshot = d.finance_snapshot ?? null;
  const audit = d.audit ?? null;
  const healthSummary = financeSnapshot?.health_summary ?? [];

  return (
    <div className="w-full space-y-4">
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#141414] px-5 py-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
          Summary
        </p>
        <p className="text-[14px] text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">{summaryText}</p>
      </div>

      <HealthSummaryView items={healthSummary} currency={financeSnapshot?.currency} />
      <FinanceSnapshotView snapshot={financeSnapshot} />

      {(d.upside_boxes?.length > 0 || d.risk_boxes?.length > 0) && (
        <div className="columns-1 md:columns-2 gap-4 w-full">
          {d.upside_boxes?.map((box: any, i: number) => (
            <div key={`up-${i}`} className="break-inside-avoid mb-4">
              <SourceCard box={box} type="upside" query={d.query} audit={audit} trail={reasoningTrail} onSpawn={onSpawn} />
            </div>
          ))}
          {d.risk_boxes?.map((box: any, i: number) => (
            <div key={`risk-${i}`} className="break-inside-avoid mb-4">
              <SourceCard box={box} type="risk" query={d.query} audit={audit} trail={reasoningTrail} onSpawn={onSpawn} />
            </div>
          ))}
        </div>
      )}

      {verdict && <VerdictView verdict={verdict} />}
      {nextStep && <NextStepView step={nextStep} />}
      <AuditMiniView audit={audit} />
    </div>
  );
}

function MessageBubble({
  message,
  onSpawn,
  isTyping,
  isLatest,
}: {
  message: Message;
  onSpawn?: (q: string) => void;
  isTyping: boolean;
  isLatest: boolean;
}) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1 mb-6 mt-2">
        <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mr-2 select-none">You</span>
        <div className="max-w-[80%] px-5 py-3.5 rounded-2xl rounded-tr-sm text-[14.5px] text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-[#1E1E1E] border border-zinc-200 dark:border-white/5 shadow-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-[85%] px-5 py-4 rounded-xl border border-rose-200 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-200 text-[14px] leading-relaxed mb-6 shadow-sm">
        {message.content}
      </div>
    );
  }

  const isThinking = isLatest && isTyping;
  const contentStr = (message.content as string) || "";
  const isEngineStream = message.kind === "decision" && !message.decision && contentStr.trim().length > 0;

  const thinkingSteps = isEngineStream
    ? contentStr
        .split(/\n+/)
        .filter((step) => step.trim() !== "")
        .map((step) => step.replace(/\*/g, ""))
    : [];

  return (
    <div className="w-full flex items-start gap-4 mb-8">
      <div
        className={clsx(
          "shrink-0 w-8 h-8 flex items-center justify-center bg-white dark:bg-[black] shadow-sm overflow-hidden transition-all duration-300 mt-0.5",
          isThinking && "shadow-[0_0_15px_rgba(232,121,249,0.3)] border-[#e879f9]/50"
        )}
      >
        <Image
          src="/dashlogo-light.png"
          alt="three AI"
          width={20}
          height={20}
          className={clsx(isThinking && "animate-spin [animation-duration:2.5s]")}
        />
      </div>

      <div className="flex-1 min-w-0 pt-1">
        {(message as any).decision ? (
          <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <DecisionBoard message={message} onSpawn={onSpawn} />
          </div>
        ) : message.blocks?.length ? (
          <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <AssistantBlocksView blocks={message.blocks} />
          </div>
        ) : isEngineStream ? (
          <div className="w-full pl-1">
            <div className="flex items-center gap-2.5 mb-5 mt-1.5">
              <BrainCircuit className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Engine Routing
              </span>
            </div>

            <div className="relative flex flex-col gap-4 ml-2">
              {thinkingSteps.length > 1 && (
                <div className="absolute left-[7px] top-2 bottom-4 w-[1.5px] bg-zinc-200 dark:bg-zinc-800 z-0" />
              )}

              {thinkingSteps.map((step, index) => {
                const isLastStep = index === thinkingSteps.length - 1;
                const showSpinner = isLastStep && isLatest && isTyping;

                return (
                  <div key={index} className="relative z-10 flex items-start gap-4">
                    <div className="mt-0.5 bg-white dark:bg-[#0A0A0A] rounded-full shrink-0 flex items-center justify-center p-[1px] transition-colors">
                      {showSpinner ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
                      )}
                    </div>
                    <span
                      className={clsx(
                        "text-[13.5px] font-medium leading-relaxed pt-[1px] transition-colors",
                        showSpinner ? "text-zinc-900 dark:text-zinc-200 animate-pulse" : "text-zinc-400 dark:text-zinc-600"
                      )}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-[14.5px] text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap mt-1">
            {contentStr || (
              <span className="text-zinc-400 flex items-center gap-2 animate-pulse text-[13px]">
                <Loader2 size={14} className="animate-spin" /> Compiling thoughts...
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Aicontentspace({ messages, isTyping, onSpawnQuestion }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const pending = localStorage.getItem("pending_spawn_question");
    if (pending && onSpawnQuestion) {
      localStorage.removeItem("pending_spawn_question");
      onSpawnQuestion(pending);
    }
  }, [onSpawnQuestion]);

  useEffect(() => {
    if (!showScrollButton) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showScrollButton]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 300);
    }
  };

  return (
    <div className="relative h-full w-full max-w-5xl mx-auto overflow-hidden">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-6 md:px-10 py-10 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {messages.length === 0 && <div className="h-full flex items-center justify-center" />}

        {messages.map((msg, index) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onSpawn={onSpawnQuestion}
            isTyping={isTyping}
            isLatest={index === messages.length - 1}
          />
        ))}

        <div ref={bottomRef} className="h-4" />
      </div>

      {showScrollButton && (
        <button
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-[#252525] hover:border-zinc-300 dark:hover:border-white/20 transition-all active:scale-95 shadow-xl flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
        >
          <ArrowDown className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
            Scroll down
          </span>
        </button>
      )}
    </div>
  );
}
