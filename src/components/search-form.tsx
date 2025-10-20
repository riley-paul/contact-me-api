import { Button, IconButton, TextField } from "@radix-ui/themes";
import { SearchIcon, XIcon } from "lucide-react";
import React from "react";

type Props = { search: string | undefined; url: URL };

const SearchForm: React.FC<Props> = ({ search, url }) => {
  return (
    <form className="flex gap-2">
      <TextField.Root
        variant="soft"
        name="search"
        defaultValue={search ?? ""}
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
              asChild
            >
              <a href={url.pathname}>
                <XIcon className="text-red-10 size-4" />
              </a>
            </IconButton>
          </TextField.Slot>
        )}
      </TextField.Root>
      <input type="submit" hidden />
    </form>
  );
};

export default SearchForm;
