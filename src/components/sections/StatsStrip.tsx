import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { StatItem } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function StatsStrip({ stats }: { stats: StatItem[] }) {
  return (
    <section className="section-shell mt-10">
      <Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-5 text-center">
              <div className="font-display text-5xl font-semibold leading-none text-accent">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 font-display text-lg uppercase tracking-[0.08em] text-ink/72">{stat.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
