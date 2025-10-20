import { and, count, eq, like, or } from "drizzle-orm";
import { Message, Project, ProjectEmail } from "@/db/schema";
import { createDb, type Db } from "@/db";
import { ActionError, defineAction } from "astro:actions";
import { ensureAuthorized } from "./helpers";
import { z } from "astro:schema";
import { zProjectInsert, type ProjectSelect } from "@/lib/types";

const getMessageCount = async (db: Db, projectId: string) => {
  const [{ messageCount }] = await db
    .select({ messageCount: count(Message.id) })
    .from(Message)
    .where(eq(Message.projectId, projectId));
  return messageCount;
};

const getProjectEmails = async (db: Db, projectId: string) => {
  return db
    .select()
    .from(ProjectEmail)
    .where(eq(ProjectEmail.projectId, projectId));
};

export const getAll = defineAction({
  input: z.object({ search: z.string().optional() }),
  handler: async ({ search }, c): Promise<ProjectSelect[]> => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const searchTerm = `%${search}%`;
    const searchQuery = or(
      like(Project.name, searchTerm),
      like(Project.identifier, searchTerm),
      like(Project.description, searchTerm),
      like(Project.liveUrl, searchTerm),
      like(Project.repoUrl, searchTerm),
    );
    return db
      .select()
      .from(Project)
      .where(and(eq(Project.userId, userId), search ? searchQuery : undefined))
      .then((rows) =>
        Promise.all(
          rows.map(async (project) => {
            const messageCount = await getMessageCount(db, project.id);
            const emails = await getProjectEmails(db, project.id);
            return { ...project, messageCount, emails };
          }),
        ),
      );
  },
});

export const getOne = defineAction({
  input: z.object({ projectId: z.string() }),
  handler: async ({ projectId }, c): Promise<ProjectSelect> => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const [project] = await db
      .select()
      .from(Project)
      .where(and(eq(Project.userId, userId), eq(Project.id, projectId)));
    if (!project)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });

    const messageCount = await getMessageCount(db, projectId);
    const emails = await getProjectEmails(db, project.id);
    return { ...project, messageCount, emails };
  },
});

export const create = defineAction({
  input: z.object({ data: zProjectInsert }),
  handler: async ({ data }, c) => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const [project] = await db
      .insert(Project)
      .values({ ...data, userId })
      .returning();

    const messageCount = await getMessageCount(db, project.id);
    return { ...project, messageCount };
  },
});

export const update = defineAction({
  input: z.object({ projectId: z.string(), data: zProjectInsert }),
  handler: async ({ projectId, data }, c) => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const [project] = await db
      .update(Project)
      .set({ ...data })
      .where(and(eq(Project.userId, userId), eq(Project.id, projectId)))
      .returning();
    if (!project)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });

    const messageCount = await getMessageCount(db, project.id);
    return { ...project, messageCount };
  },
});

export const remove = defineAction({
  input: z.object({ projectId: z.string() }),
  handler: async ({ projectId }, c) => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const { rowsAffected } = await db
      .delete(Project)
      .where(and(eq(Project.userId, userId), eq(Project.id, projectId)));
    const didSomething = rowsAffected > 0;
    if (!didSomething)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });

    return didSomething;
  },
});
