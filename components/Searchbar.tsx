// /components/ZenSearchBar.tsx
import { useState, useRef, useEffect } from "react";
import { Paperclip, Search, Send } from "lucide-react";
import Micbutton from "@/components/Micbutton";

type SearchbarProps = {
  onMicClick: () => void;
  onSubmit?: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
};

export default function Searchbar({
  onMicClick,
  onSubmit,
  inputRef,
}: SearchbarProps) {
  const [input, setInput] = useState("");
  const localRef = useRef<HTMLTextAreaElement>(null);

  const textareaRef = inputRef ?? localRef;
  const hasText = input.trim().length > 0;

  // Auto-resize textarea (unchanged behavior)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + "px";
    }
  }, [input, textareaRef]);

  const handleSubmit = () => {
    if (!hasText) return;
    onSubmit?.();
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Glassmorphic Search Bar */}
      <div className="group relative flex items-end rounded-3xl bg-white/8 backdrop-blur-2xl border border-white/20 transition-all duration-500 hover:bg-white/12 hover:shadow-3xl">

        {/* Attachment Button */}
        <button className="p-4 text-white/70 hover:text-white transition-colors">
          <Paperclip size={22} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="What can Zen do for you?"
          rows={1}
          className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none text-base md:text-lg py-3 px-2 resize-none overflow-y-auto max-h-40 scrollbar-none transition-all duration-300 ease-in-out"
          style={{ scrollbarWidth: "none" }}
        />

        {/* Voice Button */}
        <Micbutton onClick={onMicClick} />

        {/* Send / Search Button */}
        <button
          onClick={handleSubmit}
          className={`ml-2 mr-1 mb-1 p-3 rounded-full transition-all duration-500 flex items-center justify-center ${
            hasText
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
              : "bg-white/20 hover:bg-white/30"
          }`}
        >
          {hasText ? (
            <Send size={22} className="text-white" />
          ) : (
            <Search size={22} className="text-white/80" />
          )}
        </button>
      </div>
      </div>
  );
}
