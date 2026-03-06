// app/(chat)/_components/Sidebar.tsx
"use client";


import React, { useState } from "react";
import { X, Menu, PanelRight } from "lucide-react";
import clsx from "clsx";
import Sidebarheader from "./Sidebarheader";
import Sidebarfooter from "./Sidebarfooter";
import Image from 'next/image';



interface SidebarContainerProps {
  onCollapsedChange?: (isCollapsed: boolean) => void;
}

const SidebarContainer = ({ onCollapsedChange }: SidebarContainerProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // width collapse (desktop + mobile)
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile visibility

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  // Notify parent when sidebar collapses/expands
  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapsedChange?.(newState);
  };


  const sidebarClasses = clsx(
    "flex h-full flex-col bg-black text-gray-900 transition-all duration-300 ease-in-out",
    sidebarWidth
  );

  const desktopHeaderContent = (
    <div className="flex items-center justify-between px-2 py-2">
      {/* Logo */}
      <div className={clsx("flex items-center justify-center transition-all duration-300", isCollapsed && "w-full")}>
        <button
          type="button"
          onClick={handleToggleCollapse}
          className="h-auto w-auto flex items-center justify-center rounded-full dark:hover:bg-zinc-900 group relative"
          aria-label="Toggle sidebar width"
          title={isCollapsed ? "Open sidebar" : ""}
        >
          <Image 
            className={clsx(
              "mt-[6px] transition-all duration-300", 
              isCollapsed ? "ml-0 group-hover:opacity-0" : "ml-[14px]"
            )}
            src="/tw.png" 
            alt="My logo" 
            width={isCollapsed ? 40 : 75} 
            height={10} 
          />
          
          {/* PanelRight icon on hover when collapsed */}
          {isCollapsed && (
            <PanelRight className="h-5 w-5 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}

          {/* Tooltip */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-white text-black text-xs font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Open sidebar
            </div>
          )}
        </button>
      </div>

      {/* Close button on desktop (shows when expanded) */}
      {!isCollapsed && (
        <button
          type="button"
          onClick={handleToggleCollapse}
          className="h-8 w-8 flex items-center justify-center rounded-full mr-2 hover:bg-zinc-800 transition-colors"
          aria-label="Close sidebar"
        >
          <PanelRight className="h-4 w-4 text-white" />
        </button>
      )}
    </div>
  );

  const mobileHeaderContent = (
    <div className="flex items-center justify-end px-4 py-4">
      {/* Mobile close button */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(false)}
        className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
        aria-label="Close sidebar"
      >
        <PanelRight className="h-4 w-4 mt-[-8px] text-white" />
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile open button */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className={clsx(
          "fixed left-3 top-3 z-40 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-md hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 md:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        )}
        aria-label="Open sidebar"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile logo (shows when drawer is open) */}
      <div
        className={clsx(
          "fixed left-3 top-3 z-40 md:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <Image src="/tw.png" alt="My logo" width={75} height={10} />
      </div>

      {/* Desktop sidebar */}
      <aside className={clsx(sidebarClasses, "left-0 top-0 z-20 hidden md:flex")}>
        {desktopHeaderContent}
        <Sidebarheader isCollapsed={isCollapsed} />
           <Sidebarfooter />
      </aside>

      {/* Mobile drawer */}
      <div
        className={clsx(
          "fixed inset-0 z-30 md:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Sliding sidebar */}
        <aside
          className={clsx(
            "flex h-full flex-col bg-black text-gray-900 transition-transform duration-300 ease-in-out w-64",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {mobileHeaderContent}
          <Sidebarheader isCollapsed={false} />
           <Sidebarfooter />
        </aside>
     
      </div>
      
    </>
  );
};

export default SidebarContainer;
