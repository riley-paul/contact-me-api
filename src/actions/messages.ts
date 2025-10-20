import {
  zMessageInsert,
  type MessageSelect,
  type PaginationInfo,
} from "@/lib/types";
import { Message, Project } from "@/db/schema";
import { and, count, eq, like, or } from "drizzle-orm";
import { createDb, type Db } from "@/db";
import { ActionError, defineAction } from "astro:actions";
import { ensureAuthorized } from "./helpers";
import { z } from "astro:schema";
import { PAGE_SIZE } from "@/lib/constants";

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
    page: z.number().optional(),
  }),
  handler: async (
    { search, projectId, page = 1 },
    c,
  ): Promise<{ messages: MessageSelect[]; pagination: PaginationInfo }> => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const searchTerm = `%${search}%`;
    const searchQuery = or(
      like(Message.name, searchTerm),
      like(Message.email, searchTerm),
      like(Message.content, searchTerm),
      like(Project.name, searchTerm),
    );

    const query = and(
      eq(Project.userId, userId),
      projectId ? eq(Message.projectId, projectId) : undefined,
      search ? searchQuery : undefined,
    );

    const messages = await db
      .select({
        id: Message.id,
        projectId: Message.projectId,
        project: {
          id: Project.id,
          name: Project.name,
        },
        name: Message.name,
        email: Message.email,
        content: Message.content,
        createdAt: Message.createdAt,
        updatedAt: Message.updatedAt,
      })
      .from(Message)
      .innerJoin(Project, eq(Message.projectId, Project.id))
      .where(query)
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE);

    const [{ numRows }] = await db
      .select({ numRows: count() })
      .from(Message)
      .leftJoin(Project, eq(Message.projectId, Project.id))
      .where(query);

    return {
      messages,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        numPages: Math.ceil(numRows / PAGE_SIZE),
        numRows,
      },
    };
  },
});

export const getOne = defineAction({
  input: z.object({ messageId: z.string() }),
  handler: async ({ messageId }, c): Promise<MessageSelect> => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const [message] = await db
      .select({
        id: Message.id,
        projectId: Message.projectId,
        project: {
          id: Project.id,
          name: Project.name,
        },
        name: Message.name,
        email: Message.email,
        content: Message.content,
        createdAt: Message.createdAt,
        updatedAt: Message.updatedAt,
      })
      .from(Message)
      .innerJoin(Project, eq(Message.projectId, Project.id))
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
