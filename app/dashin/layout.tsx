import SettingsSidebar from "@/components/SettingsSidebar";

export default function DashinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#0A0A0A] text-zinc-900 dark:text-white transition-colors duration-300 overflow-hidden">
      
      {/* Sidebar Area */}
      <div className="w-[260px] shrink-0 border-r border-zinc-200 dark:border-white/5 hidden md:block transition-colors duration-300 bg-white dark:bg-[#0A0A0A]">
        <SettingsSidebar />
      </div>
      
      {/* Main Content Area - This is where the magic happens for Light Mode */}
      <main className="flex-1 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] p-6 md:p-10 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}