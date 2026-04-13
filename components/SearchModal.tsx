"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, MessageSquare, ArrowRight, Clock, Loader2 } from "lucide-react";
import clsx from "clsx";

type ChatSession = {
  id: string;
  title: string;
  date: string;
  preview: string;
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ChatSession[]>([]);
  const [realDatabase, setRealDatabase] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- 1. HANDLE OPEN/CLOSE & FETCH REAL DATA ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
      
      // FETCH REAL CHAT HISTORY WHEN MODAL OPENS
      fetchRealHistory();
    } else {
      document.body.style.overflow = "unset";
      setQuery(""); 
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const fetchRealHistory = async () => {
    setIsLoading(true);
    try {
      const companyId = localStorage.getItem("company_id") || "default-co";
      
      // This assumes your backend has an endpoint to list all past chats. 
      // Update this URL if your endpoint is named something else!
      const res = await fetch(`http://localhost:8000/audit/${companyId}`, {
        headers: { "X-API-Key": "testkey123" }
      });
      
      if (!res.ok) throw new Error("Failed to fetch history");
      
      const data = await res.json();
      
      // Map your Python backend's response format to our UI format
      const formattedHistory: ChatSession[] = data.map((chat: any) => ({
        id: chat.id || chat.record_id,
        title: chat.title || chat.query_preview || "Untitled Decision",
        date: chat.date || chat.created_at || "Recent",
        preview: chat.preview || "Click to review this decision engine output...",
      }));

      setRealDatabase(formattedHistory);
    } catch (err) {
      console.error("Could not load real history, falling back to empty list.", err);
      setRealDatabase([]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. REAL-TIME SEARCH FILTER ---
  useEffect(() => {
    if (!query.trim()) {
      setResults(realDatabase); // Show all by default when open
      return;
    }

    const filtered = realDatabase.filter(
      (chat) =>
        chat.title.toLowerCase().includes(query.toLowerCase()) ||
        chat.preview.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, [query, realDatabase]);

  // --- 3. HANDLE NAVIGATION ---
  const handleSelectChat = (chatId: string) => {
    onClose();
    // This fires the exact event your useChat.ts is already listening for!
    window.dispatchEvent(new CustomEvent("think-ai-load-record", { detail: chatId }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4">
      
      {/* THE BACKDROP */}
      <div 
        className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* THE MODAL BOX */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121212] rounded-2xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[70vh]">
        
        {/* Search Input Area */}
        <div className="flex items-center px-4 py-4 border-b border-zinc-100 dark:border-white/5">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search past decisions, chats, or topics..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400"
          />
          {isLoading && <Loader2 className="w-4 h-4 text-purple-500 animate-spin mr-2" />}
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          {results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {query.trim() === "" ? "Recent Decisions" : `Found ${results.length} result${results.length !== 1 ? "s" : ""}`}
              </div>
              {results.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className="w-full text-left flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center border border-purple-100 dark:border-purple-500/20 shrink-0">
                    <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 truncate pr-4">
                        {chat.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> {chat.date}
                      </span>
                    </div>
                    <p className="text-[12px] text-zinc-500 dark:text-zinc-400 truncate">
                      {chat.preview}
                    </p>
                  </div>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-purple-500">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 text-center text-zinc-500 dark:text-zinc-400">
              {query.trim() === "" ? (
                <>
                  <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="text-[14px]">No recent decisions found in this workspace.</p>
                </>
              ) : (
                <p className="text-[14px]">No results found for "{query}"</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-zinc-50 dark:bg-[#0A0A0A] border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-white/10 shadow-sm">ESC</span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">to close</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-white/10 shadow-sm">↵</span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">to select</span>
          </div>
        </div>

      </div>
    </div>
  );
}