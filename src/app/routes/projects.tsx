import { Heading, Separator } from "@radix-ui/themes";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center px-6">
        <Heading as="h2" size="4">
          Projects
        </Heading>
      </header>
      <Separator size="4" />
      <Outlet />
    </div>
  );
}
