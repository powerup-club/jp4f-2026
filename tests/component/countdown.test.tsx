import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Countdown } from "@/components/ui/Countdown";

describe("Countdown", () => {
  it("renders ended label when target is in the past", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-01T00:00:00Z"));

    render(
      <Countdown
        targetIso="2026-04-17T08:30:00+01:00"
        label="Countdown"
        endedLabel="Event started"
      />
    );

    expect(screen.getByText("Event started")).toBeInTheDocument();
    vi.useRealTimers();
  });
});
