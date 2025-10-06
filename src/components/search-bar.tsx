import { IconButton, TextField } from "@radix-ui/themes";
import { SearchIcon, XIcon } from "lucide-react";
import React from "react";
import { useDebounceCallback, useIsClient } from "usehooks-ts";

const SearchBar: React.FC = () => {
  const isClient = useIsClient();
  const getSearch = () => {
    if (!isClient) return undefined;
    const url = new URL(window.location.href);
    return url.searchParams.get("search") ?? undefined;
  };

  const search = getSearch();

  const setSearch = (search: string | undefined) => {
    const url = new URL(window.location.href);
    if (search && search.length > 0) {
      url.searchParams.set("search", search);
    } else {
      url.searchParams.delete("search");
    }
    window.location.href = url.toString();
  };

  const handleSearch = useDebounceCallback(setSearch, 500);

  return (
    <TextField.Root
      ref={(el) => {
        if (search && el) {
          el.focus();
          const length = el.value.length;
          el.setSelectionRange(length, length);
        }
      }}
      placeholder="Search..."
      defaultValue={search}
      onChange={(e) => handleSearch(e.target.value)}
    >
      <TextField.Slot side="left">
        <SearchIcon className="size-4" />
      </TextField.Slot>
      {search && (
        <TextField.Slot side="right">
          <IconButton
            size="1"
            variant="soft"
            color="red"
            radius="full"
            onClick={() => setSearch(undefined)}
          >
            <XIcon className="size-3" />
          </IconButton>
        </TextField.Slot>
      )}
    </TextField.Root>
  );
};

export default SearchBar;
