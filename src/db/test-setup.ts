import type { Db } from ".";
import { Message, Project, User } from "./schema";

export const createTables = async (db: Db) => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      avatarUrl TEXT,
      googleId TEXT UNIQUE,
      githubId INTEGER UNIQUE,
      githubUsername TEXT UNIQUE,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS userSession (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      expiresAt INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS project (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      emails TEXT NOT NULL DEFAULT '',
      allowedOrigins TEXT NOT NULL DEFAULT '',
      allowedRedirects TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS message (
      id TEXT PRIMARY KEY NOT NULL,
      projectId TEXT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  await db.delete(Message);
  await db.delete(Project);
  await db.delete(User);
};
