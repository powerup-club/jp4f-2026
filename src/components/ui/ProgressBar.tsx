"use client";

import { useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  label: string;
  value: number;
}

export function ProgressBar({ label, value }: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || active) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div className="space-y-2" ref={ref}>
      <div className="flex items-center justify-between">
        <span className="font-display text-2xl font-semibold uppercase tracking-[0.06em] text-ink/88">{label}</span>
        <span className="font-display text-xl text-ink/72">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-panel/65">
        <div
          className="h-full rounded-full bg-gradient-to-r from-signal via-accent2 to-accent transition-all duration-700"
          style={{ width: active ? `${value}%` : "0%" }}
        />
      </div>
    </div>
  );
}
