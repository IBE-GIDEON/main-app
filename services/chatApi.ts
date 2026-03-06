const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "testkey123";

export async function sendToAI(text: string, signal?: AbortSignal) {
  const res = await fetch(`${API_URL}/decide`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({
      query: text,
      company_id: "default",
      context: {},
    }),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "AI Server Error");
  }

  return res.json();
}