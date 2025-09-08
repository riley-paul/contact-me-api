import { Message, Project, User } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "astro/zod";

export const zUserSelect = createSelectSchema(User);
export const zUserInsert = createInsertSchema(User);
export type UserSelect = z.infer<typeof zUserSelect>;
export type UserInsert = z.infer<typeof zUserInsert>;

export type UserSessionInfo = {
  id: string;
  userId: string;
  expiresAt: Date;
};

export const zProjectSelect = createSelectSchema(Project);
export const zProjectInsert = createInsertSchema(Project);
export type ProjectSelect = z.infer<typeof zProjectSelect>;
export type ProjectInsert = z.infer<typeof zProjectInsert>;

export const zMessageSelect = createSelectSchema(Message);
export const zMessageInsert = createInsertSchema(Message);
export type MessageSelect = z.infer<typeof zMessageSelect>;
export type MessageInsert = z.infer<typeof zMessageInsert>;
