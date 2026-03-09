import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, fetchAdminDataMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  fetchAdminDataMock: vi.fn()
}));

vi.mock("@/auth", () => ({
  auth: authMock
}));

vi.mock("@/admin/data", () => ({
  fetchAdminData: fetchAdminDataMock
}));

import { GET } from "../../app/api/admin/data/route";

describe("admin data route", () => {
  beforeEach(() => {
    authMock.mockReset();
    fetchAdminDataMock.mockReset();
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
  });

  it("rejects unauthenticated requests", async () => {
    authMock.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/admin/data?type=register"));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error.code).toBe("unauthorized");
  });

  it("rejects authenticated non-admin users", async () => {
    authMock.mockResolvedValue({ user: { email: "user@example.com" } });

    const response = await GET(new Request("http://localhost/api/admin/data?type=register"));
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload.error.code).toBe("forbidden");
  });

  it("rejects invalid type values", async () => {
    authMock.mockResolvedValue({ user: { email: "admin@example.com" } });

    const response = await GET(new Request("http://localhost/api/admin/data?type=bad"));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("invalid_type");
  });

  it("returns upstream payloads for authenticated requests", async () => {
    authMock.mockResolvedValue({ user: { email: "admin@example.com" } });
    fetchAdminDataMock.mockResolvedValue({
      ok: true,
      type: "register",
      rows: [{ fullName: "Alice" }],
      total: 1,
      fetchedAt: "2026-03-09T10:00:00.000Z",
      setup: {
        ready: true,
        secretConfigured: true,
        sourceConfigured: true,
        issues: []
      }
    });

    const response = await GET(new Request("http://localhost/api/admin/data?type=register"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.total).toBe(1);
    expect(fetchAdminDataMock).toHaveBeenCalledWith("register");
  });
});
