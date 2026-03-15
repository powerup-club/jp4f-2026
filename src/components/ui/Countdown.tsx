"use client";

import React from "react";
import { useEffect, useMemo, useState } from "react";

interface CountdownProps {
  targetIso: string;
  label: string;
  endedLabel: string;
}

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getCountdownParts(targetIso: string) {
  const targetTime = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  if (Number.isNaN(targetTime) || diff <= 0) {
    return null;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds } satisfies CountdownParts;
}

export function Countdown({ targetIso, label, endedLabel }: CountdownProps) {
  const [parts, setParts] = useState<CountdownParts | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tick = () => {
      setParts(getCountdownParts(targetIso));
      setReady(true);
    };

    tick();
    const timer = window.setInterval(() => {
      tick();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetIso]);

  const unitList = useMemo(
    () => [
      { key: "days", text: "J" },
      { key: "hours", text: "H" },
      { key: "minutes", text: "M" },
      { key: "seconds", text: "S" }
    ],
    []
  );

  if (ready && !parts) {
    return <p className="text-sm text-ink/70">{endedLabel}</p>;
  }

  const displayParts: CountdownParts = parts ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <div className="glass-card liquid-card shadow-2xl p-5">
      <p className="font-display text-lg uppercase tracking-[0.1em] text-ink/72">{label}</p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {unitList.map((unit) => {
          const value = String(displayParts[unit.key as keyof CountdownParts]).padStart(2, "0");
          return (
            <div key={unit.key} className="rounded-2xl border border-edge/65 bg-panel/70 px-2 py-3 text-center">
              <div className="font-display text-4xl font-semibold leading-none text-accent">{value}</div>
              <div className="font-display text-base uppercase tracking-[0.08em] text-ink/65">{unit.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
