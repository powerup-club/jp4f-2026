import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authMock,
  getApplicantWorkspaceMock,
  saveApplicantQuizAttemptMock,
  getApplicantPersistenceSetupMock
} = vi.hoisted(() => ({
  authMock: vi.fn(),
  getApplicantWorkspaceMock: vi.fn(),
  saveApplicantQuizAttemptMock: vi.fn(),
  getApplicantPersistenceSetupMock: vi.fn()
}));

vi.mock("@/auth", () => ({
  auth: authMock
}));

vi.mock("@/applicant/data", () => ({
  getApplicantWorkspace: getApplicantWorkspaceMock,
  saveApplicantQuizAttempt: saveApplicantQuizAttemptMock
}));

vi.mock("@/applicant/config", () => ({
  getApplicantPersistenceSetup: getApplicantPersistenceSetupMock
}));

import { POST } from "../../app/api/application/quiz/route";

describe("application quiz api route", () => {
  beforeEach(() => {
    authMock.mockReset();
    getApplicantWorkspaceMock.mockReset();
    saveApplicantQuizAttemptMock.mockReset();
    getApplicantPersistenceSetupMock.mockReset();
  });

  it("rejects incomplete quiz payloads", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    getApplicantPersistenceSetupMock.mockReturnValue({
      ready: true,
      issues: []
    });

    const response = await POST(
      new Request("http://localhost/api/application/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branch: "GI",
          profile: ""
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("invalid_body");
  });

  it("stores the quiz attempt and returns skipped when no script URL is configured", async () => {
    const previousQuizUrl = process.env.GOOGLE_SCRIPT_URL_QUIZ;
    const previousScriptUrl = process.env.GOOGLE_SCRIPT_URL;
    delete process.env.GOOGLE_SCRIPT_URL_QUIZ;
    delete process.env.GOOGLE_SCRIPT_URL;

    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    getApplicantPersistenceSetupMock.mockReturnValue({
      ready: true,
      issues: []
    });
    getApplicantWorkspaceMock.mockResolvedValue({
      application: { id: 21 },
      error: null,
      errorCode: null
    });
    saveApplicantQuizAttemptMock.mockResolvedValue({
      id: 8,
      branch: "GI"
    });

    try {
      const response = await POST(
        new Request("http://localhost/api/application/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: "Test",
            lastName: "User",
            lang: "fr",
            branch: "GI",
            profile: "Structured thinker",
            description: "Detailed description",
            tagline: "Sharp and reliable",
            why: "Strong process mindset",
            history: [{ q: "Q1", a: "A1" }],
            rating: 4,
            comment: "Useful quiz"
          })
        })
      );
      const payload = await response.json();

      expect(response.status).toBe(200);
      expect(payload.skipped).toBe(true);
      expect(saveApplicantQuizAttemptMock).toHaveBeenCalledWith(
        expect.objectContaining({
          applicationId: 21,
          branch: "GI"
        })
      );
    } finally {
      if (previousQuizUrl === undefined) {
        delete process.env.GOOGLE_SCRIPT_URL_QUIZ;
      } else {
        process.env.GOOGLE_SCRIPT_URL_QUIZ = previousQuizUrl;
      }

      if (previousScriptUrl === undefined) {
        delete process.env.GOOGLE_SCRIPT_URL;
      } else {
        process.env.GOOGLE_SCRIPT_URL = previousScriptUrl;
      }
    }
  });
});
