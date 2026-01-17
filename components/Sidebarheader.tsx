// app/(chat)/_components/Sidebar.tsx
"use client";

import React, { useState } from "react";
import Sidebarsearch from "./Sidebarsearch"
import path from "path";
import Sidebarcontent from "./Sidebarcontent";
import { LucideIcon, LayoutDashboard, LibraryBig, ClipboardClock, Sparkles } from "lucide-react"
import Link from "next/link";
import Newflows from "./Newflows";

interface Isidebaritem {
  name: string;
  icon: LucideIcon;
  path: string;
  items?: Isubitem;
}

interface Isubitem {
 name: string;
 path: string;
} 

const items =[

  {
    name: "Connected apps",
    path: "/integratedapps",
    icon: LayoutDashboard,
  },
  {
    name: "Library",
    path: "/libraryfiles",
    icon: LibraryBig,
  },
  {
    name: "FLow history",
    path: "/history",
    icon: ClipboardClock,
  },
  {
    name: "Zen AI",
    path: "/zen-Ai",
    icon: Sparkles,
  },

]

const SidebarHeader = () => {


  return (
    <>
     
<div className=" items-center px-3 pt-3 pb-2">
        <span className="inline-flex h-7 w-7 items-center justify-center">
        
<Sidebarsearch />
 </span> 
 <div>
  <Link href={"/"}>
<Newflows />
</Link>
  </div>
        
<div className="space-y-3 mt-10 items-center px-0.5 text-white/80 justify-center font-bold">
  {items.map((item) => (
    <Sidebarcontent key={item.path} item={item} />
  ))}
  </div>      
    </div>
    </> 
  );
};

export default SidebarHeader;
