import { describe, expect, it } from "vitest";
import { getProxyAction } from "@/lib/proxy-routing";

describe("proxy routing", () => {
  it("redirects root to the default locale", () => {
    expect(getProxyAction("/")).toEqual({ type: "redirect", pathname: "/fr" });
  });

  it("keeps locale-prefixed public routes untouched", () => {
    expect(getProxyAction("/fr/programme")).toEqual({ type: "next" });
    expect(getProxyAction("/en/clubs")).toEqual({ type: "next" });
  });

  it("prefixes locale-less public routes", () => {
    expect(getProxyAction("/programme")).toEqual({ type: "redirect", pathname: "/fr/programme" });
  });

  it("exempts admin and api routes from locale redirects", () => {
    expect(getProxyAction("/admin")).toEqual({ type: "next" });
    expect(getProxyAction("/admin/login")).toEqual({ type: "next" });
    expect(getProxyAction("/auth/login")).toEqual({ type: "next" });
    expect(getProxyAction("/api/auth/signin")).toEqual({ type: "next" });
    expect(getProxyAction("/api/quiz/save")).toEqual({ type: "next" });
  });
});
