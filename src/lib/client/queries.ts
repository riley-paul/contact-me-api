import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const qCurrentUser = queryOptions({
  queryKey: ["currentUser"],
  queryFn: actions.users.getMe.orThrow,
});

export const qProjects = queryOptions({
  queryKey: ["projects"],
  queryFn: actions.projects.getAll.orThrow,
});

export const qProject = (projectId: string) =>
  queryOptions({
    queryKey: ["project", projectId],
    queryFn: () => actions.projects.getOne.orThrow({ projectId }),
  });
