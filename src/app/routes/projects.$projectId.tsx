import { Button, Heading, Separator } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { qMessages, qProject } from "../queries";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import MessageTable from "../components/messages/message-table";

export const Route = createFileRoute("/projects/$projectId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const [project, messages] = await Promise.all([
      context.queryClient.ensureQueryData(qProject(params.projectId)),
      context.queryClient.ensureQueryData(qMessages(params.projectId)),
    ]);
    return { project, messages };
  },
});

function RouteComponent() {
  const { projectId } = Route.useParams();

  const { data: project } = useSuspenseQuery(qProject(projectId));
  const { data: messages } = useSuspenseQuery(qMessages(projectId));

  return (
    <article className="flex h-screen flex-1 flex-col">
      <header className="flex h-14 items-center justify-between px-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/projects">Projects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section className="flex gap-2">
          <Button>Delete</Button>
          <Button>Edit</Button>
        </section>
      </header>
      <Separator size="4" />
      <section className="flex flex-1 flex-col gap-8 overflow-auto p-6">
        <Heading as="h1" size="7">
          {project.name}
        </Heading>

        <div className="grid gap-4">
          <Heading as="h2" size="4">
            Messages • {project.messageCount}
          </Heading>
          <MessageTable messages={messages} className="h-[500px]" />
        </div>
      </section>
    </article>
  );
}
