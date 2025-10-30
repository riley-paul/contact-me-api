import { Heading } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import SearchForm from "../components/search-form";
import MessageTable from "../components/message-table";
import { actions } from "astro:actions";
import { z } from "astro/zod";
import { useDebounceCallback } from "usehooks-ts";

export const Route = createFileRoute("/projects/$projectId/messages")({
  component: RouteComponent,
  loaderDeps: ({ search: { search, page } }) => ({ search, page }),
  loader: async ({ params: { projectId }, deps: { search, page } }) => {
    const messages = await actions.messages.getAll.orThrow({
      projectId,
      search,
      page,
    });
    return { messages };
  },
  validateSearch: z.object({
    search: z.string().optional(),
    page: z.number().optional(),
  }),
});

function RouteComponent() {
  const { messages } = Route.useLoaderData();
  const { search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const setSearch = useDebounceCallback((search: string | undefined) => {
    navigate({ to: ".", search: (old) => ({ ...old, search }) });
  });

  const setPage = (page: number) => {
    navigate({ search: (old) => ({ ...old, page }) });
  };

  return (
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
  );
}
