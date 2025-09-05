import type { Environment } from "@/envs";
import type { APIContext } from "astro";
import { Resend } from "resend";

export const createResend = (env: Environment) =>
  new Resend(env.RESEND_API_KEY);
