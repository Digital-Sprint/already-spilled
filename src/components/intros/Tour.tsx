"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

type Step = { target: string | null; text: string };

const STEPS: Step[] = [
  { target: null, text: "psst — I'm Al, Court Jester of Spillville. Two-second tour?" },
  { target: "#tour-headline", text: "The whole idea: embrace the mess. Spilling's inevitable, so we made it a lifestyle." },
  { target: "#tour-story", text: "Start here — the whole dumb, beautiful story of how this began." },
  { target: "#tour-spill", text: "Then spill yours. Your finest disaster. The messier the better." },
  { target: "#tour-boletin", text: "Drop your email in the Boletín so you actually hear from us. Rarely." },
  { target: null, text: "That's the tour. Now click around — the cherubs, the letters, all of it. There's mess hidden everywhere. 👀" },
];

const HALF_W = 150; // half the floater width, for clamping to screen

export default function Tour({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const cur = STEPS[step];
  const last = step >= STEPS.length - 1;

  const measure = useCallback(() => {
    setVp({ w: window.innerWidth, h: window.innerHeight });
    if (!cur.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(cur.target);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [cur.target]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [measure]);

  const advance = () => (last ? onDone() : setStep((s) => s + 1));

  // Where the floating cherub + bubble should sit
  let cx = vp.w / 2;
  let cy = vp.h * 0.4;
  let below = true;
  if (rect) {
    cx = rect.left + rect.width / 2;
    below = rect.top < vp.h * 0.5;
    cy = below ? rect.bottom + 18 : rect.top - 18;
  }
  cx = Math.max(HALF_W, Math.min(vp.w - HALF_W, cx));
  cy = Math.max(90, Math.min(vp.h - 90, cy));

  return (
    <div className="tour-root">
      {/* Click-anywhere-to-continue blocker (under the floater) */}
      <div className="tour-blocker" onClick={advance} />

      {/* Spotlight on the current target, or a full dim for intro/outro */}
      {rect ? (
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

      {/* Floating Al + speech bubble that glides between targets */}
      <div
        className={`tour-floater ${below ? "is-below" : "is-above"}`}
        style={{ left: cx, top: cy }}
      >
        <Image
          src="/assets/cherub-pink.png"
          alt="Al"
          width={84}
          height={100}
          className="tour-floater-cherub animate-float-2"
          priority
        />
        <div className="tour-floater-bubble" onClick={(e) => e.stopPropagation()}>
          <p className="tour-floater-text">{cur.text}</p>
          <div className="tour-floater-actions">
            <button
              className="intro-skip"
              onClick={(e) => {
                e.stopPropagation();
                onDone();
              }}
            >
              Skip
            </button>
            <span className="tour-count">
              {step + 1}/{STEPS.length}
            </span>
            <button
              className="intro-next"
              onClick={(e) => {
                e.stopPropagation();
                advance();
              }}
            >
              {last ? "Got it" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
