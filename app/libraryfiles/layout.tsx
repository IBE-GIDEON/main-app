import SidebarContainer from "@/components/SidebarContainer";

export default function InsightsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F6F4EE] text-zinc-900 transition-colors duration-300 dark:bg-[#0A0A0A] dark:text-white">
      <SidebarContainer />
      <div className="flex min-w-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
