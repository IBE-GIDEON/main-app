"use client";

import { FormEvent, KeyboardEvent, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import {
  getAuditRecord,
  getOrCreateCompanyId,
  listAuditRecords,
  sendToAI,
} from "@/services/chatApi";
import type {
  AssistantEnvelope,
  AuditRecordResponse,
  DecisionPayload,
  RecentAuditRecord,
  VerdictColor,
} from "@/types/chat";
import { loadChat, saveChat } from "@/utils/chatStorage";

type ConditionLedgerItem = {
  id: string;
  recordId?: string;
  source: "audit" | "session";
  query: string;
  headline: string;
  rationale: string;
  verdictColor: VerdictColor;
  goConditions: string[];
  stopConditions: string[];
  reviewTriggers: string[];
  nextStep?: string | null;
  confidence?: number | null;
  stakeLevel?: string | null;
  decisionType?: string | null;
  createdAt?: string | null;
};

const QUICK_PROMPTS = [
  "Should we pause hiring if runway drops below 10 months?",
  "Under what conditions should we approve a new product launch this quarter?",
  "What conditions would make a price increase too risky right now?",
];

// Refactored to be subtle, relying on dots/text color rather than heavy background fills
const VERDICT_STYLES: Record<
  VerdictColor,
  {
    badge: string;
    border: string;
    dot: string;
    iconTone: string;
  }
> = {
  Green: {
    badge: "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-[#121212] dark:text-zinc-300",
    border: "border-zinc-200 dark:border-zinc-800",
    dot: "bg-emerald-500",
    iconTone: "text-emerald-600 dark:text-emerald-500",
  },
  Yellow: {
    badge: "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-[#121212] dark:text-zinc-300",
    border: "border-zinc-200 dark:border-zinc-800",
    dot: "bg-amber-500",
    iconTone: "text-amber-600 dark:text-amber-500",
  },
  Orange: {
    badge: "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-[#121212] dark:text-zinc-300",
    border: "border-zinc-200 dark:border-zinc-800",
    dot: "bg-orange-500",
    iconTone: "text-orange-600 dark:text-orange-500",
  },
  Red: {
    badge: "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-[#121212] dark:text-zinc-300",
    border: "border-zinc-200 dark:border-zinc-800",
    dot: "bg-rose-500",
    iconTone: "text-rose-600 dark:text-rose-500",
  },
};

function isVerdictColor(value: unknown): value is VerdictColor {
  return value === "Green" || value === "Yellow" || value === "Orange" || value === "Red";
}

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getVerdictColor(value: unknown, fallback: VerdictColor = "Yellow"): VerdictColor {
  return isVerdictColor(value) ? value : fallback;
}

function formatTimestamp(value?: string | null) {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatConfidence(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "n/a";
  const normalized = value <= 1 ? value * 100 : value;
  return `${Math.round(normalized)}%`;
}

function getSignature(item: ConditionLedgerItem) {
  return `${item.query.trim().toLowerCase()}::${item.headline.trim().toLowerCase()}`;
}

function mergeLedgerItems(items: ConditionLedgerItem[]) {
  const deduped = new Map<string, ConditionLedgerItem>();

  for (const item of items) {
    const key = getSignature(item);
    const existing = deduped.get(key);

    if (!existing) {
      deduped.set(key, item);
      continue;
    }

    if (!existing.recordId && item.recordId) {
      deduped.set(key, item);
      continue;
    }

    const existingTime = new Date(existing.createdAt ?? 0).getTime();
    const nextTime = new Date(item.createdAt ?? 0).getTime();
    if (nextTime > existingTime) {
      deduped.set(key, item);
    }
  }

  return Array.from(deduped.values()).sort((left, right) => {
    const leftTime = new Date(left.createdAt ?? 0).getTime();
    const rightTime = new Date(right.createdAt ?? 0).getTime();
    return rightTime - leftTime;
  });
}

function getCurrentSessionItem(): ConditionLedgerItem | null {
  const messages = loadChat();
  const decisionMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant" && message.decision);

  if (!decisionMessage?.decision) return null;

  return mapDecisionToLedgerItem(decisionMessage.decision, {
    id: decisionMessage.id,
    source: "session",
    createdAt: new Date(decisionMessage.createdAt).toISOString(),
  });
}

function mapDecisionToLedgerItem(
  decision: DecisionPayload,
  options?: {
    id?: string;
    recordId?: string;
    source?: "audit" | "session";
    createdAt?: string | null;
    confidence?: number | null;
    stakeLevel?: string | null;
    decisionType?: string | null;
  },
): ConditionLedgerItem {
  const verdict = decision.verdict_card;
  const color = getVerdictColor(verdict?.color ?? verdict?.badge?.raw, "Yellow");

  return {
    id: options?.id ?? crypto.randomUUID(),
    recordId: options?.recordId,
    source: options?.source ?? "session",
    query: decision.query || "Untitled decision",
    headline: verdict?.headline || "Structured verdict ready",
    rationale: verdict?.rationale || "No rationale was returned for this run.",
    verdictColor: color,
    goConditions: verdict?.go_conditions ?? [],
    stopConditions: verdict?.stop_conditions ?? [],
    reviewTriggers: verdict?.review_triggers ?? [],
    nextStep:
      decision.next_step?.immediate_action ??
      decision.next_step_box?.immediate_action ??
      null,
    confidence:
      options?.confidence ??
      decision.reasoning_trail?.combined_confidence ??
      decision.confidence ??
      null,
    stakeLevel:
      options?.stakeLevel ??
      decision.reasoning_trail?.stake_level ??
      null,
    decisionType:
      options?.decisionType ??
      decision.reasoning_trail?.decision_type ??
      null,
    createdAt: options?.createdAt ?? new Date().toISOString(),
  };
}

function mapAuditRecordToLedgerItem(
  record: RecentAuditRecord,
  auditDetail?: AuditRecordResponse,
): ConditionLedgerItem {
  const snapshot =
    auditDetail?.verdict_snapshot && typeof auditDetail.verdict_snapshot === "object"
      ? (auditDetail.verdict_snapshot as Record<string, unknown>)
      : {};

  const color = getVerdictColor(
    snapshot.color ??
      (snapshot.badge && typeof snapshot.badge === "object"
        ? (snapshot.badge as Record<string, unknown>).raw
        : undefined) ??
      record.verdict_color,
    record.verdict_color,
  );

  return {
    id: record.decision_id,
    recordId: record.record_id,
    source: "audit",
    query: auditDetail?.query_preview || record.query_preview || "Archived query",
    headline: readString(snapshot.headline, "Archived verdict"),
    rationale: readString(
      snapshot.rationale,
      "Structured verdict archived without expanded rationale.",
    ),
    verdictColor: color,
    goConditions: readStringArray(snapshot.go_conditions),
    stopConditions: readStringArray(snapshot.stop_conditions),
    reviewTriggers: readStringArray(snapshot.review_triggers),
    nextStep: null,
    confidence:
      auditDetail?.routing_snapshot?.confidence ?? record.confidence ?? null,
    stakeLevel: auditDetail?.routing_snapshot?.stake_level ?? record.stake_level,
    decisionType: record.decision_type,
    createdAt: record.created_utc,
  };
}

function persistEnvelopeToChat(query: string, envelope: AssistantEnvelope) {
  const now = Date.now();
  saveChat([
    {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        envelope.decision?.verdict_card?.headline ||
        envelope.blocks.find((block) => block.text?.trim())?.text?.trim() ||
        "Structured response ready.",
      decision: envelope.decision ?? undefined,
      blocks: envelope.blocks,
      kind: envelope.kind,
      createdAt: now + 1,
    },
  ]);
}

// Re-styled to be flat and structural
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
    <div className="rounded-xl border border-zinc-200 bg-transparent p-5 dark:border-zinc-800">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
        {hint}
      </p>
    </div>
  );
}

