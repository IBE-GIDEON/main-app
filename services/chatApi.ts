const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "testkey123";

// ── Company ID ─────────────────────────────────────────────────────────────
// Generate once per browser, persist forever in localStorage.
// This is the tenant identifier that scopes all memory, audit, conditions.
export function getOrCreateCompanyId(): string {
  if (typeof window === "undefined") return "ssr-placeholder";
  let id = localStorage.getItem("company_id");
  if (!id) {
    id = `co_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
    localStorage.setItem("company_id", id);
  }
  return id;
}

// ── Send decision query ────────────────────────────────────────────────────
export async function sendToAI(text: string, signal?: AbortSignal) {
  const company_id  = getOrCreateCompanyId();
  const industry    = localStorage.getItem("company_industry")  || "";
  const company_size = localStorage.getItem("company_size")     || "";
  const risk_appetite = localStorage.getItem("risk_appetite")   || "";

  const res = await fetch(`${API_URL}/decide`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({
      query: text,
      company_id,
      context: {
        ...(industry      && { industry }),
        ...(company_size  && { company_size }),
        ...(risk_appetite && { risk_appetite }),
      },
    }),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "AI Server Error");
  }

  return res.json();
}

// ── Save company profile to backend ───────────────────────────────────────
// Called once at the end of onboarding.
// Hits POST /memory/profile so every future /decide call gets enriched context.
export async function setupCompanyProfile(data: {
  company_id: string;
  company_name: string;
  industry: string;
  company_size: string;
  decision_types: string[];
  risk_appetite?: string;
}): Promise<void> {
  const res = await fetch(`${API_URL}/memory/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({
      company_id: data.company_id,
      profile_data: {
        ...(data.industry       && { industry: data.industry }),
        ...(data.company_size   && { company_size: data.company_size }),
        ...(data.risk_appetite  && { risk_appetite: data.risk_appetite }),
        ...(data.company_name   && { company_name: data.company_name }),
        ...(data.decision_types.length > 0 && {
          decision_types: JSON.stringify(data.decision_types),
        }),
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Failed to save company profile");
  }
}

// ── Check if onboarding is complete ───────────────────────────────────────
export function isOnboardingComplete(): boolean {
  if (typeof window === "undefined") return true; // SSR — don't redirect
  return localStorage.getItem("onboarding_completed") === "true";
}