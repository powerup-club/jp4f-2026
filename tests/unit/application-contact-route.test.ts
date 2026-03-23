import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authMock,
  getApplicantWorkspaceMock,
  saveApplicantContactRequestMock,
  getApplicantPersistenceSetupMock,
  getApplicantContactScriptUrlMock,
  fetchMock
} = vi.hoisted(() => ({
  authMock: vi.fn(),
  getApplicantWorkspaceMock: vi.fn(),
  saveApplicantContactRequestMock: vi.fn(),
  getApplicantPersistenceSetupMock: vi.fn(),
  getApplicantContactScriptUrlMock: vi.fn(),
  fetchMock: vi.fn()
}));

vi.mock("@/auth", () => ({
  auth: authMock
}));

vi.mock("@/applicant/data", () => ({
  getApplicantWorkspace: getApplicantWorkspaceMock,
  saveApplicantContactRequest: saveApplicantContactRequestMock
}));

vi.mock("@/applicant/config", () => ({
  getApplicantPersistenceSetup: getApplicantPersistenceSetupMock,
  getApplicantContactScriptUrl: getApplicantContactScriptUrlMock
}));

global.fetch = fetchMock;

import { POST } from "../../app/api/application/contact/route";

describe("application contact api route", () => {
  beforeEach(() => {
    authMock.mockReset();
    getApplicantWorkspaceMock.mockReset();
    saveApplicantContactRequestMock.mockReset();
    getApplicantPersistenceSetupMock.mockReset();
    getApplicantContactScriptUrlMock.mockReset();
    fetchMock.mockReset();
  });

  it("requires a valid email and required fields", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    getApplicantPersistenceSetupMock.mockReturnValue({
      ready: true,
      issues: []
    });

    const response = await POST(
      new Request("http://localhost/api/application/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "User",
          email: "invalid-email",
          teamId: "JP4F-000001",
          message: "Hello"
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("invalid_email");
  });

  it("stores a skipped contact request when the script URL is not configured", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    getApplicantPersistenceSetupMock.mockReturnValue({
      ready: true,
      issues: []
    });
    getApplicantContactScriptUrlMock.mockReturnValue("");
    getApplicantWorkspaceMock.mockResolvedValue({
      application: { id: 12 },
      error: null,
      errorCode: null
    });
    saveApplicantContactRequestMock.mockResolvedValue({
      id: 9,
      sheetSyncStatus: "skipped"
    });

    const response = await POST(
      new Request("http://localhost/api/application/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "User",
          email: "user@example.com",
          phone: "+212600000000",
          teamId: "JP4F-000001",
          message: "Need more details"
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.skipped).toBe(true);
    expect(saveApplicantContactRequestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationId: 12,
        sheetSyncStatus: "skipped"
      })
    );
  });

  it("returns a clean Apps Script error when the upstream responds with HTML", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    getApplicantPersistenceSetupMock.mockReturnValue({
      ready: true,
      issues: []
    });
    getApplicantContactScriptUrlMock.mockReturnValue("https://script.google.com/macros/s/test/exec");
    getApplicantWorkspaceMock.mockResolvedValue({
      application: { id: 12 },
      error: null,
      errorCode: null
    });
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      headers: new Headers({ "content-type": "text/html; charset=utf-8" }),
      text: async () => "<!DOCTYPE html><html><body>Sign in</body></html>"
    });
    saveApplicantContactRequestMock.mockResolvedValue({
      id: 11,
      sheetSyncStatus: "failed",
      sheetSyncMessage: "Google Apps Script contact endpoint returned HTML. Check the deployed /exec URL and public access."
    });

    const response = await POST(
      new Request("http://localhost/api/application/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "User",
          email: "user@example.com",
          phone: "+212600000000",
          teamId: "JP4F-000001",
          message: "Need more details"
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error.code).toBe("upstream_failed");
    expect(payload.error.message).toContain("returned HTML");
    expect(saveApplicantContactRequestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationId: 12,
        sheetSyncStatus: "failed",
        sheetSyncMessage: expect.stringContaining("returned HTML")
      })
    );
  });
});
