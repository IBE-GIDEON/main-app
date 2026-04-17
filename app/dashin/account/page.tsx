"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { X, Loader2, CreditCard, RefreshCw, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { formatBillingAmount, getBillingStatus } from "@/services/billingApi";
import type { BillingStatusResponse } from "@/types/billing";

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // --- REAL-TIME STATE MANAGEMENT ---
  const [localName, setLocalName] = useState("GIDEON IBE");
  const [localHandle, setLocalHandle] = useState("shytersnic11985");
  const [localImage, setLocalImage] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Gideon");
  const [localEmail, setLocalEmail] = useState("shytersnicks@gmail.com");

  // Modal State
  const [editModal, setEditModal] = useState<{ type: "name" | "username"; value: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [billingStatus, setBillingStatus] = useState<BillingStatusResponse | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);
  const [billingError, setBillingError] = useState<string | null>(null);

  // Sync with session if it exists
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setLocalName(session.user.name);
      if (session.user.email) {
        setLocalEmail(session.user.email);
        if (!editModal) setLocalHandle(session.user.email.split("@")[0]);
      }
      if (session.user.image) setLocalImage(session.user.image);
    }
  }, [session]);

  useEffect(() => {
    let cancelled = false;

    async function loadBilling() {
      setBillingLoading(true);

      try {
        const status = await getBillingStatus();
        if (cancelled) return;

        setBillingStatus(status);
        setBillingError(null);

        if (status.customer_name && !session?.user?.name) {
          setLocalName(status.customer_name);
        }
        if (status.customer_email && !session?.user?.email) {
          setLocalEmail(status.customer_email);
        }
      } catch (err: any) {
        if (!cancelled) {
          setBillingError(err?.message ?? "Could not load subscription details.");
        }
      } finally {
        if (!cancelled) {
          setBillingLoading(false);
        }
      }
    }

    loadBilling();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.email, session?.user?.name]);

  // --- HANDLERS ---
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instantly show the image in the UI (Optimistic Update)
    const tempUrl = URL.createObjectURL(file);
    setLocalImage(tempUrl);

    // 2. TODO: Send file to your backend/cloud storage here
    console.log("Uploading new avatar:", file.name);
  };

  const handleSaveEdit = async () => {
    if (!editModal || !editModal.value.trim()) return;
    setIsUpdating(true);

    // Simulate an API call to your backend
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Optimistically update the UI
    if (editModal.type === "name") setLocalName(editModal.value.trim());
    if (editModal.type === "username") setLocalHandle(editModal.value.trim());

    setIsUpdating(false);
    setEditModal(null);
  };

  const subscriptionLabel = billingStatus?.plan_name || "Basic";
  const subscriptionState = billingStatus?.has_paid_access ? "Active" : "Free";
  const renewalLabel = billingStatus?.current_period_end_utc
    ? new Date(billingStatus.current_period_end_utc).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // Shared ghost button style
  const ghostButtonClass =
    "rounded-full border border-zinc-200 dark:border-white/10 bg-transparent px-4 py-1.5 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white";

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl relative">
      
      {/* HIDDEN FILE INPUT FOR AVATAR */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleAvatarSelect}
      />

      <h1 className="mb-8 text-[20px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">
        Account
      </h1>

      {/* --- PROFILE INFORMATION SECTION --- */}
      <div className="flex flex-col gap-6 mb-12">
        {/* Avatar Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#2A2A2A]">
              <img src={localImage} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 uppercase tracking-wide transition-colors">
                {localName}
              </span>
              <span className="text-[13px] text-zinc-500 dark:text-zinc-400 transition-colors">
                {localHandle}
              </span>
            </div>
          </div>
          <button onClick={() => fileInputRef.current?.click()} className={ghostButtonClass}>
            Change avatar
          </button>
        </div>

        {/* Full Name Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
              Full Name
            </span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 uppercase transition-colors">
              {localName}
            </span>
          </div>
          <button
            onClick={() => setEditModal({ type: "name", value: localName })}
            className={ghostButtonClass}
          >
            Change full name
          </button>
        </div>

        {/* Username Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
              Username
            </span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 transition-colors">
              {localHandle}
            </span>
          </div>
          <button
            onClick={() => setEditModal({ type: "username", value: localHandle })}
            className={ghostButtonClass}
          >
            Change username
          </button>
        </div>

        {/* Email Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
              Email
            </span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 transition-colors">
              {localEmail}
            </span>
          </div>
        </div>
      </div>

      {/* --- SUBSCRIPTION SECTION --- */}
      <h2 className="mb-6 text-[18px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">
        Your Subscription
      </h2>
      <div className="mb-12 rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 dark:bg-white/5 dark:text-white">
                <CreditCard size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 transition-colors">
                    {subscriptionLabel}
                  </p>
                  <span
                    className={clsx(
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]",
                      billingStatus?.has_paid_access
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : "bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-300",
                    )}
                  >
                    {subscriptionState}
                  </span>
                </div>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 transition-colors">
                  {billingStatus?.has_paid_access
                    ? renewalLabel
                      ? `Your current access is active through ${renewalLabel}.`
                      : "Your workspace has premium billing access."
                    : "You are currently on the free workspace plan."}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/90 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                  Provider
                </p>
                <p className="mt-1 text-[14px] font-medium text-zinc-900 dark:text-zinc-100">
                  {billingStatus?.billing_provider
                    ? billingStatus.billing_provider[0].toUpperCase() + billingStatus.billing_provider.slice(1)
                    : "Not connected"}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/90 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                  Decision limit
                </p>
                <p className="mt-1 text-[14px] font-medium text-zinc-900 dark:text-zinc-100">
                  {billingStatus?.entitlements.max_decisions_per_month ?? "Custom"}
                  <span className="ml-1 text-zinc-500 dark:text-zinc-400">/ month</span>
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/90 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                  Last payment
                </p>
                <p className="mt-1 text-[14px] font-medium text-zinc-900 dark:text-zinc-100">
                  {formatBillingAmount(
                    billingStatus?.last_payment_amount_minor,
                    billingStatus?.last_payment_currency || "USD",
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push(billingStatus?.has_paid_access ? "/checkout" : "/dashin/upgrade")}
              className="rounded-full bg-zinc-900 px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              {billingStatus?.has_paid_access ? "Manage billing" : "Upgrade plan"}
            </button>
            <button
              onClick={async () => {
                setBillingLoading(true);
                try {
                  const refreshed = await getBillingStatus();
                  setBillingStatus(refreshed);
                  setBillingError(null);
                } catch (err: any) {
                  setBillingError(err?.message ?? "Could not refresh billing.");
                } finally {
                  setBillingLoading(false);
                }
              }}
              className={ghostButtonClass}
            >
              <RefreshCw size={14} className="mr-2 inline-block" />
              Refresh
            </button>
          </div>
        </div>

        {billingLoading ? (
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3 text-[13px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
            <Loader2 size={15} className="animate-spin" />
            Loading your current billing state.
          </div>
        ) : null}

        {billingError ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
            {billingError}
          </div>
        ) : null}

        {billingStatus?.recent_payments?.length ? (
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
              <CheckCircle2 size={15} className="text-emerald-500" />
              Recent Payments
            </div>
            <div className="space-y-2">
              {billingStatus.recent_payments.slice(0, 3).map((payment) => (
                <div
                  key={payment.reference}
                  className="flex flex-col gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-50/90 px-4 py-3 text-[13px] dark:border-white/10 dark:bg-white/[0.03] md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {formatBillingAmount(payment.amount_minor, payment.currency)}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      Ref {payment.reference}
                    </p>
                  </div>
                  <div className="text-zinc-500 dark:text-zinc-400">
                    {new Date(payment.paid_at_utc).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* --- SYSTEM SECTION --- */}
      <h2 className="mb-6 text-[18px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">
        System
      </h2>
      <div className="flex flex-col gap-6 pb-20">
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
            Support
          </div>
          <button onClick={() => router.push("/help")} className={ghostButtonClass}>
            Contact
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
            You are signed in as {localHandle}
          </div>
          <button onClick={() => signOut({ callbackUrl: "/signin" })} className={ghostButtonClass}>
            Sign out
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
              Delete account
            </span>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400 transition-colors">
              Permanently delete your account and data
            </span>
          </div>
          <button
            className={clsx(
              ghostButtonClass,
              "hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 border-rose-100 dark:border-rose-500/20"
            )}
          >
            Learn more
          </button>
        </div>
      </div>

      {/* --- EDIT MODAL OVERLAY --- */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#121212] border border-zinc-200 dark:border-white/10 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditModal(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-[18px] font-semibold text-zinc-900 dark:text-white mb-1">
              Change {editModal.type === "name" ? "Full Name" : "Username"}
            </h3>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6">
              Enter your new {editModal.type === "name" ? "name" : "username"} below.
            </p>

            <input
              type="text"
              autoFocus
              value={editModal.value}
              onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-white/10 bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all mb-6"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModal(null)}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating || !editModal.value.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[13px] font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50"
              >
                {isUpdating ? <Loader2 size={14} className="animate-spin" /> : null}
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
