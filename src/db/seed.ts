import { Message, Project, User } from "./schema";
import { faker } from "@faker-js/faker";

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
      Array.from({ length: 7 }).map((_, idx) => ({
        userId,
        identifier: faker.lorem.slug(faker.number.int({ min: 1, max: 3 })),
        name: faker.lorem
          .sentence(faker.number.int({ min: 1, max: 3 }))
          .replaceAll(".", ""),
        description: faker.lorem.sentences(
          faker.number.int({ min: 1, max: 3 }),
        ),
        repoUrl: faker.internet.url(),
        liveUrl: faker.internet.url(),
      })),
    )
    .returning();

  console.log(`✅ Seeded ${projects.length} projects`);

  for (const project of projects) {
    const length = faker.number.int({ min: 0, max: 70 });
    if (length > 0) {
      await db.insert(Message).values(
        Array.from({ length }).map((_, idx) => ({
          projectId: project.id,
          name: faker.person.fullName(),
          email: faker.internet.email(),
          content: faker.lorem.paragraphs(),
        })),
      );
    }
    console.log(`✅ Seeded ${length} messages for project ${project.id}`);
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
