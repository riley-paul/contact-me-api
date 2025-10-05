import type { Environment } from "@/envs";
import { Resend } from "resend";

export const createResend = (env: Environment) =>
  new Resend(env.RESEND_API_KEY);
