import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, fetchMock, saveApplicantApplicationMock, getApplicantPersistenceSetupMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  fetchMock: vi.fn(),
  saveApplicantApplicationMock: vi.fn(),
  getApplicantPersistenceSetupMock: vi.fn()
}));

vi.mock("@/auth", () => ({
  auth: authMock
}));

vi.mock("@/applicant/data", () => ({
  saveApplicantApplication: saveApplicantApplicationMock
}));

vi.mock("@/applicant/config", () => ({
  getApplicantPersistenceSetup: getApplicantPersistenceSetupMock
}));

global.fetch = fetchMock;

import { POST } from "../../app/api/register/route";

describe("register api route", () => {
  beforeEach(() => {
    authMock.mockReset();
    fetchMock.mockReset();
    saveApplicantApplicationMock.mockReset();
    getApplicantPersistenceSetupMock.mockReset();
    getApplicantPersistenceSetupMock.mockReturnValue({
      ready: true,
      issues: []
    });
    saveApplicantApplicationMock.mockResolvedValue({ id: 1 });
  });

  it("rejects unauthenticated submissions", async () => {
    authMock.mockResolvedValue(null);

    const response = await POST(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe("Authentication required");
  });

  it("forwards authenticated submissions to the configured upstream", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    vi.stubEnv("GOOGLE_SCRIPT_URL_REGISTER", "https://script.google.com/macros/s/test/exec");
    fetchMock.mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ success: true, fileLink: "https://drive.google.com/test-file" })
    });

    const response = await POST(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Alice",
          email: "alice@example.com",
          projectTitle: "Smart Line"
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(saveApplicantApplicationMock).toHaveBeenCalledTimes(2);
    expect(saveApplicantApplicationMock.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        accountEmail: "user@example.com",
        status: "submitted",
        sheetSyncStatus: "pending"
      })
    );
    expect(saveApplicantApplicationMock.mock.calls[1]?.[0]).toEqual(
      expect.objectContaining({
        accountEmail: "user@example.com",
        status: "submitted",
        sheetSyncStatus: "synced",
        fileUrl: "https://drive.google.com/test-file",
        fileStorage: "google_script_only"
      })
    );

    vi.unstubAllEnvs();
  });

  it("fails before calling Google Sheets when the Neon save fails", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    vi.stubEnv("GOOGLE_SCRIPT_URL_REGISTER", "https://script.google.com/macros/s/test/exec");
    saveApplicantApplicationMock.mockRejectedValueOnce(new Error("Neon write failed"));

    const response = await POST(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Alice",
          email: "alice@example.com",
          projectTitle: "Smart Line"
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBe("Neon write failed");
    expect(fetchMock).not.toHaveBeenCalled();

    vi.unstubAllEnvs();
  });

  it("keeps the Neon row and marks sheet sync as failed when upstream save fails", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    vi.stubEnv("GOOGLE_SCRIPT_URL_REGISTER", "https://script.google.com/macros/s/test/exec");
    fetchMock.mockResolvedValue({
      ok: false,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ error: "Apps Script down" })
    });

    const response = await POST(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Alice",
          email: "alice@example.com",
          projectTitle: "Smart Line"
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe("Apps Script down");
    expect(saveApplicantApplicationMock).toHaveBeenCalledTimes(2);
    expect(saveApplicantApplicationMock.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        sheetSyncStatus: "pending"
      })
    );
    expect(saveApplicantApplicationMock.mock.calls[1]?.[0]).toEqual(
      expect.objectContaining({
        status: "submitted",
        sheetSyncStatus: "failed",
        sheetSyncMessage: "Apps Script down"
      })
    );

    vi.unstubAllEnvs();
  });

  it("rejects invalid participant email addresses", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    vi.stubEnv("GOOGLE_SCRIPT_URL_REGISTER", "https://script.google.com/macros/s/test/exec");

    const response = await POST(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Alice",
          email: "not-an-email",
          projectTitle: "Smart Line"
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("Email invalide.");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(saveApplicantApplicationMock).not.toHaveBeenCalled();

    vi.unstubAllEnvs();
  });

  it("rejects team members with missing email or name", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    vi.stubEnv("GOOGLE_SCRIPT_URL_REGISTER", "https://script.google.com/macros/s/test/exec");

    const response = await POST(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "team",
          fullName: "Alice",
          email: "alice@example.com",
          teamName: "Team A",
          member2Email: "member2@example.com",
          projTitle: "Smart Line"
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("Membre 2: Nom obligatoire si l'email est rempli.");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(saveApplicantApplicationMock).not.toHaveBeenCalled();

    vi.unstubAllEnvs();
  });

  it("rejects team members with invalid email addresses", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com", name: "User" } });
    vi.stubEnv("GOOGLE_SCRIPT_URL_REGISTER", "https://script.google.com/macros/s/test/exec");

    const response = await POST(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "team",
          fullName: "Alice",
          email: "alice@example.com",
          teamName: "Team A",
          member2Name: "Bob",
          member2Email: "not-an-email",
          projTitle: "Smart Line"
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("Membre 2: Email invalide.");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(saveApplicantApplicationMock).not.toHaveBeenCalled();

    vi.unstubAllEnvs();
  });
});
