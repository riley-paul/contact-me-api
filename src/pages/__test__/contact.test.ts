import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createDb } from "@/db";
import { Project, Message, User } from "@/db/schema";
import { POST, OPTIONS } from "../contact";
import type { APIContext } from "astro";

// Mock environment for testing
const mockEnv = {
  NODE_ENV: "test" as const,
  DATABASE_URL: "file:test.db",
  DATABASE_AUTH_TOKEN: "",
  RESEND_API_KEY: "test_key",
  GITHUB_CLIENT_ID: "test",
  GITHUB_CLIENT_SECRET: "test",
  GOOGLE_CLIENT_ID: "test",
  GOOGLE_CLIENT_SECRET: "test",
  SITE: "http://localhost:4321",
  // Mock rate limiter
  RATE_LIMITER: {
    limit: async () => ({ success: true }),
  },
  // Mock duplicate limiter
  DUPLICATE_LIMITER: {
    limit: async () => ({ success: true }),
  },
} as any;

// Mock Resend client
const mockResend = {
  emails: {
    send: async () => ({ data: { id: "test-email-id" }, error: null }),
  },
};

let testProjectId: string;
let testUserId: string;

describe("Contact Endpoint E2E Tests", () => {
  beforeAll(async () => {
    // Set up test database
    const db = createDb(mockEnv);

    // Clean up existing data
    await db.delete(Message);
    await db.delete(Project);
    await db.delete(User);

    // Create test user
    const [user] = await db
      .insert(User)
      .values({
        email: "test@example.com",
        name: "Test User",
      })
      .returning();
    testUserId = user.id;

    // Create test project with proper configuration
    const [project] = await db
      .insert(Project)
      .values({
        userId: testUserId,
        name: "Test Project",
        emails: "admin@example.com,support@example.com",
        allowedOrigins: "http://localhost:3000,https://example.com",
        allowedRedirects: "http://localhost:3000/success,https://example.com",
      })
      .returning();
    testProjectId = project.id;
  });

  afterAll(async () => {
    // Clean up test database
    const db = createDb(mockEnv);
    await db.delete(Message);
    await db.delete(Project);
    await db.delete(User);
  });

  beforeEach(async () => {
    // Clear messages before each test
    const db = createDb(mockEnv);
    await db.delete(Message);
  });

  // Helper function to create mock context
  const createMockContext = (
    formData: FormData,
    origin: string = "http://localhost:3000",
    options: {
      clientAddress?: string;
      rateLimitSuccess?: boolean;
      duplicateCheckSuccess?: boolean;
    } = {},
  ): APIContext => {
    const url = "http://localhost:4321/contact";
    const request = new Request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: origin,
      },
      body: formData,
    });

    const rateLimitSuccess = options.rateLimitSuccess ?? true;
    const duplicateCheckSuccess = options.duplicateCheckSuccess ?? true;

    return {
      request,
      clientAddress: options.clientAddress || "127.0.0.1",
      locals: {
        runtime: {
          env: {
            ...mockEnv,
            RATE_LIMITER: {
              limit: async () => ({ success: rateLimitSuccess }),
            },
            DUPLICATE_LIMITER: {
              limit: async () => ({ success: duplicateCheckSuccess }),
            },
          },
        },
      },
      redirect: (url: string) => {
        return new Response(null, {
          status: 303,
          headers: { Location: url },
        });
      },
    } as any;
  };

  describe("OPTIONS - CORS Preflight", () => {
    it("should handle CORS preflight request", async () => {
      const request = new Request("http://localhost:4321/contact", {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:3000",
        },
      });

      const context = { request } as APIContext;
      const response = await OPTIONS(context);

      expect(response.status).toBe(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
        "http://localhost:3000",
      );
      expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
        "POST",
      );
      expect(response.headers.get("Access-Control-Allow-Headers")).toContain(
        "Content-Type",
      );
    });

    it("should handle OPTIONS without origin", async () => {
      const request = new Request("http://localhost:4321/contact", {
        method: "OPTIONS",
      });

      const context = { request } as APIContext;
      const response = await OPTIONS(context);

      expect(response.status).toBe(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    });
  });

  describe("POST - Valid Submissions", () => {
    it("should successfully process a valid contact form submission", async () => {
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", "This is a test message");
      formData.set("access_key", testProjectId);
      formData.set("honeypot", "");

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/success");

      // Verify message was saved to database
      const db = createDb(mockEnv);
      const messages = await db.select().from(Message);
      expect(messages).toHaveLength(1);
      expect(messages[0].name).toBe("John Doe");
      expect(messages[0].email).toBe("john@example.com");
      expect(messages[0].content).toBe("This is a test message");
    });

    it("should redirect to custom URL when provided", async () => {
      const customRedirect = "http://localhost:3000/success";
      const formData = new FormData();
      formData.set("name", "Jane Doe");
      formData.set("email", "jane@example.com");
      formData.set("message", "Another test message");
      formData.set("access_key", testProjectId);
      formData.set("redirect_url", customRedirect);
      formData.set("honeypot", "");

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toBe(customRedirect);
    });

    it("should include CORS headers for allowed origin", async () => {
      const formData = new FormData();
      formData.set("name", "Test User");
      formData.set("email", "test@example.com");
      formData.set("message", "Test message");
      formData.set("access_key", testProjectId);
      formData.set("honeypot", "");

      const context = createMockContext(formData, "http://localhost:3000");
      const response = await POST(context);

      expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
        "http://localhost:3000",
      );
    });
  });

  describe("POST - Validation Failures", () => {
    it("should reject submission with missing name", async () => {
      const formData = new FormData();
      formData.set("email", "test@example.com");
      formData.set("message", "Test message");
      formData.set("access_key", testProjectId);

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");
      expect(response.headers.get("Location")).toContain("Invalid form data");
    });

    it("should reject submission with invalid email", async () => {
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "not-an-email");
      formData.set("message", "Test message");
      formData.set("access_key", testProjectId);

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");
    });

    it("should reject submission with empty message", async () => {
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", "");
      formData.set("access_key", testProjectId);

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");
    });

    it("should reject submission with message too long", async () => {
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", "a".repeat(1001)); // Max is 1000
      formData.set("access_key", testProjectId);

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");
    });

    it("should reject submission with invalid access key format", async () => {
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", "Test message");
      formData.set("access_key", "not-a-uuid");

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");
    });

    it("should reject submission with non-existent project", async () => {
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", "Test message");
      formData.set("access_key", "00000000-0000-0000-0000-000000000000");

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");
      expect(response.headers.get("Location")).toContain("Invalid access key");
    });
  });

  describe("POST - Security Features", () => {
    it("should reject submission when honeypot is filled", async () => {
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", "Test message");
      formData.set("access_key", testProjectId);
      formData.set("honeypot", "spam-bot-value");

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");

      // Verify message was NOT saved
      const db = createDb(mockEnv);
      const messages = await db.select().from(Message);
      expect(messages).toHaveLength(0);
    });

    it("should reject submission from disallowed origin", async () => {
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", "Test message");
      formData.set("access_key", testProjectId);
      formData.set("honeypot", "");

      const context = createMockContext(formData, "https://evil.com");
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");
      expect(response.headers.get("Location")).toContain(
        "Request origin not allowed",
      );
    });

    it("should reject submission to disallowed redirect URL", async () => {
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", "Test message");
      formData.set("access_key", testProjectId);
      formData.set("redirect_url", "https://evil.com/phishing");
      formData.set("honeypot", "");

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");
      expect(response.headers.get("Location")).toContain(
        "Redirect URL not allowed",
      );
    });

    it("should handle rate limiting", async () => {
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", "Test message");
      formData.set("access_key", testProjectId);
      formData.set("honeypot", "");

      const context = createMockContext(formData, "http://localhost:3000", {
        rateLimitSuccess: false,
      });
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");
      expect(response.headers.get("Location")).toContain("Too many requests");

      // Verify message was NOT saved
      const db = createDb(mockEnv);
      const messages = await db.select().from(Message);
      expect(messages).toHaveLength(0);
    });

    it("should detect duplicate submissions", async () => {
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", "Test message");
      formData.set("access_key", testProjectId);
      formData.set("honeypot", "");

      const context = createMockContext(formData, "http://localhost:3000", {
        duplicateCheckSuccess: false,
      });
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");
      expect(response.headers.get("Location")).toContain(
        "Duplicate submission",
      );
    });
  });

  describe("POST - Edge Cases", () => {
    it("should trim whitespace from inputs", async () => {
      const formData = new FormData();
      formData.set("name", "  John Doe  ");
      formData.set("email", "  john@example.com  ");
      formData.set("message", "  Test message  ");
      formData.set("access_key", testProjectId);
      formData.set("honeypot", "");

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/success");

      // Verify trimmed data in database
      const db = createDb(mockEnv);
      const messages = await db.select().from(Message);
      expect(messages[0].name).toBe("John Doe");
      expect(messages[0].email).toBe("john@example.com");
      expect(messages[0].content).toBe("Test message");
    });

    it("should handle special characters in message", async () => {
      const specialMessage = `Hello! 你好 🚀 <script>alert('xss')</script> & "quotes"`;
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", specialMessage);
      formData.set("access_key", testProjectId);
      formData.set("honeypot", "");

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/success");

      // Verify special characters preserved
      const db = createDb(mockEnv);
      const messages = await db.select().from(Message);
      expect(messages[0].content).toBe(specialMessage);
    });

    it("should handle multiple messages from same user", async () => {
      // First submission
      const formData1 = new FormData();
      formData1.set("name", "John Doe");
      formData1.set("email", "john@example.com");
      formData1.set("message", "First message");
      formData1.set("access_key", testProjectId);
      formData1.set("honeypot", "");

      const context1 = createMockContext(formData1);
      await POST(context1);

      // Second submission with different message
      const formData2 = new FormData();
      formData2.set("name", "John Doe");
      formData2.set("email", "john@example.com");
      formData2.set("message", "Second message");
      formData2.set("access_key", testProjectId);
      formData2.set("honeypot", "");

      const context2 = createMockContext(formData2);
      const response2 = await POST(context2);

      expect(response2.status).toBe(303);
      expect(response2.headers.get("Location")).toContain("/success");

      // Verify both messages saved
      const db = createDb(mockEnv);
      const messages = await db.select().from(Message);
      expect(messages).toHaveLength(2);
    });

    it("should handle very long but valid inputs", async () => {
      const formData = new FormData();
      formData.set("name", "a".repeat(100)); // Max length
      formData.set("email", "test@" + "a".repeat(90) + ".com"); // Close to max
      formData.set("message", "m".repeat(1000)); // Max length
      formData.set("access_key", testProjectId);
      formData.set("honeypot", "");

      const context = createMockContext(formData);
      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/success");
    });
  });

  describe("POST - Origin and Referer Validation", () => {
    it("should accept request with valid referer when origin is missing", async () => {
      const formData = new FormData();
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", "Test message");
      formData.set("access_key", testProjectId);
      formData.set("honeypot", "");

      const url = "http://localhost:4321/contact";
      const request = new Request(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: "http://localhost:3000/contact-page",
        },
        body: formData,
      });

      const context = {
        ...createMockContext(formData),
        request,
      };

      const response = await POST(context);

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/success");
    });
  });
});
