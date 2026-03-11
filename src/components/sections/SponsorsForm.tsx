"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { SponsorsContent } from "@/content/types";

type FormCopy = SponsorsContent["form"];

interface SponsorsFormProps {
  copy: FormCopy;
}

function normalizeTier(value: string | null, options: string[]) {
  if (!value) {
    return options[0];
  }
  const match = options.find((option) => option.toLowerCase() === value.toLowerCase());
  return match ?? options[0];
}

export function SponsorsForm({ copy }: SponsorsFormProps) {
  const searchParams = useSearchParams();
  const tierFromQuery = normalizeTier(searchParams.get("tier"), copy.tierOptions);
  const [formState, setFormState] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    tier: tierFromQuery,
    preferredDate: "",
    preferredTime: "",
    message: "",
    consent: false
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    setFormState((prev) => ({ ...prev, tier: tierFromQuery }));
  }, [tierFromQuery]);

  function handleChange(field: keyof typeof formState, value: string | boolean) {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/sponsors/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formState.companyName,
          contactName: formState.contactName,
          email: formState.email,
          phone: formState.phone,
          tier: formState.tier,
          preferredDate: formState.preferredDate,
          preferredTime: formState.preferredTime,
          message: formState.message,
          consent: formState.consent
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | { success: true }
        | { success: false; error?: string }
        | null;

      if (!response.ok || !payload || payload.success === false) {
        throw new Error(payload && "error" in payload && payload.error ? payload.error : copy.error);
      }

      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : copy.error);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-sm text-ink/80">
        {copy.success}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-ink/70">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
            {copy.companyLabel}
          </span>
          <input
            required
            value={formState.companyName}
            onChange={(event) => handleChange("companyName", event.target.value)}
            className="w-full rounded-2xl border border-edge/60 bg-panel/95 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
          />
        </label>
        <label className="space-y-2 text-sm text-ink/70">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
            {copy.contactLabel}
          </span>
          <input
            required
            value={formState.contactName}
            onChange={(event) => handleChange("contactName", event.target.value)}
            className="w-full rounded-2xl border border-edge/60 bg-panel/95 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
          />
        </label>
        <label className="space-y-2 text-sm text-ink/70">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
            {copy.emailLabel}
          </span>
          <input
            required
            type="email"
            value={formState.email}
            onChange={(event) => handleChange("email", event.target.value)}
            className="w-full rounded-2xl border border-edge/60 bg-panel/95 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
          />
        </label>
        <label className="space-y-2 text-sm text-ink/70">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
            {copy.phoneLabel}
          </span>
          <input
            type="tel"
            value={formState.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            className="w-full rounded-2xl border border-edge/60 bg-panel/95 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-ink/70">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
            {copy.tierLabel}
          </span>
          <select
            value={formState.tier}
            onChange={(event) => handleChange("tier", event.target.value)}
            className="w-full rounded-2xl border border-edge/60 bg-panel/95 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
          >
            {copy.tierOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-ink/70">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
              {copy.dateLabel}
            </span>
            <input
              type="date"
              min={minDate}
              value={formState.preferredDate}
              onChange={(event) => handleChange("preferredDate", event.target.value)}
              className="w-full rounded-2xl border border-edge/60 bg-panel/95 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/70">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
              {copy.timeLabel}
            </span>
            <input
              type="time"
              value={formState.preferredTime}
              onChange={(event) => handleChange("preferredTime", event.target.value)}
              className="w-full rounded-2xl border border-edge/60 bg-panel/95 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
            />
          </label>
        </div>
      </div>

      <label className="space-y-2 text-sm text-ink/70">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
          {copy.messageLabel}
        </span>
        <textarea
          value={formState.message}
          onChange={(event) => handleChange("message", event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-edge/60 bg-panel/95 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
        />
      </label>

      <label className="flex items-center gap-3 text-sm text-ink/70">
        <input
          required
          type="checkbox"
          checked={formState.consent}
          onChange={(event) => handleChange("consent", event.target.checked)}
          className="h-4 w-4 rounded border-edge/60 text-accent focus:ring-accent/30"
        />
        <span>{copy.consentLabel}</span>
      </label>

      {status === "error" ? (
        <div className="rounded-2xl border border-rose/35 bg-rose/10 px-4 py-3 text-sm text-rose">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full border border-transparent bg-accent px-6 py-3 font-display text-base uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? copy.submitLabel : copy.submitLabel}
      </button>
    </form>
  );
}
