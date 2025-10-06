import { User } from "@/db/schema";
import type { UserInsert, UserSelect } from "@/lib/types";
import { eq } from "drizzle-orm";
import type { Store } from "./types";

const userStore: Store<UserSelect, UserInsert> = (db, userId) => ({
  getOne: async (id: string) => {
    if (id !== userId) return null;
    const [user] = await db.select().from(User).where(eq(User.id, id));
    if (!user) return null;
    return user;
  },
  remove: async (id: string) => {
    if (id !== userId) return false;
    const { rowsAffected } = await db.delete(User).where(eq(User.id, id));
    return rowsAffected > 0;
  },
});

export default userStore;
