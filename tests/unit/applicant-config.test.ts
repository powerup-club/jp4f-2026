import { describe, expect, it, vi } from "vitest";
import { getApplicantDatabaseUrl, getApplicantPersistenceSetup } from "../../src/applicant/config";

describe("applicant config", () => {
  it("reports missing Neon configuration", () => {
    vi.stubEnv("DATABASE_URL", "");

    expect(getApplicantDatabaseUrl()).toBe("");
    expect(getApplicantPersistenceSetup()).toEqual({
      ready: false,
      issues: ["DATABASE_URL manquant pour la persistance Neon"]
    });

    vi.unstubAllEnvs();
  });

  it("accepts a configured Neon database url", () => {
    vi.stubEnv("DATABASE_URL", "postgres://user:pass@host.neon.tech/neondb");

    expect(getApplicantDatabaseUrl()).toBe("postgres://user:pass@host.neon.tech/neondb");
    expect(getApplicantPersistenceSetup()).toEqual({
      ready: true,
      issues: []
    });

    vi.unstubAllEnvs();
  });
});
