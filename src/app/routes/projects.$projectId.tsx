import { Button, Separator } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { qProject } from "../queries";

export const Route = createFileRoute("/projects/$projectId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();

  const { data: project } = useSuspenseQuery(qProject(projectId));

  return (
    <div className="w-full">
      <header className="flex h-14 items-center justify-between px-6">
        <section>{project.name}</section>
        <section className="flex gap-2">
          <Button>Delete</Button>
          <Button>Edit</Button>
        </section>
      </header>
      <Separator size="4" />
    </div>
  );
}
