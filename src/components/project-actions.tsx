import { Button } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import React from "react";
import SearchBar from "./search-bar";
import { useDebounceCallback } from "usehooks-ts";

type Props = {
  search: string | undefined;
};

const ProjectActions: React.FC<Props> = ({ search }) => {
  const navigateToSearch = (search: string | undefined) => {
    const url = new URL(window.location.href);
    if (search) {
      url.searchParams.set("search", search);
    } else {
      url.searchParams.delete("search");
    }
    window.location.href = url.toString();
  };

  const handleSearch = useDebounceCallback(navigateToSearch, 500);

  return (
    <div className="flex items-center gap-3">
      <SearchBar search={search} setSearch={handleSearch} />
      <Button asChild variant="surface">
        <a href="/projects/add">
          <PlusIcon className="size-4" />
          Add Project
        </a>
      </Button>
    </div>
  );
};

export default ProjectActions;
