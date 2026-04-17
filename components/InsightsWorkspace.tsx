"use client";

import {
  FormEvent,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import clsx from "clsx";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  Database,
  Loader2,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";

import {
  askInsightIf,
  getInsightsSnapshot,
  getOrCreateCompanyId,
} from "@/services/chatApi";
import type { DecisionPayload, VerdictColor } from "@/types/chat";
import type {
  ConditionEvaluation,
  ConditionRecord,
  InsightAskIfResponse,
  InsightConnectorStatus,
  InsightDataPoint,
  InsightMonitorCard,
  InsightSnapshotResponse,
} from "@/types/insights";

const ASK_IF_EXAMPLES = [
  "If Stripe churn rises by 4% while runway falls below 9 months, what should we do first?",
  "If our top customer concentration moves above 28%, what board action should trigger?",
  "If gross margin improves but overdue receivables worsen, do we keep hiring?",
];

const VERDICT_STYLES: Record<
  VerdictColor,
  {
    badge: string;
    dot: string;
    border: string;
  }
> = {
  Green: {
    badge:
      "border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
    border: "border-emerald-200/70 dark:border-emerald-900/40",
  },
  Yellow: {
    badge:
      "border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    dot: "bg-amber-500",
    border: "border-amber-200/70 dark:border-amber-900/40",
  },
  Orange: {
    badge:
      "border-orange-500/20 bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
    dot: "bg-orange-500",
    border: "border-orange-200/70 dark:border-orange-900/40",
  },
  Red: {
    badge:
      "border-rose-500/20 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    dot: "bg-rose-500",
    border: "border-rose-200/70 dark:border-rose-900/40",
  },
};

function formatTimestamp(value?: string | null) {
  if (!value) return "Waiting for first run";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Waiting for first run";

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatShortTime(value?: string | null) {
  if (!value) return "n/a";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "n/a";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCountdown(targetUtc?: string | null, nowMs = Date.now()) {
  if (!targetUtc) return "n/a";

  const targetMs = new Date(targetUtc).getTime();
  if (Number.isNaN(targetMs)) return "n/a";

  const remaining = Math.max(0, targetMs - nowMs);
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function formatCompactNumber(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;

  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: value < 10 ? 1 : 0,
  }).format(value);
}

function formatPercent(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return `${Math.round(value)}%`;
}

function formatCurrency(value?: number | null, currency = "USD") {
  if (typeof value !== "number" || Number.isNaN(value)) return null;

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: value >= 1000 ? 0 : 2,
    }).format(value);
  } catch {
    return `$${value.toLocaleString()}`;
  }
}

function getAssessmentTone(assessment: ConditionEvaluation["assessment"]) {
  if (assessment === "fired") {
    return {
      badge:
        "border-rose-500/20 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
      dot: "bg-rose-500",
      label: "Triggered",
    };
  }

  if (assessment === "clear") {
    return {
      badge:
        "border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
      dot: "bg-emerald-500",
      label: "Clear",
    };
  }

  return {
    badge:
      "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    dot: "bg-zinc-500",
    label: "Insufficient data",
  };
}

function getConnectorTone(status: InsightConnectorStatus["status"]) {
  switch (status) {
    case "connected":
      return "text-emerald-600 dark:text-emerald-400";
    case "error":
      return "text-rose-600 dark:text-rose-400";
    case "disabled":
      return "text-zinc-400 dark:text-zinc-500";
    default:
      return "text-amber-600 dark:text-amber-400";
  }
}

function getConditionKindTone(kind: string) {
  if (kind === "go") {
    return "border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }

  if (kind === "stop") {
    return "border-rose-500/20 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
  }

  return "border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
}

function getVerdictStyle(color?: VerdictColor | null) {
  return VERDICT_STYLES[color || "Yellow"];
}

function pickMonitorMetrics(decision: DecisionPayload) {
  const snapshot = decision.finance_snapshot;
  if (!snapshot) return [];

  const items = [
    {
      label: "Runway",
      value:
        typeof snapshot.runway_months === "number"
          ? `${snapshot.runway_months.toFixed(1)} mo`
          : null,
    },
    {
      label: "Cash",
      value: formatCurrency(snapshot.cash_balance, snapshot.currency || "USD"),
    },
    {
      label: "Growth",
      value: formatPercent(snapshot.revenue_growth_pct),
    },
    {
      label: "Gross margin",
      value: formatPercent(snapshot.gross_margin_pct),
    },
    {
      label: "Failed pay",
      value: formatPercent(snapshot.failed_payment_rate_pct),
    },
  ];

  return items.filter((item) => item.value).slice(0, 4) as Array<{
    label: string;
    value: string;
  }>;
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#161616]">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {hint}
      </p>
    </div>
  );
}

