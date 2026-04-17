// app/(chat)/_components/Sidebar.tsx
"use client";

import React from "react";
import Sidebarsearch from "./Sidebarsearch"
import Sidebarcontent from "./Sidebarcontent";
import { LayoutDashboard, Database, Binoculars, Brain } from "lucide-react"

import Newflows from "./Newdecision";

const items =[
  {
    name: "Conditions",
    path: "/integratedapps",
    icon: LayoutDashboard,
  },
  {
    name: "Insights",
    path: "/libraryfiles",
    icon: Brain,
  },
  {
    name: "Discover",
    path: "/discover",
    icon: Binoculars,
  },
  {
    name: "Data deck",
    path: "/zen-Ai",
    icon: Database,
  },
]

const SidebarHeader = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <>
      <div className="flex flex-col px-3 pt-2 pb-2">
        
        {/* Search Container */}
        <div className="mb-2 w-full">
          <Sidebarsearch isCollapsed={isCollapsed} />
        </div> 

        {/* Decide / Main Action Container */}
        {/* Kept your exact Link and Component syntax */}
        <div className="mb-4 block w-full rounded-lg transition-all duration-200 hover:opacity-90">
        
            <Newflows isCollapsed={isCollapsed} />
          
        </div>
        
        {/* Navigation List Container */}
        {/* Tightened the space-y-3 and mt-10 to match the clean Aside aesthetic */}
        <div className="flex flex-col space-y-1 w-full text-zinc-400 font-medium">
          {items.map((item) => (
            <Sidebarcontent key={item.path} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>      



        
      </div>
    </> 
  );
};

export default SidebarHeader;
