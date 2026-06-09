import { defineMiddleware, sequence } from "astro:middleware";
import {
  deleteSessionTokenCookie,
  SESSION_COOKIE_NAME,
  setSessionTokenCookie,
  validateSessionToken,
} from "./lib/server/lucia";
import { parseEnv, type Environment } from "./envs";

const injectEnv = defineMiddleware(async (context, next) => {
  const isTesting = import.meta.env.NODE_ENV === "test";

  if (isTesting) {
    context.locals.env = parseEnv(import.meta.env);
    return next();
  }

  const { env } = await import("cloudflare:workers");
  context.locals.env = env as Environment;
  return next();
});

const userValidation = defineMiddleware(async (context, next) => {
  const token = context.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const { user, session } = await validateSessionToken(context, token);

  if (session) {
    setSessionTokenCookie(context, token, session.expiresAt);
  } else {
    deleteSessionTokenCookie(context);
  }

  context.locals.session = session;
  context.locals.user = user;
  return next();
});

const routeGuarding = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith("/admin") && !context.locals.user) {
    return context.redirect("/welcome");
  }
  return next();
});

export const onRequest = sequence(injectEnv, userValidation, routeGuarding);
