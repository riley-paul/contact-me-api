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
