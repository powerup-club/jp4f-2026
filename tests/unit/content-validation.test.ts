import { describe, expect, it } from "vitest";
import { getSiteContent } from "@/content";
import { validateSiteContent } from "@/content/validation";

describe("content schema", () => {
  it("loads each locale without validation errors", () => {
    expect(() => validateSiteContent(getSiteContent("fr"))).not.toThrow();
    expect(() => validateSiteContent(getSiteContent("en"))).not.toThrow();
    expect(() => validateSiteContent(getSiteContent("ar"))).not.toThrow();
  });

  it("contains expected route links in navigation", () => {
    const fr = getSiteContent("fr");
    const hrefs = fr.navigation.map((item) => item.href);
    expect(hrefs).toContain("/programme");
    expect(hrefs).toContain("/filieres");
    expect(hrefs).toContain("/competition");
  });
});
