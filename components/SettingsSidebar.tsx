"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronLeft, User, SlidersHorizontal, 
  Bell, Plug, Sparkles, Zap 
} from "lucide-react";
import clsx from "clsx";

export default function SettingsSidebar() {
  const pathname = usePathname();

  const mainNav = [
    { name: "Account", href: "/dashin/account", icon: User },
    { name: "Preferences", href: "/dashin/preferences", icon: SlidersHorizontal },
    { name: "Notifications", href: "/dashin/notifications", icon: Bell },
    { name: "Connectors", href: "/dashin/connectors", icon: Plug },
  ];

  const isUpgradeActive = pathname === "/dashin/upgrade" || pathname.startsWith("/dashin/upgrade/");

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white dark:bg-[#0A0A0A] border-r border-zinc-200 dark:border-white/5 py-6 px-4 no-scrollbar transition-colors duration-300">
      
      {/* Back to Home Button */}
      <Link 
        href="/dashboard" 
        className="mb-8 flex items-center gap-2 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 transition-colors dark:hover:text-zinc-200 px-2"
      >
        <ChevronLeft size={16} />
        Home
      </Link>

      {/* SECTION: Account */}
      <div className="mb-8">
        <h4 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Account
        </h4>
        <nav className="flex flex-col gap-0.5">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium transition-colors",
                  isActive 
                    ? "bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white" 
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200" 
                )}
              >
                <Icon size={16} className={isActive ? "text-zinc-900 dark:text-zinc-200" : "text-zinc-400 dark:text-zinc-500"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* SECTION: Plans */}
      <div className="mb-8">
        <h4 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Plans
        </h4>
        <nav className="flex flex-col gap-1.5 mt-1">
          
          {/* Active: Upgrade to MVP */}
          <Link 
            href="/dashin/upgrade" 
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all shadow-sm active:scale-[0.98]",
              isUpgradeActive 
                ? "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20" 
                : "bg-white dark:bg-[#1A1A1A] text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-[#222222]"
            )}
          >
            <Zap size={16} className={isUpgradeActive ? "text-purple-500 dark:text-purple-400" : "text-purple-600 dark:text-purple-500"} />
            Upgrade to MVP
          </Link>
          
          {/* Disabled & Blurred: Pro Plan (Coming Soon Teaser) */}
          <div className="flex items-center justify-between rounded-xl px-3 py-2 text-[13px] font-medium text-zinc-400 dark:text-zinc-500 opacity-50 dark:opacity-40 blur-[0.7px] pointer-events-none select-none mt-1">
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-zinc-400 dark:text-zinc-600" />
              Pro Plan
            </div>
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 border border-zinc-300 dark:border-zinc-700/50 rounded px-1.5 py-0.5">
              Soon
            </span>
          </div>

        </nav>
      </div>

    </div>
  );
}