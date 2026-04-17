export type SubscriptionStatus = "inactive" | "active" | "expired" | "canceled";

export interface BillingEntitlements {
  has_paid_access: boolean;
  max_decisions_per_month: number | null;
  max_manual_uploads: number | null;
  feature_flags: string[];
}

export interface BillingPaymentRecord {
  provider: "paystack";
  reference: string;
  amount_minor: number;
  currency: string;
  paid_at_utc: string;
  status: "success";
  email?: string | null;
  provider_transaction_id?: string | null;
  provider_channel?: string | null;
}

export interface BillingStatusResponse {
  company_id: string;
  status: SubscriptionStatus;
  is_active: boolean;
  has_paid_access: boolean;
  plan_id?: string | null;
  plan_name?: string | null;
  billing_provider?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  activated_at_utc?: string | null;
  current_period_start_utc?: string | null;
  current_period_end_utc?: string | null;
  last_payment_reference?: string | null;
  last_payment_amount_minor?: number | null;
  last_payment_currency?: string | null;
  last_payment_at_utc?: string | null;
  cancel_at_period_end: boolean;
  entitlements: BillingEntitlements;
  recent_payments: BillingPaymentRecord[];
  updated_utc: string;
}

export interface VerifyPaystackPaymentPayload {
  reference: string;
  company_id?: string;
  email?: string;
  name?: string;
  plan_id?: string;
}
