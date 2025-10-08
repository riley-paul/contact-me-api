import {
  Button,
  IconButton,
  ScrollArea,
  Separator,
  TextField,
} from "@radix-ui/themes";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import ProjectList from "@/app/components/projects/project-list";
import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebounceSearch] = useDebounceValue(
    searchValue,
    300,
  );

  const clearSearch = () => {
    setDebounceSearch("");
    setSearchValue("");
  };

  return (
    <div className="flex h-screen">
      <aside className="flex w-[300px] shrink-0 flex-col">
        <header className="h-14">
          <TextField.Root
            size="3"
            radius="none"
            variant="soft"
            className="h-full bg-transparent px-3 outline-none"
            placeholder="Search projects..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          >
            <TextField.Slot side="left">
              <SearchIcon className="text-accent-10 size-4" />
            </TextField.Slot>
            <TextField.Slot side="right">
              {searchValue && (
                <IconButton
                  onClick={clearSearch}
                  radius="full"
                  color="red"
                  variant="ghost"
                  size="1"
                >
                  <XIcon className="size-4" />
                </IconButton>
              )}
            </TextField.Slot>
          </TextField.Root>
        </header>
        <Separator size="4" />
        <section className="flex-1 overflow-auto">
          <ScrollArea>
            <ProjectList search={debouncedSearch} clearSearch={clearSearch} />
          </ScrollArea>
        </section>
        <Separator size="4" />
        <footer className="flex h-14 items-center justify-center px-3">
          <Button variant="surface" className="w-full">
            <PlusIcon className="size-4" />
            New Project
          </Button>
        </footer>
      </aside>
      <Separator orientation="vertical" size="4" />
      <Outlet />
    </div>
  );
}
