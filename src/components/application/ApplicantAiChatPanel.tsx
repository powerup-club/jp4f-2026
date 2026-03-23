"use client";

import { useState } from "react";
import type { ApplicantAiChatMessage } from "@/applicant/types";
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
    aiLabel: string;
    youLabel: string;
  }
> = {
  fr: {
    inputLabel: "Message",
    inputPlaceholder: "Pose une question sur ta candidature, le formulaire ou la competition...",
    send: "Envoyer",
    sending: "Analyse...",
    empty: "Aucun message pour le moment.",
    disabled: "Le chat IA sera disponible quand Neon sera configure et migre.",
    error: "Impossible de generer une reponse pour le moment.",
    aiLabel: "Assistant",
    youLabel: "Vous"
  },
  en: {
    inputLabel: "Message",
    inputPlaceholder: "Ask about your application, the form, or the competition...",
    send: "Send",
    sending: "Thinking...",
    empty: "No messages yet.",
    disabled: "AI chat will be available once Neon is configured and migrated.",
    error: "Could not generate a reply right now.",
    aiLabel: "Assistant",
    youLabel: "You"
  },
  ar: {
    inputLabel: "الرسالة",
    inputPlaceholder: "اسأل عن الترشح أو الاستمارة أو المسابقة...",
    send: "إرسال",
    sending: "جار التفكير...",
    empty: "لا توجد رسائل حتى الآن.",
    disabled: "سيصبح المساعد الذكي متاحا بعد إعداد Neon وتشغيل الـ migration.",
    error: "تعذر توليد الرد حاليا.",
    aiLabel: "المساعد",
    youLabel: "أنت"
  }
};

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

export function ApplicantAiChatPanel({
  locale,
  initialMessages,
  canSend
}: {
  locale: SiteLocale;
  initialMessages: ApplicantAiChatMessage[];
  canSend: boolean;
}) {
  const copy = COPY[locale];
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitMessage() {
    const trimmed = body.trim();
    if (!trimmed || !canSend || sending) {
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/application/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed, locale })
      });

      const payload = (await response.json().catch(() => null)) as
        | { messages?: ApplicantAiChatMessage[]; error?: { message?: string } }
        | null;

      if (!response.ok || !payload?.messages?.length) {
        throw new Error(payload?.error?.message || copy.error);
      }

      setMessages((current) => [...current, ...payload.messages!]);
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
          messages.map((message) => {
            const isAssistant = message.role === "assistant";

            return (
              <div
                key={message.id}
                className={`rounded-2xl border p-4 ${
                  isAssistant
                    ? "border-accent/35 bg-accent/10"
                    : "border-edge/50 bg-panel/70"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-display text-2xl uppercase text-ink">
                    {isAssistant ? copy.aiLabel : copy.youLabel}
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-ink/45">
                    {formatDate(message.createdAt, locale)}
                  </p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-ink/78 sm:text-base">
                  {message.content}
                </p>
              </div>
            );
          })
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
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submitMessage();
            }
          }}
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
