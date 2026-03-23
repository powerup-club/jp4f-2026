"use client";

import { useEffect, useState } from "react";

type SponsorStatus = "pending" | "contacted" | "confirmed" | "declined";

type SponsorApplication = {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  tier: string;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string | null;
  status: SponsorStatus;
  createdAt: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--";
  }
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

export function AdminSponsorsPanel() {
  const [rows, setRows] = useState<SponsorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/admin/sponsors", { cache: "no-store" });
        if (response.status === 401) {
          window.location.href = "/admin/login";
          return;
        }

        const payload = (await response.json().catch(() => null)) as
          | { total: number; applications: SponsorApplication[] }
          | { error: string }
          | null;

        if (!response.ok || !payload || "error" in payload) {
          throw new Error(payload && "error" in payload ? payload.error : "Could not load sponsors");
        }

        if (active) {
          setRows(payload.applications);
          setError(null);
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : "Could not load sponsors");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  async function updateStatus(id: number, status: SponsorStatus) {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/admin/sponsors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      const payload = (await response.json().catch(() => null)) as
        | { success: true; id: number; status: SponsorStatus }
        | { error: string }
        | null;

      if (!response.ok || !payload || "error" in payload) {
        throw new Error(payload && "error" in payload ? payload.error : "Update failed");
      }

      setRows((current) =>
        current.map((row) => (row.id === id ? { ...row, status: payload.status } : row))
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="glass-card flex min-h-[200px] items-center justify-center p-6 text-sm text-ink/60">
        Chargement des sponsors...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose/35 bg-rose/10 p-4 text-sm text-rose">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-edge/70 bg-panel/75">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm text-ink/80">
          <thead className="bg-panel/95">
            <tr>
              {[
                "Entreprise",
                "Contact",
                "Email",
                "Tier",
                "Date/Heure",
                "Message",
                "Statut",
                "Soumis"
              ].map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap border-b border-edge/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink/45"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-edge/35 last:border-b-0">
                <td className="whitespace-nowrap px-4 py-3">{row.companyName || "--"}</td>
                <td className="whitespace-nowrap px-4 py-3">{row.contactName || "--"}</td>
                <td className="whitespace-nowrap px-4 py-3">{row.email || "--"}</td>
                <td className="whitespace-nowrap px-4 py-3">{row.tier || "--"}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {row.preferredDate || row.preferredTime
                    ? `${row.preferredDate ?? "--"} ${row.preferredTime ?? ""}`.trim()
                    : "--"}
                </td>
                <td className="px-4 py-3">
                  <span className="block max-w-[280px] whitespace-normal text-ink/70">
                    {row.message || "--"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <select
                    value={row.status}
                    onChange={(event) => updateStatus(row.id, event.target.value as SponsorStatus)}
                    disabled={updatingId === row.id}
                    className="rounded-full border border-edge/70 bg-panel/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink/70 outline-none transition focus:border-accent disabled:opacity-60"
                  >
                    <option value="pending">pending</option>
                    <option value="contacted">contacted</option>
                    <option value="confirmed">confirmed</option>
                    <option value="declined">declined</option>
                  </select>
                </td>
                <td className="whitespace-nowrap px-4 py-3">{formatDate(row.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 ? (
        <div className="p-8 text-center text-sm text-ink/55">Aucune candidature sponsor.</div>
      ) : null}
    </div>
  );
}
