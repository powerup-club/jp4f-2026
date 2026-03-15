"use client";

import { useEffect, useMemo, useState } from "react";

type HomeIntroProps = {
  children: React.ReactNode;
};

const INTRO_SRC = "/intro/home-intro.html";
const INTRO_SEEN_KEY = "homeIntroSeen";
const INTRO_DONE_MESSAGE = "homeIntroDone";

export function HomeIntro({ children }: HomeIntroProps) {
  const [showIntro, setShowIntro] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(INTRO_SEEN_KEY);
    if (seen || prefersReduced) return;
    setShowIntro(true);
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    const finish = () => {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      setExiting(true);
      window.setTimeout(() => setShowIntro(false), 500);
    };

    const onMessage = (event: MessageEvent) => {
      if (event?.data === INTRO_DONE_MESSAGE) finish();
      if (event?.data?.type === INTRO_DONE_MESSAGE) finish();
    };

    // Failsafe: never block the home if the iframe can't notify us (e.g. offline GSAP CDN).
    const fallback = window.setTimeout(finish, 38000);

    window.addEventListener("message", onMessage);
    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener("message", onMessage);
    };
  }, [showIntro]);

  const overlayStyle = useMemo<React.CSSProperties>(
    () => ({
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      opacity: exiting ? 0 : 1,
      transition: "opacity 420ms ease"
    }),
    [exiting]
  );

  return (
    <>
      {children}
      {showIntro ? (
        <div style={overlayStyle} aria-hidden>
          {/* Glass layer between the home page and the transparent intro iframe */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at 18% 16%, rgba(255,255,255,0.10), transparent 46%), radial-gradient(circle at 88% 10%, rgba(0,240,200,0.10), transparent 52%), radial-gradient(circle at 70% 90%, rgba(255,170,0,0.08), transparent 55%), linear-gradient(180deg, rgba(7,7,12,0.44), rgba(7,7,12,0.32))",
              backdropFilter: "blur(18px) saturate(140%)",
              WebkitBackdropFilter: "blur(18px) saturate(140%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)"
            }}
          />
          <iframe
            src={INTRO_SRC}
            title="Innov'Industry Intro"
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              height: "100%",
              border: 0,
              display: "block",
              backgroundColor: "transparent"
            }}
            loading="eager"
          />
        </div>
      ) : null}
    </>
  );
}
