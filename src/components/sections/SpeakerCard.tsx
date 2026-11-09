"use client";

import { useId, useState } from "react";
import type { Speaker } from "@/content/types";
import { SpeakerPortrait } from "./SpeakerPortrait";

interface SpeakerCardProps {
  speaker: Speaker;
  labels: {
    biography: string;
    intervention: string;
    details: string;
    showDetails: string;
    hideDetails: string;
  };
}

function formatUrlLabel(url: string): string {
  if (url.startsWith("mailto:")) return url.slice("mailto:".length);
  return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
}

export function SpeakerCard({ speaker, labels }: SpeakerCardProps) {
  const [flipped, setFlipped] = useState(false);
  const cardId = useId();
  const detailsTitle = speaker.biography ? labels.biography : labels.details;
  const detailsText = speaker.biography ?? speaker.topic;

  return (
    <div className="flex h-full flex-col">
      <div
        id={cardId}
        className="relative flex-1"
        style={{ minHeight: "29rem", perspective: "1200px" }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700"
          style={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d"
          }}
        >
          <article
            aria-hidden={flipped}
            inert={flipped}
            className="glass-card absolute inset-0 flex flex-col overflow-hidden p-6 sm:p-8"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center gap-5">
              <SpeakerPortrait name={speaker.name} image={speaker.image} />
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-semibold uppercase text-ink">{speaker.name}</h2>
                <p className="mt-2 text-sm font-medium text-accent">{speaker.role}</p>
                <p className="mt-1 text-sm text-ink/65">{speaker.affiliation}</p>
              </div>
            </div>

            {speaker.intervention || speaker.topic ? (
              <div className="mt-6 rounded-2xl border border-edge/60 bg-panel/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  {labels.intervention}
                </p>
                <p className="mt-2 text-sm text-ink/80">{speaker.intervention ?? speaker.topic}</p>
              </div>
            ) : null}
          </article>

          <article
            aria-hidden={!flipped}
            inert={!flipped}
            className="glass-card absolute inset-0 flex flex-col overflow-y-auto p-6 sm:p-8"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <h2 className="font-display text-xl font-semibold uppercase text-accent">{detailsTitle}</h2>
            {detailsText ? (
              <p className="mt-4 text-sm leading-7 text-ink/75">{detailsText}</p>
            ) : null}

            {speaker.links?.length ? (
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {speaker.links.map((link) => (
                  <a
                    key={`${speaker.name}-${link.href}`}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="rounded-full border border-edge/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70 transition hover:border-accent hover:text-accent"
                  >
                    {link.label || formatUrlLabel(link.href)}
                  </a>
                ))}
              </div>
            ) : null}
          </article>
        </div>
      </div>

      <button
        type="button"
        aria-controls={cardId}
        aria-pressed={flipped}
        onClick={() => setFlipped((current) => !current)}
        className="mt-3 self-start rounded-full border border-edge/70 bg-panel/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink/75 transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {flipped ? labels.hideDetails : labels.showDetails}
      </button>
    </div>
  );
}
