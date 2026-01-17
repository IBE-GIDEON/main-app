import { useState, useRef, useEffect } from "react";
import { Search, Send } from "lucide-react";

type SearchbarProps = {
  onSubmit?: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
};

export default function Searchbar({
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
      <div className=" w-[240px] group relative flex ml-48 mt-4 items-end rounded-3xl bg-white/8 backdrop-blur-2xl transition-all duration-500 hover:bg-white/12 hover:shadow-3xl">

 {/* Send / Search Button */}
        <button
          onClick={handleSubmit}
          className={`ml-2 mr-1 mb-1 p-3 rounded-full transition-all duration-500 flex items-center justify-center`}
        >
          {hasText ? (
            <Send size={22} className="text-white" />
          ) : (
            <Search size={22} className="text-white/80" />
          )}
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
          placeholder="Search flows"
          rows={1}
          className="flex-1 bg-black text-white placeholder:text-white/50 outline-none text-base md:text-lg py-3 px-2 resize-none overflow-y-auto max-h-20 scrollbar-none transition-all duration-300 ease-in-out"
          style={{ scrollbarWidth: "none" }}
        />

       
      </div>
      </div>
  );
}

