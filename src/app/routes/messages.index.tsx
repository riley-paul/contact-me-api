import MessageTable from "@/app/components/message-table";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "astro/zod";
import { useDebounceCallback } from "usehooks-ts";
import { actions } from "astro:actions";

export const Route = createFileRoute("/messages/")({
  component: RouteComponent,
  validateSearch: z.object({
    search: z.string().optional(),
    page: z.number().optional(),
  }),
  loaderDeps: ({ search: { search, page } }) => ({ search, page }),
  loader: async ({ deps: { search, page } }) => {
    const messageResponse = await actions.messages.getAll.orThrow({
      search,
      page,
    });
    return { messageResponse, crumb: "All" };
  },
});

function RouteComponent() {
  const { search } = Route.useSearch();
  const {
    messageResponse: { messages, pagination },
  } = Route.useLoaderData();
  const navigate = Route.useNavigate();

  const setSearch = useDebounceCallback((search: string | undefined) => {
    navigate({ to: ".", search: (old) => ({ ...old, search }) });
  });

  const setPage = (page: number) => {
    navigate({ search: (old) => ({ ...old, page }) });
  };

  return (
    <MessageTable
      search={search}
      setSearch={setSearch}
      messages={messages}
      pagination={pagination}
      setPage={setPage}
      showProject
    />
  );
}
