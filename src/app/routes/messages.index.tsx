import MessageTable from "@/components/message-table";
import SearchForm from "@/components/search-form";
import { Heading } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "astro:schema";
import React from "react";
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
    return { messageResponse };
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
    <React.Fragment>
      <header className="flex items-center justify-between">
        <Heading size="8">Messages</Heading>
        <SearchForm search={search} setSearch={setSearch} />
      </header>
      <MessageTable
        messages={messages}
        pagination={pagination}
        setPage={setPage}
        showProject
      />
    </React.Fragment>
  );
}
