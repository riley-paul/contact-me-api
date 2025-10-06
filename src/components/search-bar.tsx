import { IconButton, TextField } from "@radix-ui/themes";
import { SearchIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  search: string | undefined;
  setSearch: (search: string | undefined) => void;
};

const SearchBar: React.FC<Props> = ({ search, setSearch }) => {
  const [value, setValue] = useState(search);

  useEffect(() => {
    setValue(search);
  }, [search]);

  const handleClose = () => {
    setSearch(undefined);
    setValue(undefined);
  };

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
      value={value ?? ""}
      onChange={(e) => {
        setValue(e.target.value);
        setSearch(e.target.value);
      }}
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
            onClick={handleClose}
          >
            <XIcon className="size-3" />
          </IconButton>
        </TextField.Slot>
      )}
    </TextField.Root>
  );
};

export default SearchBar;
