import MessageTable from "@/app/components/message-table";
import SearchForm from "@/app/components/search-form";
import { Heading } from "@radix-ui/themes";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { actions } from "astro:actions";
import { z } from "astro/zod";
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

      <Outlet />
    </React.Fragment>
  );
}
