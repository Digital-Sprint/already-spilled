"use client";

import { useState, useEffect, type Dispatch, type SetStateAction } from "react";

type Toggle = Dispatch<SetStateAction<boolean>>;

const WINDOW_NAMES: Record<string, string> = {
  welcome: "Welcome",
  inbox: "SpillMail",
  story: "AlreadySpilled",
  collection: "Collection",
  signup: "Guestbook",
  paint: "Paint",
};

export default function TaskBar({
  soundOn, setSoundOn,
  crtOn, setCrtOn,
  stainsOn, setStainsOn,
  darkMode, setDarkMode,
  onTour, onCleanUp,
  windows, onWindowClick,
}: {
  soundOn: boolean; setSoundOn: Toggle;
  crtOn: boolean; setCrtOn: Toggle;
  stainsOn: boolean; setStainsOn: Toggle;
  darkMode: boolean; setDarkMode: Toggle;
  onTour: () => void;
  onCleanUp: () => void;
  windows: { id: string; min: boolean }[];
  onWindowClick: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      let h = d.getHours();
      const m = d.getMinutes();
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      setClock(`${h}:${m.toString().padStart(2, "0")} ${ampm}`);
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  const toggles = [
    { name: "moosic", icon: "🐮", on: soundOn, act: () => setSoundOn((v) => !v) },
    { name: "fuzz", icon: "🍑", on: crtOn, act: () => setCrtOn((v) => !v) },
    { name: "splatter", icon: "💦", on: stainsOn, act: () => setStainsOn((v) => !v) },
    { name: darkMode ? "night night" : "bom dia", icon: darkMode ? "🌚" : "☀️", on: darkMode, act: () => setDarkMode((v) => !v) },
  ];

  return (
    <>
      {open && <div className="sb-scrim" onClick={() => setOpen(false)} />}
      <div className="taskbar">
        <button
          className={`sb-start ${open ? "pressed" : ""}`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sb-start-logo">🫘</span>
          <span className="sb-start-text">Spill</span>
        </button>

        {open && (
          <div className="start-menu">
            <div className="sm-side">
              <span className="sm-side-text">Spillville<b>95</b></span>
            </div>
            <div className="sm-items">
              {toggles.map((t) => (
                <button key={t.name} className="sm-item" onClick={t.act}>
                  <span className="sm-ico">{t.icon}</span>
                  <span className="sm-label">{t.name}</span>
                  <span className="sm-check">{t.on ? "●" : "○"}</span>
                </button>
              ))}
              <div className="sm-sep" />
              <button className="sm-item" onClick={() => { onCleanUp(); setOpen(false); }}>
                <span className="sm-ico">🧹</span>
                <span className="sm-label">Clean Up</span>
              </button>
              <button className="sm-item" onClick={() => { onTour(); setOpen(false); }}>
                <span className="sm-ico">👋</span>
                <span className="sm-label">Take the Tour</span>
              </button>
            </div>
          </div>
        )}

        <div className="sb-windows">
          {windows.map((w) => (
            <button
              key={w.id}
              className={`sb-window ${w.min ? "" : "active"}`}
              onClick={() => onWindowClick(w.id)}
            >
              <span className="sb-window-ico">▪</span>
              {WINDOW_NAMES[w.id] ?? w.id}
            </button>
          ))}
        </div>

        <span className="sb-copy">© 2026 Already Spilled</span>
        <div className="sb-tray">
          <span className="sb-clock">{clock}</span>
        </div>
      </div>
    </>
  );
}
