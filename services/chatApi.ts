"use client";

import type {
  AuditRecordResponse,
  AssistantEnvelope,
  DecisionPayload,
  DeliveryStatusResponse,
  RecentAuditRecord,
  UploadedDocumentDetailResponse,
  UploadDocumentsResponse,
  VerdictEmailResponse,
} from "@/types/chat";
import type {
  InsightAskIfResponse,
  InsightSnapshotResponse,
} from "@/types/insights";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "testkey123";

type StreamEvent =
  | { type: "status"; text: string }
  | { type: "chunk"; text: string }
  | { type: "assistant"; payload: AssistantEnvelope }
  | { type: "error"; error: string };

function getApiHeaders(extra?: HeadersInit): HeadersInit {
  return {
    "X-API-Key": API_KEY,
    ...extra,
  };
}

function getRequestContext() {
  if (typeof window === "undefined") return undefined;

  const industry = localStorage.getItem("company_industry") || "";
  const companySize = localStorage.getItem("company_size") || "";
  const riskAppetite = localStorage.getItem("risk_appetite") || "";

  return {
    ...(industry && { industry }),
    ...(companySize && { company_size: companySize }),
    ...(riskAppetite && { risk_appetite: riskAppetite }),
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail ?? "Three AI request failed");
  }

  return response.json() as Promise<T>;
}

function getDownloadFilename(
  response: Response,
  fallback = "manual-data-file",
) {
  const disposition = response.headers.get("Content-Disposition");
  if (!disposition) return fallback;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = disposition.match(/filename="?([^"]+)"?/i);
  return asciiMatch?.[1] || fallback;
}

function processSseEvent(
  rawEvent: string,
  onEvent: (event: StreamEvent) => void,
) {
  const dataLines = rawEvent
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.replace(/^data:\s?/, ""));

  if (dataLines.length === 0) return false;

  const payloadText = dataLines.join("\n").trim();
  if (!payloadText || payloadText === "[DONE]") return payloadText === "[DONE]";

  try {
    const parsed = JSON.parse(payloadText) as StreamEvent;
    onEvent(parsed);
  } catch {
    onEvent({ type: "chunk", text: payloadText });
  }

  return false;
}

