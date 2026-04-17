import type { CSSProperties } from "react";

import SettingsSidebar from "@/components/SettingsSidebar";

const settingsShellStyle = {
  "--app-shell-bg": "#FFFFFF",
  "--app-shell-bg-dark": "#0A0A0A",
} as CSSProperties;

export default function DashinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="app-shell flex w-full overflow-hidden text-zinc-900 transition-colors duration-300 dark:text-white"
      style={settingsShellStyle}
    >
      
      {/* Sidebar Area */}
      <div className="w-[260px] shrink-0 border-r border-zinc-200 dark:border-white/5 hidden md:block transition-colors duration-300 bg-white dark:bg-[#0A0A0A]">
        <SettingsSidebar />
      </div>
      
      {/* Main Content Area - This is where the magic happens for Light Mode */}
      <main className="app-scroll-region flex-1 overflow-y-auto bg-[#FAFAFA] p-6 transition-colors duration-300 dark:bg-[#0A0A0A] md:p-10">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
