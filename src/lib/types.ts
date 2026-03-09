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

export const zProjectSelect = createSelectSchema(Project).extend({
  messageCount: z.number(),
});
export const zProjectInsert = createInsertSchema(Project).pick({
  name: true,
  emails: true,
  allowedOrigins: true,
  allowedRedirects: true,
});
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

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email").max(100, "Email too long"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message too long"),
  access_key: z.string().uuid("Invalid access key"),
  redirect_url: z.string().url("Invalid redirect URL").optional(),
  honeypot: z.string().optional(),
});
export type ContactFormData = z.infer<typeof contactFormSchema>;
