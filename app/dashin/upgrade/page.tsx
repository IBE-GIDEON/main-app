"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Loader2, CreditCard } from "lucide-react";
import clsx from "clsx";
import { formatBillingAmount, getBillingStatus } from "@/services/billingApi";
import type { BillingStatusResponse } from "@/types/billing";

const MVP_FEATURES = [
  "Unlimited recursive refinement layers",
  "Full upside and risk scoring with verdict cards",
  "Financial document uploads across supported file types",
  "Connector-backed context for Stripe, QuickBooks, and CSV data",
  "Optional verdict email delivery when configured",
  "Extended audit history and export-friendly records",
];

export default function UpgradePage() {
  const router = useRouter();
  const [billingStatus, setBillingStatus] = useState<BillingStatusResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBilling() {
      try {
        const status = await getBillingStatus();
        if (!cancelled) {
          setBillingStatus(status);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? "Could not load plan details.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadBilling();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasPaidAccess = Boolean(billingStatus?.has_paid_access);
  const renewalDate = billingStatus?.current_period_end_utc
    ? new Date(billingStatus.current_period_end_utc).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-4xl pb-20">
      <div className="mb-10 max-w-2xl">
        <h1 className="mb-2 flex items-center gap-3 text-[24px] font-semibold tracking-tight text-zinc-100">
          Three AI{" "}
          <span className="rounded-md border border-purple-400/20 bg-purple-400/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-purple-400">
            MVP
          </span>
        </h1>
        <p className="text-[14px] leading-relaxed text-zinc-400">
          Turn billing into a real workspace control point. This plan unlocks the
          full decision engine, more data context, and a durable audit trail for
          finance work.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="md:col-span-2 rounded-2xl border border-white/5 bg-[#121212] p-6 flex flex-col">
          <h2 className="mb-1 text-[14px] font-medium text-zinc-400">
            Current Plan
          </h2>
          <div className="mb-2 flex items-center gap-2">
            <div className="text-[20px] font-semibold text-zinc-100">
              {billingStatus?.plan_name || "Basic"}
            </div>
            <span
              className={clsx(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]",
                hasPaidAccess
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-white/5 text-zinc-400",
              )}
            >
              {hasPaidAccess ? "Active" : "Free"}
            </span>
          </div>

          <div className="mb-6 text-[13px] text-zinc-500">
            {hasPaidAccess
              ? renewalDate
                ? `Your workspace is covered through ${renewalDate}.`
                : "Your workspace has premium billing access."
              : "Upgrade to unlock the full Three AI finance workflow."}
          </div>

          <ul className="mb-8 flex flex-1 flex-col gap-4">
            <li className="flex items-start gap-3 text-[13px] text-zinc-500">
              <Check size={16} className="mt-0.5 shrink-0 text-zinc-600" />
              Standard decision routing
            </li>
            <li className="flex items-start gap-3 text-[13px] text-zinc-500">
              <Check size={16} className="mt-0.5 shrink-0 text-zinc-600" />
              Basic verdict cards and history
            </li>
            <li className="flex items-start gap-3 text-[13px] text-zinc-500">
              <Check size={16} className="mt-0.5 shrink-0 text-zinc-600" />
              Limited daily decisions and uploads
            </li>
          </ul>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              Workspace limits
            </p>
            <p className="mt-2 text-[14px] font-medium text-zinc-100">
              {billingStatus?.entitlements.max_decisions_per_month ?? 5}
              <span className="ml-1 text-zinc-500">decisions / month</span>
            </p>
            <p className="mt-1 text-[13px] text-zinc-500">
              {billingStatus?.entitlements.max_manual_uploads ?? 5}
              <span className="ml-1">manual uploads</span>
            </p>
          </div>
        </div>

        <div className="md:col-span-3 rounded-2xl border border-purple-500/30 bg-[#121212] p-6 sm:p-8 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.05)]">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px]" />

          <div className="relative z-10">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[20px] font-semibold text-zinc-100">
                <Sparkles size={18} className="text-purple-400" />
                MVP Plan
              </h2>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                Paystack
              </div>
            </div>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-[32px] font-bold text-white">$560</span>
              <span className="text-[13px] font-medium text-zinc-500">/month</span>
            </div>

            <ul className="mb-10 flex flex-col gap-4">
              {MVP_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-[14px] font-medium text-zinc-300"
                >
                  <Check size={18} className="mt-0.5 shrink-0 text-purple-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="space-y-4">
              <button
                onClick={() => router.push("/checkout")}
                className="w-full rounded-xl bg-purple-500 py-3.5 text-[14px] font-semibold text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:bg-purple-400 active:scale-[0.98]"
              >
                {hasPaidAccess ? "Open Billing Workspace" : "Upgrade to MVP Plan"}
              </button>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-[13px] text-zinc-400">
                    <Loader2 size={14} className="animate-spin" />
                    Checking your current billing state.
                  </div>
                ) : error ? (
                  <div className="text-[13px] text-rose-300">{error}</div>
                ) : (
                  <div className="space-y-2 text-[13px] text-zinc-400">
                    <div className="flex items-center justify-between gap-3">
                      <span>Latest charge</span>
                      <span className="font-medium text-zinc-100">
                        {formatBillingAmount(
                          billingStatus?.last_payment_amount_minor,
                          billingStatus?.last_payment_currency || "USD",
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Provider</span>
                      <span className="font-medium text-zinc-100">
                        {billingStatus?.billing_provider
                          ? billingStatus.billing_provider[0].toUpperCase() + billingStatus.billing_provider.slice(1)
                          : "Paystack"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Payment status</span>
                      <span className="flex items-center gap-2 font-medium text-zinc-100">
                        <CreditCard size={14} className="text-purple-400" />
                        {hasPaidAccess ? "Active" : "Awaiting upgrade"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-4 text-center text-[12px] text-zinc-500">
              Secure payment processed via Paystack and synced into your account state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
