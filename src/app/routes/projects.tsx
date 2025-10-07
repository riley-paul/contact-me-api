import { Separator } from "@radix-ui/themes";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import ProjectList from "@/app/components/projects/project-list";

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-screen">
      <ProjectList />
      <Separator orientation="vertical" size="4" />
      <Outlet />
    </div>
  );
}
