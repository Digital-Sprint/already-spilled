"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import Tour from "@/components/intros/Tour";

// Base background-music volume (0..1)
const BG_VOLUME = 0.45;

// Bumped by the "Clean Up" button to snap all dragged items back to place.
const ResetContext = createContext(0);

// Shared drag behaviour for letters and buttons: free-drag with pointer,
// snap back smoothly when the reset signal changes.
function useDraggable() {
  const resetSignal = useContext(ResetContext);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [grabbing, setGrabbing] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const movedRef = useRef(false);
  const firstReset = useRef(true);

  useEffect(() => {
    if (firstReset.current) {
      firstReset.current = false;
      return;
    }
    setSnapping(true);
    setPos({ x: 0, y: 0 });
    const t = setTimeout(() => setSnapping(false), 450);
    return () => clearTimeout(t);
  }, [resetSignal]);

  const onDown = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
    movedRef.current = false;
    setSnapping(false);
    setGrabbing(true);
  };
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.sx;
    const dy = e.clientY - drag.current.sy;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) movedRef.current = true;
    setPos({ x: drag.current.ox + dx, y: drag.current.oy + dy });
  };
  const onUp = (e: React.PointerEvent<HTMLElement>) => {
    drag.current = null;
    setGrabbing(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const style: React.CSSProperties = {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: snapping ? "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
    cursor: grabbing ? "grabbing" : "grab",
    touchAction: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
  };

  return { handlers: { onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp }, style, grabbing, movedRef };
}

const storyConversation: { name: string; text: string; side: "you" | "them" }[] = [
  { name: "You", text: "so uuhhh, wtf is this?", side: "you" },
  { name: "AlreadySpilled", text: "Excellent Question. Please expand.", side: "them" },
  { name: "You", text: "like what type of company? fashion? Media? A strange movement of some kind?", side: "you" },
  { name: "AlreadySpilled", text: "We\u2019ve spent a lot of time thinking about this and landed on \u201Celaborate bit\u201D.", side: "them" },
  { name: "AlreadySpilled", text: "It started with a feeling, \u201Cwhy can\u2019t I make it through a meal without spilling on myself?\u201D", side: "them" },
  { name: "AlreadySpilled", text: "I started asking around and found others just like me. Who saw spilling as an inevitability", side: "them" },
  { name: "AlreadySpilled", text: "There was no clear thread that connected us all. So we set out on a mission to find that community and understand what makes someone susceptible to spilling.", side: "them" },
  { name: "You", text: "That sounds incredibly dumb but im here for it", side: "you" },
  { name: "AlreadySpilled", text: "Thank you. It\u2019s the kinda thing that sooner or later probably won\u2019t make more sense but we\u2019re enjoying the ride. We like making art, short films, random items (like imagine if the pages in a coffee table book were actually coasters. Wouldn\u2019t that be more useful?), so you can expect more of that.", side: "them" },
  { name: "You", text: "You keep saying we. Who is we?", side: "you" },
  { name: "Already Spilled", text: "Ah. Who are we but us?", side: "them" },
  { name: "Already Spilled", text: "Just a boy with a silly dream a lot of talented friends", side: "them" },
  { name: "Already Spilled", text: "But you can call me Al, Court Jester of Spillville.", side: "them" },
  { name: "You", text: "Well nice to meet you Al", side: "you" },
  { name: "Al, Court Jester of Spillville", text: "Al, Court Jester of Spillville. Sorry it really bothers me when people don\u2019t use my full title. I worked hard for it.", side: "them" },
  { name: "You", text: "Apologies Al, Court Jester of Spillville.", side: "you" },
  { name: "You", text: "Just a couple more questions for ya. First off, what\u2019s up with the cherubs?", side: "you" },
  { name: "Al", text: "Hard to say really. They just kinda showed up one day.", side: "them" },
  { name: "Al", text: "But they\u2019re really good at their jobs and seem to enjoy the chaos.", side: "them" },
  { name: "You", text: "Fair enough. Plus, if one of them descended from a crane and threw beans at me, I probably would be too embarrassed to tell anyone.", side: "you" },
  { name: "Al", text: "Exactly. Their ridiculousness enhances their maneuverability.", side: "them" },
  { name: "You", text: "Alright, these kinda things always end up in collabs. What\u2019s your dream pairing?", side: "you" },
  { name: "Al", text: "We try to be organic so it really would come down to fit. But since you asked:", side: "them" },
  { name: "Al", text: "1. Scunthorpe United. A rainy November home night fixture. For one night and one night only. Think of the stains\u2026", side: "them" },
  { name: "Al", text: "2. Lola Young. I swear \u201CMessy\u201D was in my head for like 3 months. It got to the point where I thought it must be part of a psyop. Not sure what this collab would look like.", side: "them" },
  { name: "Al", text: "3. This one is a bit of a stretch but hear me out. Knicks cavs eastern conference finals, Game 7. Cavs down 2 with 5 seconds left.", side: "them" },
  { name: "Al", text: "I\u2019m court side eating buffalo cauliflower wings with blue ketchup (I brought it from home).", side: "them" },
  { name: "Al", text: "Josh hart doinks a long 3 (nothing but love Josh).", side: "them" },
  { name: "Al", text: "Jose Alvarado chases it down with Harden right behind him desperate to prove he\u2019s clutch.", side: "them" },
  { name: "Al", text: "They\u2019re coming right at me. I have no time to do anything.", side: "them" },
  { name: "Al", text: "Alvarado knocks the wings straight up into the air and the ketchup onto my shirt.", side: "them" },
  { name: "Al", text: "Harden stretches out to tip the ball to tip the ball to an open Thabo Sefalosha who heaves a buzzer beating halfcourt short.", side: "them" },
  { name: "Al", text: "On his way down he catches all the wings in his beard and crashes right into me. Leaving an orange and blue beardshaped imprint at my neckline.", side: "them" },
  { name: "Al", text: "He can\u2019t watch but hears the crowd groan in unison as Thabo\u2019s shot goes in. Cavs in 7.", side: "them" },
  { name: "Al", text: "The BS Sunday pod opens with a discussion of BeardGate (Gates are back, baby!) and what this means for Harden\u2019s Legacy.", side: "them" },
  { name: "Al", text: "", side: "them" },
  { name: "Al", text: "Zach didn\u2019t see it.", side: "them" },
  { name: "You", text: "Is this a hallucination?", side: "you" },
  { name: "Al", text: "Really wish I could answer yes that. Welcome to my brain.", side: "them" },
  { name: "You", text: "Alright so far you\u2019ve got me. what can I expect from you?", side: "you" },
  { name: "Al", text: "Here is where we\u2019ve landed", side: "them" },
  { name: "Al", text: "You won\u2019t like everything we do", side: "them" },
  { name: "Al", text: "You will only hear from when you need to", side: "them" },
  { name: "Al", text: "This will come to an end once our story is told", side: "them" },
  { name: "Al", text: "Absolutely no acronyms ever.", side: "them" },
  { name: "You", text: "Damn. That\u2019s a lot of no\u2019s. Give me something you believe in.", side: "you" },
  { name: "Al", text: "You know my mom had the same reaction haha. But here you go.", side: "them" },
  { name: "Al", text: "The older I get, the list of memories I rely on to bring my joy shrinks", side: "them" },
  { name: "Al", text: "There is so much beauty in the day to day", side: "them" },
  { name: "Al", text: "But our brains are overworked, they can\u2019t keep up and it\u2019s only getting worse.", side: "them" },
  { name: "Al", text: "You can go weeks at a time just on autopilot just trying to get the new milestone without taking a breath", side: "them" },
  { name: "Al", text: "But Already Spilled forces us to look down", side: "them" },
  { name: "Al", text: "Take in the moment", side: "them" },
  { name: "Al", text: "Use all our senses", side: "them" },
  { name: "Al", text: "marvel at the magic that got the byproduct of tomatoes from Italy, spices from India, and peppers from Mexico all coalesce on your shirt at the same time", side: "them" },
  { name: "Al", text: "Can you believe that? Really something else", side: "them" },
  { name: "Al", text: "Come on do it with me", side: "them" },
  { name: "Al", text: "Look down at your shirt", side: "them" },
];

// A headline letter you can freely drag around. The drag offset lives on the
// outer span; the inner span keeps the load/chaos animation classes so they
// don't fight the drag transform. Letters never highlight (no text select).
function DraggableLetter({ className, children }: { className?: string; children: React.ReactNode }) {
  const { handlers, style, grabbing } = useDraggable();
  return (
    <span
      {...handlers}
      onPointerDownCapture={(e) => e.preventDefault()}
      style={{ ...style, display: "inline-block", position: "relative", zIndex: grabbing ? 50 : 1 }}
    >
      <span className={className}>{children}</span>
    </span>
  );
}

// A homepage button that is both clickable and draggable. A real click only
// fires if the pointer didn't move (so dragging doesn't open a panel).
function DraggableButton({ onClick, children, id }: { onClick: () => void; children: React.ReactNode; id?: string }) {
  const { handlers, style, grabbing, movedRef } = useDraggable();
  return (
    <button
      id={id}
      {...handlers}
      onClick={() => {
        if (movedRef.current) return; // it was a drag, not a tap
        onClick();
      }}
      className="hover:brightness-105"
      style={{ ...style, display: "inline-block", position: "relative", zIndex: grabbing ? 50 : "auto" }}
    >
      {children}
    </button>
  );
}

// "EMBRACE THE MESS" as individual draggable letter images. Reused in the
// hero (knob), inside the Welcome window, or loose on the desktop. Letters
// drag via transform, so with an overflow-visible parent they can be pulled
// right out of a window and played with on the background.
const EMBRACE_LETTERS = [
  ["E1", "E", 123], ["M1", "M", 173], ["B1", "B", 147], ["R1", "R", 106],
  ["A1", "A", 146], ["C1", "C", 107], ["E2", "E", 132],
] as const;
const MESS_LETTERS = [
  ["M2", "M", 164], ["Em", "E", 124], ["S1", "S", 120], ["S2", "S", 114],
] as const;

function HeadlineLetters({
  initialAnimationDone,
  chaos,
  h = "h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px]",
}: {
  initialAnimationDone: boolean;
  chaos: string | null;
  h?: string;
}) {
  let idx = 0;
  const cls = (i: number) =>
    `inline-block letter-hover ${!initialAnimationDone ? `animate-letter letter-delay-${i}` : ""} ${chaos === "fall" ? `animate-fall-${(i % 7) + 1}` : ""} ${chaos === "spin" ? `animate-spin-letter${i % 3 === 1 ? "-delay-1" : i % 3 === 2 ? "-delay-2" : ""}` : ""}`;
  return (
    <>
      <div className="cutout-line mb-2 md:mb-3">
        <div className="flex items-center justify-center -space-x-px">
          {EMBRACE_LETTERS.map(([src, alt, w]) => {
            const i = ++idx;
            return (
              <DraggableLetter key={src} className={cls(i)}>
                <Image src={`/assets/letters-v2/${src}.png`} alt={alt} width={w} height={172} className={`${h} w-auto`} draggable={false} priority />
              </DraggableLetter>
            );
          })}
        </div>
      </div>
      <div className="cutout-line flex items-center justify-center">
        <DraggableLetter className={cls(++idx)}>
          <Image src="/assets/letters-v2/The.png" alt="the" width={167} height={170} className={`${h} w-auto`} draggable={false} priority />
        </DraggableLetter>
        <div className="flex items-center -space-x-px">
          {MESS_LETTERS.map(([src, alt, w]) => {
            const i = ++idx;
            return (
              <DraggableLetter key={src} className={cls(i)}>
                <Image src={`/assets/letters-v2/${src}.png`} alt={alt} width={w} height={170} className={`${h} w-auto`} draggable={false} priority />
              </DraggableLetter>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  // Story Time / El Boletín / Spill It open as centered modal panels.
  const openWindow = (id: string) => setActivePanel(id);
  const storyOpen = activePanel === "story";
  const collectionOpen = activePanel === "collection";

  const [crayonExchange, setCrayonExchange] = useState<"ask" | "return" | null>(null);
  const [crtOn, setCrtOn] = useState(false);
  const [stainsOn, setStainsOn] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [quickCherubs, setQuickCherubs] = useState(false);
  const [beansSpilled, setBeansSpilled] = useState(false);
  const [clockHands, setClockHands] = useState({ h: 0, m: 0 });

  // Auto-play Al's tour on a visitor's first visit (or when forced via ?tour=1)
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("tour") === "1";
    const seen = localStorage.getItem("as_tour_seen");
    if (forced || !seen) setShowTour(true);
  }, []);

  const finishTour = () => {
    setShowTour(false);
    setQuickCherubs(true); // bring the cherubs in fast after the tour
    localStorage.setItem("as_tour_seen", "1");
  };

  // Live analog clock for the corner control
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const m = d.getMinutes();
      const h = d.getHours() % 12;
      setClockHands({ h: h * 30 + m * 0.5, m: m * 6 });
    };
    update();
    const id = setInterval(update, 20000);
    return () => clearInterval(id);
  }, []);

  // Easter egg: tip over the © badge and the beans spill everywhere
  const spillBeans = () => {
    setBeansSpilled(true);
    setTimeout(() => setBeansSpilled(false), 4500);
  };

  const cleanUp = () => {
    setResetSignal((s) => s + 1); // snap dragged letters/buttons back
    // Erase any spray-paint lines on the canvas
    const canvas = sprayCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  const audioRef = useRef<HTMLAudioElement>(null);
  const jingleRef = useRef<HTMLAudioElement>(null);
  const soundOnRef = useRef(true);
  const bgFadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const crayonBubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [chaos, setChaos] = useState<string | null>(null);
  const [stainsKey, setStainsKey] = useState(0);
  const [postcardFlipped, setPostcardFlipped] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [boopRevealed, setBoopRevealed] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "you" | "them"; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [chatFailed, setChatFailed] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [progressPhase, setProgressPhase] = useState<"loading" | "timeout" | "phrases">("loading");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [storyName, setStoryName] = useState("");
  const [storyText, setStoryText] = useState("");
  const [storySubmitted, setStorySubmitted] = useState(false);
  const sprayCanvasRef = useRef<HTMLCanvasElement>(null);
  const selectedColorRef = useRef<string | null>(null);
  const paintingRef = useRef(false);
  const pendingTourRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    // Trigger stain re-animation on mode change
    setStainsKey(prev => prev + 1);
  }, [darkMode]);

  // Blue cherub toggles drawing mode + shows a crayon speech exchange
  // Blue cherub opens a paint palette; pick a color, then hold to paint.
  const togglePalette = () => {
    setPaletteOpen((prev) => {
      const next = !prev;
      // Asking for crayons when turning on, handing them back when turning off
      setCrayonExchange(next ? "ask" : "return");
      if (crayonBubbleTimer.current) clearTimeout(crayonBubbleTimer.current);
      crayonBubbleTimer.current = setTimeout(() => setCrayonExchange(null), 5500);
      if (!next) {
        setSelectedColor(null);
        selectedColorRef.current = null;
      }
      return next;
    });
  };

  const selectColor = (c: string) => {
    setSelectedColor(c);
    selectedColorRef.current = c;
  };

  // Smoothly ramp the background music volume from its current level to `to`.
  const fadeBg = useCallback((to: number, ms: number, after?: () => void) => {
    const bg = audioRef.current;
    if (!bg) return;
    if (bgFadeRef.current) clearInterval(bgFadeRef.current);
    const from = bg.volume;
    const steps = 24;
    let i = 0;
    bgFadeRef.current = setInterval(() => {
      i += 1;
      bg.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps)));
      if (i >= steps) {
        if (bgFadeRef.current) clearInterval(bgFadeRef.current);
        bgFadeRef.current = null;
        after?.();
      }
    }, ms / steps);
  }, []);

  // Play the Already Spilled jingle (on story / waitlist submit). Respects mute.
  // Fades the background music down under the jingle, then fades it back up.
  const playJingle = useCallback(() => {
    if (!soundOnRef.current) return;
    const j = jingleRef.current;
    const bg = audioRef.current;
    if (!j) return;
    fadeBg(0, 600);
    j.currentTime = 0;
    j.play().catch(() => {});
    j.onended = () => {
      if (!soundOnRef.current || !bg) return;
      if (bg.paused) bg.play().catch(() => {});
      fadeBg(BG_VOLUME, 900);
    };
  }, [fadeBg]);

  // Crosshair cursor once a paint color is picked
  useEffect(() => {
    document.body.style.cursor = selectedColor ? "crosshair" : "";
    return () => { document.body.style.cursor = ""; };
  }, [selectedColor]);

  // Background music — best-effort autoplay, fall back to first interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = BG_VOLUME;
    audio.play().catch(() => {
      // Autoplay blocked — start on the first user gesture
      const start = () => {
        audio.play().catch(() => {});
        window.removeEventListener("pointerdown", start);
        window.removeEventListener("keydown", start);
      };
      window.addEventListener("pointerdown", start);
      window.addEventListener("keydown", start);
    });
  }, []);

  // Sound on/off toggle (mute rather than stop so it stays in sync)
  useEffect(() => {
    soundOnRef.current = soundOn;
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !soundOn;
    if (soundOn) {
      // Cancel any in-progress fade and restore the normal level
      if (bgFadeRef.current) {
        clearInterval(bgFadeRef.current);
        bgFadeRef.current = null;
      }
      audio.volume = BG_VOLUME;
      audio.play().catch(() => {});
    }
  }, [soundOn]);

  // Mark initial animation as done after it completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialAnimationDone(true);
    }, 1800); // Last letter animation ends around 1.24s + 0.5s duration
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch("https://digitalsprint.app.n8n.cloud/webhook/already-spilled-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Still show confirmation even if webhook fails
    }
  };

  const closePanel = () => {
    setActivePanel(null);
    setPostcardFlipped(false);
    setActiveMenu(null);
  };

  // Chaotic interactions
  const triggerChaos = (type: string) => {
    setChaos(type);
    setTimeout(() => setChaos(null), 3000);
  };

  // Story auto-play: start when the story window opens, advance one at a time
  useEffect(() => {
    if (storyOpen && visibleCount === 0 && !isAutoPlaying) {
      setIsAutoPlaying(true);
      setVisibleCount(1);
    }
    if (!storyOpen) {
      // Reset when the story window closes
      setVisibleCount(0);
      setIsAutoPlaying(false);
      setChatMessages([]);
      setUserMessageCount(0);
      setChatFailed(false);
      setBoopRevealed(false);
      setChatInput("");
    }
  }, [storyOpen]);

  useEffect(() => {
    if (!isAutoPlaying || visibleCount === 0) return;
    if (visibleCount >= storyConversation.length) {
      setIsAutoPlaying(false);
      return;
    }

    const nextMsg = storyConversation[visibleCount];
    const prevMsg = storyConversation[visibleCount - 1];
    const isConsecutive = prevMsg && nextMsg.side === prevMsg.side;

    let delay: number;
    if (!nextMsg.text) {
      // Empty spacer message
      delay = 800;
    } else if (nextMsg.side === "you") {
      delay = isConsecutive ? 800 : 1200;
    } else {
      // "them" messages get typing delay
      delay = isConsecutive ? 1200 : 1800;
    }

    const timer = setTimeout(() => {
      setVisibleCount((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, visibleCount]);

  // Detect user scrolling up to break auto-scroll lock
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // If user is within 60px of the bottom, re-enable auto-scroll
      autoScrollRef.current = scrollHeight - scrollTop - clientHeight < 60;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll chat as messages appear (only if locked to bottom)
  useEffect(() => {
    if (autoScrollRef.current) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [visibleCount, chatMessages, isTyping]);

  const handleSkip = () => {
    setVisibleCount(storyConversation.length);
    setIsAutoPlaying(false);
  };

  const storyComplete = visibleCount >= storyConversation.length && !isAutoPlaying;

  const spilledReplies = [
    "that's the thing tho... perfection is BORING",
    "u ever look at a coffee ring and think 'art'? no? just us?",
    "stains aren't accidents, they're MEMORIES",
    "we literally built a whole brand around ur clumsiness. ur welcome",
    "imagine paying extra for something pristine lmaooo couldn't be us",
    "every shirt we make has a story before u even wear it",
    "fun fact: the mona lisa has cracks. she's still iconic",
    "spilling things is just redistributing vibes",
    "ur shirt got a stain? congrats it just went up in value",
    "we don't do mint condition. we do LIVED IN condition",
    "a knight in shining armor has never had his mettle tested... think about that",
    "the best vintage tees are the ones that look like they've BEEN somewhere",
    "embrace the mess or the mess embraces u. ur choice",
    "what if i told u the stain IS the design",
    "the beans have been spilled. there's no going back now",
    "every scuff tells a story. what's urs?",
    "we're not messy, we're EXPERIENCED",
    "already spilled... so now we can actually enjoy the moment",
  ];

  const handleChatSend = () => {
    const msg = chatInput.trim();
    if (!msg || isTyping || chatFailed) return;

    const newCount = userMessageCount + 1;
    setChatMessages((prev) => [...prev, { sender: "you", text: msg }]);
    setChatInput("");
    setUserMessageCount(newCount);

    if (newCount >= 3) {
      // Chat fails after 3 user messages
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatFailed(true);
      }, 1500);
      return;
    }

    setIsTyping(true);
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const reply = spilledReplies[Math.floor(Math.random() * spilledReplies.length)];
      setChatMessages((prev) => [...prev, { sender: "them", text: reply }]);
      setIsTyping(false);
    }, delay);
  };


  const progressPhrases = [
    "Connection timed out. Retrying...",
    "Still loading... probably...",
    "Have you tried turning it off and on again?",
    "The intern spilled coffee on the server",
    "Downloading more RAM...",
    "Asking the cherubs for help...",
    "404: Patience not found",
    "Untangling the ethernet cables...",
    "Blowing into the cartridge...",
    "The hamster powering the server took a break",
    "Reticulating splines...",
    "Consulting the magic 8-ball...",
    "Almost there... just kidding",
    "Loading loading screen...",
    "The beans are still being counted",
  ];

  useEffect(() => {
    if (!collectionOpen) {
      setProgressPhase("loading");
      setPhraseIndex(0);
      return;
    }

    const timeoutTimer = setTimeout(() => {
      setProgressPhase("timeout");
    }, 8000);

    const phraseTimer = setTimeout(() => {
      setProgressPhase("phrases");
    }, 10000);

    return () => {
      clearTimeout(timeoutTimer);
      clearTimeout(phraseTimer);
    };
  }, [collectionOpen]);

  useEffect(() => {
    if (progressPhase !== "phrases") return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % progressPhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [progressPhase, progressPhrases.length]);

  // Paint palette — brand colors (rgba prefixes, opacity appended when painting)
  const PAINTS = useRef([
    { name: "pink", c: "rgba(255, 107, 157," },
    { name: "blue", c: "rgba(74, 144, 217," },
    { name: "yellow", c: "rgba(245, 224, 80," },
    { name: "green", c: "rgba(124, 184, 96," },
    { name: "orange", c: "rgba(255, 140, 66," },
    { name: "purple", c: "rgba(157, 78, 221," },
    { name: "red", c: "rgba(230, 57, 70," },
    { name: "teal", c: "rgba(46, 196, 182," },
  ]);

  // Size the canvas to the window
  useEffect(() => {
    const canvas = sprayCanvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Hold-to-paint with the selected color (slowly fades so it never tints the page)
  useEffect(() => {
    const canvas = sprayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const spray = (x: number, y: number, density: number) => {
      const baseColor = selectedColorRef.current;
      if (!baseColor) return;
      const radius = 18;
      for (let i = 0; i < density; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * Math.random() * radius;
        const size = Math.random() * 2.5 + 0.5;
        const opacity = 0.15 + Math.random() * 0.25;
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, size, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor} ${opacity})`;
        ctx.fill();
      }
    };

    const isUi = (t: EventTarget | null) =>
      (t as HTMLElement | null)?.closest("button, a, input, textarea, .control-panel, .paint-palette");

    const handleDown = (e: PointerEvent) => {
      if (!selectedColorRef.current || isUi(e.target)) return;
      paintingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      spray(e.clientX, e.clientY, 14);
    };

    const handleMove = (e: PointerEvent) => {
      if (!paintingRef.current) return;
      const x = e.clientX;
      const y = e.clientY;
      const last = lastPosRef.current;
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const steps = Math.max(1, Math.floor(Math.sqrt(dx * dx + dy * dy) / 4));
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          spray(last.x + dx * t, last.y + dy * t, 8);
        }
      } else {
        spray(x, y, 10);
      }
      lastPosRef.current = { x, y };
    };

    const handleUp = () => {
      paintingRef.current = false;
      lastPosRef.current = null;
    };

    // Fade existing paint slowly by erasing it (destination-out) so no color
    // is ever painted over the page — prevents a tint building up over time.
    const fadeInterval = setInterval(() => {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.025)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }, 100);

    // Only listen for painting once a color is picked
    if (selectedColor) {
      window.addEventListener("pointerdown", handleDown);
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
    }

    return () => {
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      clearInterval(fadeInterval);
      paintingRef.current = false;
      lastPosRef.current = null;
    };
  }, [selectedColor]);

  return (
    <ResetContext.Provider value={resetSignal}>
    <main className={`${darkMode ? 'dark-bg' : 'paper-bg'} min-h-screen flex flex-col items-center justify-center p-4 pt-16 pb-24 md:p-8 relative overflow-hidden transition-colors duration-500`}>

      {/* HAND-PAINTED SPLATTER BACKGROUND (inverts in dark mode) */}
      <div className={`bg-splatter ${darkMode ? 'bg-splatter-dark' : ''}`} />

      {/* AL'S GUIDED TOUR (first visit; replay via the button) */}
      {showTour && <Tour onDone={finishTour} onJoin={playJingle} />}

      {/* ANIMATED STAINS - thrown against the wall */}
      {stainsOn && (
      <div key={stainsKey} className="fixed inset-0 pointer-events-none z-0">
        {/* Big pink splash - top right corner */}
        <div className={`stain stain-pink-lg ${darkMode ? 'stain-dark' : ''}`} style={{ top: '-2%', right: '5%' }} />

        {/* Pink drip cluster below it */}
        <div className={`stain stain-pink-sm-1 ${darkMode ? 'stain-dark' : ''}`} style={{ top: '18%', right: '12%' }} />
        <div className={`stain stain-pink-sm-2 ${darkMode ? 'stain-dark' : ''}`} style={{ top: '22%', right: '8%' }} />

        {/* Large blue puddle - bottom left */}
        <div className={`stain stain-blue-lg ${darkMode ? 'stain-dark' : ''}`} style={{ bottom: '-5%', left: '-3%' }} />

        {/* Blue splatter bits nearby */}
        <div className={`stain stain-blue-sm-1 ${darkMode ? 'stain-dark' : ''}`} style={{ bottom: '18%', left: '15%' }} />
        <div className={`stain stain-blue-sm-2 ${darkMode ? 'stain-dark' : ''}`} style={{ bottom: '25%', left: '8%' }} />

        {/* Yellow splash - top left, solo */}
        <div className={`stain stain-yellow-md ${darkMode ? 'stain-dark' : ''}`} style={{ top: '5%', left: '8%' }} />
        <div className={`stain stain-yellow-sm ${darkMode ? 'stain-dark' : ''}`} style={{ top: '18%', left: '22%' }} />

        {/* Orange drips running down right edge */}
        <div className={`stain stain-orange-1 ${darkMode ? 'stain-dark' : ''}`} style={{ top: '40%', right: '2%' }} />
        <div className={`stain stain-orange-2 ${darkMode ? 'stain-dark' : ''}`} style={{ top: '48%', right: '5%' }} />
        <div className={`stain stain-orange-3 ${darkMode ? 'stain-dark' : ''}`} style={{ top: '55%', right: '1%' }} />

        {/* Green splat - bottom right, solo */}
        <div className={`stain stain-green-md ${darkMode ? 'stain-dark' : ''}`} style={{ bottom: '8%', right: '18%' }} />

        {/* Purple splash - center left area, solo */}
        <div className={`stain stain-purple-lg ${darkMode ? 'stain-dark' : ''}`} style={{ top: '60%', left: '3%' }} />

        {/* Tiny scattered drops */}
        <div className={`stain stain-tiny-1 ${darkMode ? 'stain-dark' : ''}`} style={{ top: '35%', left: '30%' }} />
        <div className={`stain stain-tiny-2 ${darkMode ? 'stain-dark' : ''}`} style={{ top: '70%', right: '35%' }} />
        <div className={`stain stain-tiny-3 ${darkMode ? 'stain-dark' : ''}`} style={{ bottom: '30%', left: '45%' }} />
      </div>
      )}

      {/* INTERACTIVE CHERUB - Left (Blue) - Opens the paint palette */}
      <div className={`fixed left-2 md:left-8 top-1/2 -translate-y-1/2 z-40 animate-load-cherub-left ${quickCherubs ? 'cherub-quick' : ''} ${showTour ? 'hidden' : ''}`}>
        {/* cherub + palette float together so the palette looks held */}
        <div className="cherub-hold animate-float-1">
          <button
            onClick={togglePalette}
            className="cherub-btn"
            title={paletteOpen ? "Put the paints away" : "Can I have some paint?"}
          >
            <Image
              src="/assets/cherub-blue.png"
              alt="Open paint palette"
              width={100}
              height={120}
              className={`w-[64px] sm:w-[88px] md:w-[100px] lg:w-[150px] transition-all duration-300 ${paletteOpen ? 'drop-shadow-[0_0_10px_rgba(124,160,217,0.9)] scale-110' : ''}`}
            />
          </button>

          {/* Paint palette — pick a color, then hold to paint */}
          {paletteOpen && (
            <div className="paint-palette">
              <svg className="palette-shape" viewBox="0 0 200 180" aria-hidden="true">
                <defs>
                  <radialGradient id="palette-wood" cx="42%" cy="36%" r="78%">
                    <stop offset="0%" stopColor="#cd9156" />
                    <stop offset="100%" stopColor="#a4642d" />
                  </radialGradient>
                  <mask id="palette-thumb">
                    <rect width="200" height="180" fill="#fff" />
                    <ellipse cx="48" cy="130" rx="20" ry="18" fill="#000" />
                  </mask>
                </defs>
                <ellipse cx="100" cy="88" rx="94" ry="80" fill="url(#palette-wood)" stroke="#6f4419" strokeWidth="6" mask="url(#palette-thumb)" />
                <ellipse cx="48" cy="130" rx="20" ry="18" fill="none" stroke="#6f4419" strokeWidth="4" />
              </svg>
              {PAINTS.current.map((p) => (
                <button
                  key={p.name}
                  className={`paint-swatch ${selectedColor === p.c ? 'selected' : ''}`}
                  style={{ background: `${p.c} 1)` }}
                  onClick={() => selectColor(p.c)}
                  title={p.name}
                  aria-label={`${p.name} paint`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Crayon speech bubbles - stacked above the cherub */}
        {crayonExchange && (
          <div className="crayon-bubbles">
            <div className="crayon-bubble crayon-bubble-you">
              {crayonExchange === "ask"
                ? "psst… can I get the paints?"
                : "okay, paints away 🎨"}
            </div>
            <div className="crayon-bubble crayon-bubble-al">
              {crayonExchange === "ask"
                ? "pick a color. hold to paint. make a mess 🎨"
                : "…it's in your hair. anyway, nice work."}
            </div>
          </div>
        )}
      </div>

      {/* INTERACTIVE CHERUB - Right (Pink) - Makes letters fall */}
      <div className={`fixed right-2 md:right-8 top-1/2 -translate-y-1/2 z-40 animate-load-cherub-right ${quickCherubs ? 'cherub-quick' : ''} ${showTour ? 'hidden' : ''}`}>
        <button
          onClick={() => { triggerChaos('fall'); cleanUp(); pendingTourRef.current = true; }}
          className="cherub-btn animate-float-2"
          title="Shake it up & take the tour"
        >
          <Image
            src="/assets/cherub-pink.png"
            alt="Take the tour"
            width={100}
            height={120}
            className="w-[64px] sm:w-[88px] md:w-[100px] lg:w-[150px] hover:animate-shake"
          />
        </button>
      </div>

      {/* INTERACTIVE CHERUB - Top (Green) - Spins letters */}
      <div className={`fixed top-4 md:top-8 right-4 md:left-1/4 md:right-auto z-40 animate-load-cherub-top ${quickCherubs ? 'cherub-quick' : ''} ${showTour ? 'hidden' : ''}`}>
        <button
          onClick={() => { cleanUp(); triggerChaos('spin'); }}
          className="cherub-btn animate-float-3"
          title="Tidy up the mess"
        >
          <Image
            src="/assets/cherub-green.png"
            alt="Clean up"
            width={80}
            height={100}
            className="w-[68px] sm:w-[85px] md:w-[95px] lg:w-[125px] opacity-90 hover:animate-spin-slow"
          />
        </button>
      </div>

      {/* SPRAY PAINT CANVAS */}
      <canvas
        ref={sprayCanvasRef}
        className="fixed inset-0 pointer-events-none z-10"
        style={{ mixBlendMode: darkMode ? "screen" : "multiply" }}
      />

      {/* CRT OVERLAY - Fuzzy TV effect */}
      {crtOn && <div className="crt-overlay pointer-events-none"></div>}

      {/* BACKGROUND MUSIC + SUBMIT JINGLE */}
      <audio ref={audioRef} src="/assets/website-ui.mp3" loop preload="auto" />
      <audio ref={jingleRef} src="/assets/as-jingle.wav" preload="auto" />

      {/* CONTROL KNOB — tucked away, expands on click */}
      <div className={`control-panel ${controlsOpen ? 'is-open' : ''}`}>
        <button
          className="control-knob"
          onClick={() => setControlsOpen((v) => !v)}
          title={controlsOpen ? "Hide controls" : "Controls"}
          aria-label="Toggle controls"
        >
          <svg className="knob-dial" viewBox="0 0 44 44" aria-hidden="true">
            <defs>
              <radialGradient id="knobgrad" cx="38%" cy="32%" r="72%">
                <stop offset="0%" stopColor="#fffdf7" />
                <stop offset="100%" stopColor="#ece2cd" />
              </radialGradient>
            </defs>
            <circle cx="22" cy="22" r="18" fill="url(#knobgrad)" stroke="#1a1a1a" strokeWidth="2.5" />
            <g stroke="#1a1a1a" strokeLinecap="round">
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * 30) * Math.PI / 180;
                const r1 = i % 3 === 0 ? 13 : 15;
                const round = (n: number) => Number(n.toFixed(2));
                return (
                  <line
                    key={i}
                    x1={round(22 + Math.sin(a) * r1)}
                    y1={round(22 - Math.cos(a) * r1)}
                    x2={round(22 + Math.sin(a) * 16.5)}
                    y2={round(22 - Math.cos(a) * 16.5)}
                    strokeWidth={i % 3 === 0 ? 1.8 : 1}
                  />
                );
              })}
            </g>
            <line className="clock-hand" x1="22" y1="22" x2="22" y2="14" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round" transform={`rotate(${clockHands.h} 22 22)`} />
            <line className="clock-hand" x1="22" y1="22" x2="22" y2="9.5" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${clockHands.m} 22 22)`} />
            <circle cx="22" cy="22" r="1.7" fill="#1a1a1a" />
          </svg>
        </button>
        <div className="control-chips">
          <button
            className={`ctrl-btn ${soundOn ? 'ctrl-on' : 'ctrl-off'}`}
            onClick={() => setSoundOn((v) => !v)}
          >
            🐮 moosic
          </button>
          <button
            className={`ctrl-btn ${crtOn ? 'ctrl-on' : 'ctrl-off'}`}
            onClick={() => setCrtOn((v) => !v)}
          >
            🍑 fuzz
          </button>
          <button
            className={`ctrl-btn ${stainsOn ? 'ctrl-on' : 'ctrl-off'}`}
            onClick={() => setStainsOn((v) => !v)}
          >
            💦 plop
          </button>
          <button
            className={`ctrl-btn ${darkMode ? 'ctrl-on' : 'ctrl-off'}`}
            onClick={() => setDarkMode((v) => !v)}
          >
            {darkMode ? '🌚 night night' : '☀️ bom dia'}
          </button>
          <button className="ctrl-btn ctrl-cleanup" onClick={cleanUp}>
            🧹 Clean Up
          </button>
          <button className="ctrl-btn ctrl-tour" onClick={() => setShowTour(true)}>
            👋 tour
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="text-center z-20 max-w-4xl">
        {/* Logo */}
        <div className="mb-3 md:mb-6 animate-load-logo">
          <Image
            src="/assets/already-spilled-logo.png"
            alt="Already Spilled"
            width={2375}
            height={1545}
            className="mx-auto w-[150px] sm:w-[240px] md:w-[380px] select-none pointer-events-none"
            draggable={false}
            priority
          />
        </div>

        {/* BIG HEADLINE - letters are draggable */}
        <div
          id="tour-headline"
          className="mb-5 md:mb-8 select-none"
          onAnimationEnd={(e) => {
            // When the letters finish falling back into place, kick off the tour
            if (pendingTourRef.current && (e as React.AnimationEvent).animationName === "fall-letter") {
              pendingTourRef.current = false;
              setShowTour(true);
            }
          }}
        >
          <HeadlineLetters initialAnimationDone={initialAnimationDone} chaos={chaos} />
        </div>

        {/* BUTTONS - clickable and draggable */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 animate-load-buttons">
          <DraggableButton id="tour-story" onClick={() => openWindow("story")}>
            <Image src="/assets/buttons/story-time.png" alt="Story Time" width={1331} height={426} className="h-[44px] md:h-[56px] lg:h-[66px] w-auto" draggable={false} />
          </DraggableButton>
          <DraggableButton id="tour-boletin" onClick={() => openWindow("collection")}>
            <Image src="/assets/buttons/el-boletin.png" alt="El Boletín" width={1326} height={456} className="h-[44px] md:h-[56px] lg:h-[66px] w-auto" draggable={false} />
          </DraggableButton>
          <DraggableButton id="tour-spill" onClick={() => openWindow("signup")}>
            <Image src="/assets/buttons/spill-it.png" alt="Spill It" width={1334} height={617} className="h-[44px] md:h-[56px] lg:h-[66px] w-auto" draggable={false} />
          </DraggableButton>
        </div>
      </div>

      {/* EXPANDABLE PANEL — centered modal */}
      {activePanel && (() => {
        const which = activePanel;
        const onClose = closePanel;
        const onMinimize: (() => void) | undefined = undefined;
        const onMaximize: (() => void) | undefined = undefined;
        return (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={closePanel}
        >
          <div
            className="relative max-w-[95vw] sm:max-w-md md:max-w-lg w-full animate-panel-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* STORY PANEL - AIM Chat Style */}
            {which === "story" && (
              <div className="aim-window">
                <div className="aim-titlebar win-drag">
                  <span>AlreadySpilled - Instant Message</span>
                  <span className="win-btns">
                    {onMinimize && <button onClick={onMinimize} className="aim-close win-min" title="Minimize" aria-label="Minimize">–</button>}
                    {onMaximize && <button onClick={onMaximize} className="aim-close win-max-btn" title="Maximize" aria-label="Maximize">▢</button>}
                    <button onClick={onClose} className="aim-close">×</button>
                  </span>
                </div>
                <div className="aim-toolbar">
                  <div className="aim-menu-wrapper">
                    <span
                      className="aim-toolbar-btn"
                      onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
                    >
                      File
                    </span>
                    {activeMenu === 'file' && (
                      <div className="aim-dropdown">
                        <div className="aim-dropdown-item" onClick={() => setActiveMenu(null)}>New Message</div>
                        <div className="aim-dropdown-item" onClick={() => setActiveMenu(null)}>Save Chat</div>
                        <div className="aim-dropdown-divider"></div>
                        <div className="aim-dropdown-item" onClick={onClose}>Close Window</div>
                      </div>
                    )}
                  </div>
                  <div className="aim-menu-wrapper">
                    <span
                      className="aim-toolbar-btn"
                      onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
                    >
                      Edit
                    </span>
                    {activeMenu === 'edit' && (
                      <div className="aim-dropdown">
                        <div className="aim-dropdown-item aim-dropdown-disabled">Cut</div>
                        <div className="aim-dropdown-item aim-dropdown-disabled">Copy</div>
                        <div className="aim-dropdown-item aim-dropdown-disabled">Paste</div>
                        <div className="aim-dropdown-divider"></div>
                        <div className="aim-dropdown-item" onClick={() => setActiveMenu(null)}>Select All</div>
                      </div>
                    )}
                  </div>
                  <div className="aim-menu-wrapper">
                    <span
                      className="aim-toolbar-btn"
                      onClick={() => setActiveMenu(activeMenu === 'insert' ? null : 'insert')}
                    >
                      Insert
                    </span>
                    {activeMenu === 'insert' && (
                      <div className="aim-dropdown">
                        <div className="aim-dropdown-item" onClick={() => { if (storyComplete && !chatFailed && !boopRevealed) setChatInput(prev => prev + '😎'); setActiveMenu(null); }}>😎 Smiley</div>
                        <div className="aim-dropdown-item" onClick={() => { if (storyComplete && !chatFailed && !boopRevealed) setChatInput(prev => prev + '☕'); setActiveMenu(null); }}>☕ Coffee Stain</div>
                        <div className="aim-dropdown-item" onClick={() => { if (storyComplete && !chatFailed && !boopRevealed) setChatInput(prev => prev + '🫘'); setActiveMenu(null); }}>🫘 Spilled Beans</div>
                        <div className="aim-dropdown-item" onClick={() => { if (storyComplete && !chatFailed && !boopRevealed) setChatInput(prev => prev + '👼'); setActiveMenu(null); }}>👼 Cherub</div>
                      </div>
                    )}
                  </div>
                  <div className="aim-menu-wrapper">
                    <span
                      className="aim-toolbar-btn"
                      onClick={() => setActiveMenu(activeMenu === 'people' ? null : 'people')}
                    >
                      People
                    </span>
                    {activeMenu === 'people' && (
                      <div className="aim-dropdown">
                        <div className="aim-dropdown-item" onClick={() => setActiveMenu(null)}>Follow us on AIM</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="aim-chat" ref={chatContainerRef}>
                  {storyConversation.slice(0, visibleCount).map((msg, i) => (
                    msg.text ? (
                      <div key={`story-${i}`} className={`aim-message ${msg.side === "you" ? "aim-you" : "aim-them"}`}>
                        <span className="aim-screenname">{msg.name}:</span>
                        <span className="aim-text">{msg.text}</span>
                      </div>
                    ) : (
                      <div key={`story-${i}`} className="aim-spacer" />
                    )
                  ))}
                  {isAutoPlaying && visibleCount < storyConversation.length && storyConversation[visibleCount]?.side === "them" && storyConversation[visibleCount]?.text && (
                    <div className="aim-message aim-them">
                      <span className="aim-screenname">{storyConversation[visibleCount].name}:</span>
                      <span className="aim-text aim-typing">is typing...</span>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={`chat-${i}`} className={`aim-message ${msg.sender === "you" ? "aim-you" : "aim-them"}`}>
                      <span className="aim-screenname">{msg.sender === "you" ? "You:" : "Al:"}</span>
                      <span className="aim-text">{msg.text}</span>
                    </div>
                  ))}
                  {isTyping && !chatFailed && (
                    <div className="aim-message aim-them">
                      <span className="aim-screenname">Al:</span>
                      <span className="aim-text aim-typing">is typing...</span>
                    </div>
                  )}
                  {chatFailed && !boopRevealed && (
                    <div className="aim-error-block">
                      <span className="aim-thinking">Al is thinking...</span>
                      <button className="aim-retry-btn" onClick={() => setBoopRevealed(true)}>Try Again</button>
                    </div>
                  )}
                  {boopRevealed && (
                    <>
                      <div className="aim-boop-video">
                        <video
                          src="/assets/boop.mp4"
                          autoPlay
                          playsInline
                          muted
                          className="aim-video"
                        />
                      </div>
                      <div className="aim-message aim-them aim-away">
                        <span className="aim-screenname">Al, Court Jester of Spillville:</span>
                        <span className="aim-text">has signed off</span>
                      </div>
                    </>
                  )}
                  <div ref={chatEndRef} />
                </div>
                {isAutoPlaying && (
                  <div className="aim-input-area">
                    <button className="aim-skip-btn" onClick={handleSkip}>Skip &raquo;</button>
                  </div>
                )}
                {storyComplete && !chatFailed && !boopRevealed && (
                  <div className="aim-input-area">
                    <input
                      type="text"
                      className="aim-input"
                      placeholder="Type a message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleChatSend(); }}
                    />
                    <button className="aim-send" onClick={handleChatSend}>Send</button>
                  </div>
                )}
                <div className="aim-status">
                  <span>{boopRevealed ? "Al, Court Jester of Spillville has signed off" : "AlreadySpilled is online"}</span>
                  <span className="aim-timestamp">Est. 2025</span>
                </div>
              </div>
            )}

            {/* COLLECTION PANEL - Under Construction */}
            {which === "collection" && (
              <div className="construction-popup">
                <div className="construction-titlebar win-drag">
                  <span>🚧 http://www.alreadyspilled.com/collection 🚧</span>
                  <span className="win-btns">
                    {onMinimize && <button onClick={onMinimize} className="construction-close win-min" title="Minimize" aria-label="Minimize">–</button>}
                    {onMaximize && <button onClick={onMaximize} className="construction-close win-max-btn" title="Maximize" aria-label="Maximize">▢</button>}
                    <button onClick={onClose} className="construction-close">×</button>
                  </span>
                </div>
                <div className="construction-content">
                  <div className="construction-tape construction-tape-top">
                    ⚠ CAUTION ⚠ CAUTION ⚠ CAUTION ⚠ CAUTION ⚠ CAUTION ⚠
                  </div>

                  <div className="construction-heading">
                    <span className="construction-blink">🚧</span>
                    {" "}UNDER CONSTRUCTION{" "}
                    <span className="construction-blink">🚧</span>
                  </div>

                  <div className="construction-crane-wrapper">
                    <Image
                      src="/assets/crane.png"
                      alt="Under construction crane"
                      width={200}
                      height={200}
                      className="construction-crane"
                    />
                  </div>

                  <div className="construction-hardhat">
                    👷 PARDON OUR DUST 👷
                  </div>

                  <div className="construction-info">
                    <p>The collection is being assembled...</p>
                    <p className="construction-waitlist-label">
                      Enter your email to get added to the waitlist.
                    </p>
                  </div>

                  {!waitlistSubmitted ? (
                    <form
                      className="construction-form"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!waitlistEmail.trim()) return;
                        setWaitlistSubmitted(true);
                        playJingle();
                        try {
                          await fetch("https://digitalsprint.app.n8n.cloud/webhook/already-spilled-waitlist", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: waitlistEmail }),
                          });
                        } catch {
                          // Still show confirmation even if webhook fails
                        }
                      }}
                    >
                      <input
                        type="email"
                        className="construction-email"
                        placeholder="coolperson@aol.com"
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        required
                      />
                      <button type="submit" className="construction-submit">
                        📧 NOTIFY ME
                      </button>
                    </form>
                  ) : (
                    <div className="construction-confirmed">
                      ✅ You&apos;re in! We&apos;ll let you know when the dust settles.
                    </div>
                  )}

                  <div className="construction-progress">
                    {progressPhase === "loading" && (
                      <>
                        <div className="construction-progress-label">Loading collection...</div>
                        <div className="construction-progress-bar">
                          <div className="construction-progress-fill construction-progress-slow"></div>
                        </div>
                      </>
                    )}
                    {progressPhase === "timeout" && (
                      <div className="construction-timeout">
                        ❌ ERROR: Connection timed out (0x80004005)
                      </div>
                    )}
                    {progressPhase === "phrases" && (
                      <div className="construction-phrase">
                        {progressPhrases[phraseIndex]}
                      </div>
                    )}
                  </div>

                  <div className="construction-tape construction-tape-bottom">
                    ⚠ CAUTION ⚠ CAUTION ⚠ CAUTION ⚠ CAUTION ⚠ CAUTION ⚠
                  </div>

                  <p className="construction-fine-print">
                    This page last updated by webmaster on 01/01/2026.
                    Best viewed in 800x600.
                  </p>
                </div>
              </div>
            )}

            {/* SIGNUP PANEL - Spill Your Story */}
            {which === "signup" && (
              <div className="web95">
                <div className="web95-titlebar win-drag">
                  <span>☕ Already Spilled - Guestbook</span>
                  <span className="win-btns">
                    {onMinimize && <button onClick={onMinimize} className="web95-close win-min" title="Minimize" aria-label="Minimize">–</button>}
                    {onMaximize && <button onClick={onMaximize} className="web95-close win-max-btn" title="Maximize" aria-label="Maximize">▢</button>}
                    <button onClick={onClose} className="web95-close">×</button>
                  </span>
                </div>

                <div className="web95-content">
                  {!storySubmitted ? (
                    <div className="web95-inner">
                      <div className="web95-marquee">
                        ☕ SPILL YOUR STORY!!! ☕
                      </div>

                      <div className="web95-rainbow"></div>

                      <p className="web95-comic text-center text-sm mb-4">
                        Tell us about your <b>BEST</b> spill, stain, or mess.
                        The more chaotic the better!!!
                      </p>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!storyText.trim()) return;
                          setStorySubmitted(true);
                          playJingle();
                          try {
                            await fetch("https://digitalsprint.app.n8n.cloud/webhook/already-spilled-stories", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ name: storyName || "Anonymous Spiller", story: storyText }),
                            });
                          } catch {
                            // Still show confirmation even if webhook fails
                          }
                        }}
                        className="space-y-3"
                      >
                        <div>
                          <label className="block text-xs mb-1">Your Name (or alias):</label>
                          <input
                            type="text"
                            value={storyName}
                            onChange={(e) => setStoryName(e.target.value)}
                            placeholder="ClumsyKing99"
                            className="web95-input"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1">Your Spill Story:</label>
                          <textarea
                            value={storyText}
                            onChange={(e) => setStoryText(e.target.value)}
                            placeholder="One time I knocked over an entire pot of coffee onto my white shirt right before a job interview..."
                            required
                            rows={4}
                            className="web95-input web95-textarea"
                          />
                        </div>
                        <div className="text-center">
                          <button type="submit" className="web95-btn">
                            ☕ SPILL IT ☕
                          </button>
                        </div>
                      </form>

                      <div className="web95-rainbow"></div>

                      <div className="text-center mt-4">
                        <span className="web95-counter">Stories spilled: 000,847</span>
                      </div>

                      <div className="text-center mt-3">
                        <span className="web95-badge">🏆 Best viewed in Netscape Navigator 🏆</span>
                      </div>
                    </div>
                  ) : (
                    <div className="web95-inner text-center">
                      <div className="web95-marquee">
                        🎉 THE BEANS HAVE BEEN SPILLED!!! 🎉
                      </div>

                      <div className="web95-rainbow"></div>

                      <p className="text-4xl my-4">☕</p>

                      <p className="web95-comic text-lg mb-2">
                        <b>Thanks for spilling!</b>
                      </p>

                      <p className="text-sm text-gray-600 mb-4">
                        Your story has been added to the mess.
                      </p>

                      <div className="web95-bevel">
                        <p className="text-xs">
                          &quot;{storyText.length > 80 ? storyText.slice(0, 80) + "..." : storyText}&quot;<br/>
                          — {storyName || "Anonymous Spiller"}
                        </p>
                      </div>

                      <div className="web95-rainbow"></div>

                      <p className="text-xs mt-3">
                        <span className="web95-link" onClick={() => { setStorySubmitted(false); setStoryText(""); setStoryName(""); }}>
                          Spill another one?
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
        );
      })()}

      {/* FOOTER - secret: tip the badge over to spill the beans */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 animate-load-footer">
        <button
          onClick={spillBeans}
          className={`footer-badge ${beansSpilled ? 'footer-badge-tip' : ''}`}
          title="don't"
        >
          <Image src="/assets/2026.png" alt="© 2026 Already Spilled" width={520} height={88} className="h-[28px] md:h-[38px] w-auto" draggable={false} />
        </button>
      </div>

      {/* EASTER EGG: spilled beans raining down */}
      {beansSpilled && (
        <div className="bean-rain" aria-hidden="true">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="bean"
              style={{
                left: `${(i * 2.5 + (i % 5) * 3) % 100}%`,
                animationDelay: `${(i % 10) * 0.18}s`,
                animationDuration: `${2.2 + (i % 6) * 0.4}s`,
                fontSize: `${18 + (i % 4) * 8}px`,
              }}
            >
              🫘
            </span>
          ))}
        </div>
      )}
    </main>
    </ResetContext.Provider>
  );
}
