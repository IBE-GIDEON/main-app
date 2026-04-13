"use client";

import { useState, useEffect, useCallback } from "react";

export type RecentDecision = {
  record_id: string;
  decision_id: string;
  query_preview: string;
  decision_type: string;
  stake_level: "Low" | "Medium" | "High";
  verdict_color: "Green" | "Yellow" | "Orange" | "Red";
  timestamp_utc: string;
};

export function useRecents(companyId: string) {
  const [recents, setRecents] = useState<RecentDecision[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecents = useCallback(async () => {
    try {
      // THE FIX: Changed limit from 15 to 50 so older records don't drop off
      const res = await fetch(`http://localhost:8000/audit/${companyId}?limit=50`, {
        headers: { "X-API-Key": "testkey123" }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRecents(data);
    } catch (err) {
      console.error("Could not load recents", err);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  // 1. Listen for new decisions across the app
  useEffect(() => {
    fetchRecents();
    
    const handleRefresh = () => fetchRecents();
    window.addEventListener("refresh-recents", handleRefresh);
    
    return () => window.removeEventListener("refresh-recents", handleRefresh);
  }, [fetchRecents]);

  // 2. Optimistic Delete Function
  const deleteRecord = async (recordId: string) => {
    // Instantly remove from UI for a snappy feel
    setRecents((prev) => prev.filter((r) => r.record_id !== recordId));
    
    try {
      // Send delete request to backend
      await fetch(`http://localhost:8000/audit/${companyId}/${recordId}`, {
        method: "DELETE",
        headers: { "X-API-Key": "testkey123" }
      });
    } catch (err) {
      console.error("Failed to delete", err);
      fetchRecents(); // If backend fails, revert the UI
    }
  };

  return { recents, loading, deleteRecord };
}