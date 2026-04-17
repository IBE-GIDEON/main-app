"use client";

import { useState, useEffect, useCallback } from "react";
import {
  deleteAuditRecord,
  getOrCreateCompanyId,
  listAuditRecords,
} from "@/services/chatApi";
import type { RecentAuditRecord } from "@/types/chat";

export type RecentDecision = RecentAuditRecord;

export function useRecents(companyId?: string) {
  const [recents, setRecents] = useState<RecentDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const resolvedCompanyId = companyId || getOrCreateCompanyId();

  const fetchRecents = useCallback(async () => {
    setLoading(true);

    try {
      const data = await listAuditRecords({
        companyId: resolvedCompanyId,
        limit: 50,
      });
      setRecents(data);
    } catch (err) {
      console.error("Could not load recents", err);
      setRecents([]);
    } finally {
      setLoading(false);
    }
  }, [resolvedCompanyId]);

  useEffect(() => {
    void fetchRecents();

    const handleRefresh = () => {
      void fetchRecents();

      // Audit writes are queued in the backend, so a short follow-up fetch
      // helps the newest decision appear reliably in the sidebar.
      window.setTimeout(() => {
        void fetchRecents();
      }, 900);
    };

    window.addEventListener("refresh-recents", handleRefresh);

    return () => window.removeEventListener("refresh-recents", handleRefresh);
  }, [fetchRecents]);

  const deleteRecord = async (recordId: string) => {
    const previous = recents;
    setRecents((prev) => prev.filter((r) => r.record_id !== recordId));

    try {
      await deleteAuditRecord(recordId, resolvedCompanyId);
    } catch (err) {
      console.error("Failed to delete", err);
      setRecents(previous);
    }
  };

  return { recents, loading, deleteRecord, refreshRecents: fetchRecents };
}
