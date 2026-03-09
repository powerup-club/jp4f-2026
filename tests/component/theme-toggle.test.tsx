import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

describe("ThemeToggle", () => {
  it("switches html theme attribute", () => {
    document.documentElement.setAttribute("data-theme", "dark");
    render(<ThemeToggle locale="fr" />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("jp4f-theme")).toBe("light");
  });

  it("keeps dark by default when storage unavailable", () => {
    document.documentElement.removeAttribute("data-theme");
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    render(<ThemeToggle locale="fr" />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    spy.mockRestore();
  });
});
