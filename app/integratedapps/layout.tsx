import type { CSSProperties } from "react";

import SidebarContainer from "@/components/SidebarContainer";

const conditionsShellStyle = {
  "--app-shell-bg": "#FCFBF8",
  "--app-shell-bg-dark": "#09090B",
} as CSSProperties;

export default function ConditionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="app-shell flex w-full text-zinc-900 transition-colors duration-300 dark:text-white"
      style={conditionsShellStyle}
    >
      <SidebarContainer />
      <div className="app-shell-main flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