// Simplified layout, removing heavy background colors
function ConditionGroup({
  label,
  items,
  icon,
  tone,
  emptyLabel,
}: {
  label: string;
  items: string[];
  icon: ReactNode;
  tone: string;
  emptyLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className={clsx("flex items-center gap-2 text-xs font-medium uppercase tracking-wider", tone)}>
        {icon}
        <span>{label}</span>
      </div>

      {items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800/80 dark:bg-[#161616]/50 dark:text-zinc-300"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-sm text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}

export default function ConditionsWorkspace() {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [ledgerItems, setLedgerItems] = useState<ConditionLedgerItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshSeed, setRefreshSeed] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadLedger() {
      const resolvedCompanyId = getOrCreateCompanyId();
      const currentSessionItem = getCurrentSessionItem();

      if (!isCancelled) {
        setCompanyId(resolvedCompanyId);
        setLoadingHistory(true);
        setHistoryError(null);
      }

      try {
        const records = await listAuditRecords({
          companyId: resolvedCompanyId,
          limit: 12,
        });

        const items = await Promise.all(
          records.map(async (record) => {
            try {
              const detail = await getAuditRecord(record.record_id, resolvedCompanyId);
              return mapAuditRecordToLedgerItem(record, detail);
            } catch {
              return mapAuditRecordToLedgerItem(record);
            }
          }),
        );

        if (isCancelled) return;

        setLedgerItems(
          mergeLedgerItems([
            ...(currentSessionItem ? [currentSessionItem] : []),
            ...items,
          ]),
        );
      } catch (error) {
        if (isCancelled) return;

        console.error("Failed to load condition ledger", error);
        setHistoryError("Could not load past conditions right now.");
        setLedgerItems(
          mergeLedgerItems(currentSessionItem ? [currentSessionItem] : []),
        );
      } finally {
        if (!isCancelled) {
          setLoadingHistory(false);
        }
      }
    }

    void loadLedger();

    return () => {
      isCancelled = true;
    };
  }, [refreshSeed]);

  const totalConditionCount = ledgerItems.reduce((total, item) => {
    return (
      total +
      item.goConditions.length +
      item.stopConditions.length +
      item.reviewTriggers.length
    );
  }, 0);

  const latestRun = ledgerItems[0];

  async function handleExecute(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const query = draft.trim();
    if (!query || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const envelope = await sendToAI(query);

      if (!envelope.decision) {
        throw new Error(
          "This run returned an unstructured response. Try phrasing it as a decision with explicit conditions.",
        );
      }

      persistEnvelopeToChat(query, envelope);

      const liveItem = mapDecisionToLedgerItem(envelope.decision, {
        source: "session",
        createdAt: new Date().toISOString(),
      });

      setLedgerItems((previous) => mergeLedgerItems([liveItem, ...previous]));
      setDraft("");
      window.dispatchEvent(new CustomEvent("refresh-recents"));
      setRefreshSeed((value) => value + 1);
    } catch (error) {
      console.error("Failed to execute condition query", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not execute the condition query.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleExecute();
    }
  }

  function openDecisionBoard(item: ConditionLedgerItem) {
    if (item.recordId) {
      localStorage.setItem("pending_record_id", item.recordId);
    }

    router.push("/dashboard");
  }

  return (
    <main className="flex-1 overflow-y-auto bg-zinc-50 font-sans text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100">
      <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_340px]">
          {/* Top Primary Workspace Area */}
          <section className="flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <ShieldCheck className="h-4 w-4" />
                  Conditions Console
                </div>
                {/* Changed to font-serif for that editorial/perplexity feel */}
                <h1 className="mt-4 font-serif text-3xl tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                  Review every decision condition in one workspace.
                </h1>

                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                  This page keeps a running ledger of the `go`, `stop`, and `review`
                  conditions produced after each query, then lets you execute fresh
                  condition checks from the same screen.
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                  Company scope
                </p>
                <p className="mt-1 font-mono text-sm text-zinc-700 dark:text-zinc-300">
                  {companyId || "initializing"}
                </p>
              </div>
            </div>

            <form onSubmit={handleExecute} className="mt-8 space-y-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm transition-colors focus-within:border-zinc-300 dark:border-zinc-800 dark:bg-[#121212] dark:focus-within:border-zinc-700">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Example: Under what conditions should we approve the new regional expansion this quarter?"
                  className="min-h-[120px] w-full resize-none bg-transparent px-3 py-2 text-[15px] leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-1 pt-2">
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    Press `Enter` to execute, or `Shift + Enter` for a new line.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting || draft.trim().length === 0}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Activity className="h-4 w-4" />
                    )}
                    Execute
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setDraft(prompt)}
                    className="rounded-full border border-zinc-200 bg-transparent px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {submitError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400">
                  {submitError}
                </div>
              )}
            </form>
          </section>

          {/* Right Sidebar Stats */}
          <aside className="grid content-start gap-4 pt-1">
            <StatCard
              label="Queries tracked"
              value={ledgerItems.length}
              hint="Each card below represents a condition set tied to a past or current decision query."
            />
            <StatCard
              label="Conditions tracked"
              value={totalConditionCount}
              hint="Combined count of go conditions, stop conditions, and review triggers."
            />
            <StatCard
              label="Latest verdict"
              value={latestRun ? formatConfidence(latestRun.confidence) : "n/a"}
              hint={
                latestRun
                  ? `${latestRun.decisionType || "Decision"} at ${latestRun.stakeLevel || "standard"} stakes`
                  : "Run a condition query to populate the latest confidence."
              }
            />
          </aside>
        </div>

        {/* Ledger Section */}
        <section className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Sparkles className="h-4 w-4" />
                Condition ledger
              </div>
              <h2 className="mt-2 text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Past conditions after every query
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setRefreshSeed((value) => value + 1)}
              disabled={loadingHistory || submitting}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-transparent px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {loadingHistory ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Refresh
            </button>
          </div>

          {historyError && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-400">
              {historyError}
            </div>
          )}

          {loadingHistory && ledgerItems.length === 0 ? (
            <div className="mt-6 grid gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-[#121212]"
                />
              ))}
            </div>
          ) : ledgerItems.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-zinc-200 bg-transparent p-12 text-center dark:border-zinc-800">
              <TriangleAlert className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-600" />
              <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                No condition ledger yet
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-500 dark:text-zinc-500">
                Run your first condition query above and this page will start building a structured history of every `go`, `stop`, and `review` rule that comes back.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5">
              {ledgerItems.map((item) => {
                const verdictStyle = VERDICT_STYLES[item.verdictColor];
                return (
                  <article
                    key={item.id}
                    className={clsx(
                      "rounded-xl border bg-white p-5 transition-colors dark:bg-[#121212] sm:p-6",
                      verdictStyle.border,
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-6">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={clsx(
                              "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
                              verdictStyle.badge,
                            )}
                          >
                            <span className={clsx("h-1.5 w-1.5 rounded-full", verdictStyle.dot)} />
                            {item.verdictColor}
                          </span>
                          <span className="rounded-full border border-zinc-200 bg-transparent px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                            {item.decisionType || "Decision"}
                          </span>
                          <span className="rounded-full border border-zinc-200 bg-transparent px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                            {item.stakeLevel || "Standard"} stakes
                          </span>
                          <span className="rounded-full border border-zinc-200 bg-transparent px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                            Confidence {formatConfidence(item.confidence)}
                          </span>
                        </div>

                        {/* Article-style serif headline */}
                        <h3 className="mt-4 font-serif text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                          {item.query}
                        </h3>
                        <p className="mt-2 text-[15px] font-medium text-zinc-800 dark:text-zinc-300">
                          {item.headline}
                        </p>
                        <p className="mt-2 max-w-4xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {item.rationale}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-3">
                        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                          {formatTimestamp(item.createdAt)}
                        </p>
                        <button
                          type="button"
                          onClick={() => openDecisionBoard(item)}
                          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Open board
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-6 border-t border-zinc-200 pt-6 dark:border-zinc-800 xl:grid-cols-3">
                      <ConditionGroup
                        label="Go if"
                        items={item.goConditions}
                        icon={<CheckCircle2 className="h-4 w-4" />}
                        tone="text-emerald-600 dark:text-emerald-500"
                        emptyLabel="No explicit green-light conditions."
                      />
                      <ConditionGroup
                        label="Stop if"
                        items={item.stopConditions}
                        icon={<XCircle className="h-4 w-4" />}
                        tone="text-rose-600 dark:text-rose-500"
                        emptyLabel="No hard stop conditions."
                      />
                      <ConditionGroup
                        label="Review when"
                        items={item.reviewTriggers}
                        icon={<RefreshCcw className="h-4 w-4" />}
                        tone="text-amber-600 dark:text-amber-500"
                        emptyLabel="No review triggers."
                      />
                    </div>

                    {item.nextStep && (
                      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800/80 dark:bg-[#161616]/50">
                        <div className={clsx("flex items-center gap-2 text-xs font-medium uppercase tracking-wider", verdictStyle.iconTone)}>
                          <ShieldCheck className="h-4 w-4" />
                          Next step
                        </div>
                        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {item.nextStep}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}