import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Heading } from "@radix-ui/themes";
import SearchForm from "@/components/search-form";
import ProjectAddLink from "@/components/project-add-link";
import ProjectCard from "@/components/project-card";
import { z } from "astro:schema";
import { useDebounceCallback } from "usehooks-ts";
import { actions } from "astro:actions";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  loaderDeps: ({ search: { search } }) => ({ search }),
  loader: async ({ deps: { search } }) => {
    const projects = await actions.projects.getAll.orThrow({ search });
    return { projects };
  },
  validateSearch: z.object({
    search: z.string().optional(),
  }),
});

function RouteComponent() {
  const { projects } = Route.useLoaderData();
  const { search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const setSearch = useDebounceCallback((search: string | undefined) => {
    navigate({ to: ".", search: (old) => ({ ...old, search }) });
  });

  return (
    <React.Fragment>
      <header className="flex items-center justify-between">
        <Heading size="8">Projects</Heading>
        <section className="flex items-center gap-3">
          <SearchForm search={search} setSearch={setSearch} />
          <ProjectAddLink />
        </section>
      </header>
      <section className="grid gap-4">
        {projects.map((project) => (
          <ProjectCard project={project} />
        ))}
      </section>
    </React.Fragment>
  );
}
