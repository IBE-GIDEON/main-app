import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_KEY =
  process.env.THINK_AI_API_KEY ||
  process.env.NEXT_PUBLIC_API_KEY ||
  "testkey123";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body?.reference || !body?.company_id) {
    return NextResponse.json(
      { detail: "company_id and reference are required." },
      { status: 400 },
    );
  }

  const response = await fetch(`${API_URL}/billing/paystack/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({
    detail: "Billing verification failed.",
  }));

  return NextResponse.json(data, { status: response.status });
}
