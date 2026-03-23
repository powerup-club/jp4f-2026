import { describe, expect, it, vi } from "vitest";
import { getGoogleAuthSetup, isAdminEmail } from "@/admin/config";

describe("admin config", () => {
  it("checks admin emails against ADMIN_EMAILS", () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com, other@example.com");

    expect(isAdminEmail("admin@example.com")).toBe(true);
    expect(isAdminEmail("ADMIN@example.com")).toBe(true);
    expect(isAdminEmail("user@example.com")).toBe(false);

    vi.unstubAllEnvs();
  });

  it("reports missing Google auth setup", () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "");
    vi.stubEnv("AUTH_SECRET", "");

    const setup = getGoogleAuthSetup();

    expect(setup.ready).toBe(false);
    expect(setup.issues.length).toBeGreaterThan(0);

    vi.unstubAllEnvs();
  });
});
