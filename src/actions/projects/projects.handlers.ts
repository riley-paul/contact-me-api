import { ActionError, type ActionHandler } from "astro:actions";
import * as inputs from "./projects.inputs";
import type { ProjectSelect } from "@/lib/types";
import { createDb } from "@/db";
import { isAuthorized } from "../helpers";
import { Project } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const getAll: ActionHandler<
  typeof inputs.getAll,
  ProjectSelect[]
> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const projects = await db
    .select()
    .from(Project)
    .where(eq(Project.userId, userId));

  return projects;
};

export const getOne: ActionHandler<
  typeof inputs.getOne,
  ProjectSelect
> = async ({ projectId }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [project] = await db
    .select()
    .from(Project)
    .where(and(eq(Project.userId, userId), eq(Project.id, projectId)));

  if (!project)
    throw new ActionError({ code: "NOT_FOUND", message: "Project not found" });

  return project;
};

export const create: ActionHandler<
  typeof inputs.create,
  ProjectSelect
> = async (data, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [project] = await db
    .insert(Project)
    .values({ ...data, userId })
    .returning();

  return project;
};

export const update: ActionHandler<
  typeof inputs.update,
  ProjectSelect
> = async ({ projectId, ...data }, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const [project] = await db
    .update(Project)
    .set({ ...data })
    .where(and(eq(Project.userId, userId), eq(Project.id, projectId)))
    .returning();

  if (!project)
    throw new ActionError({ code: "NOT_FOUND", message: "Project not found" });

  return project;
};

export const remove: ActionHandler<typeof inputs.remove, null> = async (
  { projectId },
  c,
) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;

  const result = await db
    .delete(Project)
    .where(and(eq(Project.userId, userId), eq(Project.id, projectId)));

  if (result.rowsAffected === 0)
    throw new ActionError({ code: "NOT_FOUND", message: "Project not found" });

  return null;
};
