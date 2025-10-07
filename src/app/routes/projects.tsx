import { Separator, TextField } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import ProjectList from "../components/project-list";

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-screen">
      <ProjectList />
      <Separator orientation="vertical" size="4" />
    </div>
  );
}
