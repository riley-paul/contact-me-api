import { Message, Project } from "@/db/schema";
import { createDb } from "@/db";
import { defineAction } from "astro:actions";
import { ensureAuthorized } from "./helpers";
import { count, eq, sql } from "drizzle-orm";
import { subDays, subHours } from "date-fns";

export const getStats = defineAction({
  handler: async (_, c) => {
    const db = createDb(c.locals.runtime.env);
    const userId = ensureAuthorized(c).id;

    // Get total messages count
    const [{ totalMessages }] = await db
      .select({ totalMessages: count(Message.id) })
      .from(Message)
      .innerJoin(Project, eq(Message.projectId, Project.id))
      .where(eq(Project.userId, userId));

    // Get total projects count
    const [{ totalProjects }] = await db
      .select({ totalProjects: count(Project.id) })
      .from(Project)
      .where(eq(Project.userId, userId));

    // Get messages from last 24 hours
    const last24Hours = subHours(new Date(), 24).toISOString();
    const [{ messagesLast24h }] = await db
      .select({ messagesLast24h: count(Message.id) })
      .from(Message)
      .innerJoin(Project, eq(Message.projectId, Project.id))
      .where(
        sql`${Project.userId} = ${userId} AND ${Message.createdAt} >= ${last24Hours}`,
      );

    // Get messages from last 7 days
    const last7Days = subDays(new Date(), 7).toISOString();
    const [{ messagesLast7d }] = await db
      .select({ messagesLast7d: count(Message.id) })
      .from(Message)
      .innerJoin(Project, eq(Message.projectId, Project.id))
      .where(
        sql`${Project.userId} = ${userId} AND ${Message.createdAt} >= ${last7Days}`,
      );

    // Get messages from last 30 days
    const last30Days = subDays(new Date(), 30).toISOString();
    const [{ messagesLast30d }] = await db
      .select({ messagesLast30d: count(Message.id) })
      .from(Message)
      .innerJoin(Project, eq(Message.projectId, Project.id))
      .where(
        sql`${Project.userId} = ${userId} AND ${Message.createdAt} >= ${last30Days}`,
      );

    // Get projects with message counts
    const projectStats = await db
      .select({
        id: Project.id,
        name: Project.name,
        messageCount: count(Message.id),
      })
      .from(Project)
      .leftJoin(Message, eq(Message.projectId, Project.id))
      .where(eq(Project.userId, userId))
      .groupBy(Project.id, Project.name)
      .orderBy(sql`count(${Message.id}) DESC`)
      .limit(5);

    // Get recent messages
    const recentMessages = await db
      .select({
        id: Message.id,
        name: Message.name,
        email: Message.email,
        content: Message.content,
        createdAt: Message.createdAt,
        project: {
          id: Project.id,
          name: Project.name,
        },
      })
      .from(Message)
      .innerJoin(Project, eq(Message.projectId, Project.id))
      .where(eq(Project.userId, userId))
      .orderBy(sql`${Message.createdAt} DESC`)
      .limit(5);

    return {
      totalMessages,
      totalProjects,
      messagesLast24h,
      messagesLast7d,
      messagesLast30d,
      projectStats,
      recentMessages,
    };
  },
});
