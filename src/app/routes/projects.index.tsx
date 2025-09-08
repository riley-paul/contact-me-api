import { createFileRoute } from "@tanstack/react-router";
import ProjectList from "../components/projects/project-list";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProjectList />;
}
