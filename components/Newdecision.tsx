"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Workflow } from "lucide-react";
import clsx from "clsx";

const Newdecision = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const pathname = usePathname();
  const router = useRouter();

  const createNewflows = () => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem("pending_record_id");
    localStorage.removeItem("pending_spawn_question");

    if (pathname === "/dashboard") {
      window.dispatchEvent(new CustomEvent("think-ai-new"));
      return;
    }

    localStorage.setItem("pending_new_decision", "1");
    router.push("/dashboard");
  };

  return (
    <div
      onClick={createNewflows}
      title={isCollapsed ? "New Decision" : ""}
      className="px-0 mt-2"
    >
      <div
        className={clsx(
          // Always use the exact same flex layout and padding (p-2). No swapping justify properties.
          "flex items-center w-full p-2 rounded-xl cursor-pointer",
          "font-semibold text-[13px] text-white",
          "bg-gradient-to-r from-[#b372ce] to-[#5b8def] shadow-[0_0_15px_rgba(179,114,206,0.25)] hover:shadow-[0_0_20px_rgba(179,114,206,0.4)]",
          "transition-all duration-300 ease-out active:scale-[0.98]",
        )}
      >
        {/* Fixed-width icon container: guarantees perfectly centered alignment when sidebar is 72px */}
        <div className="flex items-center justify-center w-8 h-8 shrink-0">
          <Workflow size={18} className="text-white" />
        </div>
        
        {/* Smooth expanding text container using max-width for zero-jitter clipping */}
        <div
          className={clsx("flex flex-col justify-center overflow-hidden transition-all duration-300 ease-in-out", isCollapsed ? "ml-0 max-w-0 opacity-0" : "ml-2 max-w-[150px] opacity-100")}
        >
          <span className="whitespace-nowrap">New Decision</span>
        </div>
      </div>
    </div>
  );
};

export default Newdecision;
