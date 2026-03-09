"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export function BackgroundCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let particles: Particle[] = [];
    let pointer = { x: -1000, y: -1000 };

    const paletteDark = ["#8B5CF6", "#6366F1", "#EC4899", "#F97316"];
    const paletteLight = ["#6366F1", "#8B5CF6", "#EC4899", "#F97316"];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = Array.from({ length: Math.min(Math.floor((width * height) / 11000), 140) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.5
      }));
    };

    const onPointerMove = (event: MouseEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
    };

    const draw = () => {
      const isLightTheme = document.documentElement.getAttribute("data-theme") === "light";
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      if (isLightTheme) {
        gradient.addColorStop(0, "rgba(248, 250, 252, 0.3)");
        gradient.addColorStop(1, "rgba(237, 241, 245, 0.3)");
      } else {
        gradient.addColorStop(0, "rgba(15, 23, 40, 0.66)");
        gradient.addColorStop(1, "rgba(31, 41, 55, 0.66)");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const palette = isLightTheme ? paletteLight : paletteDark;
      particles.forEach((p, i) => {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 140 && distance > 0) {
          const force = (140 - distance) / 140;
          p.vx += (dx / distance) * force * 0.25;
          p.vy += (dy / distance) * force * 0.25;
        }

        p.vx *= 0.992;
        p.vy *= 0.992;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const color = palette[i % palette.length];
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = isLightTheme ? 0.24 : 0.46;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 110) {
            ctx.strokeStyle = isLightTheme ? "rgba(99, 102, 241, 0.16)" : "rgba(236, 72, 153, 0.12)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onPointerMove);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onPointerMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen" aria-hidden="true" />;
}
