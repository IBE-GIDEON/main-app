import SidebarContainer from "@/components/SidebarContainer";

export default function DiscoverLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FCFBF8] text-zinc-900 transition-colors duration-300 dark:bg-[#09090B] dark:text-white">
      <SidebarContainer />
      <div className="flex min-w-0 flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
