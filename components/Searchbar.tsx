"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { 
  Plus, ChevronDown, Search, Send, Loader2, 
  Plug, FileText, Image as ImageIcon, Database, 
  Zap, Sparkles, Check, ArrowRight
} from "lucide-react";
import Micbutton from "@/components/Micbutton";
import clsx from 'clsx';

type SearchbarProps = {
  onMicClick: () => void;
  onResult: (text: string) => void;
  onDocumentUpload?: (files: File[]) => Promise<{ message?: string } | null>;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  isLoading?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
};

export default function ZenSearchBar({
  onMicClick,
  onResult,
  onDocumentUpload,
  inputRef,
  isLoading = false,
  autoFocus = true,
  maxLength = 4000,
}: SearchbarProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? localRef;
  const hasText = useMemo(() => input.trim().length > 0, [input]);

  // Hidden inputs to trigger the actual file selection dialogs
  const documentInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "28px"; 
    const nextHeight = Math.min(el.scrollHeight, 200);
    el.style.height = `${nextHeight}px`;
  }, [textareaRef]);

  useEffect(() => { adjustHeight(); }, [input, adjustHeight]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus, textareaRef]);

  const handleSubmit = useCallback(() => {
    if (!hasText || isLoading) return;
    onResult(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "28px";
    }
  }, [hasText, isLoading, input, onResult, textareaRef]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // --- NEW: FILE UPLOAD HANDLERS ---
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: "document" | "image") => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      if (type === "image") {
        setUploadMessage("Image uploads are coming next. Financial documents are live now.");
        return;
      }

      if (!onDocumentUpload) {
        setUploadMessage("Document uploads are not configured in this view yet.");
        return;
      }

      setUploading(true);
      const result = await onDocumentUpload(files);
      setUploadMessage(result?.message || `Uploaded ${files.length} document(s) into finance context.`);
    } catch {
      setUploadMessage("Document upload failed. Check your backend connection and try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
      window.setTimeout(() => setUploadMessage(null), 5000);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-2 sm:px-4">
      
      {/* HIDDEN FILE INPUTS */}
      <input 
        type="file" 
        ref={documentInputRef} 
        className="hidden" 
        accept=".pdf,.txt,.csv,.md,.json" 
        multiple
        onChange={(e) => handleFileSelect(e, "document")} 
      />
      <input 
        type="file" 
        ref={imageInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => handleFileSelect(e, "image")} 
      />

      <div
        className={`
          flex flex-col relative rounded-[2.5rem] p-2
          border transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu
          ${isLoading || uploading
            ? "border-zinc-200 bg-zinc-50 dark:border-white/5 dark:bg-[#1A1A1A] cursor-wait"
            : "bg-white border-zinc-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 focus-within:shadow-[0_15px_40px_rgb(0,0,0,0.12)] focus-within:-translate-y-1 focus-within:border-zinc-300 dark:border-transparent dark:bg-[#1E1E1E] dark:hover:-translate-y-0 dark:focus-within:-translate-y-0 dark:focus-within:border-white/10 dark:focus-within:bg-[#252525] dark:shadow-2xl"
          }
        `}
      >
        {/* Top Section: Input */}
        <div className="px-4 pt-4 pb-2 sm:px-5">
          <textarea
            ref={textareaRef}
            value={input}
            disabled={isLoading || uploading}
            maxLength={maxLength}
            rows={1}
            placeholder={isLoading ? "Analyzing..." : uploading ? "Loading documents into context..." : "Ask Three ..."}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="
              w-full bg-transparent text-zinc-900 dark:text-white
              placeholder:text-zinc-400 dark:placeholder:text-zinc-500 font-medium
              outline-none resize-none overflow-y-auto scrollbar-none
              text-[15px] sm:text-[16px] md:text-[17px] leading-[26px] sm:leading-[28px] tracking-wide
              max-h-[200px] min-h-[28px] disabled:opacity-50 transition-colors
            "
          />
        </div>

        {/* Bottom Section: Tools & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 px-2 pb-1">
          
          {/* Left Side: Attachments & Connect Apps */}
          <div className="flex min-w-0 items-center gap-1">
            
            {/* THE PLUS DROPDOWN */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  disabled={isLoading || uploading}
                  className="shrink-0 rounded-full p-2.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50 outline-none dark:hover:bg-white/10 dark:hover:text-zinc-100"
                >
                  <Plus size={22} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="start"
                  sideOffset={12}
                  className="z-50 w-48 overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-1.5 shadow-xl dark:shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                >
                  <DropdownMenu.Item 
                    onSelect={() => documentInputRef.current?.click()}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10"
                  >
                    <FileText size={16} className="text-zinc-400 dark:text-zinc-500" />
                    Upload Document
                  </DropdownMenu.Item>
                  <DropdownMenu.Item 
                    onSelect={() => imageInputRef.current?.click()}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10"
                  >
                    <ImageIcon size={16} className="text-zinc-400 dark:text-zinc-500" />
                    Upload Image
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 h-px bg-zinc-100 dark:bg-white/10 mx-1" />
                  <DropdownMenu.Item 
                    onSelect={() => router.push("/dashin/connectors")}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-zinc-100 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10"
                  >
                    <Database size={16} className="text-zinc-400 dark:text-zinc-500" />
                    Connect Database
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* CONNECT APPS BUTTON */}
            <button
              type="button"
              onClick={() => router.push("/dashin/connectors")}
              disabled={isLoading || uploading}
              className="flex min-w-0 items-center gap-2 rounded-full px-2.5 py-2 text-[12px] font-medium text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50 sm:px-3 sm:text-[13px] dark:hover:bg-white/10 dark:hover:text-zinc-100"
            >
              <Plug size={16} className="text-zinc-400 dark:text-zinc-400" />
              <span className="truncate">Connect Apps</span>
            </button>
          </div>

          {/* Right Side: Mode, Mic, and Send */}
          <div className="ml-auto flex w-full items-center justify-end gap-1 sm:w-auto">
            
            {/* UPGRADE PLANS DROPDOWN */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  disabled={isLoading || uploading}
                  className={clsx(
                    "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-xl p-2 cursor-pointer outline-none",
                    "font-semibold text-[13px] text-white",
                    "bg-gradient-to-r from-[#b372ce] to-[#5b8def] shadow-[0_0_15px_rgba(179,114,206,0.25)] hover:shadow-[0_0_10px_rgba(179,114,206,0.4)]",
                    "transition-all duration-300 ease-out active:scale-[0.98]"
                  )}
                >
                  Upgrade<ChevronDown size={16} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={12}
                  className="z-50 w-56 overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-1.5 shadow-xl dark:shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                >
                  <div className="px-2 py-1.5 mb-1">
                    <span className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">Three AI Plans</span>
                  </div>
                  
                  <DropdownMenu.Item className="flex cursor-default items-center justify-between rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-white/5 outline-none mb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 flex justify-center"><Check size={14} className="text-purple-500" /></div>
                      Free Plan
                    </div>
                    <span className="text-[10px] text-zinc-500 font-normal">Current</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item 
                    onSelect={() => router.push("/dashin/upgrade")}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 outline-none transition-colors hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-500/10 dark:hover:text-purple-300 focus:bg-purple-50 dark:focus:bg-purple-500/10 group"
                  >
                    <div className="w-4 flex justify-center"><Zap size={14} className="text-zinc-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" /></div>
                    MVP Plan
                  </DropdownMenu.Item>

                  {/* THE FIX: Pro Plan is now completely disabled and faded out */}
                  <DropdownMenu.Item 
                    disabled
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-400 dark:text-zinc-600 outline-none cursor-not-allowed"
                  >
                    <div className="w-4 flex justify-center"><Sparkles size={14} /></div>
                    Pro Plan (Coming Soon)
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="my-1 h-px bg-zinc-100 dark:bg-white/10 mx-1" />

                  {/* THE FIX: Routes directly to the anchor link on the pricing page */}
                  <DropdownMenu.Item 
                    onSelect={() => router.push("/pricing#compare")}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 outline-none transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 focus:bg-zinc-100 dark:focus:bg-white/10"
                  >
                    Compare all features
                    <ArrowRight size={14} />
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            
            <Micbutton onClick={onMicClick} disabled={isLoading || uploading} />
            
            {/* The Send Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!hasText || isLoading || uploading}
              className={`
                flex items-center justify-center w-20 h-10 rounded-full ml-1
                transition-all duration-500
                ${hasText && !isLoading
                  ? "bg-zinc-900 text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:bg-white dark:text-black scale-100 hover:scale-105 active:scale-95 dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "bg-transparent text-zinc-400 dark:text-zinc-600 scale-90"
                }
              `}
            >
              {isLoading || uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : hasText ? (
                <Send size={18} strokeWidth={2.5} className="ml-0.5" /> 
              ) : (
                <Search size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
          
        </div>
      </div>

      {input.length > 50 && (
        <div className="mt-2 text-[10px] uppercase tracking-tighter text-zinc-400 dark:text-white/20 text-right px-6 transition-colors">
          Refinement Scope: {input.length} / {maxLength}
        </div>
      )}

      {uploadMessage && (
        <div className="mt-3 px-5 py-3 rounded-2xl border border-sky-200 dark:border-sky-500/20 bg-sky-50/80 dark:bg-sky-950/10 text-sky-800 dark:text-sky-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-500 dark:text-sky-300/80 mb-1">
            Document Context
          </p>
          <p className="text-[13px] leading-relaxed">{uploadMessage}</p>
        </div>
      )}
    </div>
  );
}
