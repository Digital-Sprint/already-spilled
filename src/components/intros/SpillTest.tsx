"use client";

import { useState } from "react";

const COLORS = [
  "#ff6b9d", "#4a90d9", "#f5e050", "#7cb860",
  "#ff8c42", "#9d4edd", "#e63946", "#2ec4b6",
];

const QUESTIONS: { q: string; a: string[] }[] = [
  {
    q: "A waiter sets a full glass of red wine right in front of you. First instinct?",
    a: ["Admire it from a safe distance", "Gesture wildly mid-story", "I'm already wearing it"],
  },
  {
    q: "Your white shirt is...",
    a: ["Pristine and quietly judging me", "A blank canvas", "What white shirt?"],
  },
  {
    q: "Spilling is...",
    a: ["A tragedy", "Inevitable", "A lifestyle"],
  },
];

type Splat = { id: string; x: number; y: number; c: string; s: number; r: number };

const VERDICTS = [
  { min: 0, title: "Mildly Damp", line: "You try. The mess always wins, but you try. Welcome anyway." },
  { min: 3, title: "Habitually Spilled", line: "Be honest — there's a stain on you right now, isn't there?" },
  { min: 5, title: "Chronically Spilled", line: "Diagnosis confirmed. You were always one of us. Come in." },
];

export default function SpillTest({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const [splats, setSplats] = useState<Splat[]>([]);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const answer = (idx: number) => {
    const n = 5 + idx * 4;
    const fresh: Splat[] = Array.from({ length: n }).map((_, k) => ({
      id: `${i}-${k}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      s: 24 + Math.random() * 90,
      r: Math.random() * 360,
    }));
    setSplats((s) => [...s, ...fresh]);
    setScore((sc) => sc + idx);
    if (i >= QUESTIONS.length - 1) {
      setTimeout(() => setDone(true), 450);
    } else {
      setI((v) => v + 1);
    }
  };

  const verdict = [...VERDICTS].reverse().find((v) => score >= v.min) ?? VERDICTS[0];

  return (
    <div className="intro-overlay spill-test">
      {splats.map((s) => (
        <span
          key={s.id}
          className="test-splat"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            background: s.c,
            transform: `translate(-50%, -50%) rotate(${s.r}deg)`,
          }}
        />
      ))}

      {!done ? (
        <div className="test-card animate-panel-in">
          <div className="test-kicker">THE SPILL TEST</div>
          <h2 className="test-title">Are you Already Spilled?</h2>
          <p className="test-q">{QUESTIONS[i].q}</p>
          <div className="test-answers">
            {QUESTIONS[i].a.map((a, idx) => (
              <button key={a} className="test-answer" onClick={() => answer(idx)}>
                {a}
              </button>
            ))}
          </div>
          <div className="test-progress">
            {QUESTIONS.map((_, k) => (
              <span key={k} className={`test-dot ${k <= i ? "on" : ""}`} />
            ))}
          </div>
          <button className="intro-skip test-skip" onClick={onDone}>
            skip the test
          </button>
        </div>
      ) : (
        <div className="test-card test-verdict animate-panel-in">
          <div className="test-kicker">DIAGNOSIS</div>
          <h2 className="test-title">{verdict.title}</h2>
          <p className="test-q">{verdict.line}</p>
          <button className="intro-next test-enter" onClick={onDone}>
            Enter Spillville →
          </button>
        </div>
      )}
    </div>
  );
}
