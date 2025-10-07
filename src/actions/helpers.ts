import { ActionError, type ActionAPIContext } from "astro:actions";

export const ensureAuthorized = (c: ActionAPIContext) => {
  const { user } = c.locals;
  if (!user)
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action.",
    });
  return user;
};
