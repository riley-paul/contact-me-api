import { CornerDownLeftIcon, SearchIcon, XIcon } from "lucide-react";
import React from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  ButtonGroup,
} from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

type Props = { search: string | undefined; pathname: string };

const SearchBar: React.FC<Props> = ({ search, pathname }) => {
  return (
    <form>
      <ButtonGroup>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            name="search"
            placeholder="Search..."
            defaultValue={search}
          />
          <InputGroupAddon align="inline-end">
            {search && (
              <InputGroupButton type="reset" asChild>
                <a href={pathname}>
                  <XIcon className="size-3" />
                </a>
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
        <Button type="submit" variant="outline">
          <CornerDownLeftIcon className="size-4" />
        </Button>
      </ButtonGroup>
      <input type="submit" hidden />
    </form>
  );
};

export default SearchBar;
