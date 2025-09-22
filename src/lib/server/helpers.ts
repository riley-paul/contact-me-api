import { createDb } from "@/db";
import { User } from "@/db/schema";
import type { APIContext } from "astro";
import { eq } from "drizzle-orm";

export const getUser = async (c: APIContext) => {
  const user = c.locals.user;
  if (!user) return null;

  const db = createDb(c.locals.runtime.env);
  const [currentUser] = await db
    .select()
    .from(User)
    .where(eq(User.id, user.id));

  if (!currentUser) return null;
  return currentUser;
};
