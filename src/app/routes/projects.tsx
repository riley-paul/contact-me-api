import {
  Button,
  Heading,
  IconButton,
  ScrollArea,
  Separator,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PlusIcon, SearchIcon } from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between px-6">
        <Heading as="h2" size="4">
          Projects
        </Heading>
        <section className="flex items-center gap-2">
          <IconButton variant="soft">
            <SearchIcon className="size-4" />
          </IconButton>
          <Button variant="solid">
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
