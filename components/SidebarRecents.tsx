"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { Clock, Trash2 } from "lucide-react";
import { useRecents } from "@/hooks/useRecents";

const VERDICT_STYLES: Record<string, string> = {
  Green:  "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] dark:shadow-[0_0_8px_rgba(16,185,129,0.4)]",
  Yellow: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)] dark:shadow-[0_0_8px_rgba(245,158,11,0.4)]",
  Orange: "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)] dark:shadow-[0_0_8px_rgba(249,115,22,0.4)]",
  Red:    "bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.3)] dark:shadow-[0_0_8px_rgba(225,29,72,0.4)]",
};

interface SidebarRecentsProps {
  isCollapsed: boolean;
}

export default function SidebarRecents({ isCollapsed }: SidebarRecentsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { recents, loading, deleteRecord } = useRecents();

  const handleOpenRecord = (recordId: string) => {
    if (pathname === "/dashboard") {
      window.dispatchEvent(
        new CustomEvent("think-ai-load-record", {
          detail: recordId,
        }),
      );
      return;
    }

    localStorage.setItem("pending_record_id", recordId);
    router.push("/dashboard");
  };

  return (
    // THIN SCROLLBAR INJECTED HERE (With Light/Dark mode thumb colors)
    <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
      
      {/* Section Header */}
      <div 
        className={clsx(
          "flex items-center text-[10px] font-bold text-zinc-500 dark:text-white/30 uppercase tracking-widest mb-3 transition-colors",
          isCollapsed ? "justify-center" : "px-5 gap-2"
        )}
      >
        <Clock size={12} />
        {!isCollapsed && <span>Audit Ledger</span>}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={clsx("text-[10px] font-mono text-zinc-500 dark:text-white/30 transition-colors", isCollapsed ? "text-center" : "px-5")}>
          {isCollapsed ? "..." : "FETCHING_RECORDS"}
        </div>
      ) : recents.length === 0 ? (
        <div className={clsx("text-[10px] font-mono text-zinc-500 dark:text-white/30 transition-colors", isCollapsed ? "text-center" : "px-5")}>
          {isCollapsed ? "-" : "NO_RECORDS"}
        </div>
      ) : (
        <div className="space-y-0.5 px-2">
          {recents.map((record) => (
            // CHANGED from <button> to <div className="cursor-pointer"> to allow nested buttons
            <div
              key={record.record_id}
              onClick={() => handleOpenRecord(record.record_id)}
              className={clsx(
                "w-full text-left rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group relative flex items-center cursor-pointer",
                isCollapsed ? "p-3 justify-center" : "p-3 gap-3"
              )}
            >
              {/* Status Dot */}
              <div 
                className={clsx(
                  "w-1.5 h-1.5 rounded-full shrink-0", 
                  VERDICT_STYLES[record.verdict_color] || "bg-zinc-300 dark:bg-white/20",
                  isCollapsed ? "mx-auto" : "mt-1.5 self-start"
                )} 
              />
              
              {/* Full Text (Only visible when expanded) */}
              {!isCollapsed && (
                <div className="flex flex-col gap-1.5 overflow-hidden flex-1">
                  {/* Added pr-6 to give the trash can some breathing room */}
                  <p className="text-[13px] font-medium text-zinc-900 dark:text-white/70 group-hover:text-black dark:group-hover:text-white truncate transition-colors pr-6">
                    {record.query_preview}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] font-mono uppercase text-zinc-500 dark:text-white/40 transition-colors">
                    <span>{record.decision_type}</span>
                    <span>•</span>
                    <span className={
                      record.stake_level === "High" ? "text-rose-600 dark:text-rose-400/70" : 
                      record.stake_level === "Medium" ? "text-amber-600 dark:text-amber-400/70" : "text-emerald-600 dark:text-emerald-400/70"
                    }>
                      {record.stake_level}
                    </span>
                  </div>
                </div>
              )}

              {/* DELETE BUTTON: Visible on mobile, hover on desktop */}
              {!isCollapsed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Stops the row from registering a click when you hit delete
                    deleteRecord(record.record_id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 md:opacity-0 opacity-100 group-hover:opacity-100 p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-all"
                  aria-label="Delete record"
                >
                  <Trash2 size={14} />
                </button>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white/80 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-48 shadow-xl dark:shadow-2xl">
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
