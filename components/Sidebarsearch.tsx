"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import clsx from "clsx";

// Import the new modal! (Make sure this path matches where you saved it)
import SearchModal from "@/components/SearchModal"; 

type SearchbarProps = {
  isCollapsed?: boolean;
};

export default function Sidebarsearch({ isCollapsed = false }: SearchbarProps) {
  // Replace the router with a simple open/close state
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        title={isCollapsed ? "Search" : ""}
        className={clsx(
          "flex items-center w-full p-2 rounded-xl cursor-pointer",
          "transition-all duration-300 ease-out active:scale-[0.98]",
          
          // Light Mode (Crisp white box, subtle border, dark text on hover)
          "bg-white border border-zinc-200 text-zinc-500 shadow-sm",
          "hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300",
          
          // Dark Mode (Restored your exact glassy design)
          "dark:bg-white/5 dark:border-white/5 dark:text-zinc-400 dark:shadow-none",
          "dark:hover:bg-white/10 dark:hover:text-zinc-200 dark:hover:border-white/10"
        )}
      >
        {/* Fixed-width icon container guarantees perfect math-centering when sidebar shrinks to 72px */}
        <div className="flex items-center justify-center w-8 h-8 shrink-0 transition-colors">
          <Search size={16} />
        </div>

        {/* Zero-jitter text reveal using max-width clipping */}
        <div
          className={clsx(
            "flex flex-col justify-center overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-2"
          )}
        >
          <span className="whitespace-nowrap text-[13px] font-medium transition-colors">Search</span>
        </div>
      </button>

      {/* Render the modal right here. It will float over everything when isOpen is true. */}
      <SearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}