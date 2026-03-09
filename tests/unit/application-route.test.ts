import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, getApplicantWorkspaceMock, saveApplicantApplicationMock, getApplicantPersistenceSetupMock } =
  vi.hoisted(() => ({
    authMock: vi.fn(),
    getApplicantWorkspaceMock: vi.fn(),
    saveApplicantApplicationMock: vi.fn(),
    getApplicantPersistenceSetupMock: vi.fn()
  }));

vi.mock("@/auth", () => ({
  auth: authMock
}));

vi.mock("@/applicant/data", () => ({
  getApplicantWorkspace: getApplicantWorkspaceMock,
  saveApplicantApplication: saveApplicantApplicationMock
}));

vi.mock("@/applicant/config", () => ({
  getApplicantPersistenceSetup: getApplicantPersistenceSetupMock
}));

import { GET, PUT } from "../../app/api/application/route";

describe("application api route", () => {
  beforeEach(() => {
    authMock.mockReset();
    getApplicantWorkspaceMock.mockReset();
    saveApplicantApplicationMock.mockReset();
    getApplicantPersistenceSetupMock.mockReset();
  });

  it("rejects unauthenticated reads", async () => {
    authMock.mockResolvedValue(null);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error.code).toBe("unauthorized");
  });

  it("returns applicant workspace state for authenticated users", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com" } });
    getApplicantWorkspaceMock.mockResolvedValue({
      setup: { ready: true, issues: [] },
      application: { id: 1, accountEmail: "user@example.com" },
      error: null
    });

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.application.id).toBe(1);
    expect(getApplicantWorkspaceMock).toHaveBeenCalledWith("user@example.com");
  });

  it("returns setup errors for draft saves when Neon is not configured", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    getApplicantPersistenceSetupMock.mockReturnValue({
      ready: false,
      issues: ["DATABASE_URL manquant pour la persistance Neon"]
    });

    const response = await PUT(
      new Request("http://localhost/api/application", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: "User" })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.error.code).toBe("setup_required");
    expect(saveApplicantApplicationMock).not.toHaveBeenCalled();
  });
});
