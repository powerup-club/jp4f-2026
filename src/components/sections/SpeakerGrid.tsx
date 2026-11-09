"use client";

import { useEffect, useState } from "react";
import type { Speaker } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";
import { SpeakerCard } from "./SpeakerCard";

interface SpeakerGridProps {
  speakers: Speaker[];
  labels: {
    biography: string;
    details: string;
    showDetails: string;
    hideDetails: string;
  };
}

export function SpeakerGrid({ speakers, labels }: SpeakerGridProps) {
  const [openSpeaker, setOpenSpeaker] = useState<string | null>(null);

  function blurOtherSpeakerFocus(speakerName: string) {
    const activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLElement)) return;

    const activeCard = activeElement.closest<HTMLElement>("[data-speaker-card]");
    if (activeCard?.dataset.speakerName && activeCard.dataset.speakerName !== speakerName) {
      activeElement.blur();
    }
  }

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (event.target instanceof Element && !event.target.closest("[data-speaker-card]")) {
        setOpenSpeaker(null);
        if (
          document.activeElement instanceof HTMLElement &&
          document.activeElement.closest("[data-speaker-card]")
        ) {
          document.activeElement.blur();
        }
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {speakers.map((speaker) => (
        <Reveal key={speaker.name} className="h-full">
          <SpeakerCard
            speaker={speaker}
            isOpen={openSpeaker === speaker.name}
            onOpen={() => {
              blurOtherSpeakerFocus(speaker.name);
              setOpenSpeaker(speaker.name);
            }}
            onClose={() => {
              setOpenSpeaker((current) => (current === speaker.name ? null : current));
            }}
            onToggle={() => {
              if (openSpeaker !== speaker.name) blurOtherSpeakerFocus(speaker.name);
              setOpenSpeaker((current) => (current === speaker.name ? null : speaker.name));
            }}
            labels={labels}
          />
        </Reveal>
      ))}
    </div>
  );
}
