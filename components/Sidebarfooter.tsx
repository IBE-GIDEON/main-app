"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; 
import { useTheme } from "next-themes";
import {
  User, SlidersHorizontal, Plug, 
  ArrowUpCircle, Moon, Sun, Monitor, HelpCircle, LogOut, 
  ChevronRight, ChevronsUpDown, Bell, Check,
  LifeBuoy, Tag, BookOpen, Shield, Scale
} from "lucide-react";

interface SidebarFooterProps {
  isCollapsed?: boolean;
}

export default function SidebarFooter({ isCollapsed = false }: SidebarFooterProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter(); 
  
  const userName = session?.user?.name || "GIDEON IBE";
  const userEmail = session?.user?.email || "shytersnicks@gmail.com";
  const userHandle = userEmail.split('@')[0] || "shytersnic11985";
  const userImage = session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Gideon";

  return (
    <div className="mt-auto flex w-full items-center gap-1 px-3 py-4">
      
      {/* DROPDOWN MENU TRIGGER */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={`group flex flex-1 items-center rounded-xl p-1.5 text-sm transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-white/5 focus:outline-none outline-none active:scale-[0.98] ${
              isCollapsed ? 'justify-center' : 'gap-3'
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#2A2A2A]">
              <img src={userImage} alt="User" className="h-full w-full object-cover" />
            </div>
            
            {!isCollapsed && (
              <>
                <div className="flex flex-1 items-center gap-2 overflow-hidden text-left">
                  <span className="truncate text-[13px] font-semibold text-zinc-900 dark:text-zinc-200 tracking-wide uppercase transition-colors">
                    {userName}
                  </span>
                </div>
                <ChevronsUpDown size={14} className="text-zinc-400 dark:text-zinc-500 shrink-0 mr-1 transition-colors" />
              </>
            )}
          </button>
        </DropdownMenu.Trigger>

        {/* DROPDOWN MENU CONTENT */}
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="top"
            align="start"
            sideOffset={12}
            className="z-50 w-[260px] overflow-hidden rounded-[14px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-1.5 text-zinc-900 dark:text-zinc-200 shadow-xl dark:shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            {/* 1. HEADER */}
            <div className="flex items-center gap-3 px-2 py-2 mb-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 dark:bg-[#2A2A2A]">
                <img src={userImage} alt="Profile" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">{userHandle}</span>
                <span className="truncate text-[12px] text-zinc-500 dark:text-zinc-400">{userEmail}</span>
              </div>
            </div>

            <DropdownMenu.Separator className="my-1 h-px bg-zinc-100 dark:bg-white/10 mx-1" />

            {/* 2. MAIN SETTINGS */}
            <DropdownMenu.Item 
              onSelect={() => router.push("/dashin/account")}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10"
            >
              <User size={16} className="text-zinc-400 dark:text-zinc-400" />
              Account
            </DropdownMenu.Item>

            <DropdownMenu.Item 
              onSelect={() => router.push("/dashin/preferences")}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10"
            >
              <SlidersHorizontal size={16} className="text-zinc-400 dark:text-zinc-400" />
              Preferences
            </DropdownMenu.Item>

            <DropdownMenu.Item 
              onSelect={() => router.push("/dashin/connectors")}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10"
            >
              <Plug size={16} className="text-zinc-400 dark:text-zinc-400" />
              Connectors
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="my-1 h-px bg-zinc-100 dark:bg-white/10 mx-1" />

            {/* 3. APP & BILLING */}
            <DropdownMenu.Item 
              onSelect={() => router.push("/dashin/upgrade")}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10"
            >
              <ArrowUpCircle size={16} className="text-zinc-400 dark:text-zinc-400" />
              Upgrade plan
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="my-1 h-px bg-zinc-100 dark:bg-white/10 mx-1" />

            {/* 4. SYSTEM PREFERENCES (APPEARANCE SUBMENU) */}
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="flex cursor-default select-none items-center gap-3 rounded-lg px-2 py-1.5 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10 data-[state=open]:bg-zinc-100 dark:data-[state=open]:bg-white/10">
                <Moon size={16} className="text-zinc-400 dark:text-zinc-400" />
                <div className="flex flex-col flex-1 text-left">
                  <span>Appearance</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal capitalize">{theme || "system"}</span>
                </div>
                <ChevronRight size={14} className="text-zinc-400 dark:text-zinc-500" />
              </DropdownMenu.SubTrigger>
              
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent
                  className="z-50 min-w-[140px] overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-1.5 text-zinc-900 dark:text-zinc-200 shadow-xl dark:shadow-2xl animate-in slide-in-from-left-2 fade-in duration-200"
                  sideOffset={8}
                >
                  <DropdownMenu.Item onSelect={(e) => { e.preventDefault(); setTheme("light"); }} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10">
                    <Sun size={14} className="text-zinc-400 dark:text-zinc-400" />
                    <span className="flex-1">Light</span>
                    {theme === "light" && <Check size={14} className="text-emerald-600 dark:text-emerald-500" />}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={(e) => { e.preventDefault(); setTheme("dark"); }} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10">
                    <Moon size={14} className="text-zinc-400 dark:text-zinc-400" />
                    <span className="flex-1">Dark</span>
                    {theme === "dark" && <Check size={14} className="text-emerald-600 dark:text-emerald-500" />}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={(e) => { e.preventDefault(); setTheme("system"); }} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10">
                    <Monitor size={14} className="text-zinc-400 dark:text-zinc-400" />
                    <span className="flex-1">System</span>
                    {theme === "system" && <Check size={14} className="text-emerald-600 dark:text-emerald-500" />}
                  </DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>

            {/* 5. HELP & RESOURCES */}
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="flex cursor-default select-none items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10 data-[state=open]:bg-zinc-100 dark:data-[state=open]:bg-white/10 mt-1">
                <HelpCircle size={16} className="text-zinc-400 dark:text-zinc-400" />
                <span className="flex-1 text-left">Help & Resources</span>
                <ChevronRight size={14} className="text-zinc-400 dark:text-zinc-500" />
              </DropdownMenu.SubTrigger>
              
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent
                  className="z-50 min-w-[180px] overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-1.5 text-zinc-900 dark:text-zinc-200 shadow-xl dark:shadow-2xl animate-in slide-in-from-left-2 fade-in duration-200"
                  sideOffset={8}
                >
                  <DropdownMenu.Item onSelect={() => router.push("/help")} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10">
                    <LifeBuoy size={14} className="text-zinc-400 dark:text-zinc-400" />
                    Help Center
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Item onSelect={() => router.push("/dashin/upgrade")} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10">
                    <Tag size={14} className="text-zinc-400 dark:text-zinc-400" />
                    Plans & Pricing
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Item onSelect={() => router.push("/blog")} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10">
                    <BookOpen size={14} className="text-zinc-400 dark:text-zinc-400" />
                    Blog
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="my-1 h-px bg-zinc-100 dark:bg-white/10 mx-1" />

                  <DropdownMenu.Item onSelect={() => router.push("/pandt")} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10">
                    <Shield size={14} className="text-zinc-400 dark:text-zinc-400" />
                    Privacy Policy
                  </DropdownMenu.Item>

                  <DropdownMenu.Item onSelect={() => router.push("/pandt")} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10">
                    <Scale size={14} className="text-zinc-400 dark:text-zinc-400" />
                    Terms of Service
                  </DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>

            <DropdownMenu.Separator className="my-1 h-px bg-zinc-100 dark:bg-white/10 mx-1" />

            {/* 6. SIGN OUT */}
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium outline-none transition-colors text-rose-600 dark:text-rose-400 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-300 focus:bg-rose-50 dark:focus:bg-rose-500/10"
              onSelect={() => signOut({ callbackUrl: "/signin" })}
            >
              <LogOut size={16} />
              Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* NOTIFICATION BELL */}
      {!isCollapsed && (
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-zinc-200 ml-1">
          <Bell size={18} />
        </button>
      )}
    </div>
  );
}