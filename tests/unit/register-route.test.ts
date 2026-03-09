import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, fetchMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  fetchMock: vi.fn()
}));

vi.mock("@/auth", () => ({
  auth: authMock
}));

global.fetch = fetchMock;

import { POST } from "../../app/api/register/route";

describe("register api route", () => {
  beforeEach(() => {
    authMock.mockReset();
    fetchMock.mockReset();
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
    authMock.mockResolvedValue({ user: { email: "user@example.com" } });
    vi.stubEnv("GOOGLE_SCRIPT_URL_REGISTER", "https://script.google.com/macros/s/test/exec");
    fetchMock.mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ success: true })
    });

    const response = await POST(
      new Request("http://localhost/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Alice",
          projectTitle: "Smart Line"
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.unstubAllEnvs();
  });
});
