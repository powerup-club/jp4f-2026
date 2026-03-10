import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

vi.mock("recharts", () => {
  const Simple = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  return {
    ResponsiveContainer: Simple,
    BarChart: Simple,
    Bar: Simple,
    PieChart: Simple,
    Pie: Simple,
    Cell: Simple,
    CartesianGrid: Simple,
    XAxis: Simple,
    YAxis: Simple,
    Tooltip: Simple,
    Legend: Simple
  };
});

vi.mock("next-auth/react", () => ({
  signOut: vi.fn()
}));

describe("AdminDashboardClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders overview stats from the admin api", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        status: 200,
        json: async () => ({
          ok: true,
          type: "register",
          rows: [
            {
              timestamp: "2026-03-09T10:00:00.000Z",
              lang: "fr",
              type: "Equipe",
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
              fileLink: ""
            }
          ],
          total: 1,
          fetchedAt: "2026-03-09T10:00:00.000Z",
          setup: {
            ready: true,
            secretConfigured: true,
            sourceConfigured: true,
            issues: []
          }
        })
      } as Response)
      .mockResolvedValueOnce({
        status: 200,
        json: async () => ({
          ok: true,
          type: "quiz",
          rows: [
            {
              timestamp: "2026-03-09T11:00:00.000Z",
              firstName: "Nora",
              lastName: "El Idrissi",
              lang: "fr",
              branch: "GESI",
              profile: "Analytique",
              rating: 4,
              comment: ""
            }
          ],
          total: 1,
          fetchedAt: "2026-03-09T11:00:00.000Z",
          setup: {
            ready: true,
            secretConfigured: true,
            sourceConfigured: true,
            issues: []
          }
        })
      } as Response);

    render(<AdminDashboardClient userEmail="admin@example.com" />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /dashboard admin jp4f/i })).toBeInTheDocument();
    });

    expect(screen.getAllByText("Inscriptions").length).toBeGreaterThan(0);
    expect(screen.getByText("Quiz completes")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("shows setup or upstream errors returned by the api", async () => {
    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce({
        status: 503,
        json: async () => ({
          ok: false,
          type: "register",
          rows: [],
          total: 0,
          fetchedAt: "2026-03-09T10:00:00.000Z",
          setup: {
            ready: false,
            secretConfigured: true,
            sourceConfigured: false,
            issues: ["DATABASE_URL manquant pour le dashboard admin"]
          },
          error: {
            code: "missing_config",
            message: "Configuration admin incomplete"
          }
        })
      } as Response)
      .mockResolvedValueOnce({
        status: 200,
        json: async () => ({
          ok: true,
          type: "quiz",
          rows: [],
          total: 0,
          fetchedAt: "2026-03-09T11:00:00.000Z",
          setup: {
            ready: true,
            secretConfigured: true,
            sourceConfigured: true,
            issues: []
          }
        })
      } as Response);

    render(<AdminDashboardClient userEmail="admin@example.com" />);

    await waitFor(() => {
      expect(screen.getByText("Source inscriptions")).toBeInTheDocument();
    });

    expect(screen.getByText("DATABASE_URL manquant pour le dashboard admin")).toBeInTheDocument();
  });
});
