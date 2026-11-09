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
    <div className="speaker-card__photo" role="img" aria-label={`Portrait de ${name}`}>
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
        <span aria-hidden="true" className="font-display text-6xl font-semibold tracking-wider text-accent">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
