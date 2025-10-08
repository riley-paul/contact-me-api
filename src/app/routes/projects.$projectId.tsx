import { Button, Heading, Separator, Skeleton } from "@radix-ui/themes";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
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
    await Promise.all([
      context.queryClient.ensureQueryData(qProject(params.projectId)),
      context.queryClient.ensureQueryData(qMessages(params.projectId)),
    ]);
  },
});

function RouteComponent() {
  const { projectId } = Route.useParams();

  const { data: project } = useSuspenseQuery(qProject(projectId));
  const { data: messages, isLoading: messagesLoading } = useQuery(
    qMessages(projectId),
  );

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
      <section className="flex-1 overflow-auto p-6">
        <div className="grid gap-4">
          <Heading as="h2" size="4">
            Messages •{" "}
            <Skeleton loading={messagesLoading}>
              {messages?.length ?? "50"}
            </Skeleton>
          </Heading>
          <Skeleton loading={messagesLoading}>
            <MessageTable messages={messages ?? []} className="h-[500px]" />
          </Skeleton>
        </div>
      </section>
    </article>
  );
}
