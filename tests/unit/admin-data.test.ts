import { describe, expect, it, vi } from "vitest";
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
  it("returns a structured setup error when the source is not configured", async () => {
    vi.stubEnv("GOOGLE_SCRIPT_URL_REGISTER", "");
    vi.stubEnv("GOOGLE_SCRIPT_URL", "");
    vi.stubEnv("ADMIN_DATA_SECRET", "");

    const response = await fetchAdminData("register");

    expect(response.ok).toBe(false);
    expect(response.error?.code).toBe("missing_config");
    expect(response.setup.ready).toBe(false);

    vi.unstubAllEnvs();
  });
});
