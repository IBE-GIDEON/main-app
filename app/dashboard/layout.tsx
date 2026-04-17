"use client";

import Aicontentspace from "@/components/Aicontentspace";
import Searchbar from "@/components/Searchbar";
import SidebarContainer from "@/components/SidebarContainer";
import { useChat } from "@/hooks/useChat";
import { useOnboarding } from "@/hooks/useOnboarding";
import clsx from "clsx";
import type { CSSProperties } from "react";

const dashboardShellStyle = {
  "--app-shell-bg": "#FDFCF8",
  "--app-shell-bg-dark": "#0A0A0A",
} as CSSProperties;

export default function ChatLayout() {
  useOnboarding();

  const { messages, loading, send, uploadDocuments } = useChat();
  const hasMessages = messages.length > 0;

  return (
    <div
      className="app-shell relative flex w-full text-zinc-900 transition-colors duration-300 dark:text-white"
      style={dashboardShellStyle}
    >
      
      <SidebarContainer />

      <div className="app-shell-main relative z-10 flex h-full flex-1 flex-col">

        {/* Top bar */}
        <div className="flex-none flex items-center justify-between px-4 py-4 sm:px-6">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-white/30 font-medium transition-colors">
            <span className="opacity-40"></span>
          </div>

          {/* Right side buttons (Share & More) have been removed for a cleaner enterprise UI */}
        </div>

        {/* THE ENTERPRISE LAYOUT SHIFT */}
        {hasMessages && (
          <div className="app-scroll-region flex-1 w-full animate-in fade-in duration-500 ease-out">
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
            hasMessages ? "flex-none pb-3 pt-0 sm:pb-4" : "flex-1 justify-center pb-16 sm:pb-20"
          )}
        >
          {/* Hero Text */}
          {!hasMessages && (
            <div className="mb-6 flex flex-col items-center px-4 text-center transform transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-4 sm:mb-8">
              <h1 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-900 transition-colors sm:text-4xl md:text-5xl dark:text-white">
                Hi,
              </h1>
              <p className="text-base font-medium tracking-wide text-zinc-500 transition-colors sm:text-lg dark:text-white/40">
                Let&apos;s start making those decisions.
              </p>
            </div>
          )}

          {/* Searchbar Container */}
          <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 md:px-8">
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
