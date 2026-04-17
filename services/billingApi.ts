import { getOrCreateCompanyId } from "@/services/chatApi";
import type {
  BillingStatusResponse,
  VerifyPaystackPaymentPayload,
} from "@/types/billing";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "testkey123";

function getApiHeaders(extra?: HeadersInit): HeadersInit {
  return {
    "X-API-Key": API_KEY,
    ...extra,
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail ?? "Billing request failed");
  }

  return response.json() as Promise<T>;
}

export async function getBillingStatus(companyId?: string) {
  const resolvedCompanyId = companyId || getOrCreateCompanyId();
  const response = await fetch(`${API_URL}/billing/${resolvedCompanyId}`, {
    headers: getApiHeaders(),
    cache: "no-store",
  });

  return parseJsonResponse<BillingStatusResponse>(response);
}

export async function verifyPaystackPayment(
  payload: VerifyPaystackPaymentPayload,
) {
  const response = await fetch(`${API_URL}/billing/paystack/verify`, {
    method: "POST",
    headers: getApiHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      company_id: payload.company_id || getOrCreateCompanyId(),
      reference: payload.reference,
      email: payload.email,
      name: payload.name,
      plan_id: payload.plan_id,
    }),
  });

  return parseJsonResponse<BillingStatusResponse>(response);
}

export function formatBillingAmount(
  amountMinor?: number | null,
  currency = "USD",
) {
  if (amountMinor == null) return "N/A";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amountMinor / 100);
  } catch {
    return `${currency} ${(amountMinor / 100).toFixed(2)}`;
  }
}
