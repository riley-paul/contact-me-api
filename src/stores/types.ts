import type { Db } from "@/db";

export type Store<S, I = S> = (
  db: Db,
  userId: string,
) => {
  getOne: (id: string) => Promise<S | null>;
  getAll: (search?: string) => Promise<S[]>;
  create: (data: I) => Promise<S>;
  update: (id: string, data: Partial<I>) => Promise<S | null>;
  duplicate: (id: string) => Promise<S | null>;
  remove: (id: string) => Promise<boolean>;
};

export const dummyStore: Store<any, any> = () => ({
  getOne: async () => null,
  getAll: async () => [],
  create: async () => null,
  update: async () => null,
  duplicate: async () => null,
  remove: async () => false,
});
