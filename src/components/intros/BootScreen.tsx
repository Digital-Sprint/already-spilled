"use client";

import { useState, useEffect, useRef } from "react";

const LINES = [
  "SPILLVILLE OS  v2.026",
  "© Already Spilled. all rights reversed.",
  "",
  "booting...",
  "mounting /dev/mess ........ ok",
  "loading manifesto:",
  "  > spilling is inevitable",
  "  > there is beauty in the day-to-day",
  "  > our brains are overworked, they can't keep up",
  "  > Already Spilled forces us to look down",
  "  > take in the moment. use all your senses.",
  "  > embrace the mess",
  "",
  "ready.",
];

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [finished, setFinished] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let cancelled = false;
    let line = 0;
    let char = 0;

    const tick = () => {
      if (cancelled) return;
      if (line >= LINES.length) {
        setFinished(true);
        return;
      }
      const text = LINES[line];
      if (char < text.length) {
        setCurrent(text.slice(0, char + 1));
        char += 1;
        timers.current.push(setTimeout(tick, 18));
      } else {
        setDone((d) => [...d, text]);
        setCurrent("");
        line += 1;
        char = 0;
        // Empty lines flash by; content lines pause a beat
        timers.current.push(setTimeout(tick, text === "" ? 90 : 260));
      }
    };

    timers.current.push(setTimeout(tick, 400));
    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const skip = () => {
    timers.current.forEach(clearTimeout);
    setDone(LINES);
    setCurrent("");
    setFinished(true);
  };

  return (
    <div className="intro-overlay boot-screen" onClick={!finished ? skip : undefined}>
      <div className="boot-crt" />
      <div className="boot-inner">
        <pre className="boot-text">
          {done.map((l, i) => (
            <div key={i} className="boot-line">
              {l || " "}
            </div>
          ))}
          {!finished && (
            <div className="boot-line">
              {current}
              <span className="boot-cursor">▋</span>
            </div>
          )}
        </pre>

        {finished ? (
          <button className="boot-enter" onClick={onDone}>
            [ ENTER SPILLVILLE ]
          </button>
        ) : (
          <div className="boot-hint">click anywhere to skip</div>
        )}
      </div>
    </div>
  );
}
