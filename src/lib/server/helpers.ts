import { isAuthorized } from "@/actions/helpers";
import { createDb } from "@/db";
import { Project, User } from "@/db/schema";
import type { APIContext } from "astro";
import { and, eq, like, or } from "drizzle-orm";

export const getUser = async (c: APIContext) => {
  const user = c.locals.user;
  if (!user) return null;

  const db = createDb(c.locals.runtime.env);
  const [currentUser] = await db
    .select()
    .from(User)
    .where(eq(User.id, user.id));

  if (!currentUser) return null;
  return currentUser;
};

export const getProjects = async (
  c: APIContext,
  props: { search?: string } = {},
) => {
  const { search } = props;
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const searchTerm = `%${search}%`;

  const projects = await db
    .select()
    .from(Project)
    .where(
      and(
        eq(Project.userId, userId),
        search
          ? or(
              like(Project.name, searchTerm),
              like(Project.identifier, searchTerm),
              like(Project.description, searchTerm),
              like(Project.liveUrl, searchTerm),
              like(Project.repoUrl, searchTerm),
            )
          : undefined,
      ),
    );

  return projects;
};
