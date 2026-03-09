import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgrammeTabs } from "@/components/ui/ProgrammeTabs";

describe("ProgrammeTabs", () => {
  it("switches from day 1 to day 2", () => {
    render(
      <ProgrammeTabs
        day1Label="Day 1"
        day2Label="Day 2"
        day1={[{ time: "09:00", title: "Opening" }]}
        day2={[{ time: "10:00", title: "Final" }]}
      />
    );

    expect(screen.getByText("Opening")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Day 2" }));
    expect(screen.getByText("Final")).toBeInTheDocument();
  });
});
