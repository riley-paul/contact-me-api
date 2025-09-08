import { zProjectInsert } from "@/lib/types";
import { z } from "astro/zod";

export const getAll = z.any();
export const getOne = z.object({ projectId: z.string().uuid() });
export const create = zProjectInsert.pick({
  name: true,
  description: true,
  identifier: true,
  repoUrl: true,
  liveUrl: true,
});
export const update = create.extend({ projectId: z.string().uuid() });
export const remove = z.object({ projectId: z.string().uuid() });