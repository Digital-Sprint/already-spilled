"use client";

import Image from "next/image";
import { useState } from "react";

const STEPS = [
  "New here? I'm Al, Court Jester of Spillville. Lemme walk you in. 👋",
  "We're a movement for people who can't make it through a meal clean. The motto: embrace the mess.",
  "Start with STORY TIME — the whole dumb, beautiful story of how this began.",
  "Then hit SPILL IT and tell us your finest disaster. The messier the better.",
  "And drop your email in EL BOLETÍN so you actually hear from us. Rarely. We promise.",
];

export default function TourIntro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const last = step >= STEPS.length - 1;

  return (
    <div className="intro-overlay">
      <div className="tour-card animate-panel-in">
        <Image
          src="/assets/cherub-pink.png"
          alt="Al"
          width={120}
          height={140}
          className="tour-cherub animate-float-2"
          priority
        />
        <p className="tour-text">{STEPS[step]}</p>
        <div className="tour-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`tour-dot ${i === step ? "on" : ""}`} />
          ))}
        </div>
        <div className="tour-actions">
          <button className="intro-skip" onClick={onDone}>
            Skip
          </button>
          <button
            className="intro-next"
            onClick={() => (last ? onDone() : setStep((s) => s + 1))}
          >
            {last ? "Let me in →" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
