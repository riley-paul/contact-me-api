import MessageTable from "@/app/components/message-table";
import ProjectEmailAdd from "@/app/components/project-email-add";
import ProjectEmailTable from "@/app/components/project-email-table";
import ProjectTags from "@/app/components/project-tags";
import SearchForm from "@/app/components/search-form";
import { Heading, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { actions } from "astro:actions";
import { z } from "astro:schema";
import React from "react";
import { useDebounceCallback } from "usehooks-ts";

export const Route = createFileRoute("/projects/$projectId")({
  component: RouteComponent,
  loaderDeps: ({ search: { search, page } }) => ({ search, page }),
  loader: async ({ params: { projectId }, deps: { search, page } }) => {
    const [project, messages] = await Promise.all([
      actions.projects.getOne.orThrow({ projectId }),
      actions.messages.getAll.orThrow({ projectId, search, page }),
    ]);
    return { project, messages };
  },
  validateSearch: z.object({
    search: z.string().optional(),
    page: z.number().optional(),
  }),
});

function RouteComponent() {
  const { project, messages } = Route.useLoaderData();
  const { search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const setSearch = useDebounceCallback((search: string | undefined) => {
    navigate({ to: ".", search: (old) => ({ ...old, search }) });
  });

  const setPage = (page: number) => {
    navigate({ search: (old) => ({ ...old, page }) });
  };

  return (
    <React.Fragment>
      <Heading size="8">{project.name}</Heading>
      <ProjectTags project={project} />
      <Text size="2" color="gray">
        {project.description}
      </Text>
      <section className="grid gap-4">
        <header className="flex items-center justify-between">
          <Heading as="h2">Emails</Heading>
          <ProjectEmailAdd projectId={project.id} />
        </header>
        <ProjectEmailTable projectEmails={project.emails} />
        <Text color="gray" size="2">
          Messages sent to this project will be forwarded to all of the emails
          above.
        </Text>
      </section>
      <section className="grid gap-4">
        <header className="flex items-center justify-between">
          <Heading>Messages</Heading>
          <SearchForm search={search} setSearch={setSearch} />
        </header>
        <MessageTable
          messages={messages.messages}
          pagination={messages.pagination}
          setPage={setPage}
        />
      </section>
    </React.Fragment>
  );
}
