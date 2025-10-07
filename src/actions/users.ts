import { createDb } from "@/db";
import { User } from "@/db/schema";
import type { UserSelect } from "@/lib/types";
import { ActionError, defineAction } from "astro:actions";
import { eq } from "drizzle-orm";
import { ensureAuthorized } from "./helpers";

export const getOne = defineAction<UserSelect>({
  handler: async (_, c) => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;
    const [user] = await db.select().from(User).where(eq(User.id, userId));
    if (!user)
      throw new ActionError({ code: "NOT_FOUND", message: "User not found." });
    return user;
  },
});

export const remove = defineAction<true>({
  handler: async (_, c) => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;
    const { rowsAffected } = await db.delete(User).where(eq(User.id, userId));
    const didSomething = rowsAffected > 0;
    if (!didSomething) {
      throw new ActionError({ code: "NOT_FOUND", message: "User not found." });
    }
    return didSomething;
  },
});
