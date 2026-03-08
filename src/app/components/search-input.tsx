import { SearchIcon, XIcon } from "lucide-react";
import React, { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/app/components/ui/input-group";

type Props = {
  search: string | undefined;
  setSearch: (value: string | undefined) => void;
};

const SearchInput: React.FC<Props> = ({ search, setSearch }) => {
  const [value, setValue] = useState(search ?? "");

  return (
    <InputGroup>
      <InputGroupInput
        name="search"
        value={value}
        onChange={(e) => {
          const { value } = e.target;
          setValue(value);
          setSearch(value.length > 0 ? value : undefined);
        }}
        placeholder="Search..."
      />
      <InputGroupAddon>
        <SearchIcon className="text-accent-10 size-4" />
      </InputGroupAddon>
      {search && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => {
              setValue("");
              setSearch(undefined);
            }}
          >
            <XIcon className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

export default SearchInput;
