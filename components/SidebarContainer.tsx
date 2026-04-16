"use client";

import React, { useState } from "react";
import { Menu, PanelRight } from "lucide-react";
import clsx from "clsx";
import Sidebarheader from "./Sidebarheader";
import Sidebarfooter from "./Sidebarfooter"; 
import SidebarRecents from "./SidebarRecents";
import Image from "next/image";

interface SidebarContainerProps {
  onCollapsedChange?: (isCollapsed: boolean) => void;
}

const SidebarContainer = ({ onCollapsedChange }: SidebarContainerProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarWidth = isCollapsed ? "w-[72px]" : "w-64";

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapsedChange?.(newState);
  };

  const sidebarClasses = clsx(
    "flex h-full flex-col transition-all duration-300 ease-in-out",
    sidebarWidth
  );

  const glassBtn =
    "flex items-center justify-center transition-all duration-200 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200";

  const sidebarBg = "bg-[#F9F9F9] dark:bg-[#0D0D0D] border-r border-zinc-200 dark:border-white/5 transition-colors duration-300";

  const desktopHeaderContent = (
    <div className="px-3 py-4">
      <div
        className={clsx(
          "flex items-center transition-all duration-300",
          isCollapsed 
            ? "justify-center p-2 bg-transparent" 
            : "justify-between p-3 bg-zinc-100 dark:bg-[#262626] rounded-xl border border-zinc-200 dark:border-white/5"
        )}
      >
        {isCollapsed ? (
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg group hover:bg-zinc-200 dark:hover:bg-white/10 transition-all duration-200"
            aria-label="Expand sidebar"
          >
            {/* THE FIX: Dark Mode Logo (hidden in light mode) */}
            <Image
              className="absolute hidden dark:block transition-opacity duration-300 group-hover:opacity-0"
              src="/dashlogo.png"
              alt="three AI logo"
              width={24}
              height={24}
            />
            {/* THE FIX: Light Mode Logo (hidden in dark mode) */}
            <Image
              className="absolute block dark:hidden transition-opacity duration-300 group-hover:opacity-0"
              src="/dashlogo-light.png"
              alt="three AI logo"
              width={24}
              height={24}
            />
            
            <PanelRight className="absolute h-4 w-4 text-zinc-500 dark:text-zinc-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="absolute left-full ml-4 px-2 py-1 bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 shadow-sm dark:shadow-none">
              Expand menu
            </div>
          </button>
        ) : (
          <>
            {/* THE FIX: Dark Mode Logo */}
            <Image
              className="hidden dark:block bg-none"
              src="/dashlogo.png"
              alt="three AI logo"
              width={24}
              height={24}
            />
            {/* THE FIX: Light Mode Logo */}
            <Image
              className="block dark:hidden bg-none"
              src="/dashlogo-light.png"
              alt="three AI logo"
              width={24}
              height={24}
            />
            <button
              type="button"
              onClick={handleToggleCollapse}
              className={clsx("h-7 w-7", glassBtn)}
              aria-label="Close sidebar"
            >
              <PanelRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const mobileHeaderContent = (
    <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-white/5">
      {/* THE FIX: Mobile Dark Mode Logo */}
      <Image src="/dashlogo.png" alt="three AI logo" width={24} height={24} className="hidden dark:block" />
      {/* THE FIX: Mobile Light Mode Logo */}
      <Image src="/dashlogo-light.png" alt="three AI logo" width={24} height={24} className="block dark:hidden" />
      <button
        type="button"
        onClick={() => setIsMobileOpen(false)}
        className={clsx("h-8 w-8", glassBtn)}
        aria-label="Close sidebar"
      >
        <PanelRight className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <>
      {/* MOBILE HAMBURGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className={clsx(
          "fixed left-4 top-4 z-40 inline-flex h-9 w-9 md:hidden transition-all duration-300 bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-none",
          glassBtn,
          isMobileOpen
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        )}
        aria-label="Open sidebar"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* DESKTOP SIDEBAR */}
      <aside className={clsx(sidebarClasses, sidebarBg, "left-0 top-0 z-20 hidden md:flex")}>
        {desktopHeaderContent}
        <Sidebarheader isCollapsed={isCollapsed} />
        <SidebarRecents isCollapsed={isCollapsed} />
        <Sidebarfooter isCollapsed={isCollapsed} />
      </aside>

      {/* MOBILE OVERLAY */}
      <div
        className={clsx(
          "fixed inset-0 z-30 md:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-zinc-900/60 dark:bg-black/60 backdrop-blur-sm transition-colors"
          onClick={() => setIsMobileOpen(false)}
        />
        
        {/* MOBILE SIDEBAR */}
        <aside
          className={clsx(
            "absolute flex h-full flex-col transition-transform duration-300 ease-in-out w-64 shadow-2xl",
            sidebarBg,
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {mobileHeaderContent}
          <Sidebarheader isCollapsed={false} />
          <SidebarRecents isCollapsed={false} />
          <Sidebarfooter isCollapsed={false} />
        </aside>
      </div>
    </>
  );
};

export default SidebarContainer;
