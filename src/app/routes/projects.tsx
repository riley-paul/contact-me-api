import { Separator, TextField } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-screen">
      <aside className="w-[250px]">
        <header className="h-14">
          <TextField.Root
            variant="soft"
            size="3"
            className="h-full bg-transparent"
            style={{ borderRadius: 0 }}
            placeholder="Search projects..."
          >
            <TextField.Slot side="left">
              <SearchIcon className="text-accent-10 size-4" />
            </TextField.Slot>
          </TextField.Root>
        </header>
        <Separator size="4" />
        <div>Projects List</div>
      </aside>
      <Separator orientation="vertical" size="4" />
    </div>
  );
}
