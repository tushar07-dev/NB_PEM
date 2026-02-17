import SearchInput, { type ISearchInput } from "@/shared/components/ui/search-input";
import { useState } from "react";

const DataTableSearchInput = ({
  handleSearchClick,
  ...props
}: Omit<ISearchInput, "handleSearchClick"> & {
  handleSearchClick: (searchValue: string) => void;
}) => {
  const [search, setSearch] = useState("");
  return (
    <SearchInput
      onClear={() => {
        setSearch("");
        handleSearchClick("");
      }}
      onChange={(e) => setSearch(e.target.value)}
      value={search}
      handleSearchClick={() => handleSearchClick(search)}
      className="h-8"
      {...props}
    />
  );
};

export default DataTableSearchInput;
