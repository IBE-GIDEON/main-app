import { Search } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

type SearchbarProps = {
  isCollapsed?: boolean;
};

export default function Searchbar({
  isCollapsed = false,
}: SearchbarProps) {

  const router = useRouter();

  const handleSearch = () => {
    // Navigate to search page or open search modal
    router.push("/search");
  };

  return (
    <button
      onClick={handleSearch}
      title={isCollapsed ? "Search" : ""}
      className={clsx(
        "flex items-center gap-2",
        isCollapsed ? "justify-center" : "justify-start",
        "px-3 ml-[10px]",
        "py-2",
        "rounded-lg",
        "cursor-pointer",
        "text-white/80",
        "border border-transparent",
        "bg-transparent",
        "transition-all duration-300 ease-out",
        "hover:bg-white/10",
        "hover:backdrop-blur-md",
        "hover:border-white/20",
        "hover:text-white",
        "hover:shadow-[0_8px_32px_rgba(255,255,255,0.08)]",
        "active:scale-[0.98]"
        
      )}
    >

      {/* Search Icon */}
      <Search size={20} className="text-white/90 shrink-0" />


    </button>
  );
}