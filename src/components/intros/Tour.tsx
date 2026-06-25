"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

type Step = { target: string | null; text: string };

const STEPS: Step[] = [
  { target: "#tour-headline", text: "The whole idea: embrace the mess. Spilling's inevitable, so we made it a lifestyle." },
  { target: "#tour-story", text: "Start here — the whole dumb, beautiful story of how this began." },
  { target: "#tour-spill", text: "Then spill yours. Your finest disaster. The messier the better." },
  { target: "#tour-boletin", text: "Drop your email in the Boletín so you actually hear from us. Rarely." },
  { target: null, text: "That's the tour. Now click around — the cherubs, the letters, all of it. There's mess hidden everywhere. 👀" },
];

const HALF_W = 180; // half the cherub+bubble width, for clamping to screen

export default function Tour({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"hero" | "tour">("hero");
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });

  const cur = STEPS[step];
  const last = step >= STEPS.length - 1;

  const measure = useCallback(() => {
    setVp({ w: window.innerWidth, h: window.innerHeight });
    if (phase !== "tour" || !cur.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(cur.target);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [phase, cur.target]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [measure]);

  const start = () => setPhase("tour");
  const advance = () => (last ? onDone() : setStep((s) => s + 1));

  // --- Pink (Al) position: cluster center in hero, beside the target in tour ---
  let px = vp.w / 2;
  let py = vp.h * 0.36;
  let below = true;
  if (phase === "tour") {
    if (rect) {
      px = rect.left + rect.width / 2;
      below = rect.top < vp.h * 0.5;
      py = below ? rect.bottom + 18 : rect.top - 18;
    } else {
      px = vp.w / 2;
      py = vp.h * 0.42;
    }
  }
  px = Math.max(HALF_W, Math.min(vp.w - HALF_W, px));
  py = Math.max(90, Math.min(vp.h - 110, py));

  // Blue and green: clustered in hero, then fly to their home corners.
  // Spread the cluster wider on narrow screens so they don't pile up.
  const narrow = vp.w > 0 && vp.w <= 640;
  const blueStyle =
    phase === "hero"
      ? { left: narrow ? "26%" : "37%", top: "36%" }
      : { left: "6%", top: "50%" };
  const greenStyle =
    phase === "hero"
      ? { left: narrow ? "74%" : "63%", top: "36%" }
      : { left: "20%", top: "9%" };

  return (
    <div className="tour-root">
      <div className="tour-blocker" onClick={phase === "tour" ? advance : undefined} />

      {/* Backdrop: full dim in hero, spotlight on the target in tour */}
      {phase === "tour" && rect ? (
        <div
          className="tour-spotlight"
          style={{
            left: rect.left - 8,
            top: rect.top - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          }}
        />
      ) : (
        <div className="tour-dim" />
      )}

      {/* Blue cherub */}
      <div className={`tour-cherub-fly cherub-blue ${phase}`} style={blueStyle}>
        <Image src="/assets/cherub-blue.png" alt="" width={150} height={180} className="animate-float-1" priority />
      </div>

      {/* Green cherub */}
      <div className={`tour-cherub-fly cherub-green ${phase}`} style={greenStyle}>
        <Image src="/assets/cherub-green.png" alt="" width={150} height={180} className="animate-float-3" priority />
      </div>

      {/* Pink cherub = Al, the guide */}
      <div
        className={`tour-al ${phase} ${below ? "is-below" : "is-above"}`}
        style={{ left: px, top: py }}
      >
        <Image
          src="/assets/cherub-pink.png"
          alt="Al"
          width={150}
          height={180}
          className="tour-al-cherub animate-float-2"
          priority
        />
        {phase === "tour" && (
          <div className="tour-floater-bubble" onClick={(e) => e.stopPropagation()}>
            <p className="tour-floater-text">{cur.text}</p>
            <div className="tour-floater-actions">
              <button className="intro-skip" onClick={(e) => { e.stopPropagation(); onDone(); }}>
                Skip
              </button>
              <span className="tour-count">{step + 1}/{STEPS.length}</span>
              <button className="intro-next" onClick={(e) => { e.stopPropagation(); advance(); }}>
                {last ? "Got it" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hero greeting (fades out when the tour starts) */}
      <div className={`tour-hero ${phase === "tour" ? "gone" : ""}`}>
        <h1 className="tour-hero-title">welcome to the mess</h1>
        <p className="tour-hero-sub">
          I&apos;m Al, Court Jester of Spillville — and these are the cherubs.
          First time here? Let us show you around.
        </p>
        <div className="tour-hero-actions">
          <button className="intro-skip" onClick={onDone}>I&apos;ll explore solo</button>
          <button className="intro-next tour-hero-go" onClick={start}>Show me around →</button>
        </div>
      </div>
    </div>
  );
}
