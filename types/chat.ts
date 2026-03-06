export type Role = "user" | "assistant" | "error";

// ── Decision payload types (matches your Python backend exactly) ──────────────

export type VerdictColor = "Green" | "Yellow" | "Orange" | "Red";

export interface DecisionBox {
  title: string;
  color: VerdictColor;
  claim: string;
  evidence_or_reasoning: string;
  probability: number;
  impact: number;
  risk_score: number;
  follow_up_actions: string[];
  spawn_questions: string[];
}

export interface VerdictCard {
  color: VerdictColor;
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

export interface DecisionPayload {
  query: string;
  company_id: string;
  summary_box: string;
  upside_boxes: DecisionBox[];
  risk_boxes: DecisionBox[];
  verdict_card: {
    badge: { label: string; color: string };
    verdict: VerdictCard;
  };
  next_step_box: NextStep;
  confidence: number;
}

// ── Message ───────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  role: Role;
  content: string;
  pending?: boolean;
  createdAt: number;
  decision?: DecisionPayload; // present on assistant messages from /decide
}