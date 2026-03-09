import pino from "pino";
import type { APIContext } from "astro";

/**
 * Creates a Pino logger instance configured for the contact endpoint
 *
 * Features:
 * - Structured JSON logging in production
 * - Pretty-printed logs in development
 * - Automatic request context (IP, origin, user-agent)
 * - Type-safe event logging
 */
export function createContactLogger(context: APIContext) {
  const isDevelopment = context.locals.runtime.env.NODE_ENV === "development";

  // Get client information from request
  const clientIp =
    context.request.headers.get("CF-Connecting-IP") ||
    context.request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    context.clientAddress ||
    "unknown";

  const origin = context.request.headers.get("origin") || undefined;
  const userAgent = context.request.headers.get("user-agent") || undefined;
  const referer = context.request.headers.get("referer") || undefined;

  // Create base logger with context
  const logger = pino({
    level: isDevelopment ? "debug" : "info",
    // Pretty print in development
    transport: isDevelopment
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
      : undefined,
    // Base fields included in all logs
    base: {
      service: "contact-form",
      environment: context.locals.runtime.env.NODE_ENV,
    },
  });

  // Create child logger with request context
  const contextLogger = logger.child({
    clientIp,
    origin,
    userAgent,
    referer,
  });

  // Helper to add common fields
  const withFields = (event: string, fields?: Record<string, unknown>) => ({
    event,
    ...fields,
  });

  return {
    /**
     * Log submission received
     */
    submissionReceived(accessKey: string, email: string) {
      contextLogger.info(
        withFields("submission_received", {
          accessKey,
          email,
        }),
      );
    },

    /**
     * Log project not found
     */
    projectNotFound(accessKey: string) {
      contextLogger.warn(
        withFields("project_not_found", {
          accessKey,
        }),
      );
    },

    /**
     * Log rate limit violation
     */
    rateLimited(accessKey: string) {
      contextLogger.warn(
        withFields("rate_limited", {
          accessKey,
        }),
      );
    },

    /**
     * Log duplicate submission detected
     */
    duplicateSubmission(accessKey: string, email: string) {
      contextLogger.warn(
        withFields("duplicate_submission", {
          accessKey,
          email,
        }),
      );
    },

    /**
     * Log validation failure
     */
    validationFailed(accessKey: string | undefined, errors: unknown) {
      contextLogger.warn(
        withFields("validation_failed", {
          accessKey,
          errors,
        }),
      );
    },

    /**
     * Log origin blocked
     */
    originBlocked(accessKey: string, blockedOrigin: string | null) {
      contextLogger.warn(
        withFields("origin_blocked", {
          accessKey,
          blockedOrigin,
        }),
      );
    },

    /**
     * Log redirect URL blocked
     */
    redirectBlocked(accessKey: string, redirectUrl: string) {
      contextLogger.warn(
        withFields("redirect_blocked", {
          accessKey,
          redirectUrl,
        }),
      );
    },

    /**
     * Log email sent successfully
     */
    emailSent(projectId: string, recipientCount: number) {
      contextLogger.info(
        withFields("email_sent", {
          projectId,
          recipientCount,
        }),
      );
    },

    /**
     * Log email send failure
     */
    emailFailed(projectId: string, error: string) {
      contextLogger.error(
        withFields("email_failed", {
          projectId,
          error,
        }),
      );
    },

    /**
     * Log message saved to database
     */
    messageSaved(projectId: string, messageId: string) {
      contextLogger.info(
        withFields("message_saved", {
          projectId,
          messageId,
        }),
      );
    },

    /**
     * Log honeypot triggered (spam detected)
     */
    honeypotTriggered(accessKey: string) {
      contextLogger.warn(
        withFields("honeypot_triggered", {
          accessKey,
          message: "Likely spam submission",
        }),
      );
    },

    /**
     * Log successful submission
     */
    submissionSuccess(projectId: string, email: string) {
      contextLogger.info(
        withFields("submission_success", {
          projectId,
          email,
        }),
      );
    },

    /**
     * Log warning with custom message
     */
    warn(event: string, fields?: Record<string, unknown>) {
      contextLogger.warn(withFields(event, fields));
    },

    /**
     * Log error with custom message
     */
    error(
      event: string,
      error: Error | string,
      fields?: Record<string, unknown>,
    ) {
      contextLogger.error(
        withFields(event, {
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
          ...fields,
        }),
      );
    },

    /**
     * Log info with custom message
     */
    info(event: string, fields?: Record<string, unknown>) {
      contextLogger.info(withFields(event, fields));
    },

    /**
     * Access the underlying Pino logger for advanced use cases
     */
    get raw() {
      return contextLogger;
    },
  };
}

export type ContactLogger = ReturnType<typeof createContactLogger>;
