import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, getApplicantChatMock, createApplicantMessageMock, getApplicantPersistenceSetupMock } =
  vi.hoisted(() => ({
    authMock: vi.fn(),
    getApplicantChatMock: vi.fn(),
    createApplicantMessageMock: vi.fn(),
    getApplicantPersistenceSetupMock: vi.fn()
  }));

vi.mock("@/auth", () => ({
  auth: authMock
}));

vi.mock("@/applicant/data", () => ({
  getApplicantChat: getApplicantChatMock,
  createApplicantMessage: createApplicantMessageMock
}));

vi.mock("@/applicant/config", () => ({
  getApplicantPersistenceSetup: getApplicantPersistenceSetupMock
}));

import { GET, POST } from "../../app/api/application/chat/route";

describe("application chat api route", () => {
  beforeEach(() => {
    authMock.mockReset();
    getApplicantChatMock.mockReset();
    createApplicantMessageMock.mockReset();
    getApplicantPersistenceSetupMock.mockReset();
  });

  it("rejects unauthenticated chat requests", async () => {
    authMock.mockResolvedValue(null);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error.code).toBe("unauthorized");
  });

  it("returns existing chat messages for authenticated users", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com" } });
    getApplicantChatMock.mockResolvedValue({
      setup: { ready: true, issues: [] },
      application: { id: 1, accountEmail: "user@example.com" },
      messages: [{ id: 10, body: "hello" }],
      error: null
    });

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.messages).toHaveLength(1);
    expect(getApplicantChatMock).toHaveBeenCalledWith("user@example.com");
  });

  it("validates new chat messages before saving", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    getApplicantPersistenceSetupMock.mockReturnValue({
      ready: true,
      issues: []
    });

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
    expect(createApplicantMessageMock).not.toHaveBeenCalled();
  });
});
