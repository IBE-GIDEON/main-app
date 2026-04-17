"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Search, X, MessageSquare, ArrowRight, Clock, Loader2 } from "lucide-react";

type ChatSession = {
  id: string;
  title: string;
  date: string;
  preview: string;
};

type AuditRecordResponse = {
  id?: string;
  record_id?: string;
  title?: string;
  query_preview?: string;
  date?: string;
  created_at?: string;
  preview?: string;
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatSearchDate(rawDate?: string) {
  if (!rawDate) return "Recent";

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) {
    return rawDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: parsed.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  }).format(parsed);
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [realDatabase, setRealDatabase] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isOpen) {
      document.body.style.overflow = "";
      setQuery("");
      return;
    }

    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const fetchRealHistory = async () => {
      setIsLoading(true);

      try {
        const companyId = localStorage.getItem("company_id") || "default-co";
        const response = await fetch(`http://localhost:8000/audit/${companyId}`, {
          headers: { "X-API-Key": "testkey123" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const data: AuditRecordResponse[] = await response.json();
        const formattedHistory = data.map((chat, index) => ({
          id: chat.id ?? chat.record_id ?? `record-${index}`,
          title: chat.title ?? chat.query_preview ?? "Untitled Decision",
          date: formatSearchDate(chat.date ?? chat.created_at),
          preview:
            chat.preview ??
            chat.query_preview ??
            "Click to review this decision engine output...",
        }));

        setRealDatabase(formattedHistory);
      } catch (error) {
        console.error("Could not load real history, falling back to empty list.", error);
        setRealDatabase([]);
      } finally {
        setIsLoading(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    void fetchRealHistory();

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, mounted, onClose]);

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? realDatabase.filter((chat) => {
        const title = chat.title.toLowerCase();
        const preview = chat.preview.toLowerCase();
        const date = chat.date.toLowerCase();

        return (
          title.includes(normalizedQuery) ||
          preview.includes(normalizedQuery) ||
          date.includes(normalizedQuery)
        );
      })
    : realDatabase;

  const handleSelectChat = (chatId: string) => {
    onClose();
    if (pathname === "/dashboard") {
      window.dispatchEvent(new CustomEvent("think-ai-load-record", { detail: chatId }));
      return;
    }

    localStorage.setItem("pending_record_id", chatId);
    router.push("/dashboard");
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && results[0]) {
      event.preventDefault();
      handleSelectChat(results[0].id);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[140]">
      <div
        className="absolute inset-0 bg-zinc-900/45 backdrop-blur-md transition-opacity animate-in fade-in duration-200 dark:bg-black/70"
        onClick={onClose}
      />

      <div className="relative flex min-h-full items-start justify-center px-3 py-4 sm:px-6 sm:py-8 md:items-center md:px-8">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-[26px] border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] animate-in fade-in zoom-in-95 duration-200 dark:border-white/10 dark:bg-[#121212] dark:shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
        >
          <div className="border-b border-zinc-100 dark:border-white/5">
            <div className="flex items-start gap-3 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                <Search className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  id={titleId}
                  className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500"
                >
                  Workspace Search
                </p>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search past decisions, chats, or topics..."
                  className="mt-1 w-full border-none bg-transparent pr-2 text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400 sm:text-[16px] dark:text-white dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-purple-500" />}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[min(78vh,42rem)] overflow-y-auto px-2 py-2 sm:px-3 sm:py-3">
            {results.length > 0 ? (
              <div className="space-y-1">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {normalizedQuery === ""
                    ? "Recent Decisions"
                    : `Found ${results.length} result${results.length !== 1 ? "s" : ""}`}
                </div>

                {results.map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => handleSelectChat(chat.id)}
                    className="group flex w-full items-start gap-3 rounded-2xl border border-transparent px-3 py-3 text-left transition-colors hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-white/10 dark:hover:bg-white/5 sm:px-4"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-100 bg-purple-50 dark:border-purple-500/20 dark:bg-purple-500/10">
                      <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <span className="line-clamp-2 break-words pr-2 text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
                          {chat.title}
                        </span>
                        <span className="flex shrink-0 items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                          <Clock className="h-3 w-3" />
                          {chat.date}
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-2 break-words pr-2 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {chat.preview}
                      </p>
                    </div>

                    <div className="mt-1 hidden shrink-0 text-purple-500 opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center text-zinc-500 dark:text-zinc-400 sm:px-6">
                {normalizedQuery === "" ? (
                  <>
                    <MessageSquare className="mx-auto mb-3 h-8 w-8 opacity-20" />
                    <p className="text-[14px]">No recent decisions found in this workspace.</p>
                  </>
                ) : (
                  <p className="break-words text-[14px]">
                    No results found for &quot;{query}&quot;
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-zinc-100 bg-zinc-50 px-4 py-3 text-[11px] text-zinc-500 dark:border-white/5 dark:bg-[#0A0A0A] dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-2">
              <span className="rounded border border-zinc-300 bg-zinc-200 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-zinc-400">
                ESC
              </span>
              <span>to close</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded border border-zinc-300 bg-zinc-200 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-zinc-400">
                ENTER
              </span>
              <span>to open the top result</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
