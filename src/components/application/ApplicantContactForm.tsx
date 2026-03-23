"use client";

import { useState } from "react";
import type { SiteLocale } from "@/config/locales";

const COPY: Record<
  SiteLocale,
  {
    fullName: string;
    email: string;
    phone: string;
    teamId: string;
    message: string;
    submit: string;
    submitting: string;
    success: string;
    skipped: string;
    error: string;
    required: string;
  }
> = {
  fr: {
    fullName: "Nom complet",
    email: "Email",
    phone: "Telephone",
    teamId: "Team ID",
    message: "Message",
    submit: "Envoyer",
    submitting: "Envoi...",
    success: "Demande envoyee. Nous vous contacterons bientot.",
    skipped: "Demande envoyee. Nous vous contacterons bientot.",
    error: "Impossible d'envoyer la demande pour le moment.",
    required: "Ce champ est obligatoire"
  },
  en: {
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    teamId: "Team ID",
    message: "Message",
    submit: "Send",
    submitting: "Sending...",
    success: "Request sent. We will contact you soon.",
    skipped: "Request sent. We will contact you soon.",
    error: "Could not send the request right now.",
    required: "This field is required"
  },
  ar: {
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    teamId: "Team ID",
    message: "الرسالة",
    submit: "إرسال",
    submitting: "جار الإرسال...",
    success: "تم إرسال الطلب. سنتواصل معك قريبا.",
    skipped: "تم إرسال الطلب. سنتواصل معك قريبا.",
    error: "تعذر إرسال الطلب حاليا.",
    required: "هذا الحقل مطلوب"
  }
};

export function ApplicantContactForm({
  locale,
  defaultFullName,
  defaultEmail,
  defaultPhone,
  teamId
}: {
  locale: SiteLocale;
  defaultFullName: string;
  defaultEmail: string;
  defaultPhone: string;
  teamId: string;
}) {
  const copy = COPY[locale];
  const [fullName, setFullName] = useState(defaultFullName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function submit() {
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setValidationError(copy.required);
      return;
    }

    setValidationError(null);
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch("/api/application/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          teamId,
          message
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | { skipped?: boolean; error?: { message?: string } }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error?.message || copy.error);
      }

      setSuccess(payload?.skipped ? copy.skipped : copy.success);
      setMessage("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : copy.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="glass-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
            {copy.fullName}
          </label>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-2xl border border-edge/60 bg-panel/70 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:bg-panel"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
            {copy.email}
          </label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-edge/60 bg-panel/70 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:bg-panel"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
            {copy.phone}
          </label>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-2xl border border-edge/60 bg-panel/70 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:bg-panel"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
            {copy.teamId}
          </label>
          <input
            value={teamId}
            readOnly
            className="w-full rounded-2xl border border-edge/60 bg-panel/50 px-4 py-3 text-sm text-ink/70 outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
          {copy.message}
        </label>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          className="w-full rounded-2xl border border-edge/60 bg-panel/70 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:bg-panel"
        />
      </div>

      {validationError ? <p className="mt-3 text-sm text-rose">{validationError}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose">{error}</p> : null}
      {success ? <p className="mt-3 text-sm text-emerald-600">{success}</p> : null}

      <button
        type="button"
        onClick={() => void submit()}
        disabled={submitting}
        className="mt-4 rounded-full border border-transparent bg-accent px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? copy.submitting : copy.submit}
      </button>
    </article>
  );
}
