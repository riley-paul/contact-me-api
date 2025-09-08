import { Heading, IconButton, Separator, Tooltip } from "@radix-ui/themes";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

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
        <Tooltip content="New Project" side="left">
          <IconButton variant="surface" radius="full">
            <PlusIcon className="size-4" />
          </IconButton>
        </Tooltip>
      </header>
      <Separator size="4" />
      <Outlet />
    </div>
  );
}
