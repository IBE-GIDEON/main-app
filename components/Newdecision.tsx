"use client";

import React from 'react'
import { Workflow } from 'lucide-react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

const Newdecision = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const router = useRouter();

  const createNewflows = async () => {
    // created a new chatid in store
    router.push (`/chat/676767`);
  };

  return (
    <div 
      onClick={createNewflows}
      title= {isCollapsed ? "New think" : ""}
      className="mt-4 text-[15px] items-center px-0.5 text-white/80 justify-center mb-[-28px]"
    >
      <div
        className={clsx(
          "flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-white/80 border border-transparent bg-transparent transition-all duration-300 ease-out hover:bg-white/10 hover:backdrop-blur-md hover:border-white/20 hover:text-white hover:shadow-[0_8px_32px_rgba(255,255,255,0.08)] active:scale-[0.98]",
          isCollapsed && "justify-center"
        )}
      >
        <span className="shrink-0">
          <Workflow />
        </span>

        {/* Smooth text animation (no glitch) */}
        <span
          className={clsx(
            "whitespace-nowrap",
            "transition-all duration-300 ease-in-out",
            isCollapsed
              ? "opacity-0 -translate-x-2 w-0 overflow-hidden"
              : "opacity-100 translate-x-0 w-auto"
          )}
        >
          New Decision
        </span>
      </div>
    </div>
  )
}

export default Newdecision
