"use client";

import { useState } from "react";
import type { SiteLocale } from "@/config/locales";
import type { Club } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";
import { ClubAccordionCard } from "@/components/sections/ClubAccordionCard";

interface ClubsAccordionProps {
  clubs: Club[];
  locale: SiteLocale;
}

export function ClubsAccordion({ clubs, locale }: ClubsAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((previous) => (previous === id ? null : id));
  };

  return (
    <div className="space-y-3">
      {clubs.map((club) => (
        <Reveal key={club.id}>
          <div id={club.id} className="outlined-cut-card">
            <ClubAccordionCard
              club={club}
              locale={locale}
              isExpanded={expandedId === club.id}
              onToggle={() => toggle(club.id)}
            />
          </div>
        </Reveal>
      ))}
    </div>
  );
}
