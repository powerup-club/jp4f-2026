import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminLoginCard } from "@/components/admin/AdminLoginCard";

const { signInMock } = vi.hoisted(() => ({
  signInMock: vi.fn()
}));

vi.mock("next-auth/react", () => ({
  signIn: signInMock
}));

describe("AdminLoginCard", () => {
  it("shows setup issues and disables sign-in when auth config is incomplete", () => {
    render(
      <AdminLoginCard
        callbackUrl="/admin"
        setupReady={false}
        setupIssues={["GOOGLE_CLIENT_ID manquant"]}
      />
    );

    expect(screen.getByText("Configuration requise")).toBeInTheDocument();
    expect(screen.getByText("GOOGLE_CLIENT_ID manquant")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continuer avec google/i })).toBeDisabled();
  });

  it("starts Google sign-in with the callback url", () => {
    render(
      <AdminLoginCard callbackUrl="/admin" setupReady setupIssues={[]} />
    );

    fireEvent.click(screen.getByRole("button", { name: /continuer avec google/i }));

    expect(signInMock).toHaveBeenCalledWith("google", { redirectTo: "/admin" });
  });
});
