import { createDb } from "@/db";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { ensureAuthorized } from "./helpers";
import { Project, ProjectEmail } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { zProjectEmailInsert } from "@/lib/types";

export const create = defineAction({
  accept: "form",
  input: zProjectEmailInsert,
  handler: async (data, c) => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const [project] = await db
      .select()
      .from(Project)
      .where(and(eq(Project.id, data.projectId), eq(Project.userId, userId)));

    if (!project)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });

    const [existingEmail] = await db
      .select()
      .from(ProjectEmail)
      .where(
        and(
          eq(ProjectEmail.projectId, data.projectId),
          eq(ProjectEmail.email, data.email),
        ),
      );

    if (existingEmail)
      throw new ActionError({
        code: "CONFLICT",
        message: "This email is already associated with the project.",
      });

    const [newProjectEmail] = await db
      .insert(ProjectEmail)
      .values({ ...data })
      .returning();

    return newProjectEmail;
  },
});

export const remove = defineAction({
  input: z.object({ projectEmailId: z.string() }),
  handler: async ({ projectEmailId }, c) => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    const [projectEmail] = await db
      .select()
      .from(ProjectEmail)
      .rightJoin(Project, eq(Project.id, ProjectEmail.projectId))
      .where(
        and(eq(Project.userId, userId), eq(ProjectEmail.id, projectEmailId)),
      );

    if (!projectEmail)
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Project email not found.",
      });

    const { rowsAffected } = await db
      .delete(ProjectEmail)
      .where(eq(ProjectEmail.id, projectEmailId));

    const didSomething = rowsAffected > 0;
    return didSomething;
  },
});
