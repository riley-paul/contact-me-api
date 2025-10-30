import { IconButton, TextField } from "@radix-ui/themes";
import { SearchIcon, XIcon } from "lucide-react";
import React, { useState } from "react";

type Props = {
  search: string | undefined;
  setSearch: (value: string | undefined) => void;
};

const SearchForm: React.FC<Props> = ({ search, setSearch }) => {
  const [value, setValue] = useState(search ?? "");

  return (
    <TextField.Root
      variant="surface"
      name="search"
      value={value}
      onChange={(e) => {
        const { value } = e.target;
        setValue(value);
        setSearch(value.length > 0 ? value : undefined);
      }}
      placeholder="Search..."
    >
      <TextField.Slot side="left">
        <SearchIcon className="text-accent-10 size-4" />
      </TextField.Slot>
      {search && (
        <TextField.Slot side="right">
          <IconButton
            color="red"
            variant="ghost"
            radius="full"
            size="1"
            onClick={() => {
              setValue("");
              setSearch(undefined);
            }}
          >
            <XIcon className="size-4" />
          </IconButton>
        </TextField.Slot>
      )}
    </TextField.Root>
  );
};

export default SearchForm;
