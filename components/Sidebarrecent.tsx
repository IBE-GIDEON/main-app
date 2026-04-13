"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Clock, Trash2 } from "lucide-react";

const VERDICT_STYLES: Record<string, string> = {
  Green:  "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
  Yellow: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]",
  Orange: "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]",
  Red:    "bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.4)]",
};

// Define the shape of our records
type RecentRecord = {
  record_id: string;
  verdict_color: string;
  query_preview: string;
  decision_type: string;
  stake_level: string;
};

interface SidebarRecentsProps {
  isCollapsed: boolean;
}

export default function SidebarRecents({ isCollapsed }: SidebarRecentsProps) {
  const [recents, setRecents] = useState<RecentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecents = async () => {
    setLoading(true);
    try {
      // 🚨 SAFE FROM HYDRATION ERRORS: We only grab localStorage inside this async 
      // function, which only fires after the browser has mounted the component.
      const companyId = localStorage.getItem("company_id") || "default-co";
      
      const res = await fetch(`http://localhost:8000/audit/${companyId}`, {
        headers: { "X-API-Key": "testkey123" }
      });
      
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();
      setRecents(data);
    } catch (err) {
      console.warn("Backend not connected yet. Loading demo recents.");
      // THE DEMO FALLBACK: Shows up if Python isn't running yet!
      setRecents([
        {
          record_id: "demo-1",
          verdict_color: "Green",
          query_preview: "Acquire Stripe vs Build Internal Payment Gateway",
          decision_type: "Strategic",
          stake_level: "High",
        },
        {
          record_id: "demo-2",
          verdict_color: "Yellow",
          query_preview: "Q3 Server Migration (AWS to GCP)",
          decision_type: "Operational",
          stake_level: "Medium",
        },
        {
          record_id: "demo-3",
          verdict_color: "Green",
          query_preview: "Executive Hiring: VP of Sales",
          decision_type: "Hiring",
          stake_level: "Normal",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecents();

    // Listen for new decisions finishing to automatically refresh the list
    const handleRefresh = () => fetchRecents();
    window.addEventListener("refresh-recents", handleRefresh);
    
    return () => window.removeEventListener("refresh-recents", handleRefresh);
  }, []);

  // Handle clicking a record to load it into the main chat
  const handleLoadRecord = (id: string) => {
    window.dispatchEvent(new CustomEvent("think-ai-load-record", { detail: id }));
  };

  // Mock delete function (updates UI instantly)
  const deleteRecord = (id: string) => {
    setRecents((prev) => prev.filter((r) => r.record_id !== id));
    // TODO: Add a fetch call here to delete from your database later!
  };

  return (
    // THE THIN SCROLLBAR HACK: Added Light/Dark mode scrollbar classes
    <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
    
      {loading ? (
        <div className={clsx("text-[10px] font-mono text-zinc-400 dark:text-white/20 transition-colors", isCollapsed ? "text-center" : "px-5")}>
          {isCollapsed ? "..." : "FETCHING_RECORDS"}
        </div>
      ) : recents.length === 0 ? (
        <div className={clsx("text-[10px] font-mono text-zinc-400 dark:text-white/20 transition-colors", isCollapsed ? "text-center" : "px-5")}>
          {isCollapsed ? "-" : "NO_RECORDS"}
        </div>
      ) : (
        <div className="space-y-0.5 px-2">
          {recents.map((record) => (
            <div
              key={record.record_id}
              className={clsx(
                "w-full text-left rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group relative flex items-center cursor-pointer",
                isCollapsed ? "p-3 justify-center" : "p-3 gap-3"
              )}
              onClick={() => handleLoadRecord(record.record_id)} 
            >
              <div 
                className={clsx(
                  "w-1.5 h-1.5 rounded-full shrink-0", 
                  VERDICT_STYLES[record.verdict_color] || "bg-zinc-300 dark:bg-white/20",
                  isCollapsed ? "mx-auto" : "mt-1.5 self-start"
                )} 
              />
              
              {!isCollapsed && (
                <div className="flex flex-col gap-1.5 overflow-hidden flex-1">
                  <p className="text-[13px] text-zinc-600 dark:text-white/60 group-hover:text-zinc-900 dark:group-hover:text-white/90 truncate transition-colors pr-6">
                    {record.query_preview}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] font-mono uppercase text-zinc-400 dark:text-white/30 transition-colors">
                    <span>{record.decision_type}</span>
                    <span>•</span>
                    <span className={
                      record.stake_level === "High" ? "text-rose-500 dark:text-rose-400/70" : 
                      record.stake_level === "Medium" ? "text-amber-500 dark:text-amber-400/70" : "text-emerald-500 dark:text-emerald-400/70"
                    }>
                      {record.stake_level}
                    </span>
                  </div>
                </div>
              )}

              {/* DELETE BUTTON: Appears on hover */}
              {!isCollapsed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents loading the record when trying to delete it
                    deleteRecord(record.record_id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:text-zinc-500 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 rounded transition-all"
                  aria-label="Delete record"
                >
                  <Trash2 size={14} />
                </button>
              )}

              {/* TOOLTIP: Appears on hover when sidebar is collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-white/80 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-48 shadow-xl">
                  <p className="line-clamp-2">{record.query_preview}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}