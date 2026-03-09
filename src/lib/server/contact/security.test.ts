import { describe, it, expect } from "vitest";
import {
  isOriginAllowed,
  isRedirectAllowed,
  generateSubmissionHash,
  checkHoneypot,
} from "./security";

describe("isOriginAllowed", () => {
  it("should return false for null origin", () => {
    expect(isOriginAllowed(null, "https://example.com")).toBe(false);
  });

  it("should return false for null allowedOrigins", () => {
    expect(isOriginAllowed("https://example.com", null)).toBe(false);
  });

  it("should return false for empty allowedOrigins", () => {
    expect(isOriginAllowed("https://example.com", "")).toBe(false);
  });

  it("should allow exact origin match", () => {
    expect(isOriginAllowed("https://example.com", "https://example.com")).toBe(
      true,
    );
  });

  it("should allow origin in comma-separated list", () => {
    const allowed = "https://example.com,https://test.com,https://app.com";
    expect(isOriginAllowed("https://test.com", allowed)).toBe(true);
  });

  it("should handle whitespace in comma-separated list", () => {
    const allowed = "https://example.com, https://test.com , https://app.com";
    expect(isOriginAllowed("https://test.com", allowed)).toBe(true);
  });

  it("should reject unlisted origin", () => {
    expect(isOriginAllowed("https://evil.com", "https://example.com")).toBe(
      false,
    );
  });

  it("should support wildcard subdomains", () => {
    const allowed = "*.example.com";
    expect(isOriginAllowed("https://www.example.com", allowed)).toBe(true);
    expect(isOriginAllowed("https://api.example.com", allowed)).toBe(true);
    expect(isOriginAllowed("https://app.api.example.com", allowed)).toBe(true);
  });

  it("should allow base domain with wildcard", () => {
    const allowed = "*.example.com";
    expect(isOriginAllowed("https://example.com", allowed)).toBe(true);
  });

  it("should not match different domains with wildcard", () => {
    const allowed = "*.example.com";
    expect(isOriginAllowed("https://example.org", allowed)).toBe(false);
    expect(isOriginAllowed("https://notexample.com", allowed)).toBe(false);
  });

  it("should handle hostname-only allowed origins", () => {
    expect(isOriginAllowed("https://example.com", "example.com")).toBe(true);
    expect(isOriginAllowed("http://example.com", "example.com")).toBe(true);
  });

  it("should be protocol-sensitive for full URLs", () => {
    expect(isOriginAllowed("http://example.com", "https://example.com")).toBe(
      false,
    );
    expect(isOriginAllowed("https://example.com", "https://example.com")).toBe(
      true,
    );
  });

  it("should handle invalid origin gracefully", () => {
    expect(isOriginAllowed("not-a-url", "https://example.com")).toBe(false);
  });

  it("should handle port numbers", () => {
    expect(
      isOriginAllowed("http://localhost:3000", "http://localhost:3000"),
    ).toBe(true);
    expect(
      isOriginAllowed("http://localhost:3000", "http://localhost:4000"),
    ).toBe(false);
  });
});

describe("isRedirectAllowed", () => {
  it("should return false for null allowedRedirects", () => {
    expect(isRedirectAllowed("https://example.com", null)).toBe(false);
  });

  it("should return false for empty allowedRedirects", () => {
    expect(isRedirectAllowed("https://example.com", "")).toBe(false);
  });

  it("should allow exact hostname match", () => {
    expect(isRedirectAllowed("https://example.com/path", "example.com")).toBe(
      true,
    );
  });

  it("should allow hostname in comma-separated list", () => {
    const allowed = "example.com,test.com,app.com";
    expect(isRedirectAllowed("https://test.com/page", allowed)).toBe(true);
  });

  it("should support wildcard subdomains", () => {
    const allowed = "*.example.com";
    expect(isRedirectAllowed("https://www.example.com", allowed)).toBe(true);
    expect(isRedirectAllowed("https://api.example.com", allowed)).toBe(true);
  });

  it("should allow base domain with wildcard", () => {
    const allowed = "*.example.com";
    expect(isRedirectAllowed("https://example.com", allowed)).toBe(true);
  });

  it("should match URL prefix", () => {
    const allowed = "https://example.com/success";
    expect(isRedirectAllowed("https://example.com/success", allowed)).toBe(
      true,
    );
    expect(isRedirectAllowed("https://example.com/success/page", allowed)).toBe(
      true,
    );
    expect(isRedirectAllowed("https://example.com/other", allowed)).toBe(false);
  });

  it("should reject different domains", () => {
    expect(isRedirectAllowed("https://evil.com", "example.com")).toBe(false);
  });

  it("should handle invalid redirect URL gracefully", () => {
    expect(isRedirectAllowed("not-a-url", "example.com")).toBe(false);
  });

  it("should handle whitespace in allowed list", () => {
    const allowed = "example.com, test.com , app.com";
    expect(isRedirectAllowed("https://test.com", allowed)).toBe(true);
  });

  it("should reject subdomain if not wildcarded", () => {
    expect(isRedirectAllowed("https://www.example.com", "example.com")).toBe(
      false,
    );
  });
});

