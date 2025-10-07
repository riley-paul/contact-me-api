import { Separator, Spinner, TextField } from "@radix-ui/themes";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { qProjects } from "../queries";

const ProjectList: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounceValue(searchValue, 300);

  const { data: projects = [], isLoading } = useQuery(
    qProjects(debouncedSearch),
  );

  return (
    <aside className="w-[250px]">
      <header className="h-14">
        <TextField.Root
          variant="soft"
          className="h-full bg-transparent"
          style={{ borderRadius: 0 }}
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
      <Spinner loading={isLoading}>
        <article>
          {projects.map((project) => (
            <div>{project.name}</div>
          ))}
        </article>
      </Spinner>
    </aside>
  );
};

export default ProjectList;
