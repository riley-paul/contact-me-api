import { Button, IconButton, TextField } from "@radix-ui/themes";
import { CornerDownLeftIcon, SearchIcon, XIcon } from "lucide-react";
import React from "react";

type Props = { search: string | undefined; pathname: string };

const SearchBar: React.FC<Props> = ({ search, pathname }) => {
  return (
    <form>
      <TextField.Root
        name="search"
        placeholder="Search..."
        defaultValue={search}
      >
        <TextField.Slot side="left">
          <SearchIcon className="size-4" />
        </TextField.Slot>
        <TextField.Slot side="right">
          {search && (
            <IconButton
              type="reset"
              size="1"
              variant="ghost"
              color="red"
              radius="full"
              asChild
            >
              <a href={pathname}>
                <XIcon className="size-3" />
              </a>
            </IconButton>
          )}
          <IconButton type="submit" size="1" variant="ghost">
            <CornerDownLeftIcon className="size-4" />
          </IconButton>
        </TextField.Slot>
      </TextField.Root>
      <input type="submit" hidden />
    </form>
  );
};

export default SearchBar;
