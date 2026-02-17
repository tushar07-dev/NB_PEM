import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export interface ISearchInput extends React.InputHTMLAttributes<HTMLInputElement> {
  handleSearchClick?: () => void;
  onClear?: () => void;
}

const SearchInput = ({
  handleSearchClick,
  onClear,
  ...props
}: ISearchInput) => {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearchClick?.();
    }
  }
  const showClearButton = !!props.value;
  return (
    <div className={cn("relative h-9", props.className)}>
      <Search
        onClick={handleSearchClick}
        className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform"
      />
      <input
        {...props}
        value={props.value}
        placeholder={props.placeholder ?? "Search"}
        onKeyDown={handleKeyDown}
        className="border-input-border file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-full w-full border bg-transparent px-3 py-1 pl-8 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
      {showClearButton && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transform"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
