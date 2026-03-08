import { createFileRoute } from "@tanstack/react-router";
import SearchInput from "../components/search-input";
import MessageTable from "../components/message-table";
import { actions } from "astro:actions";
import { z } from "astro/zod";
import { useDebounceCallback } from "usehooks-ts";
import React from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/app/components/ui/empty";
import { MailXIcon } from "lucide-react";

export const Route = createFileRoute("/projects/$projectId/messages")({
  component: RouteComponent,
  loaderDeps: ({ search: { search, page } }) => ({ search, page }),
  loader: async ({ params: { projectId }, deps: { search, page } }) => {
    const messages = await actions.messages.getAll.orThrow({
      projectId,
      search,
      page,
    });
    return { messages, crumb: "Messages" };
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

  if (messages.messages.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MailXIcon />
          </EmptyMedia>
          <EmptyTitle>No messages</EmptyTitle>
          <EmptyDescription>
            This project has yet to recieve any messages
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <React.Fragment>
      <MessageTable
        search={search}
        setSearch={setSearch}
        messages={messages.messages}
        pagination={messages.pagination}
        setPage={setPage}
      />
    </React.Fragment>
  );
}
