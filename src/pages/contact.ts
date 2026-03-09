import { createDb } from "@/db";
import { Message, Project, ProjectEmail } from "@/db/schema";
import { createResend } from "@/lib/server/resend";
import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { eq } from "drizzle-orm";
import {
  escapeHtml,
  checkRateLimit,
  isDuplicateSubmission,
  validateRequestOrigin,
  isRedirectAllowed,
  createCorsHeaders,
  checkHoneypot,
} from "@/lib/server/contact/security";
import { createContactLogger } from "@/lib/server/contact/logger";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email").max(100, "Email too long"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message too long"),
  access_key: z.string().uuid("Invalid access key"),
  redirect_url: z.string().url("Invalid redirect URL").optional(),
  honeypot: z.string().optional(),
});

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
    const parsedData = formSchema.safeParse(Object.fromEntries(formData));

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
    if (isDuplicateSubmission(project.id, email, message)) {
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
    const projectEmails = await db
      .select()
      .from(ProjectEmail)
      .where(eq(ProjectEmail.projectId, project.id))
      .then((rows) => rows.map((r) => r.email));

    if (projectEmails.length === 0) {
      logger.warn("no_project_emails", {
        projectId: project.id,
        message: "No recipient emails configured for project",
      });
    }

    // Escape HTML to prevent XSS in email clients
    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedMessage = escapeHtml(message);
    const escapedProjectName = escapeHtml(project.name);

    // Send email notification to project owners only
    // Security: Do NOT send to user-submitted email address
    if (projectEmails.length > 0) {
      const emailResponse = await resend.emails.send({
        from: "Contactulator <contactulator@notifications.rileys-projects.com>",
        to: projectEmails,
        replyTo: email, // Allow project owners to reply directly
        subject: `New message from ${name} via Contactulator`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">📬 New Contact Message</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
      <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong>From:</strong></p>
      <p style="margin: 0 0 20px 0; font-size: 16px;">${escapedName}</p>

      <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong>Email:</strong></p>
      <p style="margin: 0 0 20px 0;"><a href="mailto:${escapedEmail}" style="color: #667eea; text-decoration: none;">${escapedEmail}</a></p>

      <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong>Message:</strong></p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; white-space: pre-wrap; word-wrap: break-word;">${escapedMessage}</div>
    </div>

    <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <p style="margin: 0; color: #666; font-size: 14px;"><strong>Project:</strong> ${escapedProjectName}</p>
      <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">Message ID: ${savedMessage.id}</p>
    </div>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">

    <p style="text-align: center; color: #999; font-size: 12px; margin: 0;">
      This email was sent via <a href="https://contactulator.rileys-projects.com" style="color: #667eea; text-decoration: none;">Contactulator</a>
    </p>
  </div>
</body>
</html>
        `,
      });

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
