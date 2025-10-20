import { TextField } from "@radix-ui/themes";
import { SearchIcon } from "lucide-react";
import React from "react";

type Props = { search: string | null };

const SearchForm: React.FC<Props> = ({ search }) => {
  return (
    <form>
      <TextField.Root name="search">
        <TextField.Slot side="left">
          <SearchIcon className="size-4" />
        </TextField.Slot>
      </TextField.Root>
    </form>
  );
};

export default SearchForm;
