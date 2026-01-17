// components/Aicontentspace.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, ChevronDown } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AicontentspaceProps {
  messages: Message[];
  isTyping?: boolean;
}

export default function Aicontentspace({ messages, isTyping = false }: AicontentspaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showBackToBottom, setShowBackToBottom] = useState(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Detect if user has scrolled up (show button if >300px from bottom)
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom > 300) {
      setShowBackToBottom(true);
    } else {
      setShowBackToBottom(false);
    }
  };

  // Scroll smoothly to bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto h-full ">
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* Main Glass Panel */}
      <div className="relative flex-1 flex flex-col overflow-hidden bg-black/30 border border-white/50 rounded-xl">
      
      <div>
        {/* Scrollable Area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 p-6 overflow-y-auto scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`relative px-5 py-4 rounded-3xl ${
                      msg.role === "assistant"
                        ? "w-full whitespace-pre-wrap break-words bg-transparent border-none shadow-none"
                        : "max-w-xs md:max-w-md bg-black/200 border border-gray-400/40 shadow-lg"
                    }`}
                  >
                    {msg.role === "user" && (
                      <div className="absolute rounded-3xl opacity-60 blur-md -z-10 animate-pulse" />
                    )}

                    <div className="flex items-start gap-3">
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}

                      <div className="flex-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="text-white/90 leading-relaxed">{children}</p>
                            ),
                            a: ({ href, children }) => (
                              <a href={href} className="text-cyan-300 underline decoration-cyan-400/50">
                                {children}
                              </a>
                            ),
                            code: ({ children }) => (
                              <code className="px-2 py-1 bg-black/30 rounded-lg text-cyan-200 text-xs">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      {msg.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="px-5 py-4 bg-white/12 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg">
                    <div className="flex gap-2">
                      {[0, 0.2, 0.4].map((delay) => (
                        <motion.div
                          key={delay}
                          animate={{ y: [-4, -10, -4] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay }}
                          className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-40" />
          </div>
        </div>

        {/* Back to Bottom Button */}
        <AnimatePresence>
          {showBackToBottom && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToBottom}
              className="absolute bottom-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/20 transition-all"
            >
              <ChevronDown className="h-6 w-6 text-white/80" />
              {/* Subtle glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-30 blur-xl" />
            </motion.button>
          )}
        </AnimatePresence></div>
      </div>

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}