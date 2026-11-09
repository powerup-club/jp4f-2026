"use client";

import { useId, useRef } from "react";
import type { Speaker } from "@/content/types";
import { SpeakerPortrait } from "./SpeakerPortrait";

interface SpeakerCardProps {
  speaker: Speaker;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  labels: {
    biography: string;
    details: string;
    showDetails: string;
    hideDetails: string;
  };
}

function formatUrlLabel(url: string): string {
  if (url.startsWith("mailto:")) return url.slice("mailto:".length);
  return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
}

export function SpeakerCard({ speaker, isOpen, onOpen, onClose, onToggle, labels }: SpeakerCardProps) {
  const detailsId = useId();
  const isTouchPointer = useRef(false);
  const detailsText = speaker.biography ?? speaker.topic;

  return (
    <article
      data-speaker-card
      data-speaker-name={speaker.name}
      data-open={isOpen}
      className="speaker-card group"
      onPointerDownCapture={(event) => {
        isTouchPointer.current = event.pointerType === "touch";
      }}
      onMouseEnter={onOpen}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) onClose();
      }}
      onFocusCapture={() => {
        if (!isTouchPointer.current) onOpen();
      }}
      onBlurCapture={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) onClose();
      }}
      onClick={(event) => {
        if (isTouchPointer.current) {
          const clickedLink = event.target instanceof Element && event.target.closest("a");
          if (!clickedLink) {
            onToggle();
            if (isOpen && document.activeElement instanceof HTMLElement && event.currentTarget.contains(document.activeElement)) {
              document.activeElement.blur();
            }
          }
          isTouchPointer.current = false;
        } else if (event.detail === 0) {
          onOpen();
        }
      }}
    >
      <SpeakerPortrait name={speaker.name} image={speaker.image} />

      <div className="speaker-card__base">
        <h2 className="font-display text-2xl font-semibold uppercase text-ink">{speaker.name}</h2>
        <p className="mt-1 text-sm text-ink/75">{speaker.role}</p>
        <p className="mt-1 text-xs text-ink/60">{speaker.affiliation}</p>
      </div>

      <button
        className="speaker-card__trigger"
        type="button"
        aria-controls={detailsId}
        aria-expanded={isOpen}
        aria-label={isOpen ? labels.hideDetails : labels.showDetails}
      >
        <span aria-hidden="true">i</span>
      </button>

      <div
        id={detailsId}
        className="speaker-card__panel"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="speaker-card__content">
          {speaker.links?.length ? (
            <div className="speaker-card__links mb-5 flex flex-wrap gap-2">
              {speaker.links.map((link) => (
                <a
                  key={`${speaker.name}-${link.href}`}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="rounded-full border border-edge/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink transition hover:border-accent hover:text-accent"
                >
                  {link.label || formatUrlLabel(link.href)}
                </a>
              ))}
            </div>
          ) : null}

          <h3 className="speaker-card__bio font-display text-xl font-semibold uppercase text-accent">
            {speaker.biography ? labels.biography : labels.details}
          </h3>
          {detailsText ? <p className="speaker-card__bio mt-3 text-sm leading-6 text-ink/80">{detailsText}</p> : null}
        </div>
      </div>
    </article>
  );
}
