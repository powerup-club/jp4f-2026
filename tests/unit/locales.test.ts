import { describe, expect, it } from "vitest";
import { isSiteLocale, localeDirection, resolveLocaleFromPathname } from "@/config/locales";
import { switchLocaleInPath } from "@/lib/routing";

describe("locale helpers", () => {
  it("validates known locales", () => {
    expect(isSiteLocale("fr")).toBe(true);
    expect(isSiteLocale("en")).toBe(true);
    expect(isSiteLocale("ar")).toBe(true);
    expect(isSiteLocale("de")).toBe(false);
  });

  it("extracts locale from pathname", () => {
    expect(resolveLocaleFromPathname("/fr/programme")).toBe("fr");
    expect(resolveLocaleFromPathname("/ar/clubs")).toBe("ar");
    expect(resolveLocaleFromPathname("/programme")).toBeNull();
  });

  it("switches locale in pathname", () => {
    expect(switchLocaleInPath("/fr/programme", "en")).toBe("/en/programme");
    expect(switchLocaleInPath("/", "ar")).toBe("/ar");
  });

  it("returns rtl direction for arabic", () => {
    expect(localeDirection("ar")).toBe("rtl");
    expect(localeDirection("fr")).toBe("ltr");
  });
});
