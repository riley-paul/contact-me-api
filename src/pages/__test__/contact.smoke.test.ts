import { describe, it, expect } from "vitest";

/**
 * Smoke Test for Contact Endpoint Testing Setup
 *
 * This test verifies that the testing infrastructure is properly set up.
 * If this test passes, your environment is ready for more complex tests.
 *
 * Run with: npm test contact.smoke.test.ts
 */

describe("Contact Endpoint - Smoke Test", () => {
  it("should pass basic sanity check", () => {
    expect(true).toBe(true);
  });

  it("should have access to test environment", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it("should be able to create FormData", () => {
    const formData = new FormData();
    formData.append("test", "value");
    expect(formData.get("test")).toBe("value");
  });

  it("should be able to use fetch API", () => {
    expect(typeof fetch).toBe("function");
  });

  it("should be able to create Request objects", () => {
    const request = new Request("http://localhost:4321/contact", {
      method: "POST",
    });
    expect(request.method).toBe("POST");
    expect(request.url).toBe("http://localhost:4321/contact");
  });

  it("should be able to work with Headers", () => {
    const headers = new Headers();
    headers.set("Origin", "http://localhost:3000");
    expect(headers.get("Origin")).toBe("http://localhost:3000");
  });

  it("should be able to create Response objects", () => {
    const response = new Response(null, {
      status: 303,
      headers: { Location: "/success" },
    });
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("/success");
  });

  it("should be able to generate UUIDs", () => {
    const uuid = crypto.randomUUID();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it("should be able to work with URLSearchParams", () => {
    const params = new URLSearchParams();
    params.set("message", "Test error message");
    const url = `/failure?${params.toString()}`;
    expect(url).toContain("message=Test+error+message");
  });

  it("should be able to parse URLs", () => {
    const url = new URL("http://localhost:3000/success?status=ok");
    expect(url.hostname).toBe("localhost");
    expect(url.pathname).toBe("/success");
    expect(url.searchParams.get("status")).toBe("ok");
  });
});

describe("Contact Endpoint - Module Imports", () => {
  it("should be able to import security functions", async () => {
    const { isOriginAllowed, isRedirectAllowed, checkHoneypot } = await import(
      "@/lib/server/contact/security"
    );

    expect(typeof isOriginAllowed).toBe("function");
    expect(typeof isRedirectAllowed).toBe("function");
    expect(typeof checkHoneypot).toBe("function");
  });

  it("should be able to import database functions", async () => {
    const { createDb } = await import("@/db");
    expect(typeof createDb).toBe("function");
  });

  it("should be able to import schema", async () => {
    const { Project, Message, User } = await import("@/db/schema");
    expect(Project).toBeDefined();
    expect(Message).toBeDefined();
    expect(User).toBeDefined();
  });

  it("should be able to import contact form schema", async () => {
    const { contactFormSchema } = await import("@/lib/types");
    expect(contactFormSchema).toBeDefined();

    // Test valid data
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      message: "Test message",
      access_key: crypto.randomUUID(),
      honeypot: "",
    };

    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should be able to import contact endpoint", async () => {
    const { POST, OPTIONS } = await import("../contact");
    expect(typeof POST).toBe("function");
    expect(typeof OPTIONS).toBe("function");
  });
});

describe("Contact Endpoint - Security Functions Basics", () => {
  it("should validate simple origin correctly", async () => {
    const { isOriginAllowed } = await import("@/lib/server/contact/security");

    expect(
      isOriginAllowed("http://localhost:3000", "http://localhost:3000"),
    ).toBe(true);
    expect(isOriginAllowed("http://evil.com", "http://localhost:3000")).toBe(
      false,
    );
  });

  it("should check honeypot correctly", async () => {
    const { checkHoneypot } = await import("@/lib/server/contact/security");

    const emptyHoneypot = new FormData();
    emptyHoneypot.set("honeypot", "");
    expect(checkHoneypot(emptyHoneypot)).toBe(true);

    const filledHoneypot = new FormData();
    filledHoneypot.set("honeypot", "spam");
    expect(checkHoneypot(filledHoneypot)).toBe(false);
  });

  it("should generate consistent hashes", async () => {
    const { generateSubmissionHash } = await import(
      "@/lib/server/contact/security"
    );

    const submission = {
      projectId: "test-project",
      email: "test@example.com",
      message: "Test message",
    };

    const hash1 = generateSubmissionHash(submission);
    const hash2 = generateSubmissionHash(submission);

    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[0-9a-z]+$/);
  });
});

describe("Contact Endpoint - Form Validation", () => {
  it("should validate correct form data", async () => {
    const { contactFormSchema } = await import("@/lib/types");

    const validData = {
      name: "John Doe",
      email: "john@example.com",
      message: "This is a test message",
      access_key: crypto.randomUUID(),
      honeypot: "",
    };

    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", async () => {
    const { contactFormSchema } = await import("@/lib/types");

    const invalidData = {
      name: "John Doe",
      email: "not-an-email",
      message: "Test message",
      access_key: crypto.randomUUID(),
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject missing required fields", async () => {
    const { contactFormSchema } = await import("@/lib/types");

    const invalidData = {
      name: "John Doe",
      // Missing email and message
      access_key: crypto.randomUUID(),
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject message too long", async () => {
    const { contactFormSchema } = await import("@/lib/types");

    const invalidData = {
      name: "John Doe",
      email: "john@example.com",
      message: "a".repeat(1001), // Max is 1000
      access_key: crypto.randomUUID(),
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject invalid UUID for access_key", async () => {
    const { contactFormSchema } = await import("@/lib/types");

    const invalidData = {
      name: "John Doe",
      email: "john@example.com",
      message: "Test message",
      access_key: "not-a-uuid",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

// Success message
console.log("\n✅ Smoke test file loaded successfully!");
console.log(
  "If you see test results above, your setup is working correctly.\n",
);
