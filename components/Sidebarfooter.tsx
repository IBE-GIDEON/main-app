"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { 
  MoreHorizontal, 
  User, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";

interface SidebarFooterProps {
  isCollapsed?: boolean;
}

export default function SidebarFooter({ isCollapsed = false }: SidebarFooterProps) {
  return (
    <div className="mt-auto w-full px-3 py-4">
      <DropdownMenu.Root>
        {/* The Trigger is your profile button */}
        <DropdownMenu.Trigger asChild>
          <button 
            className={`group flex w-full items-center rounded-xl p-2 text-sm transition-all duration-200 text-white focus:outline-none outline-none ${
              isCollapsed 
                ? 'justify-center hover:bg-transparent' 
                : 'gap-3 shadow-lg'
            } active:scale-[0.98]`}
          >
          
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500/90 to-teal-700/90 text-white shrink-0 shadow-lg backdrop-blur-sm border border-white/20">
              <User size={20} />
            </div>

            {!isCollapsed && (
              <>
                <div className="flex flex-1 flex-col items-start overflow-hidden text-left">
                  <span className="truncate w-full font-semibold tracking-tight drop-shadow-sm">
                    Think AI Admin
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider drop-shadow-sm">
                    Premium Plan
                  </span>
                </div>

                <MoreHorizontal 
                  size={18} 
                  className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-sm" 
                />
              </>
            )}
          </button>
        </DropdownMenu.Trigger>

        {/* The actual Dropdown Menu */}
        <DropdownMenu.Portal>
          <DropdownMenu.Content 
            side="top" 
            align="end" 
            sideOffset={10}
            className="z-50 min-w-[240px] overflow-hidden rounded-xl border border-white/20 backdrop-blur-xl bg-zinc-900/90 p-1.5 text-zinc-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <DropdownMenu.Label className="px-2 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Account
            </DropdownMenu.Label>

            <DropdownMenu.Item className="group flex cursor-default items-center gap-3 rounded-lg px-2 py-2.5 text-sm outline-none transition-colors backdrop-blur-sm hover:bg-white/10 data-[highlighted]:bg-white/10 border border-transparent hover:border-white/20">
              <Sparkles size={16} className="text-teal-400 drop-shadow-sm" />
              Upgrade to Pro
            </DropdownMenu.Item>

            <DropdownMenu.Item className="group flex cursor-default items-center gap-3 rounded-lg px-2 py-2.5 text-sm outline-none transition-colors backdrop-blur-sm hover:bg-white/10 data-[highlighted]:bg-white/10 border border-transparent hover:border-white/20">
              <Settings size={16} />
              Settings
            </DropdownMenu.Item>

            <DropdownMenu.Item className="group flex cursor-default items-center gap-3 rounded-lg px-2 py-2.5 text-sm outline-none transition-colors backdrop-blur-sm hover:bg-white/10 data-[highlighted]:bg-white/10 border border-transparent hover:border-white/20">
              <ShieldCheck size={16} />
              Privacy Policy
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="my-1.5 h-px bg-white/10" />

            <DropdownMenu.Item className="group flex cursor-default items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-red-400 outline-none transition-colors backdrop-blur-sm hover:bg-red-400/10 data-[highlighted]:bg-red-400/10 border border-transparent hover:border-red-400/30">
              <LogOut size={16} />
              Log out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}