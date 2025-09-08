import { queryOptions } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const qCurrentUser = queryOptions({
  queryKey: ["currentUser"],
  queryFn: actions.users.getMe.orThrow,
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
