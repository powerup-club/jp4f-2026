"use client";

import { useState } from "react";
import type { ApplicantChatMessage } from "@/applicant/types";
import type { SiteLocale } from "@/config/locales";

const COPY: Record<
  SiteLocale,
  {
    inputLabel: string;
    inputPlaceholder: string;
    send: string;
    sending: string;
    empty: string;
    disabled: string;
    error: string;
  }
> = {
  fr: {
    inputLabel: "Nouveau message",
    inputPlaceholder: "Ecris ici ta question ou une mise a jour de ton dossier...",
    send: "Envoyer",
    sending: "Envoi...",
    empty: "Aucun message pour le moment.",
    disabled: "Le chat sera disponible des que Neon sera configure.",
    error: "Impossible d'envoyer le message pour le moment."
  },
  en: {
    inputLabel: "New message",
    inputPlaceholder: "Write your question or an update about your application here...",
    send: "Send",
    sending: "Sending...",
    empty: "No messages yet.",
    disabled: "Chat will be available once Neon is configured.",
    error: "Could not send the message right now."
  },
  ar: {
    inputLabel: "رسالة جديدة",
    inputPlaceholder: "اكتب هنا سؤالك أو تحديثا بخصوص ملفك...",
    send: "إرسال",
    sending: "جارٍ الإرسال...",
    empty: "لا توجد رسائل حاليا.",
    disabled: "ستصبح الدردشة متاحة بعد إعداد Neon.",
    error: "تعذر إرسال الرسالة حاليا."
  }
};

interface ApplicantChatPanelProps {
  locale: SiteLocale;
  initialMessages: ApplicantChatMessage[];
  canSend: boolean;
}

function formatDate(date: string, locale: SiteLocale) {
  if (!date) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export function ApplicantChatPanel({
  locale,
  initialMessages,
  canSend
}: ApplicantChatPanelProps) {
  const copy = COPY[locale];
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitMessage() {
    const trimmed = body.trim();
    if (!trimmed || !canSend) {
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/application/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          body: trimmed
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: ApplicantChatMessage; error?: { message?: string } }
        | null;

      if (!response.ok || !payload?.message) {
        throw new Error(payload?.error?.message || copy.error);
      }

      setMessages((current) => [...current, payload.message!]);
      setBody("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : copy.error);
    } finally {
      setSending(false);
    }
  }

  return (
    <article className="glass-card p-6">
      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className="rounded-2xl border border-edge/40 bg-panel/60 p-4 text-sm text-ink/65">
            {canSend ? copy.empty : copy.disabled}
          </p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="rounded-2xl border border-edge/50 bg-panel/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-2xl uppercase text-ink">
                  {message.senderName || message.senderEmail}
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-ink/45">
                  {formatDate(message.createdAt, locale)}
                </p>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink/72 sm:text-base">
                {message.body}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
          {copy.inputLabel}
        </label>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={copy.inputPlaceholder}
          disabled={!canSend || sending}
          className="min-h-32 w-full rounded-2xl border border-edge/60 bg-panel/70 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-accent focus:bg-panel"
        />
        {error ? <p className="text-sm text-rose">{error}</p> : null}
        <button
          type="button"
          onClick={() => void submitMessage()}
          disabled={!canSend || sending}
          className="rounded-full border border-transparent bg-accent px-6 py-3 font-display text-xl uppercase tracking-[0.08em] text-white shadow-halo transition hover:bg-accent2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? copy.sending : copy.send}
        </button>
      </div>
    </article>
  );
}
