import { Button, ScrollArea, Separator, TextField } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { qProjects } from "@/app/queries";
import ProjectListItem from "./project-list-item";

const ProjectList: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounceValue(searchValue, 300);

  const { data: projects = [], isLoading } = useQuery(
    qProjects(debouncedSearch),
  );

  return (
    <aside className="flex w-[300px] shrink-0 flex-col">
      <header className="h-14">
        <TextField.Root
          size="3"
          radius="none"
          variant="soft"
          className="h-full bg-transparent outline-none"
          placeholder="Search projects..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        >
          <TextField.Slot side="left">
            <SearchIcon className="text-accent-10 size-4" />
          </TextField.Slot>
        </TextField.Root>
      </header>
      <Separator size="4" />
      <section className="flex-1 overflow-auto">
        <ScrollArea>
          <ul className="flex flex-col gap-1 overflow-auto p-3">
            {projects.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </ul>
        </ScrollArea>
      </section>
      <Separator size="4" />
      <footer className="grid p-3">
        <Button variant="surface">
          <PlusIcon className="size-4" />
          New Project
        </Button>
      </footer>
    </aside>
  );
};

export default ProjectList;
