import type { CSSProperties } from "react";

import SidebarContainer from "@/components/SidebarContainer";

const insightsShellStyle = {
  "--app-shell-bg": "#F6F4EE",
  "--app-shell-bg-dark": "#0A0A0A",
} as CSSProperties;

export default function InsightsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="app-shell flex w-full text-zinc-900 transition-colors duration-300 dark:text-white"
      style={insightsShellStyle}
    >
      <SidebarContainer />
      <div className="app-shell-main flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
