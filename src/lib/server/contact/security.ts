import type { APIContext } from "astro";

type Submission = {
  projectId: string;
  email: string;
  message: string;
};

/**
 * Escapes HTML characters to prevent XSS in email content
 */
export function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
  };
  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Validates if an origin is allowed based on project configuration
 */
export function isOriginAllowed(
  origin: string | null,
  allowedOrigins: string | null,
): boolean {
  if (!origin || !allowedOrigins) return false;

  try {
    const originUrl = new URL(origin);
    const allowed = allowedOrigins
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    return allowed.some((allowedOrigin) => {
      // Exact match
      if (originUrl.origin === allowedOrigin) return true;

      // Wildcard subdomain support (e.g., *.example.com)
      if (allowedOrigin.startsWith("*.")) {
        const domain = allowedOrigin.slice(2);
        return (
          originUrl.hostname === domain ||
          originUrl.hostname.endsWith(`.${domain}`)
        );
      }

      // Check if allowed origin is a full URL
      try {
        const allowedUrl = new URL(allowedOrigin);
        return originUrl.origin === allowedUrl.origin;
      } catch {
        // If it's not a full URL, treat as hostname
        return originUrl.hostname === allowedOrigin;
      }
    });
  } catch {
    return false;
  }
}

/**
 * Validates if a redirect URL is allowed based on project configuration
 */
export function isRedirectAllowed(
  redirectUrl: string,
  allowedRedirects: string | null,
): boolean {
  if (!allowedRedirects) return false;

  try {
    const url = new URL(redirectUrl);
    const allowed = allowedRedirects
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    return allowed.some((allowedRedirect) => {
      // Wildcard subdomain support
      if (allowedRedirect.startsWith("*.")) {
        const domain = allowedRedirect.slice(2);
        return url.hostname === domain || url.hostname.endsWith(`.${domain}`);
      }

      // Exact hostname match
      if (!allowedRedirect.includes("/")) {
        return url.hostname === allowedRedirect;
      }

      // Full URL prefix match
      try {
        const allowedUrl = new URL(allowedRedirect);
        return (
          url.hostname === allowedUrl.hostname &&
          url.pathname.startsWith(allowedUrl.pathname)
        );
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

/**
 * Rate limit check for contact form submissions
 */
export async function checkRateLimit(
  context: APIContext,
  accessKey: string,
): Promise<boolean> {
  // Get client IP from Cloudflare headers or fallback
  const clientIp =
    context.request.headers.get("CF-Connecting-IP") ||
    context.request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    context.clientAddress ||
    "unknown";

  const rateLimiter = context.locals.runtime.env.RATE_LIMITER;
  const key = `contact:${accessKey}:${clientIp}`;
  const { success } = await rateLimiter.limit({ key });
  return success;
}

/**
 * Generates a hash for duplicate detection
 */
export function generateSubmissionHash({
  projectId,
  email,
  message,
}: Submission): string {
  // Simple hash for duplicate detection (consider using crypto.subtle.digest in production)
  const content = `${projectId}:${email}:${message.toLowerCase().trim()}`;
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check if this is a duplicate submission
 */
export async function isDuplicateSubmission(
  context: APIContext,
  submission: Submission,
): Promise<boolean> {
  const hash = generateSubmissionHash(submission);

  const rateLimiter = context.locals.runtime.env.DUPLICATE_LIMITER;
  const { success } = await rateLimiter.limit({ key: `duplicate:${hash}` });
  return success;
}

/**
 * Validates the referer/origin against project configuration
 */
export function validateRequestOrigin(
  context: APIContext,
  project: { allowedOrigins: string | null },
): boolean {
  // For development, allow requests without origin
  if (context.locals.runtime.env.NODE_ENV === "development") {
    return true;
  }

  const origin = context.request.headers.get("origin");
  const referer = context.request.headers.get("referer");

  // If no origin or referer, reject (likely not a browser request)
  if (!origin && !referer) {
    return false;
  }

  // Check origin first
  if (origin && isOriginAllowed(origin, project.allowedOrigins)) {
    return true;
  }

  // Check referer as fallback
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;
      return isOriginAllowed(refererOrigin, project.allowedOrigins);
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Creates CORS headers for the response
 */
export function createCorsHeaders(
  origin: string | null,
  allowedOrigins: string | null,
): HeadersInit {
  if (!origin || !isOriginAllowed(origin, allowedOrigins)) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * Check for honeypot field (spam prevention)
 * Add a hidden field in your form called "honeypot" that should remain empty
 */
export function checkHoneypot(formData: FormData): boolean {
  const honeypot = formData.get("honeypot");
  return !honeypot || honeypot === "";
}
