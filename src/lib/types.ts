import { Message, Project, ProjectEmail, User } from "@/db/schema";
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

export const zProjectEmailSelect = createSelectSchema(ProjectEmail).pick({
  id: true,
  projectId: true,
  email: true,
  name: true,
});
export const zProjectEmailInsert = createInsertSchema(ProjectEmail);
export type ProjectEmailSelect = z.infer<typeof zProjectEmailSelect>;
export type ProjectEmailInsert = z.infer<typeof zProjectEmailInsert>;

export const zProjectSelect = createSelectSchema(Project).extend({
  messageCount: z.number(),
  emails: z.array(zProjectEmailSelect),
});
export const zProjectInsert = createInsertSchema(Project);
export type ProjectSelect = z.infer<typeof zProjectSelect>;
export type ProjectInsert = z.infer<typeof zProjectInsert>;

export const zMessageSelect = createSelectSchema(Message).extend({
  project: z.object({ id: z.string(), name: z.string() }),
});
export const zMessageInsert = createInsertSchema(Message);
export type MessageSelect = z.infer<typeof zMessageSelect>;
export type MessageInsert = z.infer<typeof zMessageInsert>;

export type PaginationInfo = {
  page: number;
  pageSize: number;
  numRows: number;
  numPages: number;
};
