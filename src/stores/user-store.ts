import { User } from "@/db/schema";
import type { UserInsert, UserSelect } from "@/lib/types";
import { eq } from "drizzle-orm";
import { dummyStore, type Store } from "./types";
import { ActionError } from "astro:actions";

const getUserStore: Store<UserSelect, UserInsert> = (db, userId) => ({
  ...dummyStore(db, userId),
  getOne: async (id: string) => {
    if (id !== userId)
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You can only access your own user data.",
      });
    const [user] = await db.select().from(User).where(eq(User.id, id));
    if (!user)
      throw new ActionError({ code: "NOT_FOUND", message: "User not found." });
    return user;
  },
  remove: async (id: string) => {
    if (id !== userId)
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You can only delete your own user account.",
      });
    const { rowsAffected } = await db.delete(User).where(eq(User.id, id));
    const didSomething = rowsAffected > 0;
    if (!didSomething) {
      throw new ActionError({ code: "NOT_FOUND", message: "User not found." });
    }
    return didSomething;
  },
});

export default getUserStore;
