"use client";

import { useTheme } from "next-themes"; 
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useSettings } from "@/contexts/SettingsContext"; // Update path if needed!

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme(); 
  
  // Grab the settings AND the new isLoaded flag
  const { autosuggest, updateSetting, isLoaded } = useSettings();
  
  // Hydration fix for next-themes
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // THE FIX: Do not render the UI until BOTH the theme and the settings have loaded from storage
  if (!mounted || !isLoaded) return null; 

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl pb-20">
      
      {/* APPEARANCE SECTION */}
      <h1 className="mb-6 text-[18px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">
        Appearance
      </h1>
      
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col max-w-[280px]">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">Theme</span>
            <span className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400 transition-colors">How Three AI looks on your device</span>
          </div>
          
          <div className="flex gap-3">
            
            {/* LIGHT THEME BUTTON */}
            <button 
              onClick={() => setTheme("light")} 
              className="flex flex-col items-center gap-2 group"
            >
              <div className={clsx(
                "h-[72px] w-[104px] rounded-xl border p-1.5 transition-all",
                theme === "light" 
                  ? "border-sky-500 bg-sky-50 dark:border-sky-500/50 dark:shadow-[0_0_15px_rgba(14,165,233,0.1)] dark:bg-[#1C1C1C]" 
                  : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-white/5 dark:bg-[#1C1C1C] dark:group-hover:border-white/20"
              )}>
                <div className="h-full w-full rounded-lg bg-white dark:bg-[#E5E5E5] border border-zinc-200 dark:border-transparent p-2.5 flex flex-col gap-1.5 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-400/50" />
                    <div className="h-1.5 w-12 rounded bg-zinc-200 dark:bg-zinc-300" />
                  </div>
                  <div className="h-1.5 w-16 rounded bg-zinc-200 dark:bg-zinc-300 ml-3" />
                  <div className="mt-auto self-end h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-400" />
                </div>
              </div>
              <span className={clsx("text-[12px] font-medium transition-colors", theme === "light" ? "text-zinc-900 dark:text-zinc-200" : "text-zinc-500")}>
                Light
              </span>
            </button>

            {/* DARK THEME BUTTON */}
            <button 
              onClick={() => setTheme("dark")} 
              className="flex flex-col items-center gap-2 group"
            >
              <div className={clsx(
                "h-[72px] w-[104px] rounded-xl border p-1.5 transition-all",
                theme === "dark" 
                  ? "border-emerald-600 bg-emerald-50 dark:border-emerald-500/50 dark:shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:bg-[#1C1C1C]" 
                  : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-white/5 dark:bg-[#1C1C1C] dark:group-hover:border-white/20"
              )}>
                <div className="h-full w-full rounded-lg border border-zinc-800 dark:border-white/10 bg-zinc-900 dark:bg-[#0A0A0A] p-2.5 flex flex-col gap-1.5">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 dark:bg-zinc-600" />
                    <div className="h-1.5 w-12 rounded bg-zinc-800" />
                  </div>
                  <div className="h-1.5 w-16 rounded bg-zinc-800 ml-3" />
                  <div className="mt-auto self-end h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-sky-500" />
                </div>
              </div>
              <span className={clsx("text-[12px] font-medium transition-colors", theme === "dark" ? "text-zinc-900 dark:text-zinc-200" : "text-zinc-500")}>
                Dark
              </span>
            </button>

            {/* SYSTEM THEME BUTTON */}
            <button 
              onClick={() => setTheme("system")} 
              className="flex flex-col items-center gap-2 group"
            >
              <div className={clsx(
                "h-[72px] w-[104px] rounded-xl border p-1.5 transition-all",
                theme === "system" 
                  ? "border-purple-600 bg-purple-50 dark:border-purple-500/50 dark:shadow-[0_0_15px_rgba(168,85,247,0.1)] dark:bg-[#1C1C1C]" 
                  : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-white/5 dark:bg-[#1C1C1C] dark:group-hover:border-white/20"
              )}>
                <div className="h-full w-full rounded-lg border border-zinc-300 dark:border-white/10 flex overflow-hidden relative">
                  <div className="w-1/2 h-full bg-white dark:bg-[#E5E5E5] p-2.5 flex flex-col gap-1.5 border-r border-zinc-200 dark:border-zinc-300">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-400/50" />
                      <div className="h-1.5 w-6 rounded bg-zinc-200 dark:bg-zinc-300" />
                    </div>
                  </div>
                  <div className="w-1/2 h-full bg-zinc-900 dark:bg-[#0A0A0A] p-2.5 flex flex-col gap-1.5 items-end justify-end">
                     <div className="h-2.5 w-2.5 rounded-full bg-purple-500 dark:bg-sky-500 relative -right-1" />
                  </div>
                </div>
              </div>
              <span className={clsx("text-[12px] font-medium transition-colors", theme === "system" ? "text-zinc-900 dark:text-zinc-200" : "text-zinc-500")}>
                System
              </span>
            </button>

          </div>
        </div>
      </div>

      {/* PREFERENCES SECTION */}
      <h1 className="mb-6 text-[18px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">
        Preferences
      </h1>
      
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex items-center justify-between">
          <div className="flex flex-col max-w-[80%]">
            <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 transition-colors">Autosuggest</span>
            <span className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400 transition-colors">Enable dropdown and tab-complete suggestions</span>
          </div>
          <button 
            onClick={() => updateSetting("autosuggest", !autosuggest)}
            className={clsx(
              "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
              autosuggest ? "bg-purple-500" : "bg-zinc-300 dark:bg-zinc-700"
            )}
          >
            <span className={clsx(
              "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition shadow-sm",
              autosuggest ? "translate-x-4" : "translate-x-1"
            )} />
          </button>
        </div>
      </div>

    </div>
  );
}