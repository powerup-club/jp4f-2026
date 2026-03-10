import { beforeEach, describe, expect, it, vi } from "vitest";

const { neonMock, sqlMock } = vi.hoisted(() => ({
  neonMock: vi.fn(),
  sqlMock: vi.fn()
}));

vi.mock("@neondatabase/serverless", () => ({
  neon: neonMock
}));

import { fetchAdminData, normalizeQuizRow, normalizeRegistrationRow } from "@/admin/data";

describe("admin data normalization", () => {
  it("normalizes registration rows across key variants and type labels", () => {
    const row = normalizeRegistrationRow({
      fullName: "Alice",
      email: "alice@example.com",
      type: "team",
      university: "ENSA Fes",
      branch: "GI",
      projectTitle: "Smart Line",
      projectDomain: "Digitalisation",
      filelink: "https://example.com/file.pdf"
    });

    expect(row.fullName).toBe("Alice");
    expect(row.type).toBe("Equipe");
    expect(row.projTitle).toBe("Smart Line");
    expect(row.projDomain).toBe("Digitalisation");
    expect(row.fileLink).toBe("https://example.com/file.pdf");
  });

  it("normalizes quiz rows and maps language to lang", () => {
    const row = normalizeQuizRow({
      firstName: "Nora",
      lastName: "El Idrissi",
      language: "fr",
      branch: "GESI",
      profile: "Analytique",
      rating: "4"
    });

    expect(row.firstName).toBe("Nora");
    expect(row.lang).toBe("fr");
    expect(row.rating).toBe(4);
  });
});

describe("admin data fetching", () => {
  beforeEach(() => {
    neonMock.mockReset();
    sqlMock.mockReset();
    neonMock.mockReturnValue(sqlMock);
    vi.unstubAllEnvs();
  });

  it("returns a structured setup error when the database is not configured", async () => {
    vi.stubEnv("DATABASE_URL", "");

    const response = await fetchAdminData("register");

    expect(response.ok).toBe(false);
    expect(response.error?.code).toBe("missing_config");
    expect(response.setup.ready).toBe(false);
    expect(response.setup.issues).toContain("DATABASE_URL manquant pour le dashboard admin");
  });

  it("loads submitted registrations from Neon", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://user:pass@host.neon.tech/neondb");
    sqlMock.mockResolvedValueOnce([
      {
        timestamp: "2026-03-09T10:00:00.000Z",
        lang: "fr",
        type: "team",
        fullName: "Alice",
        email: "alice@example.com",
        phone: "0600",
        university: "ENSA Fes",
        branch: "GI",
        yearOfStudy: "Bac+5",
        teamName: "Team One",
        projTitle: "Smart Line",
        projDomain: "Digitalisation",
        demoFormat: "Pitch",
        heardFrom: "Instagram",
        fileLink: "https://example.com/file.pdf"
      }
    ]);

    const response = await fetchAdminData("register");

    expect(response.ok).toBe(true);
    expect(response.total).toBe(1);
    expect(response.rows[0]).toMatchObject({
      fullName: "Alice",
      type: "Equipe",
      projTitle: "Smart Line",
      projDomain: "Digitalisation"
    });
    expect(neonMock).toHaveBeenCalledWith("postgres://user:pass@host.neon.tech/neondb");
  });

  it("loads the latest quiz rows from Neon", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://user:pass@host.neon.tech/neondb");
    sqlMock.mockResolvedValueOnce([
      {
        timestamp: "2026-03-09T11:00:00.000Z",
        fullName: "Nora El Idrissi",
        lang: "fr",
        branch: "GESI",
        profile: "Analytique",
        rating: 4,
        comment: "Tres utile"
      }
    ]);

    const response = await fetchAdminData("quiz");

    expect(response.ok).toBe(true);
    expect(response.total).toBe(1);
    expect(response.rows[0]).toMatchObject({
      firstName: "Nora",
      lastName: "El Idrissi",
      branch: "GESI",
      profile: "Analytique",
      rating: 4
    });
  });
});
