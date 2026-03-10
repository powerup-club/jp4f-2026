"use client";

import { useCallback, useDeferredValue, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type {
  AdminApiError,
  AdminDataResponse,
  AdminDataSetup,
  AdminQuizRow,
  AdminRegistrationRow
} from "@/admin/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminEvaluationsPanel } from "@/components/admin/AdminEvaluationsPanel";

type AdminTab = "overview" | "registrations" | "quiz" | "evaluations";
type DatasetState<T> = {
  rows: T[];
  total: number;
  setup: AdminDataSetup;
  error?: AdminApiError;
};

const BRANCH_COLORS: Record<string, string> = {
  GESI: "#6366f1",
  MECA: "#f97316",
  MECATRONIQUE: "#ec4899",
  GI: "#8b5cf6"
};

const CHART_COLORS = ["#f97316", "#6366f1", "#ec4899", "#8b5cf6", "#f43f5e", "#fb7185"];

function createEmptySetup(): AdminDataSetup {
  return {
    ready: true,
    secretConfigured: true,
    sourceConfigured: true,
    issues: []
  };
}

function createEmptyDataset<T>(): DatasetState<T> {
  return {
    rows: [],
    total: 0,
    setup: createEmptySetup()
  };
}

function countBy<T>(rows: T[], selector: (row: T) => string) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const key = selector(row) || "Inconnu";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function toChartData(items: Record<string, number>) {
  return Object.entries(items).map(([name, value]) => ({ name, value }));
}

function exportCsv(data: Record<string, string | number>[], filename: string) {
  if (data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function formatTimeLabel(value: string | null) {
  if (!value) {
    return "Aucune synchro";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Aucune synchro";
  }

  return `Derniere synchro ${new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date)}`;
}

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

function matchesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

interface AdminDashboardClientProps {
  userEmail: string;
}

export function AdminDashboardClient({ userEmail }: AdminDashboardClientProps) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [search, setSearch] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [registerState, setRegisterState] = useState<DatasetState<AdminRegistrationRow>>(createEmptyDataset);
  const [quizState, setQuizState] = useState<DatasetState<AdminQuizRow>>(createEmptyDataset);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  const loadDashboardData = useCallback(async (showBusyState: boolean) => {
    if (showBusyState) {
      setIsRefreshing(true);
    }

    try {
      const [registerResponse, quizResponse] = await Promise.all([
        fetch("/api/admin/data?type=register", { cache: "no-store" }),
        fetch("/api/admin/data?type=quiz", { cache: "no-store" })
      ]);

      if (registerResponse.status === 401 || quizResponse.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const [registerPayload, quizPayload] = (await Promise.all([
        registerResponse.json(),
        quizResponse.json()
      ])) as [
        AdminDataResponse<AdminRegistrationRow>,
        AdminDataResponse<AdminQuizRow>
      ];

      setRegisterState({
        rows: registerPayload.rows,
        total: registerPayload.total,
        setup: registerPayload.setup,
        error: registerPayload.error
      });
      setQuizState({
        rows: quizPayload.rows,
        total: quizPayload.total,
        setup: quizPayload.setup,
        error: quizPayload.error
      });
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      const fallbackError: AdminApiError = {
        code: "upstream_failed",
        message: "Impossible de charger les donnees admin",
        details: error instanceof Error ? error.message : undefined
      };

      setRegisterState((current) => ({ ...current, error: fallbackError }));
      setQuizState((current) => ({ ...current, error: fallbackError }));
    } finally {
      setHasLoaded(true);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboardData(true);
  }, [loadDashboardData]);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadDashboardData(false);
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [autoRefresh, loadDashboardData]);

  const filteredRegistrations = registerState.rows.filter((row) =>
    matchesQuery(
      [row.fullName, row.email, row.university, row.projTitle, row.teamName].join(" "),
      deferredSearch
    )
  );
  const filteredQuizRows = quizState.rows.filter((row) =>
    matchesQuery(
      [row.firstName, row.lastName, row.branch, row.profile, row.comment].join(" "),
      deferredSearch
    )
  );

  const teamRegistrations = registerState.rows.filter((row) => row.type === "Equipe").length;
  const individualRegistrations = registerState.rows.length - teamRegistrations;
  const averageQuizRating = quizState.rows.length
    ? (
        quizState.rows.reduce((sum, row) => sum + row.rating, 0) / quizState.rows.length
      ).toFixed(1)
    : "--";

  const branchData = toChartData(countBy(quizState.rows, (row) => row.branch));
  const domainData = toChartData(countBy(registerState.rows, (row) => row.projDomain));
  const sourceData = toChartData(countBy(registerState.rows, (row) => row.heardFrom));
  const participationData = [
    { name: "Individuel", value: individualRegistrations },
    { name: "Equipe", value: teamRegistrations }
  ];

  return (
    <div className="relative min-h-screen">
      <AdminHeader
        userEmail={userEmail}
        isRefreshing={isRefreshing}
        autoRefresh={autoRefresh}
        lastUpdatedLabel={formatTimeLabel(lastUpdated)}
        onRefresh={() => void loadDashboardData(true)}
        onToggleAutoRefresh={() => setAutoRefresh((value) => !value)}
      />

      <main className="section-shell relative z-10 pb-12 pt-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="badge-line">Pilotage live</p>
            <h1 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.92] text-ink sm:text-6xl">
              <span className="gradient-title">Dashboard</span>
              <span className="block">Admin JP4F</span>
            </h1>
            <p className="mt-3 max-w-3xl text-base text-ink/72 sm:text-lg">
              Vue interne des inscriptions Innov&apos;Dom et des reponses du quiz d&apos;orientation.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex rounded-full border border-edge/70 bg-panel/90 p-1">
              {([
                ["overview", "Vue globale"],
                ["registrations", "Inscriptions"],
                ["quiz", "Quiz"],
                ["evaluations", "Évaluations"]
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                    tab === value
                      ? "bg-accent text-white shadow-halo"
                      : "text-ink/70 hover:text-accent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="flex min-w-[260px] items-center gap-3 rounded-full border border-edge/70 bg-panel/90 px-4 py-3 text-sm text-ink/70">
              <span className="font-semibold uppercase tracking-[0.12em] text-ink/45">Recherche</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nom, email, projet, profil..."
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
              />
            </label>
          </div>
        </div>

        {!hasLoaded ? (
          <div className="mt-8 glass-card flex min-h-[320px] items-center justify-center p-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-edge/30 border-t-accent" />
              <p className="mt-4 text-sm uppercase tracking-[0.16em] text-ink/55">
                Chargement des donnees admin
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4">
              {!registerState.setup.ready || registerState.error ? (
                <SetupCard
                  title="Source inscriptions"
                  setup={registerState.setup}
                  error={registerState.error}
                />
              ) : null}
              {!quizState.setup.ready || quizState.error ? (
                <SetupCard title="Source quiz" setup={quizState.setup} error={quizState.error} />
              ) : null}
            </div>

            {tab === "overview" ? (
              <section className="mt-8 space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <StatCard label="Inscriptions" value={String(registerState.total)} accent="text-accent" />
                  <StatCard label="Individuels" value={String(individualRegistrations)} accent="text-signal" />
                  <StatCard label="Equipes" value={String(teamRegistrations)} accent="text-accent2" />
                  <StatCard label="Quiz completes" value={String(quizState.total)} accent="text-violet" />
                  <StatCard label="Note moyenne" value={averageQuizRating} accent="text-rose" />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <ChartCard title="Repartition quiz par filiere" subtitle={`${quizState.total} reponses`}>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={branchData}>
                        <CartesianGrid vertical={false} stroke="rgba(148,163,184,.18)" />
                        <XAxis dataKey="name" stroke="rgba(100,116,139,.9)" fontSize={12} />
                        <YAxis stroke="rgba(100,116,139,.9)" fontSize={12} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                          {branchData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={BRANCH_COLORS[entry.name] || CHART_COLORS[0]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Type de participation" subtitle="Individuel vs Equipe">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={participationData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={58}
                          outerRadius={90}
                          paddingAngle={4}
                        >
                          {participationData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={index === 0 ? "#6366f1" : "#f97316"}
                            />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <ChartCard title="Domaines de projet" subtitle="Candidatures Innov'Dom">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={domainData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid horizontal={false} stroke="rgba(148,163,184,.18)" />
                        <XAxis type="number" stroke="rgba(100,116,139,.9)" fontSize={12} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={150}
                          stroke="rgba(100,116,139,.9)"
                          fontSize={11}
                        />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                          {domainData.map((entry, index) => (
                            <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Canaux d'acquisition" subtitle="Comment ils ont entendu parler">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={sourceData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={92}
                          paddingAngle={3}
                        >
                          {sourceData.map((entry, index) => (
                            <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>
              </section>
            ) : null}

            {tab === "registrations" ? (
              <section className="mt-8 space-y-4">
                <TableToolbar
                  count={filteredRegistrations.length}
                  total={registerState.total}
                  onExport={() =>
                    exportCsv(
                      filteredRegistrations.map((row) => ({
                        timestamp: row.timestamp,
                        type: row.type,
                        fullName: row.fullName,
                        email: row.email,
                        university: row.university,
                        branch: row.branch,
                        projectTitle: row.projTitle,
                        projectDomain: row.projDomain,
                        heardFrom: row.heardFrom
                      })),
                      "jp4f-admin-inscriptions.csv"
                    )
                  }
                />

                <DataTable
                  columns={[
                    "#",
                    "Nom",
                    "Email",
                    "Type",
                    "Universite",
                    "Filiere",
                    "Projet",
                    "Domaine",
                    "Fichier",
                    "Date"
                  ]}
                  emptyLabel="Aucune inscription a afficher."
                  rows={filteredRegistrations.map((row, index) => [
                    String(index + 1),
                    row.fullName || "--",
                    row.email || "--",
                    row.type,
                    row.university || "--",
                    row.branch || "--",
                    row.projTitle || "--",
                    row.projDomain || "--",
                    row.fileLink ? "Ouvrir" : "--",
                    formatDate(row.timestamp)
                  ])}
                  linkColumnIndex={8}
                  linkValues={filteredRegistrations.map((row) => row.fileLink)}
                />
              </section>
            ) : null}

            {tab === "quiz" ? (
              <section className="mt-8 space-y-4">
                <TableToolbar
                  count={filteredQuizRows.length}
                  total={quizState.total}
                  onExport={() =>
                    exportCsv(
                      filteredQuizRows.map((row) => ({
                        timestamp: row.timestamp,
                        firstName: row.firstName,
                        lastName: row.lastName,
                        branch: row.branch,
                        profile: row.profile,
                        rating: row.rating,
                        comment: row.comment,
                        lang: row.lang
                      })),
                      "jp4f-admin-quiz.csv"
                    )
                  }
                />

                <DataTable
                  columns={[
                    "#",
                    "Prenom",
                    "Nom",
                    "Filiere",
                    "Profil",
                    "Note",
                    "Commentaire",
                    "Langue",
                    "Date"
                  ]}
                  emptyLabel="Aucun resultat quiz a afficher."
                  rows={filteredQuizRows.map((row, index) => [
                    String(index + 1),
                    row.firstName || "--",
                    row.lastName || "--",
                    row.branch || "--",
                    row.profile || "--",
                    row.rating ? `${row.rating}/5` : "--",
                    row.comment || "--",
                    row.lang ? row.lang.toUpperCase() : "--",
                    formatDate(row.timestamp)
                  ])}
                />
              </section>
            ) : null}

            {tab === "evaluations" ? (
              <section className="mt-8">
                <AdminEvaluationsPanel locale="fr" />
              </section>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <article className="glass-card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">{label}</p>
      <p className={`mt-4 font-display text-5xl font-semibold uppercase leading-none ${accent}`}>
        {value}
      </p>
    </article>
  );
}

function ChartCard({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <article className="glass-card p-5">
      <p className="font-display text-3xl font-semibold uppercase text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink/55">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </article>
  );
}

function TableToolbar({
  count,
  total,
  onExport
}: {
  count: number;
  total: number;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] border border-edge/70 bg-panel/80 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-ink/72">
        {count} / {total} lignes visibles
      </p>
      <button
        type="button"
        onClick={onExport}
        className="rounded-full border border-edge/80 bg-panel/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink/80 transition hover:border-accent hover:text-accent"
      >
        Export CSV
      </button>
    </div>
  );
}

function DataTable({
  columns,
  rows,
  emptyLabel,
  linkColumnIndex,
  linkValues
}: {
  columns: string[];
  rows: string[][];
  emptyLabel: string;
  linkColumnIndex?: number;
  linkValues?: string[];
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-edge/70 bg-panel/75">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm text-ink/80">
          <thead className="bg-panel/95">
            <tr>
              {columns.map((column) => (
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
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="border-b border-edge/35 last:border-b-0">
                {row.map((cell, cellIndex) => {
                  const href =
                    linkColumnIndex === cellIndex && linkValues ? linkValues[rowIndex] || "" : "";

                  return (
                    <td key={`cell-${rowIndex}-${cellIndex}`} className="whitespace-nowrap px-4 py-3 align-top">
                      {href && cell !== "--" ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-accent underline-offset-2 hover:underline"
                        >
                          {cell}
                        </a>
                      ) : (
                        <span className={cell === "--" ? "text-ink/35" : ""}>{cell}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 ? (
        <div className="p-8 text-center text-sm text-ink/55">{emptyLabel}</div>
      ) : null}
    </div>
  );
}

function SetupCard({
  title,
  setup,
  error
}: {
  title: string;
  setup: AdminDataSetup;
  error?: AdminApiError;
}) {
  return (
    <article className="rounded-[22px] border border-accent/40 bg-accent/10 p-5">
      <p className="font-display text-3xl font-semibold uppercase text-accent">{title}</p>
      {!setup.ready ? (
        <ul className="mt-3 space-y-2 text-sm text-ink/72">
          {setup.issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-ink/75">
          {error.message}
          {error.details ? ` (${error.details})` : ""}
        </p>
      ) : null}
    </article>
  );
}

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid rgba(249, 115, 22, 0.3)",
  background: "rgba(255,255,255,0.96)",
  color: "#1f2937"
};
