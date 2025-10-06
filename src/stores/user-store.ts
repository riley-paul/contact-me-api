import { User } from "@/db/schema";
import type { UserSelect } from "@/lib/types";
import { eq } from "drizzle-orm";
import type { Store } from "./types";

const userStore: Store<UserSelect> = (db) => ({
  getOne: async (userId: string) => {
    const [user] = await db.select().from(User).where(eq(User.id, userId));
    if (!user) return null;
    return user;
  },
  remove: async (userId: string) => {
    const { rowsAffected } = await db.delete(User).where(eq(User.id, userId));
    return rowsAffected > 0;
  },
});

export default userStore;
