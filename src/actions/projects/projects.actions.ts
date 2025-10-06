import { defineAction } from "astro:actions";
import * as inputs from "./projects.inputs";
import * as handlers from "./projects.handlers";

export const getAll = defineAction({
  handler: handlers.getAll,
  input: inputs.getAll,
});

export const getOne = defineAction({
  handler: handlers.getOne,
  input: inputs.getOne,
});

export const create = defineAction({
  handler: handlers.create,
  input: inputs.create,
  accept: "form",
});

export const update = defineAction({
  handler: handlers.update,
  input: inputs.update,
});

export const remove = defineAction({
  handler: handlers.remove,
  input: inputs.remove,
});
