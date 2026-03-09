"use client";

import React from "react";
import { useState } from "react";
import type { ScheduleItem } from "@/content/types";

interface ProgrammeTabsProps {
  day1Label: string;
  day2Label: string;
  day1: ScheduleItem[];
  day2: ScheduleItem[];
}

function AgendaList({ items }: { items: ScheduleItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={`${item.time}-${item.title}`} className="glass-card flex items-start gap-4 p-4">
          <div className="min-w-14 rounded-xl border border-edge/70 bg-panel/75 px-2 py-1 text-center font-display text-xl font-semibold uppercase text-accent">
            {item.time}
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-ink">{item.title}</p>
            {item.location ? <p className="text-base text-ink/68">{item.location}</p> : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProgrammeTabs({ day1Label, day2Label, day1, day2 }: ProgrammeTabsProps) {
  const [day, setDay] = useState<"day1" | "day2">("day1");

  return (
    <div>
      <div className="mb-6 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setDay("day1")}
          className={`rounded-2xl border px-4 py-3 text-left font-display text-2xl uppercase tracking-[0.08em] transition ${
            day === "day1" ? "border-accent bg-accent/15 text-accent" : "border-edge bg-panel/60 text-ink/80"
          }`}
        >
          {day1Label}
        </button>
        <button
          type="button"
          onClick={() => setDay("day2")}
          className={`rounded-2xl border px-4 py-3 text-left font-display text-2xl uppercase tracking-[0.08em] transition ${
            day === "day2" ? "border-accent bg-accent/15 text-accent" : "border-edge bg-panel/60 text-ink/80"
          }`}
        >
          {day2Label}
        </button>
      </div>

      {day === "day1" ? <AgendaList items={day1} /> : <AgendaList items={day2} />}
    </div>
  );
}
