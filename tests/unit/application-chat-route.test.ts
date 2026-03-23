import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authMock,
  getApplicantAiChatMock,
  createApplicantAiMessageMock,
  getApplicantPersistenceSetupMock,
  hasGroqApiKeyMock,
  requestGroqCompletionMock
} = vi.hoisted(() => ({
  authMock: vi.fn(),
  getApplicantAiChatMock: vi.fn(),
  createApplicantAiMessageMock: vi.fn(),
  getApplicantPersistenceSetupMock: vi.fn(),
  hasGroqApiKeyMock: vi.fn(),
  requestGroqCompletionMock: vi.fn()
}));

vi.mock("@/auth", () => ({
  auth: authMock
}));

vi.mock("@/applicant/data", () => ({
  getApplicantAiChat: getApplicantAiChatMock,
  createApplicantAiMessage: createApplicantAiMessageMock
}));

vi.mock("@/applicant/config", () => ({
  getApplicantPersistenceSetup: getApplicantPersistenceSetupMock
}));

vi.mock("@/lib/groq", () => ({
  hasGroqApiKey: hasGroqApiKeyMock,
  requestGroqCompletion: requestGroqCompletionMock
}));

import { GET, POST } from "../../app/api/application/chat/route";

describe("application chat api route", () => {
  beforeEach(() => {
    authMock.mockReset();
    getApplicantAiChatMock.mockReset();
    createApplicantAiMessageMock.mockReset();
    getApplicantPersistenceSetupMock.mockReset();
    hasGroqApiKeyMock.mockReset();
    requestGroqCompletionMock.mockReset();
  });

  it("rejects unauthenticated chat requests", async () => {
    authMock.mockResolvedValue(null);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error.code).toBe("unauthorized");
  });

  it("returns existing AI chat messages for authenticated users", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com" } });
    getApplicantAiChatMock.mockResolvedValue({
      setup: { ready: true, issues: [] },
      application: { id: 1, accountEmail: "user@example.com" },
      messages: [{ id: 10, role: "assistant", content: "hello" }],
      error: null
    });

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.messages).toHaveLength(1);
    expect(getApplicantAiChatMock).toHaveBeenCalledWith("user@example.com");
  });

  it("validates new chat messages before requesting AI", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    getApplicantPersistenceSetupMock.mockReturnValue({
      ready: true,
      issues: []
    });
    hasGroqApiKeyMock.mockReturnValue(true);

    const response = await POST(
      new Request("http://localhost/api/application/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: "   " })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("invalid_body");
    expect(requestGroqCompletionMock).not.toHaveBeenCalled();
  });

  it("stores both user and assistant messages after a successful AI reply", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    getApplicantPersistenceSetupMock.mockReturnValue({
      ready: true,
      issues: []
    });
    hasGroqApiKeyMock.mockReturnValue(true);
    getApplicantAiChatMock.mockResolvedValue({
      setup: { ready: true, issues: [] },
      application: { id: 4, projectTitle: "Smart grid" },
      messages: [],
      error: null,
      errorCode: null
    });
    requestGroqCompletionMock.mockResolvedValue("Assistant reply");
    createApplicantAiMessageMock
      .mockResolvedValueOnce({ id: 1, role: "user", content: "My message" })
      .mockResolvedValueOnce({ id: 2, role: "assistant", content: "Assistant reply" });

    const response = await POST(
      new Request("http://localhost/api/application/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: "My message", locale: "en" })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(requestGroqCompletionMock).toHaveBeenCalledTimes(1);
    expect(createApplicantAiMessageMock).toHaveBeenCalledTimes(2);
    expect(payload.messages).toHaveLength(2);
  });
});
