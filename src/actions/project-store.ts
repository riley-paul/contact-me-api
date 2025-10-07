import type { ProjectInsert, ProjectSelect } from "@/lib/types";
import { dummyStore, type Store } from "./types";
import { and, count, eq, like, or } from "drizzle-orm";
import { Message, Project } from "@/db/schema";
import type { Db } from "@/db";
import { ActionError } from "astro:actions";

const getMessageCount = async (db: Db, projectId: string) => {
  const [{ messageCount }] = await db
    .select({ messageCount: count(Message.id) })
    .from(Message)
    .where(eq(Message.projectId, projectId));
  return messageCount;
};

const getProjectStore: Store<ProjectSelect, ProjectInsert> = (db, userId) => ({
  ...dummyStore(db, userId),
  getAll: async (search) => {
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
            return { ...project, messageCount };
          }),
        ),
      );
  },
  getOne: async (id) => {
    const [project] = await db
      .select()
      .from(Project)
      .where(and(eq(Project.userId, userId), eq(Project.id, id)));
    if (!project)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });

    const messageCount = await getMessageCount(db, id);
    return { ...project, messageCount };
  },
  create: async (data) => {
    const [project] = await db
      .insert(Project)
      .values({ ...data, userId })
      .returning();

    const messageCount = await getMessageCount(db, project.id);
    return { ...project, messageCount };
  },
  update: async (id, data) => {
    const [project] = await db
      .update(Project)
      .set({ ...data })
      .where(and(eq(Project.userId, userId), eq(Project.id, id)))
      .returning();
    if (!project)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });

    const messageCount = await getMessageCount(db, project.id);
    return { ...project, messageCount };
  },
  remove: async (id) => {
    const { rowsAffected } = await db
      .delete(Project)
      .where(and(eq(Project.userId, userId), eq(Project.id, id)));
    const didSomething = rowsAffected > 0;
    if (!didSomething)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });

    return didSomething;
  },
});

export default getProjectStore;
