"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ScheduleItem } from "@/content/types";

interface ProgrammeTabsProps {
  day1Label: string;
  day2Label: string;
  day1: ScheduleItem[];
  day2: ScheduleItem[];
}

export function ProgrammeTabs({ day1Label, day2Label, day1, day2 }: ProgrammeTabsProps) {
  const days = useMemo(
    () =>
      [
        {
          key: "day1",
          label: day1Label,
          items: day1,
          lineClass: "timeline-progress-accent",
          dotClass: "timeline-dot-accent",
          timeClass: "text-accent",
          activeCardClass: "timeline-card-active-accent"
        },
        {
          key: "day2",
          label: day2Label,
          items: day2,
          lineClass: "timeline-progress-signal",
          dotClass: "timeline-dot-signal",
          timeClass: "text-signal",
          activeCardClass: "timeline-card-active-signal"
        }
      ] as const,
    [day1, day1Label, day2, day2Label]
  );

  return (
    <div className="space-y-10">
      {days.map((day) => (
        <DayTimeline key={day.key} {...day} />
      ))}
    </div>
  );
}

function DayTimeline({
  label,
  items,
  lineClass,
  dotClass,
  timeClass,
  activeCardClass
}: {
  label: string;
  items: ScheduleItem[];
  lineClass: string;
  dotClass: string;
  timeClass: string;
  activeCardClass: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!items.length) {
      return;
    }

    const visible = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false;
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (Number.isNaN(index)) {
            return;
          }
          if (entry.isIntersecting) {
            if (!visible.has(index)) {
              visible.add(index);
              changed = true;
            }
          } else if (visible.delete(index)) {
            changed = true;
          }
        });

        if (changed) {
          const next = visible.size ? Math.max(...visible) : 0;
          setActiveIndex(next);
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: 0.2 }
    );

    itemRefs.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items.length]);

  const progress = items.length ? Math.min(100, ((activeIndex + 1) / items.length) * 100) : 0;

  return (
    <article className="glass-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-2xl font-semibold uppercase text-ink sm:text-3xl">{label}</p>
        <span className="rounded-full border border-edge/60 bg-panel/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-ink/60">
          {items.length}
        </span>
      </div>

      <div className="timeline-center mt-6">
        <span className="timeline-center-line" />
        <span className={`timeline-center-progress ${lineClass}`} style={{ height: `${progress}%` }} />
        <div className="timeline-center-items">
          {items.map((item, index) => {
            const side = index % 2 === 0 ? "left" : "right";
            const isActive = index <= activeIndex;
            return (
              <div
                key={`${label}-${item.time}-${item.title}`}
                data-index={index}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className={`timeline-center-item ${side}`}
              >
                <span className={`timeline-center-dot ${dotClass} ${isActive ? "is-active" : ""}`} />
                <div className={`timeline-center-card outlined-cut-card bg-panel/70 p-4 sm:p-5 ${isActive ? activeCardClass : ""}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full border border-edge/70 bg-panel/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${timeClass}`}
                    >
                      {item.time}
                    </span>
                    <p className="font-display text-xl font-semibold text-ink">{item.title}</p>
                  </div>
                  {item.location ? <p className="mt-2 text-sm text-ink/65">{item.location}</p> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
