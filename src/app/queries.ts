import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const qUser = queryOptions({
  queryKey: ["profile"],
  retry: false,
  queryFn: actions.users.getOne.orThrow,
});

export const qProjects = (search?: string) =>
  queryOptions({
    queryKey: ["projects", search],
    queryFn: () => actions.projects.getAll.orThrow({ search }),
  });

export const qProject = (projectId: string) =>
  queryOptions({
    queryKey: ["project", projectId],
    queryFn: () => actions.projects.getOne.orThrow({ projectId }),
  });

export const qMessages = (projectId?: string) =>
  queryOptions({
    queryKey: ["messages", projectId],
    queryFn: () => actions.messages.getAll.orThrow({ projectId }),
  });

export const qMessage = (messageId: string) =>
  queryOptions({
    queryKey: ["message", messageId],
    queryFn: () => actions.messages.getOne.orThrow({ messageId }),
  });