function DecisionConditionColumn({
  label,
  items,
  emptyLabel,
  tone,
  icon,
}: {
  label: string;
  items: string[];
  emptyLabel: string;
  tone: string;
  icon: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div
        className={clsx(
          "inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em]",
          tone,
        )}
      >
        {icon}
        <span>{label}</span>
      </div>

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-sm border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-[#111111] dark:text-zinc-300"
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-zinc-200 px-3 py-3 text-sm text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}

function MonitorCard({ monitor }: { monitor: InsightMonitorCard }) {
  const verdict = monitor.decision.verdict_card;
  const style = getVerdictStyle(verdict.color);
  const metrics = pickMonitorMetrics(monitor.decision);

  return (
    <article
      className={clsx(
        "rounded-md border bg-white p-5 dark:bg-[#161616]",
        style.border,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={clsx(
                "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em]",
                style.badge,
              )}
            >
              <span className={clsx("h-1.5 w-1.5 rounded-full", style.dot)} />
              {monitor.title}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
              {formatShortTime(monitor.generated_utc)}
            </span>
          </div>

          <h3 className="mt-4 font-serif text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
            {verdict.headline}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {monitor.description}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
            {verdict.rationale}
          </p>
        </div>

        <div className="rounded-sm border border-zinc-200 bg-zinc-50 px-3 py-2 text-right dark:border-zinc-800 dark:bg-[#101010]">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
            Net score
          </p>
          <p className="mt-1 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            {verdict.net_score}
          </p>
        </div>
      </div>

      {metrics.length > 0 && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-sm border border-zinc-200 bg-zinc-50 px-3 py-3 dark:border-zinc-800 dark:bg-[#101010]"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                {metric.label}
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-5 border-t border-zinc-200 pt-5 dark:border-zinc-800 xl:grid-cols-3">
        <DecisionConditionColumn
          label="Go if"
          items={verdict.go_conditions}
          emptyLabel="No explicit green-light conditions returned."
          tone="text-emerald-600 dark:text-emerald-400"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <DecisionConditionColumn
          label="Stop if"
          items={verdict.stop_conditions}
          emptyLabel="No hard stop conditions returned."
          tone="text-rose-600 dark:text-rose-400"
          icon={<XCircle className="h-4 w-4" />}
        />
        <DecisionConditionColumn
          label="Review when"
          items={verdict.review_triggers}
          emptyLabel="No review triggers returned."
          tone="text-amber-600 dark:text-amber-400"
          icon={<RefreshCcw className="h-4 w-4" />}
        />
      </div>

      <div className="mt-5 rounded-sm border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-[#111111]">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
          Monitor question
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {monitor.question}
        </p>
      </div>
    </article>
  );
}

function AskIfResultCard({ result }: { result: InsightAskIfResponse }) {
  const verdict = result.decision.verdict_card;
  const style = getVerdictStyle(verdict.color);

  return (
    <article
      className={clsx(
        "rounded-md border bg-white p-5 dark:bg-[#161616]",
        style.border,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={clsx(
                "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em]",
                style.badge,
              )}
            >
              <span className={clsx("h-1.5 w-1.5 rounded-full", style.dot)} />
              Ask an if
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
              {formatTimestamp(result.generated_utc)}
            </span>
          </div>
          <h3 className="mt-4 font-serif text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
            {result.query}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
            {verdict.rationale}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 border-t border-zinc-200 pt-5 dark:border-zinc-800 xl:grid-cols-3">
        <DecisionConditionColumn
          label="Go if"
          items={verdict.go_conditions}
          emptyLabel="No green-light conditions returned."
          tone="text-emerald-600 dark:text-emerald-400"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <DecisionConditionColumn
          label="Stop if"
          items={verdict.stop_conditions}
          emptyLabel="No stop conditions returned."
          tone="text-rose-600 dark:text-rose-400"
          icon={<XCircle className="h-4 w-4" />}
        />
        <DecisionConditionColumn
          label="Review when"
          items={verdict.review_triggers}
          emptyLabel="No review triggers returned."
          tone="text-amber-600 dark:text-amber-400"
          icon={<RefreshCcw className="h-4 w-4" />}
        />
      </div>
    </article>
  );
}

function ConditionBucket({
  label,
  records,
  emptyLabel,
  tone,
}: {
  label: string;
  records: ConditionRecord[];
  emptyLabel: string;
  tone: string;
}) {
  return (
    <section className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#161616]">
      <div className="flex items-center justify-between gap-3">
        <p
          className={clsx(
            "text-[10px] font-medium uppercase tracking-[0.24em]",
            tone,
          )}
        >
          {label}
        </p>
        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
          {records.length}
        </span>
      </div>

      {records.length > 0 ? (
        <div className="mt-4 space-y-3">
          {records.slice(0, 4).map((record) => (
            <div
              key={record.condition_id}
              className="rounded-sm border border-zinc-200 bg-zinc-50 px-3 py-3 dark:border-zinc-800 dark:bg-[#101010]"
            >
              <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                {record.text}
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {record.query_preview}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {emptyLabel}
        </p>
      )}
    </section>
  );
}

function ConnectorPanel({
  connectors,
  connectedSources,
}: {
  connectors: InsightConnectorStatus[];
  connectedSources: string[];
}) {
  return (
    <section className="rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#161616]">
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
          Connected sources
        </p>
        <h2 className="mt-1 font-serif text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
          Live connector health
        </h2>
      </div>

      <div className="space-y-4 p-5">
        {connectors.length > 0 ? (
          connectors.map((connector) => (
            <div
              key={connector.connector_id}
              className="rounded-sm border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-[#101010]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {connector.label}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {connector.detail || "Connector standing by."}
                  </p>
                </div>
                <span
                  className={clsx(
                    "text-xs font-medium uppercase tracking-[0.22em]",
                    getConnectorTone(connector.status),
                  )}
                >
                  {connector.status}
                </span>
              </div>

              <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
                Last touch {formatShortTime(connector.last_used_utc)}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-sm border border-dashed border-zinc-200 px-4 py-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            No finance connectors are configured yet.
          </div>
        )}

        {connectedSources.length > 0 && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
              Source labels
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {connectedSources.map((source) => (
                <span
                  key={source}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-[#111111] dark:text-zinc-300"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EvaluationCard({ evaluation }: { evaluation: ConditionEvaluation }) {
  const tone = getAssessmentTone(evaluation.assessment);

  return (
    <article className="rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#161616]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={clsx(
              "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em]",
              getConditionKindTone(evaluation.kind),
            )}
          >
            {evaluation.kind}
          </span>
          <span
            className={clsx(
              "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em]",
              tone.badge,
            )}
          >
            <span className={clsx("h-1.5 w-1.5 rounded-full", tone.dot)} />
            {tone.label}
          </span>
          {evaluation.reanalysis_triggered && (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
              Reanalysis queued
            </span>
          )}
        </div>

        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
          {formatTimestamp(evaluation.evaluated_utc)}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
        If {evaluation.condition_text}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {evaluation.reasoning}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {evaluation.data_points.length > 0 ? (
          evaluation.data_points.slice(0, 6).map((point) => (
            <span
              key={`${evaluation.condition_id}-${point.metric_name}-${point.fetched_utc}`}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-[#101010] dark:text-zinc-300"
            >
              {point.metric_name}: {point.value_str}
            </span>
          ))
        ) : (
          <span className="rounded-full border border-dashed border-zinc-200 px-3 py-1 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
            No supporting datapoints yet
          </span>
        )}
      </div>
    </article>
  );
}

function RecentDataTable({
  data,
  syncDurationMs,
}: {
  data: InsightDataPoint[];
  syncDurationMs?: number | null;
}) {
  return (
    <section className="rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#161616]">
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
              Metric tape
            </p>
            <h2 className="mt-1 font-serif text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              Latest connected finance datapoints
            </h2>
          </div>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Sync {syncDurationMs ? `${syncDurationMs} ms` : "n/a"}
          </span>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead>
              <tr className="text-left text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                <th className="px-5 py-3">Metric</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Fetched</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {data.slice(0, 12).map((point) => (
                <tr
                  key={`${point.connector_id}-${point.metric_name}-${point.fetched_utc}`}
                  className="text-sm text-zinc-700 dark:text-zinc-300"
                >
                  <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                    {point.metric_name}
                  </td>
                  <td className="px-5 py-3">{point.value_str}</td>
                  <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400">
                    {point.source_label || point.connector_id}
                  </td>
                  <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400">
                    {formatShortTime(point.fetched_utc)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-8 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          No normalized datapoints are available yet. Connect Stripe,
          QuickBooks, or another finance stream and the live tape will populate
          here.
        </div>
      )}
    </section>
  );
}

export default function InsightsWorkspace() {
  const [companyId, setCompanyId] = useState("");
  const [snapshot, setSnapshot] = useState<InsightSnapshotResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [askDraft, setAskDraft] = useState("");
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);
  const [askResponse, setAskResponse] = useState<InsightAskIfResponse | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const snapshotRef = useRef<InsightSnapshotResponse | null>(null);
  const pendingRefreshRef = useRef(false);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  const hydrateSnapshot = useCallback(async (forceRefresh = false) => {
    if (pendingRefreshRef.current) return;
    pendingRefreshRef.current = true;
    const resolvedCompanyId = getOrCreateCompanyId();
    const hasSnapshot = Boolean(snapshotRef.current);

    setCompanyId(resolvedCompanyId);
    setError(null);
    if (hasSnapshot) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await getInsightsSnapshot({
        companyId: resolvedCompanyId,
        forceRefresh,
      });
      setSnapshot(response);
    } catch (loadError) {
      console.error("Failed to load insights snapshot", loadError);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load the insights workspace.",
      );
    } finally {
      pendingRefreshRef.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void hydrateSnapshot(false);
  }, [hydrateSnapshot]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!snapshot?.overview.next_refresh_utc) return;

    const nextRefreshAt = new Date(snapshot.overview.next_refresh_utc).getTime();
    const fallbackDelay = snapshot.overview.refresh_interval_seconds * 1000;
    const delay = Number.isNaN(nextRefreshAt)
      ? fallbackDelay
      : Math.max(nextRefreshAt - Date.now(), 1000);

    const timeoutId = window.setTimeout(() => {
      void hydrateSnapshot(true);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [
    hydrateSnapshot,
    snapshot?.overview.next_refresh_utc,
    snapshot?.overview.refresh_interval_seconds,
  ]);

  async function handleAskIfSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const question = askDraft.trim();
    if (!question || asking) return;

    setAsking(true);
    setAskError(null);

    try {
      const response = await askInsightIf({
        question,
        companyId: companyId || getOrCreateCompanyId(),
        forceRefresh: true,
      });

      setAskResponse(response);
      setAskDraft("");
      window.dispatchEvent(new CustomEvent("refresh-recents"));
      void hydrateSnapshot(true);
    } catch (submitError) {
      console.error("Failed to run ask-if", submitError);
      setAskError(
        submitError instanceof Error
          ? submitError.message
          : "The ask-if scenario could not be executed.",
      );
    } finally {
      setAsking(false);
    }
  }

  function handleAskKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleAskIfSubmit();
    }
  }

  const connectedSources = snapshot?.overview.connected_sources ?? [];
  const syncDurationMs =
    typeof snapshot?.sync_result?.duration_ms === "number"
      ? snapshot.sync_result.duration_ms
      : null;
  const countdownLabel = formatCountdown(
    snapshot?.overview.next_refresh_utc,
    now,
  );
  const recentData = snapshot?.recent_data ?? [];
  const monitors = snapshot?.monitors ?? [];
  const evaluations = snapshot?.scan_report.evaluations ?? [];
  const urgentConditions = snapshot?.conditions.urgent ?? [];
  const reviewConditions = snapshot?.conditions.needs_review ?? [];
  const goConditions = snapshot?.conditions.go_conditions ?? [];
  const scanReport = snapshot?.scan_report;

  return (
    <main className="flex-1 overflow-y-auto bg-[#F6F4EE] text-zinc-900 dark:bg-[#0A0A0A] dark:text-zinc-100">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-md border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-[#161616]">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-600 dark:border-zinc-800 dark:bg-[#101010] dark:text-zinc-400">
                <Sparkles className="h-3.5 w-3.5" />
                Insights Control Tower
              </div>
              <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                Real-time financial watchtower for every connected company
                signal.
              </h1>
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                Every five minutes this workspace refreshes your connected
                finance sources, runs proactive monitor questions, surfaces live
                condition checks, and keeps the full if/else runtime visible in
                a cleaner decision-ops UI.
              </p>
            </div>

            <div className="min-w-[260px] rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-[#101010]">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Company scope
              </p>
              <p className="mt-2 font-mono text-sm text-zinc-800 dark:text-zinc-200">
                {companyId || "initializing"}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-[#161616] dark:text-zinc-300">
                  <Clock3 className="h-3.5 w-3.5" />
                  Last refresh {formatShortTime(snapshot?.generated_utc)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-[#161616] dark:text-zinc-300">
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Next in {countdownLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-[#161616] dark:text-zinc-300">
                  <Database className="h-3.5 w-3.5" />
                  {snapshot?.cached ? "Cached snapshot" : "Live snapshot"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-[#161616] dark:text-zinc-300">
                  <Activity className="h-3.5 w-3.5" />
                  Watch {snapshot?.watch_status?.status || "scheduled"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => void hydrateSnapshot(true)}
                disabled={loading || refreshing}
                className="mt-4 inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-[#161616] dark:text-zinc-100 dark:hover:bg-[#202020]"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                Refresh now
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-400">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Sources"
                value={snapshot?.overview.source_count ?? 0}
                hint="Connected systems available to the watchtower."
              />
              <StatCard
                label="Monitors"
                value={snapshot?.overview.monitor_count ?? 0}
                hint="Proactive finance questions generated from live company data."
              />
              <StatCard
                label="Active conditions"
                value={snapshot?.overview.active_conditions ?? 0}
                hint="Current go, stop, and review conditions on the books."
              />
              <StatCard
                label="Datapoints"
                value={
                  formatCompactNumber(snapshot?.overview.datapoint_count) ?? 0
                }
                hint="Recent normalized finance datapoints available for scans."
              />
            </div>

            <section className="rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#161616]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    <Activity className="h-4 w-4" />
                    Ask an if
                  </div>
                  <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                    Run a fresh scenario against the same live finance context.
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Use this for targeted what-if questions while the monitor
                    bank keeps scanning the background conditions automatically.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAskIfSubmit} className="mt-5 space-y-4">
                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-2 focus-within:border-zinc-400 dark:border-zinc-800 dark:bg-[#101010] dark:focus-within:border-zinc-700">
                  <textarea
                    value={askDraft}
                    onChange={(event) => setAskDraft(event.target.value)}
                    onKeyDown={handleAskKeyDown}
                    placeholder="Example: If collections slow down while burn accelerates, what should leadership do before the next board meeting?"
                    className="min-h-[110px] w-full resize-none bg-transparent px-3 py-2 text-[15px] leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-2 pt-1">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Press Enter to execute. Shift + Enter inserts a new line.
                    </p>

                    <button
                      type="submit"
                      disabled={asking || askDraft.trim().length === 0}
                      className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                    >
                      {asking ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Activity className="h-4 w-4" />
                      )}
                      Execute
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ASK_IF_EXAMPLES.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setAskDraft(prompt)}
                      className="rounded-full border border-zinc-200 bg-transparent px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {askError && (
                  <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-400">
                    {askError}
                  </div>
                )}
              </form>
            </section>

            {askResponse && <AskIfResultCard result={askResponse} />}

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    <Sparkles className="h-4 w-4" />
                    Proactive monitor bank
                  </div>
                  <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                    Predicted finance questions running every cycle
                  </h2>
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {monitors.length} live monitor{monitors.length === 1 ? "" : "s"}
                </span>
              </div>

              {loading && monitors.length === 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-64 animate-pulse rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-[#161616]"
                    />
                  ))}
                </div>
              ) : monitors.length > 0 ? (
                <div className="grid gap-4 2xl:grid-cols-2">
                  {monitors.map((monitor) => (
                    <MonitorCard key={monitor.monitor_id} monitor={monitor} />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-[#161616]">
                  <Bot className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-500" />
                  <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    No proactive monitors yet
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    Once finance sources are connected, the workspace will start
                    generating and refreshing a bank of proactive financial
                    questions automatically.
                  </p>
                </div>
              )}
            </section>
          </section>

          <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
            <ConnectorPanel
              connectors={snapshot?.connector_status ?? []}
              connectedSources={connectedSources}
            />

            <section className="rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#161616]">
              <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                  Runtime summary
                </p>
                <h2 className="mt-1 font-serif text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                  Live if / else engine
                </h2>
              </div>

              <div className="grid gap-3 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-sm border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-[#101010]">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                      <ShieldAlert className="h-4 w-4" />
                      <span className="text-[10px] font-medium uppercase tracking-[0.22em]">
                        Triggered
                      </span>
                    </div>
                    <p className="mt-2 text-xl font-medium text-zinc-900 dark:text-zinc-100">
                      {scanReport?.conditions_fired ?? 0}
                    </p>
                  </div>
                  <div className="rounded-sm border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-[#101010]">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-[10px] font-medium uppercase tracking-[0.22em]">
                        Clear
                      </span>
                    </div>
                    <p className="mt-2 text-xl font-medium text-zinc-900 dark:text-zinc-100">
                      {scanReport?.conditions_clear ?? 0}
                    </p>
                  </div>
                </div>

                <div className="rounded-sm border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-[#101010]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                      Scan duration
                    </span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {scanReport ? `${scanReport.scan_duration_ms} ms` : "n/a"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                      Insufficient data
                    </span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {scanReport?.insufficient_data ?? 0}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                      Last scan
                    </span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {formatShortTime(scanReport?.scanned_utc)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <ConditionBucket
              label="Urgent stop conditions"
              records={urgentConditions}
              emptyLabel="No urgent conditions have fired."
              tone="text-rose-600 dark:text-rose-400"
            />
            <ConditionBucket
              label="Needs review"
              records={reviewConditions}
              emptyLabel="No review conditions waiting."
              tone="text-amber-600 dark:text-amber-400"
            />
            <ConditionBucket
              label="Go conditions"
              records={goConditions}
              emptyLabel="No green-light conditions tracked yet."
              tone="text-emerald-600 dark:text-emerald-400"
            />
          </aside>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
          <section className="rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#161616]">
            <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    Logic stream
                  </p>
                  <h2 className="mt-1 font-serif text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                    Every live if / else check, shown explicitly
                  </h2>
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {evaluations.length} evaluated
                </span>
              </div>
            </div>

            <div className="space-y-4 p-5">
              {loading && evaluations.length === 0 ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-40 animate-pulse rounded-md bg-zinc-100 dark:bg-[#101010]"
                  />
                ))
              ) : evaluations.length > 0 ? (
                evaluations.map((evaluation) => (
                  <EvaluationCard
                    key={evaluation.condition_id}
                    evaluation={evaluation}
                  />
                ))
              ) : (
                <div className="rounded-md border border-dashed border-zinc-200 px-4 py-8 text-center dark:border-zinc-800">
                  <AlertTriangle className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-500" />
                  <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    No live evaluations yet
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    This panel fills up once monitors or ask-if runs produce
                    conditions that can be scanned against connected finance
                    signals.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="space-y-6">
            <RecentDataTable data={recentData} syncDurationMs={syncDurationMs} />

            <section className="rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#161616]">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                <Building2 className="h-4 w-4" />
                Enterprise watchtower behavior
              </div>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                <p>
                  The page keeps a rolling five-minute cycle, refreshes finance
                  sources, regenerates monitor questions from the connected
                  company footprint, and then reruns condition scans against the
                  newest datapoints.
                </p>
                <p>
                  The visible logic stream is intentionally explicit: every
                  monitor can create conditions, every condition can be scanned,
                  and every scan can show triggered, clear, or
                  insufficient-data branches.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Explore the monitors above
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
