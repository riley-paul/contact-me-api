import { zMessageInsert, type MessageSelect } from "@/lib/types";
import { Message, Project } from "@/db/schema";
import { and, eq, like, or } from "drizzle-orm";
import { createDb, type Db } from "@/db";
import { ActionError, defineAction } from "astro:actions";
import { ensureAuthorized } from "./helpers";
import { z } from "astro:schema";

const getUserInProject = async (db: Db, userId: string, projectId: string) => {
  const [project] = await db
    .select()
    .from(Project)
    .where(and(eq(Project.id, projectId), eq(Project.userId, userId)));
  return !!project;
};

export const getAll = defineAction({
  input: z.object({
    search: z.string().optional(),
    projectId: z.string().optional(),
  }),
  handler: async ({ search, projectId }, c): Promise<MessageSelect[]> => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const searchTerm = `%${search}%`;
    const searchQuery = or(
      like(Message.name, searchTerm),
      like(Message.email, searchTerm),
      like(Message.content, searchTerm),
    );
    return db
      .select({
        id: Message.id,
        projectId: Message.projectId,
        name: Message.name,
        email: Message.email,
        content: Message.content,
        createdAt: Message.createdAt,
        updatedAt: Message.updatedAt,
      })
      .from(Message)
      .leftJoin(Project, eq(Message.projectId, Project.id))
      .where(
        and(
          eq(Project.userId, userId),
          projectId ? eq(Message.projectId, projectId) : undefined,
          search ? searchQuery : undefined,
        ),
      );
  },
});

export const getOne = defineAction({
  input: z.object({ messageId: z.string() }),
  handler: async ({ messageId }, c) => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const [message] = await db
      .select({
        id: Message.id,
        projectId: Message.projectId,
        name: Message.name,
        email: Message.email,
        content: Message.content,
        createdAt: Message.createdAt,
        updatedAt: Message.updatedAt,
      })
      .from(Message)
      .leftJoin(Project, eq(Message.projectId, Project.id))
      .where(and(eq(Project.userId, userId), eq(Message.id, messageId)));
    if (!message)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Message not found.",
      });
    return message;
  },
});

export const create = defineAction({
  input: z.object({ data: zMessageInsert }),
  handler: async ({ data }, c) => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const [project] = await db
      .select()
      .from(Project)
      .where(eq(Project.id, data.projectId));
    if (!project)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });
    if (project.userId !== userId)
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this project.",
      });

    const [message] = await db
      .insert(Message)
      .values({ ...data })
      .returning();
    return message;
  },
});

export const remove = defineAction({
  input: z.object({ messageId: z.string() }),
  handler: async ({ messageId }, c) => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const [message] = await db
      .select()
      .from(Message)
      .where(eq(Message.id, messageId));
    if (!message)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Message not found.",
      });

    const projectId = message.projectId;

    const hasAccess = await getUserInProject(db, userId, projectId);
    if (!hasAccess)
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this project.",
      });

    const { rowsAffected } = await db
      .delete(Message)
      .where(eq(Message.id, messageId));
    const didSomething = rowsAffected > 0;
    if (!didSomething)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Message not found.",
      });
    return didSomething;
  },
});
