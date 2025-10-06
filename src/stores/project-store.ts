import type { ProjectInsert, ProjectSelect } from "@/lib/types";
import type { Store } from "./types";
import { and, eq, like, or } from "drizzle-orm";
import { Project } from "@/db/schema";

const projectStore: Store<ProjectSelect, ProjectInsert> = (db, userId) => ({
  getAll: async (search) => {
    const searchTerm = `%${search}%`;
    return db
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
  },
  getOne: async (id) => {
    const [project] = await db
      .select()
      .from(Project)
      .where(and(eq(Project.userId, userId), eq(Project.id, id)));
    if (!project) return null;
    return project;
  },
  create: async (data) => {
    const [project] = await db
      .insert(Project)
      .values({ ...data, userId })
      .returning();
    return project;
  },
  update: async (id, data) => {
    const [project] = await db
      .update(Project)
      .set({ ...data })
      .where(and(eq(Project.userId, userId), eq(Project.id, id)))
      .returning();
    if (!project) return null;
    return project;
  },
  remove: async (id) => {
    const { rowsAffected } = await db
      .delete(Project)
      .where(and(eq(Project.userId, userId), eq(Project.id, id)));
    return rowsAffected > 0;
  },
});

export default projectStore;
