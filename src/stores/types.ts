import type { Db } from "@/db";

export type Store<T> = (db: Db) => Partial<{
  getOne: (id: string) => Promise<T | null>;
  getAll: () => Promise<T[]>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T | null>;
  duplicate: (id: string) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
}>;