describe("generateSubmissionHash", () => {
  it("should generate consistent hash for same inputs", () => {
    const hash1 = generateSubmissionHash({
      projectId: "proj-1",
      email: "test@example.com",
      message: "Hello",
    });
    const hash2 = generateSubmissionHash({
      projectId: "proj-1",
      email: "test@example.com",
      message: "Hello",
    });
    expect(hash1).toBe(hash2);
  });

  it("should generate different hashes for different projects", () => {
    const hash1 = generateSubmissionHash({
      projectId: "proj-1",
      email: "test@example.com",
      message: "Hello",
    });
    const hash2 = generateSubmissionHash({
      projectId: "proj-2",
      email: "test@example.com",
      message: "Hello",
    });
    expect(hash1).not.toBe(hash2);
  });

  it("should generate different hashes for different emails", () => {
    const hash1 = generateSubmissionHash({
      projectId: "proj-1",
      email: "test1@example.com",
      message: "Hello",
    });
    const hash2 = generateSubmissionHash({
      projectId: "proj-1",
      email: "test2@example.com",
      message: "Hello",
    });
    expect(hash1).not.toBe(hash2);
  });

  it("should generate different hashes for different messages", () => {
    const hash1 = generateSubmissionHash({
      projectId: "proj-1",
      email: "test@example.com",
      message: "Hello",
    });
    const hash2 = generateSubmissionHash({
      projectId: "proj-1",
      email: "test@example.com",
      message: "World",
    });
    expect(hash1).not.toBe(hash2);
  });

  it("should normalize message case", () => {
    const hash1 = generateSubmissionHash({
      projectId: "proj-1",
      email: "test@example.com",
      message: "HELLO",
    });
    const hash2 = generateSubmissionHash({
      projectId: "proj-1",
      email: "test@example.com",
      message: "hello",
    });
    expect(hash1).toBe(hash2);
  });

  it("should normalize message whitespace", () => {
    const hash1 = generateSubmissionHash({
      projectId: "proj-1",
      email: "test@example.com",
      message: "  Hello  ",
    });
    const hash2 = generateSubmissionHash({
      projectId: "proj-1",
      email: "test@example.com",
      message: "Hello",
    });
    expect(hash1).toBe(hash2);
  });

  it("should return base36 string", () => {
    const hash = generateSubmissionHash({
      projectId: "proj-1",
      email: "test@example.com",
      message: "Hello",
    });
    expect(hash).toMatch(/^[0-9a-z]+$/);
  });
});

// describe("isDuplicateSubmission", () => {
//   beforeEach(() => {
//     // Clear any cached state between tests
//     // Note: This test assumes the implementation uses in-memory storage
//     // In real implementation, you might need to expose a reset method
//   });

//   it("should not detect first submission as duplicate", () => {
//     const isDup = isDuplicateSubmission({projectId: "proj-1", email: "test@example.com", message: "Hello"});
//     expect(isDup).toBe(false);
//   });

//   it("should detect immediate duplicate submission", () => {
//     isDuplicateSubmission({projectId: "proj-1", email: "test@example.com", message: "Test message"});
//     const isDup = isDuplicateSubmission({projectId: "proj-1", email: "test@example.com", message: "Test message"});
//     expect(isDup).toBe(true);
//   });

//   it("should allow same message from different emails", () => {
//     isDuplicateSubmission({projectId: "proj-1", email: "user1@example.com", message: "Same message"});
//     const isDup = isDuplicateSubmission({projectId: "proj-1", email: "user2@example.com", message: "Same message"});
//     expect(isDup).toBe(false);
//   });

//   it("should allow same message to different projects", () => {
//     isDuplicateSubmission({projectId: "proj-1", email: "test@example.com", message: "Same message"});
//     const isDup = isDuplicateSubmission({projectId: "proj-2", email: "test@example.com", message: "Same message"});
//     expect(isDup).toBe(false);
//   });

//   it("should treat case-insensitive messages as duplicates", () => {
//     isDuplicateSubmission({projectId: "proj-1", email: "test@example.com", message: "HELLO"});
//     const isDup = isDuplicateSubmission({projectId: "proj-1", email: "test@example.com", message: "hello"});
//     expect(isDup).toBe(true);
//   });

//   it("should treat whitespace-normalized messages as duplicates", () => {
//     isDuplicateSubmission({projectId: "proj-1", email: "test@example.com", message: "  Hello  World  "});
//     const isDup = isDuplicateSubmission({ projectId: "proj-1", email: "test@example.com", message: "Hello  World" });
//     expect(isDup).toBe(true);
//   });
// });

describe("checkHoneypot", () => {
  it("should pass when honeypot is empty", () => {
    const formData = new FormData();
    formData.set("honeypot", "");
    expect(checkHoneypot(formData)).toBe(true);
  });

  it("should pass when honeypot is not present", () => {
    const formData = new FormData();
    expect(checkHoneypot(formData)).toBe(true);
  });

  it("should fail when honeypot is filled", () => {
    const formData = new FormData();
    formData.set("honeypot", "spam-bot-value");
    expect(checkHoneypot(formData)).toBe(false);
  });

  it("should fail when honeypot has whitespace", () => {
    const formData = new FormData();
    formData.set("honeypot", "   ");
    expect(checkHoneypot(formData)).toBe(false);
  });

  it("should pass for multiple form fields with empty honeypot", () => {
    const formData = new FormData();
    formData.set("name", "John Doe");
    formData.set("email", "john@example.com");
    formData.set("message", "Hello");
    formData.set("honeypot", "");
    expect(checkHoneypot(formData)).toBe(true);
  });
});
