"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Paperclip, Search, Send, Loader2 } from "lucide-react";
import Micbutton from "@/components/Micbutton";

/* ================= TYPES ================= */

type SearchbarProps = {
  onMicClick: () => void;
  onResult: (text: string) => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  isLoading?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
};

/* ================= COMPONENT ================= */

export default function ZenSearchBar({
  onMicClick,
  onResult,
  inputRef,
  isLoading = false,
  autoFocus = true,
  maxLength = 4000,
}: SearchbarProps) {
  const [input, setInput] = useState("");

  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? localRef;

  const hasText = useMemo(() => input.trim().length > 0, [input]);

  /* ================= AUTO RESIZE ================= */

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "24px"; // Base height for one line
    const nextHeight = Math.min(el.scrollHeight, 160);
    el.style.height = `${nextHeight}px`;
  }, [textareaRef]);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  /* ================= AUTO FOCUS ================= */

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus, textareaRef]);

  /* ================= SUBMIT ================= */

  const handleSubmit = useCallback(() => {
    if (!hasText || isLoading) return;

    onResult(input.trim());
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }
  }, [hasText, isLoading, input, onResult, textareaRef]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.nativeEvent as any).isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-2">
      <div
        className={`
          group relative flex items-center rounded-[32px]
          border transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          min-h-[64px] px-2
          ${isLoading 
            ? "border-white/5 bg-white/[0.02] cursor-wait" 
            : "border-white/10 bg-white/5 backdrop-blur-3xl focus-within:border-white/20 focus-within:bg-white/[0.07] shadow-2xl"
          }
        `}
      >
        {/* Paperclip - Centered Vertically */}
        <div className="flex items-center justify-center shrink-0 w-12 h-12">
          <button
            type="button"
            aria-label="Attach file"
            disabled={isLoading}
            className="text-white/40 hover:text-white transition-colors disabled:opacity-10"
          >
            <Paperclip size={20} />
          </button>
        </div>

        {/* Input Field - Flex-1 to take space */}
        <div className="flex-1 flex items-center py-4">
          <textarea
            ref={textareaRef}
            value={input}
            disabled={isLoading}
            maxLength={maxLength}
            rows={1}
            placeholder={isLoading ? "Analyzing..." : "What are we thinking through?"}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="
              w-full
              bg-transparent
              text-white
              placeholder:text-white/30
              outline-none
              resize-none
              overflow-y-auto
              scrollbar-none
              text-[16px] md:text-[17px]
              leading-[24px]
              max-h-[160px]
              disabled:opacity-50
            "
          />
        </div>

        {/* Right Side Actions - Flex group centered vertically */}
        <div className="flex items-center gap-1 shrink-0 ml-2 mr-1">
          <Micbutton
            onClick={onMicClick}
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasText || isLoading}
            className={`
              flex items-center justify-center
              w-10 h-10 rounded-full
              transition-all duration-500
              ${
                hasText && !isLoading
                  ? "bg-white text-black scale-100 hover:scale-105 active:scale-95 shadow-xl"
                  : "bg-white/5 text-white/20 scale-90"
              }
            `}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : hasText ? (
              <Send size={18} strokeWidth={2.5} />
            ) : (
              <Search size={18} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Counter - Clean and minimal */}
      {input.length > 50 && (
         <div className="mt-2 text-[10px] uppercase tracking-tighter text-white/10 text-right px-6">
            Refinement Scope: {input.length} / {maxLength}
         </div>
      )}
    </div>
  );
}