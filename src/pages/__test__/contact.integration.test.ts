import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createDb } from "@/db";
import { Project, Message, User } from "@/db/schema";
import type { Environment } from "@/envs";
import { createTables } from "@/db/test-setup";

/**
 * Integration Tests for Contact Endpoint
 *
 * These tests use real HTTP requests to test the contact endpoint.
 * Run the dev server before executing these tests:
 *
 * Terminal 1: npm run dev
 * Terminal 2: npm run test contact.integration.test.ts
 */

const BASE_URL = "http://localhost:4321";

const testEnv = { NODE_ENV: "test" } as Environment;

let testProjectId: string;
let testUserId: string;

describe.skip("Contact Endpoint Integration Tests", () => {
  beforeAll(async () => {
    const db = createDb(testEnv);
    await createTables(db);

    // Create test user
    const [user] = await db
      .insert(User)
      .values({
        email: "integration-test@example.com",
        name: "Integration Test User",
      })
      .returning();
    testUserId = user.id;

    // Create test project
    const [project] = await db
      .insert(Project)
      .values({
        userId: testUserId,
        name: "Integration Test Project",
        emails: "test-admin@example.com",
        allowedOrigins: "http://localhost:4321,http://localhost:3000",
        allowedRedirects:
          "http://localhost:3000/success,http://localhost:4321/success",
      })
      .returning();
    testProjectId = project.id;

    console.log(`Test Project ID: ${testProjectId}`);
  });

  afterAll(async () => {
    const db = createDb(testEnv);
    await db.delete(Message);
    await db.delete(Project);
    await db.delete(User);
  });

  beforeEach(async () => {
    // Clear messages before each test
    const db = createDb(testEnv);
    await db.delete(Message);
  });

  describe("CORS Preflight", () => {
    it("should handle OPTIONS request", async () => {
      const response = await fetch(`${BASE_URL}/contact`, {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:3000",
        },
      });

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
  });

  describe("Successful Submissions", () => {
    it("should successfully submit a contact form", async () => {
      const formData = new FormData();
      formData.append("name", "Integration Test User");
      formData.append("email", "user@example.com");
      formData.append("message", "This is an integration test message");
      formData.append("access_key", testProjectId);
      formData.append("honeypot", "");

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: {
          Origin: "http://localhost:3000",
        },
        body: formData,
        redirect: "manual", // Don't follow redirects automatically
      });

      expect(response.status).toBe(303);
      const location = response.headers.get("Location");
      expect(location).toContain("/success");

      // Verify in database
      const db = createDb(testEnv);
      const messages = await db.select().from(Message);
      expect(messages).toHaveLength(1);
      expect(messages[0].name).toBe("Integration Test User");
      expect(messages[0].email).toBe("user@example.com");
      expect(messages[0].content).toBe("This is an integration test message");
    });

    it("should redirect to custom URL when provided", async () => {
      const customRedirect = "http://localhost:3000/success";
      const formData = new FormData();
      formData.append("name", "Test User");
      formData.append("email", "test@example.com");
      formData.append("message", "Test with custom redirect");
      formData.append("access_key", testProjectId);
      formData.append("redirect_url", customRedirect);
      formData.append("honeypot", "");

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: {
          Origin: "http://localhost:3000",
        },
        body: formData,
        redirect: "manual",
      });

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toBe(customRedirect);
    });

    it("should include CORS headers in response", async () => {
      const formData = new FormData();
      formData.append("name", "CORS Test User");
      formData.append("email", "cors@example.com");
      formData.append("message", "Testing CORS headers");
      formData.append("access_key", testProjectId);
      formData.append("honeypot", "");

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: {
          Origin: "http://localhost:3000",
        },
        body: formData,
        redirect: "manual",
      });

      expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
        "http://localhost:3000",
      );
    });
  });

  describe("Validation Failures", () => {
    it("should reject submission with missing required fields", async () => {
      const formData = new FormData();
      formData.append("name", "Test User");
      // Missing email and message
      formData.append("access_key", testProjectId);

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        body: formData,
        redirect: "manual",
      });

      expect(response.status).toBe(303);
      const location = response.headers.get("Location");
      expect(location).toContain("/failure");
      expect(location).toContain("Invalid form data");
    });

    it("should reject submission with invalid email format", async () => {
      const formData = new FormData();
      formData.append("name", "Test User");
      formData.append("email", "not-an-email");
      formData.append("message", "Test message");
      formData.append("access_key", testProjectId);

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        body: formData,
        redirect: "manual",
      });

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");

      // Verify no message saved
      const db = createDb(testEnv);
      const messages = await db.select().from(Message);
      expect(messages).toHaveLength(0);
    });

    it("should reject submission with invalid access key", async () => {
      const formData = new FormData();
      formData.append("name", "Test User");
      formData.append("email", "test@example.com");
      formData.append("message", "Test message");
      formData.append("access_key", "00000000-0000-0000-0000-000000000000");
      formData.append("honeypot", "");

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        body: formData,
        redirect: "manual",
      });

      expect(response.status).toBe(303);
      const location = response.headers.get("Location");
      expect(location).toContain("/failure");
      expect(location).toContain("Invalid access key");
    });

    it("should reject submission with message too long", async () => {
      const formData = new FormData();
      formData.append("name", "Test User");
      formData.append("email", "test@example.com");
      formData.append("message", "a".repeat(1001)); // Max is 1000
      formData.append("access_key", testProjectId);

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        body: formData,
        redirect: "manual",
      });

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");
    });
  });

  describe("Security Features", () => {
    it("should reject submission with filled honeypot", async () => {
      const formData = new FormData();
      formData.append("name", "Bot User");
      formData.append("email", "bot@example.com");
      formData.append("message", "Spam message");
      formData.append("access_key", testProjectId);
      formData.append("honeypot", "bot-filled-this");

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        body: formData,
        redirect: "manual",
      });

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/failure");

      // Verify no message saved
      const db = createDb(testEnv);
      const messages = await db.select().from(Message);
      expect(messages).toHaveLength(0);
    });

    it("should reject submission with disallowed redirect URL", async () => {
      const formData = new FormData();
      formData.append("name", "Test User");
      formData.append("email", "test@example.com");
      formData.append("message", "Test message");
      formData.append("access_key", testProjectId);
      formData.append("redirect_url", "https://evil.com/phishing");
      formData.append("honeypot", "");

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: {
          Origin: "http://localhost:3000",
        },
        body: formData,
        redirect: "manual",
      });

      expect(response.status).toBe(303);
      const location = response.headers.get("Location");
      expect(location).toContain("/failure");
      expect(location).toContain("Redirect URL not allowed");
    });
  });

  describe("Real-world Scenarios", () => {
    it("should handle form submission with special characters", async () => {
      const formData = new FormData();
      formData.append("name", "José García-López");
      formData.append("email", "jose.garcia@example.com");
      formData.append(
        "message",
        "Hello! 你好 🚀 Testing special chars: & < > \" ' @#$%",
      );
      formData.append("access_key", testProjectId);
      formData.append("honeypot", "");

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: {
          Origin: "http://localhost:3000",
        },
        body: formData,
        redirect: "manual",
      });

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/success");

      // Verify special characters preserved
      const db = createDb(testEnv);
      const messages = await db.select().from(Message);
      expect(messages[0].name).toBe("José García-López");
      expect(messages[0].content).toContain("你好");
      expect(messages[0].content).toContain("🚀");
    });

    it("should handle form submission with multiline message", async () => {
      const multilineMessage = `This is line 1
This is line 2
This is line 3

With a blank line above.`;

      const formData = new FormData();
      formData.append("name", "Test User");
      formData.append("email", "test@example.com");
      formData.append("message", multilineMessage);
      formData.append("access_key", testProjectId);
      formData.append("honeypot", "");

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: {
          Origin: "http://localhost:3000",
        },
        body: formData,
        redirect: "manual",
      });

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/success");

      // Verify multiline preserved
      const db = createDb(testEnv);
      const messages = await db.select().from(Message);
      expect(messages[0].content).toBe(multilineMessage);
    });

    it("should handle multiple submissions from different users", async () => {
      const users = [
        {
          name: "Alice",
          email: "alice@example.com",
          message: "Message from Alice",
        },
        { name: "Bob", email: "bob@example.com", message: "Message from Bob" },
        {
          name: "Charlie",
          email: "charlie@example.com",
          message: "Message from Charlie",
        },
      ];

      for (const user of users) {
        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("message", user.message);
        formData.append("access_key", testProjectId);
        formData.append("honeypot", "");

        const response = await fetch(`${BASE_URL}/contact`, {
          method: "POST",
          headers: {
            Origin: "http://localhost:3000",
          },
          body: formData,
          redirect: "manual",
        });

        expect(response.status).toBe(303);
        expect(response.headers.get("Location")).toContain("/success");

        // Small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Verify all messages saved
      const db = createDb(testEnv);
      const messages = await db.select().from(Message);
      expect(messages).toHaveLength(3);
      expect(messages.map((m) => m.name)).toEqual(
        expect.arrayContaining(["Alice", "Bob", "Charlie"]),
      );
    });
  });

  describe("Content-Type Variations", () => {
    it("should handle FormData submission", async () => {
      const formData = new FormData();
      formData.append("name", "FormData User");
      formData.append("email", "formdata@example.com");
      formData.append("message", "Sent via FormData");
      formData.append("access_key", testProjectId);
      formData.append("honeypot", "");

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: {
          Origin: "http://localhost:3000",
        },
        body: formData,
        redirect: "manual",
      });

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/success");
    });

    it("should handle URL-encoded form submission", async () => {
      const params = new URLSearchParams();
      params.append("name", "URLEncoded User");
      params.append("email", "urlencoded@example.com");
      params.append("message", "Sent via URL encoding");
      params.append("access_key", testProjectId);
      params.append("honeypot", "");

      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "http://localhost:3000",
        },
        body: params.toString(),
        redirect: "manual",
      });

      expect(response.status).toBe(303);
      expect(response.headers.get("Location")).toContain("/success");

      const db = createDb(testEnv);
      const messages = await db.select().from(Message);
      expect(messages[0].name).toBe("URLEncoded User");
    });
  });
});
