import { Button, Heading, Separator } from "@radix-ui/themes";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import SearchBar from "../components/search-bar";
import { z } from "astro/zod";
import { useDebounceCallback } from "usehooks-ts";
import { useAtom } from "jotai/react";
import { projectEditorAtom } from "../components/project/project-editor.store";

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
  validateSearch: z.object({ search: z.string().optional() }),
});

function RouteComponent() {
  const { search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [_, dispatch] = useAtom(projectEditorAtom);

  const debouncedSetSearch = useDebounceCallback((search) =>
    navigate({ search: { search } }),
  );

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between px-6">
        <Heading as="h2" size="4">
          Projects
        </Heading>
        <section className="flex items-center gap-2">
          <SearchBar search={search} setSearch={debouncedSetSearch} />
          <Button variant="solid" onClick={() => dispatch({ type: "open" })}>
            <PlusIcon className="size-4" />
            Add Project
          </Button>
        </section>
      </header>
      <Separator size="4" />
      <div className="h-[calc(100vh-3.5rem-1px)] overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