export function getOrCreateCompanyId(): string {
  if (typeof window === "undefined") return "ssr-placeholder";
  let id = localStorage.getItem("company_id");
  if (!id) {
    id = `co_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
    localStorage.setItem("company_id", id);
  }
  return id;
}

export function getVerdictEmailPreferences() {
  if (typeof window === "undefined") {
    return { enabled: false, address: "" };
  }

  try {
    const raw = localStorage.getItem("three_ai_settings");
    if (!raw) return { enabled: false, address: "" };
    const parsed = JSON.parse(raw) as {
      verdictEmailEnabled?: boolean;
      verdictEmailAddress?: string;
    };
    return {
      enabled: Boolean(parsed.verdictEmailEnabled),
      address: parsed.verdictEmailAddress?.trim() || "",
    };
  } catch {
    return { enabled: false, address: "" };
  }
}

export async function streamToAI(
  text: string,
  options: {
    signal?: AbortSignal;
    onEvent: (event: StreamEvent) => void;
  },
) {
  const response = await fetch(`${API_URL}/decide/stream`, {
    method: "POST",
    headers: getApiHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      query: text,
      company_id: getOrCreateCompanyId(),
      context: getRequestContext(),
    }),
    signal: options.signal,
  });

  if (!response.ok || !response.body) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail ?? "No readable stream available.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const eventBlock of events) {
      const shouldStop = processSseEvent(eventBlock, options.onEvent);
      if (shouldStop) return;
    }
  }

  if (buffer.trim()) {
    processSseEvent(buffer, options.onEvent);
  }
}

export async function sendToAI(text: string, signal?: AbortSignal) {
  const response = await fetch(`${API_URL}/decide`, {
    method: "POST",
    headers: getApiHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      query: text,
      company_id: getOrCreateCompanyId(),
      context: getRequestContext(),
    }),
    signal,
  });

  return parseJsonResponse<AssistantEnvelope>(response);
}

export async function uploadFinancialDocuments(files: File[]) {
  const formData = new FormData();
  formData.append("company_id", getOrCreateCompanyId());

  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(`${API_URL}/finance/upload`, {
    method: "POST",
    headers: getApiHeaders(),
    body: formData,
  });

  return parseJsonResponse<UploadDocumentsResponse>(response);
}

export async function listUploadedFinancialDocuments(options?: {
  companyId?: string;
}) {
  const companyId = options?.companyId || getOrCreateCompanyId();
  const response = await fetch(`${API_URL}/finance/uploads/${companyId}`, {
    headers: getApiHeaders(),
  });

  return parseJsonResponse<UploadDocumentsResponse>(response);
}

export async function getUploadedFinancialDocument(
  documentId: string,
  companyId?: string,
) {
  const response = await fetch(
    `${API_URL}/finance/uploads/${companyId || getOrCreateCompanyId()}/${documentId}`,
    {
      headers: getApiHeaders(),
    },
  );

  return parseJsonResponse<UploadedDocumentDetailResponse>(response);
}

export async function deleteUploadedFinancialDocument(
  documentId: string,
  companyId?: string,
) {
  const response = await fetch(
    `${API_URL}/finance/uploads/${companyId || getOrCreateCompanyId()}/${documentId}`,
    {
      method: "DELETE",
      headers: getApiHeaders(),
    },
  );

  return parseJsonResponse<UploadDocumentsResponse>(response);
}

export async function downloadUploadedFinancialDocument(
  documentId: string,
  companyId?: string,
) {
  const response = await fetch(
    `${API_URL}/finance/uploads/${companyId || getOrCreateCompanyId()}/${documentId}/download`,
    {
      headers: getApiHeaders(),
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail ?? "Unable to download document.");
  }

  return {
    blob: await response.blob(),
    filename: getDownloadFilename(response),
  };
}

export async function getDeliveryStatus() {
  const response = await fetch(`${API_URL}/finance/delivery/status`, {
    headers: getApiHeaders(),
  });

  return parseJsonResponse<DeliveryStatusResponse>(response);
}

export async function listAuditRecords(options?: {
  companyId?: string;
  limit?: number;
}) {
  const companyId = options?.companyId || getOrCreateCompanyId();
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 50));

  const response = await fetch(`${API_URL}/audit/${companyId}?${params.toString()}`, {
    headers: getApiHeaders(),
  });

  return parseJsonResponse<RecentAuditRecord[]>(response);
}

export async function getAuditRecord(recordId: string, companyId?: string) {
  const response = await fetch(`${API_URL}/audit/${companyId || getOrCreateCompanyId()}/${recordId}`, {
    headers: getApiHeaders(),
  });

  return parseJsonResponse<AuditRecordResponse>(response);
}

export async function deleteAuditRecord(recordId: string, companyId?: string) {
  const response = await fetch(`${API_URL}/audit/${companyId || getOrCreateCompanyId()}/${recordId}`, {
    method: "DELETE",
    headers: getApiHeaders(),
  });

  return parseJsonResponse<{ status: string }>(response);
}

export async function renameAuditRecord(input: {
  recordId: string;
  queryPreview: string;
  companyId?: string;
}) {
  const response = await fetch(
    `${API_URL}/audit/${input.companyId || getOrCreateCompanyId()}/${input.recordId}`,
    {
      method: "PATCH",
      headers: getApiHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ query_preview: input.queryPreview }),
    },
  );

  return parseJsonResponse<RecentAuditRecord>(response);
}

export async function deliverVerdictEmail(input: {
  decision: DecisionPayload;
  query: string;
  to: string;
  subject?: string;
}) {
  const response = await fetch(`${API_URL}/finance/deliver/email`, {
    method: "POST",
    headers: getApiHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      company_id: getOrCreateCompanyId(),
      decision: input.decision,
      query: input.query,
      to: input.to,
      ...(input.subject && { subject: input.subject }),
    }),
  });

  return parseJsonResponse<VerdictEmailResponse>(response);
}

export async function getInsightsSnapshot(options?: {
  companyId?: string;
  forceRefresh?: boolean;
}) {
  const companyId = options?.companyId || getOrCreateCompanyId();
  const params = new URLSearchParams();

  if (options?.forceRefresh) {
    params.set("force_refresh", "true");
  }

  const queryString = params.toString();
  const response = await fetch(
    `${API_URL}/insights/${companyId}${queryString ? `?${queryString}` : ""}`,
    {
      headers: getApiHeaders(),
    },
  );

  return parseJsonResponse<InsightSnapshotResponse>(response);
}

export async function askInsightIf(input: {
  question: string;
  companyId?: string;
  forceRefresh?: boolean;
  signal?: AbortSignal;
}) {
  const response = await fetch(`${API_URL}/insights/ask-if`, {
    method: "POST",
    headers: getApiHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      company_id: input.companyId || getOrCreateCompanyId(),
      question: input.question,
      force_refresh: Boolean(input.forceRefresh),
    }),
    signal: input.signal,
  });

  return parseJsonResponse<InsightAskIfResponse>(response);
}

export async function setupCompanyProfile(data: {
  company_id: string;
  company_name: string;
  industry: string;
  company_size: string;
  decision_types: string[];
  risk_appetite?: string;
}): Promise<void> {
  const response = await fetch(`${API_URL}/memory/profile`, {
    method: "POST",
    headers: getApiHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      company_id: data.company_id,
      profile_data: {
        ...(data.industry && { industry: data.industry }),
        ...(data.company_size && { company_size: data.company_size }),
        ...(data.risk_appetite && { risk_appetite: data.risk_appetite }),
        ...(data.company_name && { company_name: data.company_name }),
        ...(data.decision_types.length > 0 && {
          decision_types: JSON.stringify(data.decision_types),
        }),
      },
    }),
  });

  await parseJsonResponse(response);
}

export function isOnboardingComplete(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("onboarding_completed") === "true";
}
