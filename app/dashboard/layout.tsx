"use client";

import Aicontentspace from "@/components/Aicontentspace";
import Searchbar from "@/components/Searchbar";
import SidebarContainer from "@/components/SidebarContainer";
import { useChat } from "@/hooks/useChat";
import { useOnboarding } from "@/hooks/useOnboarding";
import clsx from "clsx";

export default function ChatLayout() {
  useOnboarding();

  const { messages, loading, send, uploadDocuments } = useChat();
  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen w-full overflow-hidden text-zinc-900 dark:text-white relative bg-[#FDFCF8] dark:bg-[#0A0A0A] transition-colors duration-300">
      
      <SidebarContainer />

      <div className="flex flex-col flex-1 min-w-0 h-full relative z-10">

        {/* Top bar */}
        <div className="flex-none flex items-center justify-between px-6 py-4">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-white/30 font-medium transition-colors">
            <span className="opacity-40"></span>
          </div>

          {/* Right side buttons (Share & More) have been removed for a cleaner enterprise UI */}
        </div>

        {/* THE ENTERPRISE LAYOUT SHIFT */}
        {hasMessages && (
          <div className="flex-1 min-h-0 w-full animate-in fade-in duration-500 ease-out">
            <Aicontentspace
              messages={messages}
              isTyping={loading}
              onSpawnQuestion={(q) => send(q)}
            />
          </div>
        )}

        {/* Searchbar & Hero Area */}
        <div 
          className={clsx(
            "w-full transition-all duration-500 ease-in-out flex flex-col items-center",
            hasMessages ? "flex-none pb-4 pt-0" : "flex-1 justify-center pb-20"
          )}
        >
          {/* Hero Text */}
          {!hasMessages && (
            <div className="flex flex-col items-center mb-8 transform transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-4 text-center">
              <h1 className="text-4xl md:text-5xl font-semibold text-zinc-900 dark:text-white mb-3 tracking-tight transition-colors">
                Hi,
              </h1>
              <p className="text-lg text-zinc-500 dark:text-white/40 tracking-wide font-medium transition-colors">
                Let&apos;s start making those decisions.
              </p>
            </div>
          )}

          {/* Searchbar Container */}
          <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
            <Searchbar
              isLoading={loading}
              onMicClick={() => void 0}
              onDocumentUpload={uploadDocuments}
              onResult={(text) => {
                send(text);
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
