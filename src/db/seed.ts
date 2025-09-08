import { Project, User } from "./schema";

import env from "@/envs-runtime";
import { createDb } from ".";

export default async function seed() {
  const db = createDb(env);
  await db.delete(User);

  const [{ id: userId }] = await db
    .insert(User)
    .values({
      email: "rileypaul96@gmail.com",
      githubId: 71047303,
      githubUsername: "rjp301",
      name: "Riley Paul",
      avatarUrl: "https://avatars.githubusercontent.com/u/71047303?v=4",
    })
    .returning();

  console.log(`✅ Seeded user`);

  const projects = await db
    .insert(Project)
    .values(
      Array.from({ length: 10 }).map((_, idx) => ({
        userId,
        identifier: `my-project-${idx + 1}`,
        name: `My Project ${idx + 1}`,
        description: "This is my project",
        repoUrl: "",
        liveUrl: "",
      })),
    )
    .returning();

  console.log(`✅ Seeded ${projects.length} projects`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
