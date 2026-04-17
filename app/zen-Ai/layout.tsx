import type { CSSProperties } from "react";

import SidebarContainer from "@/components/SidebarContainer";

const dataDeckShellStyle = {
  "--app-shell-bg": "#F3EFE6",
  "--app-shell-bg-dark": "#0A0A0A",
} as CSSProperties;

export default function DataDeckLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="app-shell flex w-full text-zinc-900 transition-colors duration-300 dark:text-white"
      style={dataDeckShellStyle}
    >
      <SidebarContainer />
      <div className="app-shell-main flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
