import type { Db } from "@/db";

export type Store<S, I = S> = (
  db: Db,
  userId: string,
) => Partial<{
  getOne: (id: string) => Promise<S | null>;
  getAll: (search?: string) => Promise<S[]>;
  create: (data: I) => Promise<S>;
  update: (id: string, data: Partial<I>) => Promise<S | null>;
  duplicate: (id: string) => Promise<S | null>;
  remove: (id: string) => Promise<boolean>;
}>;
