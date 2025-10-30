import { and, count, eq, inArray, like, or } from "drizzle-orm";
import { Message, Project, ProjectEmail } from "@/db/schema";
import { createDb, type Db } from "@/db";
import { ActionError, defineAction } from "astro:actions";
import { ensureAuthorized } from "./helpers";
import { z } from "astro/zod";
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
    const searchQuery = or(like(Project.name, searchTerm));
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
  handler: async ({ data }, c): Promise<ProjectSelect> => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const [project] = await db
      .insert(Project)
      .values({ ...data, userId })
      .returning();

    const emails = await db
      .insert(ProjectEmail)
      .values(
        data.emails.map((email) => ({
          projectId: project.id,
          email,
        })),
      )
      .returning();

    const messageCount = await getMessageCount(db, project.id);
    return { ...project, emails, messageCount };
  },
});

export const update = defineAction({
  input: z.object({ projectId: z.string(), data: zProjectInsert }),
  handler: async ({ projectId, data }, c): Promise<ProjectSelect> => {
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

    const existingEmails = await db
      .select()
      .from(ProjectEmail)
      .where(eq(ProjectEmail.projectId, project.id));
    const existingEmailSet = new Set(existingEmails.map((e) => e.email));
    const newEmailSet = new Set(data.emails);

    const emailsToAdd = data.emails.filter(
      (email) => !existingEmailSet.has(email),
    );
    const emailsToRemove = existingEmails
      .filter((e) => !newEmailSet.has(e.email))
      .map((e) => e.id);

    if (emailsToAdd.length > 0) {
      await db.insert(ProjectEmail).values(
        emailsToAdd.map((email) => ({
          projectId: project.id,
          email,
        })),
      );
    }

    if (emailsToRemove.length > 0) {
      await db
        .delete(ProjectEmail)
        .where(
          and(
            eq(ProjectEmail.projectId, project.id),
            inArray(ProjectEmail.id, emailsToRemove),
          ),
        );
    }

    const emails = await getProjectEmails(db, project.id);

    const messageCount = await getMessageCount(db, project.id);
    return { ...project, emails, messageCount };
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
