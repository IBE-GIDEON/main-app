// app/(chat)/_components/Sidebar.tsx
"use client";


import React, { useState } from "react";
import { X, Menu } from "lucide-react";
import clsx from "clsx";
import Sidebarheader from "./Sidebarheader";



const SidebarContainer = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // width collapse (desktop + mobile)
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile visibility

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";


  const sidebarClasses = clsx(
    "flex h-full flex-col bg-black text-gray-900 transition-all duration-300 ease-in-out",
    sidebarWidth
  );

  const headerContent = (
    <div className="flex items-center justify-between px-2 py-2">
      {/* Collapse toggle (desktop + mobile) */}
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="h-8 w-8 flex items-center justify-center rounded-full dark:hover:bg-zinc-900"
        aria-label="Toggle sidebar width"
      >
       <Menu className="text-white pt-2 ml-4 "></Menu>
      </button>

      {/* Mobile close */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(false)}
        className="md:hidden h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
        aria-label="Close sidebar"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile open button */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-3 top-3 z-40 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-md hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 md:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Desktop sidebar */}
      <aside className={clsx(sidebarClasses, "left-0 top-0 z-20 hidden md:flex")}>
        {headerContent}
        <Sidebarheader />
      </aside>

      {/* Mobile drawer (desktop-like behavior) */}
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
            sidebarClasses,
            "absolute left-0 top-0 z-40 transform transition-transform duration-300",
            isMobileOpen ? "w-64" : "w-64"
          )}
        >
          {headerContent}
          <Sidebarheader />
        </aside>
      </div>
    </>
  );
};

export default SidebarContainer;
