import type { DecisionPayload } from "@/types/chat";

export type InsightConnectorState =
  | "idle"
  | "disabled"
  | "error"
  | "connected";

export type ConditionKind = "go" | "stop" | "review";

export type ConditionStatus =
  | "active"
  | "fired"
  | "acknowledged"
  | "cleared"
  | "expired";

export interface InsightConnectorStatus {
  connector_id: string;
  label: string;
  enabled: boolean;
  status: InsightConnectorState;
  detail?: string | null;
  last_used_utc?: string | null;
  category: string;
}

export interface InsightDataPoint {
  connector_id: string;
  source_label?: string | null;
  metric_name: string;
  value: unknown;
  value_str: string;
  kind: string;
  currency?: string | null;
  period?: string | null;
  fetched_utc: string;
  recorded_utc?: string | null;
  freshness_utc?: string | null;
  source_url?: string | null;
}

export interface ConditionRecord {
  condition_id: string;
  decision_id: string;
  company_id: string;
  query_preview: string;
  kind: ConditionKind;
  text: string;
  status: ConditionStatus;
  created_utc: string;
  last_checked_utc?: string | null;
  fired_utc?: string | null;
  acknowledged_utc?: string | null;
  cleared_utc?: string | null;
  expires_utc: string;
  spot_check_note?: string | null;
  reanalysis_requested: boolean;
  metric_targets: string[];
  threshold_hint?: number | null;
  last_evaluated_metrics: Record<string, unknown>;
  evaluation_source?: string | null;
}

export interface ConditionReport {
  company_id: string;
  total_active: number;
  total_fired: number;
  total_acknowledged: number;
  urgent: ConditionRecord[];
  needs_review: ConditionRecord[];
  go_conditions: ConditionRecord[];
  generated_utc: string;
}

export interface ConditionEvaluation {
  condition_id: string;
  condition_text: string;
  kind: ConditionKind | string;
  data_points: InsightDataPoint[];
  assessment: "fired" | "clear" | "insufficient_data";
  reasoning: string;
  fired: boolean;
  reanalysis_triggered: boolean;
  evaluated_utc: string;
}

export interface ScanReport {
  company_id: string;
  conditions_scanned: number;
  conditions_fired: number;
  conditions_clear: number;
  insufficient_data: number;
  reanalysis_triggered: number;
  evaluations: ConditionEvaluation[];
  scan_duration_ms: number;
  scanned_utc: string;
}

export interface InsightMonitorCard {
  monitor_id: string;
  title: string;
  description: string;
  question: string;
  decision: DecisionPayload;
  generated_utc: string;
}

export interface InsightWatchStatus {
  company_id: string;
  active: boolean;
  status: string;
  enrolled_utc: string;
  last_requested_utc?: string | null;
  last_completed_utc?: string | null;
  next_due_utc?: string | null;
  last_duration_ms?: number | null;
  last_error?: string | null;
  last_reason?: string | null;
}

export interface InsightOverview {
  company_id: string;
  generated_utc: string;
  next_refresh_utc: string;
  refresh_interval_seconds: number;
  source_count: number;
  connected_sources: string[];
  datapoint_count: number;
  monitor_count: number;
  active_conditions: number;
  fired_conditions: number;
  urgent_conditions: number;
}

export interface InsightSnapshotResponse {
  overview: InsightOverview;
  connector_status: InsightConnectorStatus[];
  sync_result: Record<string, unknown>;
  recent_data: InsightDataPoint[];
  conditions: ConditionReport;
  scan_report: ScanReport;
  monitors: InsightMonitorCard[];
  watch_status?: InsightWatchStatus | null;
  generated_utc: string;
  cached: boolean;
}

export interface InsightAskIfResponse {
  company_id: string;
  query: string;
  decision: DecisionPayload;
  watch_status?: InsightWatchStatus | null;
  generated_utc: string;
}
