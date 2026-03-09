import { createDb } from "@/db";
import { Message, Project } from "@/db/schema";
import { createResend } from "@/lib/server/resend";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import {
  checkRateLimit,
  isDuplicateSubmission,
  validateRequestOrigin,
  isRedirectAllowed,
  createCorsHeaders,
  checkHoneypot,
} from "@/lib/server/contact/security";
import { createContactLogger } from "@/lib/server/contact/logger";
import { contactFormSchema } from "@/lib/types";
import { getEmail, getProjectEmails } from "@/lib/server/contact/email";

/**
 * Handle OPTIONS requests for CORS preflight
 */
export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get("origin");
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
};

/**
 * Handle contact form submissions with comprehensive security measures
 */
export const POST: APIRoute = async (ctx) => {
  const { request, locals, redirect } = ctx;
  const logger = createContactLogger(ctx);
  const db = createDb(locals.runtime.env);
  const resend = createResend(locals.runtime.env);
  const origin = request.headers.get("origin");

  let accessKey: string | undefined;
  let project: typeof Project.$inferSelect | undefined;

  try {
    // Parse form data
    const formData = await request.formData();
    accessKey = formData.get("access_key")?.toString();

    logger.submissionReceived(
      accessKey || "unknown",
      formData.get("email")?.toString() || "unknown",
    );

    // Check honeypot (spam prevention)
    if (!checkHoneypot(formData)) {
      logger.honeypotTriggered(accessKey || "unknown");
      const params = new URLSearchParams();
      params.set("message", "Invalid submission");
      return redirect(`/failure?${params.toString()}`);
    }

    // Validate form data
    const parsedData = contactFormSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!parsedData.success) {
      logger.validationFailed(accessKey, parsedData.error.errors);
      const params = new URLSearchParams();
      params.set("message", "Invalid form data");
      return redirect(`/failure?${params.toString()}`);
    }

    const { name, email, message, access_key, redirect_url } = parsedData.data;

    // Rate limiting check
    const rateLimitSuccess = await checkRateLimit(ctx, access_key);
    if (!rateLimitSuccess) {
      logger.rateLimited(access_key);
      const params = new URLSearchParams();
      params.set("message", "Too many requests. Please try again later");
      return redirect(`/failure?${params.toString()}`);
    }

    // Fetch project
    const [projectResult] = await db
      .select()
      .from(Project)
      .where(eq(Project.id, access_key));

    if (!projectResult) {
      logger.projectNotFound(access_key);
      const params = new URLSearchParams();
      params.set("message", "Invalid access key");
      return redirect(`/failure?${params.toString()}`);
    }

    project = projectResult;

    // Validate origin/referer
    if (!validateRequestOrigin(ctx, project)) {
      logger.originBlocked(access_key, origin);
      const params = new URLSearchParams();
      params.set("message", "Request origin not allowed");
      return redirect(`/failure?${params.toString()}`);
    }

    // Check for duplicate submissions
    const duplicateSubmissionSuccess = await isDuplicateSubmission(ctx, {
      projectId: project.id,
      email,
      message,
    });
    if (!duplicateSubmissionSuccess) {
      logger.duplicateSubmission(access_key, email);
      const params = new URLSearchParams();
      params.set("message", "Duplicate submission detected");
      return redirect(`/failure?${params.toString()}`);
    }

    // Validate redirect URL if provided
    if (
      redirect_url &&
      !isRedirectAllowed(redirect_url, project.allowedRedirects)
    ) {
      logger.redirectBlocked(access_key, redirect_url);
      const params = new URLSearchParams();
      params.set("message", "Redirect URL not allowed");
      return redirect(`/failure?${params.toString()}`);
    }

    // Start database transaction (save message)
    const [savedMessage] = await db
      .insert(Message)
      .values({
        projectId: project.id,
        name,
        email,
        content: message,
      })
      .returning();

    logger.messageSaved(project.id, savedMessage.id);

    // Fetch project emails
    const projectEmails = getProjectEmails(project.emails);

    if (projectEmails.length === 0) {
      logger.warn("no_project_emails", {
        projectId: project.id,
        message: "No recipient emails configured for project",
      });
    }

    // Send email notification to project owners only
    // Security: Do NOT send to user-submitted email address
    if (projectEmails.length > 0) {
      const emailResponse = await resend.emails.send(
        getEmail({
          contactData: parsedData.data,
          projectEmails,
          projectName: project.name,
        }),
      );

      if (emailResponse.error) {
        logger.emailFailed(project.id, emailResponse.error.message);
        const params = new URLSearchParams();
        params.set("message", "Failed to send notification email");
        return redirect(`/failure?${params.toString()}`);
      }

      logger.emailSent(project.id, projectEmails.length);
    }

    logger.submissionSuccess(project.id, email);

    // Handle redirect
    if (redirect_url) {
      const headers = createCorsHeaders(origin, project.allowedOrigins);
      return new Response(null, {
        status: 303,
        headers: {
          Location: redirect_url,
          ...headers,
        },
      });
    }

    // Default success redirect
    const headers = createCorsHeaders(origin, project.allowedOrigins);
    const successUrl = new URL("/success", request.url);

    return new Response(null, {
      status: 303,
      headers: {
        Location: successUrl.toString(),
        ...headers,
      },
    });
  } catch (error) {
    // Log unexpected errors
    logger.error(
      "unexpected_error",
      error instanceof Error ? error : String(error),
      {
        projectId: project?.id,
        accessKey,
      },
    );

    // Don't expose internal errors to users
    const params = new URLSearchParams();
    params.set("message", "An unexpected error occurred");
    return redirect(`/failure?${params.toString()}`);
  }
};
