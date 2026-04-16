export type Role = "user" | "assistant" | "error";

export type VerdictColor = "Green" | "Yellow" | "Orange" | "Red";

export interface UIBadge {
  label: string;
  color: string;
  raw?: string;
}

export interface DecisionBox {
  id?: string;
  box_type?: "summary" | "upside" | "risk" | "verdict" | "next_step";
  title: string;
  badge?: UIBadge;
  color?: VerdictColor;
  claim: string;
  evidence_or_reasoning: string;
  probability: number;
  impact: number;
  risk_score: number;
  follow_up_actions: string[];
  spawn_questions: string[];
}

export interface VerdictCard {
  badge?: UIBadge;
  color?: VerdictColor;
  headline: string;
  rationale: string;
  net_score: number;
  go_conditions: string[];
  stop_conditions: string[];
  review_triggers: string[];
  key_unknown: string;
  flip_factor: string;
}

export interface NextStep {
  immediate_action: string;
  test_if_uncertain?: string | null;
  owner?: string | null;
  deadline?: string | null;
  escalate_if?: string | null;
}

export interface UIAudit {
  query_hash: string;
  company_id: string;
  routing_plan_hash: string;
  model_used: string;
  pass_latencies_ms: number[];
  total_tokens_in: number;
  total_tokens_out: number;
  refiner_version: string;
  timestamp_utc: string;
  output_latency_ms: number;
  finance_snapshot_hash?: string | null;
  data_as_of_utc?: string | null;
  cache_bypassed?: boolean | null;
}

export type BlockTone = "neutral" | "positive" | "warning" | "critical" | "info";

export interface FinanceHealthItem {
  metric_name: string;
  label: string;
  value: number | string | null;
  unit: string;
  status?: "green" | "yellow" | "red" | null;
  description?: string | null;
}

export interface FinanceSnapshot {
  as_of_utc?: string | null;
  currency?: string | null;
  reporting_period?: string | null;
  analysis_horizon_days?: number | null;
  is_live_data?: boolean;

  sources_used?: string[];
  source_freshness?: Record<string, string>;

  cash_balance?: number | null;
  available_liquidity?: number | null;
  monthly_burn?: number | null;
  runway_months?: number | null;

  mrr?: number | null;
  arr?: number | null;
  revenue_last_30d?: number | null;
  revenue_prev_30d?: number | null;
  revenue_growth_pct?: number | null;

  gross_margin_pct?: number | null;
  ebitda_margin_pct?: number | null;
  net_margin_pct?: number | null;

  opex_last_30d?: number | null;
  opex_prev_30d?: number | null;
  opex_growth_pct?: number | null;

  ar_total?: number | null;
  ar_overdue_30_plus?: number | null;
  ap_total?: number | null;
  ap_due_30d?: number | null;

  failed_payment_rate_pct?: number | null;
  customer_concentration_pct?: number | null;
  top_customer_share_pct?: number | null;
  logo_churn_pct?: number | null;
  revenue_churn_pct?: number | null;
  nrr_pct?: number | null;

  pipeline_coverage?: number | null;
  forecast_vs_actual_pct?: number | null;

  debt_service_coverage_ratio?: number | null;
  current_ratio?: number | null;
  quick_ratio?: number | null;
  covenant_headroom_pct?: number | null;

  headcount?: number | null;
  notes?: string[];
  health_summary?: FinanceHealthItem[];
}

export interface AgentBlockMetric {
  label: string;
  value: string;
  tone?: BlockTone;
}

export interface AgentTable {
  columns: string[];
  rows: string[][];
}

export interface AgentBlock {
  id: string;
  type: "status" | "markdown" | "table" | "metric_grid" | "callout";
  title?: string | null;
  text?: string | null;
  tone?: BlockTone | null;
  table?: AgentTable | null;
  metrics?: AgentBlockMetric[];
}

export interface BoxReasoningTrail {
  box_title: string;
  box_type: "upside" | "risk";
  draft_claim: string;
  draft_probability: number;
  draft_impact: number;
  draft_reasoning: string;
  attack_weakness: string;
  attack_correction: string;
  claim_changed: boolean;
  probability_delta: number;
  impact_delta: number;
  what_changed: string;
  lenses_applied: string[];
}

export interface ReasoningTrail {
  box_trails: BoxReasoningTrail[];
  company_industry?: string | null;
  company_size?: string | null;
  risk_appetite?: string | null;
  extra_context?: Record<string, string>;
  finance_snapshot_used?: Record<string, unknown>;
  lenses_used: string[];
  framework: string;
  decision_type: string;
  stake_level: string;
  router_confidence: number;
  refiner_confidence: number;
  combined_confidence: number;
  confidence_explanation: string;
  overall_attack_assessment: string;
  real_world_failure_modes: string[];
  missing_risks_found: string[];
}

export interface DecisionPayload {
  query: string;
  company_id: string;
  confidence: number;
  total_boxes: number;

  summary_box: string | DecisionBox;
  upside_boxes: DecisionBox[];
  risk_boxes: DecisionBox[];

  verdict_card: VerdictCard;
  next_step?: NextStep;
  next_step_box?: NextStep;

  audit?: UIAudit;
  reasoning_trail?: ReasoningTrail | null;
  finance_snapshot?: FinanceSnapshot | null;

  is_branch?: boolean;
  parent_query?: string | null;
}

export interface AssistantEnvelope {
  kind: "decision" | "chat" | "action";
  blocks: AgentBlock[];
  decision?: DecisionPayload | null;
}

export interface UploadDocumentsResponse {
  ok: boolean;
  message: string;
  document_count: number;
  total_chars: number;
  uploaded_utc: string;
  documents: Array<{
    filename: string;
    pages: number;
    chars_extracted: number;
    uploaded_utc: string;
    sha256: string;
  }>;
}

export interface DeliveryStatusResponse {
  ok: boolean;
  email_delivery_available: boolean;
}

export interface VerdictEmailResponse {
  ok: boolean;
  provider: string;
  to: string;
  subject: string;
  sent_utc: string;
}

export interface RecentAuditRecord {
  record_id: string;
  decision_id: string;
  version: number;
  query_preview: string;
  decision_type: string;
  stake_level: string;
  verdict_color: VerdictColor;
  net_score: number;
  confidence: number;
  total_boxes: number;
  is_branch: boolean;
  created_utc: string;
}

export interface AuditBoxRecord {
  box_type?: string;
  claim?: string;
  reasoning?: string;
  explanation?: string;
  evidence_or_reasoning?: string;
  action_items?: string[];
  next_steps?: string[];
  actions?: string[];
  spawn_questions?: string[];
  [key: string]: unknown;
}

export interface AuditRecordResponse {
  query_preview?: string;
  verdict_snapshot?: Record<string, unknown>;
  boxes?: AuditBoxRecord[];
  routing_snapshot?: {
    confidence?: number;
    framework?: string;
    stake_level?: string;
  };
  performance?: Record<string, unknown>;
  audit?: Record<string, unknown>;
  metrics?: Record<string, unknown>;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  pending?: boolean;
  createdAt: number;
  decision?: DecisionPayload;
  blocks?: AgentBlock[];
  kind?: AssistantEnvelope["kind"];
}
