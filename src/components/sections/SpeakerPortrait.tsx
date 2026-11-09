"use client";

import { useState } from "react";

interface SpeakerPortraitProps {
  name: string;
  image?: string;
}

function getInitials(name: string): string {
  return name
    .replace(/^(Pr\.?|Mr\.?|Mme\.?|Dr\.?)\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function SpeakerPortrait({ name, image }: SpeakerPortraitProps) {
  const [imageUnavailable, setImageUnavailable] = useState(!image);

  return (
    <div
      className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-edge/70 bg-gradient-to-br from-accent/25 to-accent2/20 sm:h-28 sm:w-28"
      role="img"
      aria-label={`Portrait de ${name}`}
    >
      {image && !imageUnavailable ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageUnavailable(true)}
        />
      ) : (
        <span aria-hidden="true" className="font-display text-2xl font-semibold tracking-wider text-accent">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
