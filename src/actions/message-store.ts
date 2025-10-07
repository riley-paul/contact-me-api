import type { MessageInsert, MessageSelect } from "@/lib/types";
import { dummyStore, type Store } from "./types";
import { Message, Project } from "@/db/schema";
import { and, eq, like, or } from "drizzle-orm";
import type { Db } from "@/db";
import { ActionError } from "astro:actions";

const getUserInProject = async (db: Db, userId: string, projectId: string) => {
  const [project] = await db
    .select()
    .from(Project)
    .where(and(eq(Project.id, projectId), eq(Project.userId, userId)));
  return !!project;
};

const getMessageStore: Store<
  MessageSelect,
  MessageInsert,
  { projectId: string }
> = (db, userId, { projectId }) => ({
  ...dummyStore(db, userId),
  getAll: async (search) => {
    const hasAccess = await getUserInProject(db, userId, projectId);
    if (!hasAccess)
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this project.",
      });

    const searchTerm = `%${search}%`;
    const searchQuery = or(
      like(Message.name, searchTerm),
      like(Message.email, searchTerm),
      like(Message.content, searchTerm),
    );
    return db
      .select()
      .from(Message)
      .where(
        and(eq(Message.projectId, projectId), search ? searchQuery : undefined),
      );
  },
  getOne: async (id) => {
    const hasAccess = await getUserInProject(db, userId, projectId);
    if (!hasAccess)
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this project.",
      });

    const [message] = await db
      .select()
      .from(Message)
      .where(and(eq(Message.projectId, projectId), eq(Message.id, id)));
    if (!message)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Message not found.",
      });
    return message;
  },
  create: async (data) => {
    const hasAccess = await getUserInProject(db, userId, projectId);
    if (!hasAccess)
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this project.",
      });

    const [message] = await db
      .insert(Message)
      .values({ ...data, projectId })
      .returning();
    return message;
  },
  remove: async (id) => {
    const hasAccess = await getUserInProject(db, userId, projectId);
    if (!hasAccess)
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You do not have access to this project.",
      });

    const { rowsAffected } = await db
      .delete(Message)
      .where(and(eq(Message.projectId, projectId), eq(Message.id, id)));
    const didSomething = rowsAffected > 0;
    if (!didSomething)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Message not found.",
      });
    return didSomething;
  },
});

export default getMessageStore;
