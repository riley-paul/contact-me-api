import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const id = text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

const userId = text()
  .notNull()
  .references(() => User.id, { onDelete: "cascade" });

const projectId = text()
  .notNull()
  .references(() => Project.id, { onDelete: "cascade" });

const timeStamps = {
  createdAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
};

export const User = sqliteTable("user", {
  id,
  email: text().notNull().unique(),
  name: text().notNull(),
  avatarUrl: text(),

  googleId: text().unique(),
  githubId: integer().unique(),
  githubUsername: text().unique(),
  ...timeStamps,
});

export const UserSession = sqliteTable("userSession", {
  id,
  userId,
  expiresAt: integer({ mode: "timestamp_ms" }).notNull(),
  ...timeStamps,
});

export const Project = sqliteTable("project", {
  id,
  userId,
  name: text().notNull(),
  description: text(),
  identifier: text().notNull(),
  repoUrl: text(),
  liveUrl: text(),
  ...timeStamps,
});

export const Message = sqliteTable("message", {
  id,
  projectId,
  email: text().notNull(),
  name: text().notNull(),
  content: text().notNull(),
  ...timeStamps,
});

export const ProjectEmail = sqliteTable("projectEmail", {
  id,
  projectId,
  email: text().notNull(),
  name: text().notNull(),
  ...timeStamps,
});
