import { IconButton, TextField } from "@radix-ui/themes";
import { SearchIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useEventListener } from "usehooks-ts";

type Props = {
  search: string | undefined;
  setSearch: (search: string | undefined) => void;
};

const SearchBar: React.FC<Props> = ({ search, setSearch }) => {
  const [isSearching, setIsSearching] = useState(Boolean(search));
  const [value, setValue] = useState(search);

  useEffect(() => {
    setValue(search);
  }, [search]);

  const handleClose = () => {
    setIsSearching(false);
    setSearch(undefined);
    setValue(undefined);
  };

  useEventListener("keydown", (e) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsSearching(true);
    }
    if (e.key === "Escape") {
      handleClose();
    }
  });

  if (isSearching) {
    return (
      <TextField.Root
        autoFocus
        placeholder="Search..."
        value={value ?? ""}
        onChange={(e) => {
          setValue(e.target.value);
          setSearch(e.target.value);
        }}
      >
        <TextField.Slot side="left">
          <SearchIcon className="size-4" />
        </TextField.Slot>
        <TextField.Slot side="right">
          <IconButton
            size="1"
            variant="soft"
            color="gray"
            onClick={handleClose}
          >
            <XIcon className="size-3" />
          </IconButton>
        </TextField.Slot>
      </TextField.Root>
    );
  }

  return (
    <IconButton variant="soft" onClick={() => setIsSearching(true)}>
      <SearchIcon className="size-4" />
    </IconButton>
  );
};

export default SearchBar;
