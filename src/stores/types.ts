import type { Db } from "@/db";
import { ActionError } from "astro:actions";

export type Store<S, I = S, D = undefined> = (
  db: Db,
  userId: string,
  ...args: D extends undefined ? [] : [dependencies: D]
) => {
  getOne: (id: string) => Promise<S>;
  getAll: (search?: string) => Promise<S[]>;
  create: (data: I) => Promise<S>;
  update: (id: string, data: Partial<I>) => Promise<S>;
  duplicate: (id: string) => Promise<S>;
  remove: (id: string) => Promise<true>;
};

export const dummyStore: Store<any, any> = () => ({
  getOne: async () => {
    throw new ActionError({ code: "NOT_IMPLEMENTED" });
  },
  getAll: async () => {
    throw new ActionError({ code: "NOT_IMPLEMENTED" });
  },
  create: async () => {
    throw new ActionError({ code: "NOT_IMPLEMENTED" });
  },
  update: async () => {
    throw new ActionError({ code: "NOT_IMPLEMENTED" });
  },
  duplicate: async () => {
    throw new ActionError({ code: "NOT_IMPLEMENTED" });
  },
  remove: async () => {
    throw new ActionError({ code: "NOT_IMPLEMENTED" });
  },
});
