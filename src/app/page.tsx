"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

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
function DraggableButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const { handlers, style, grabbing, movedRef } = useDraggable();
  return (
    <button
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

export default function Home() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [crayonExchange, setCrayonExchange] = useState<"ask" | "return" | null>(null);
  const [crtOn, setCrtOn] = useState(false);
  const [stainsOn, setStainsOn] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
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
  const sprayColorRef = useRef({ h: 0, color: "" });
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    // Trigger stain re-animation on mode change
    setStainsKey(prev => prev + 1);
  }, [darkMode]);

  // Blue cherub toggles drawing mode + shows a crayon speech exchange
  const toggleDrawing = () => {
    setDrawingMode((prev) => {
      const next = !prev;
      // Asking for crayons when turning on, handing them back when turning off
      setCrayonExchange(next ? "ask" : "return");
      if (crayonBubbleTimer.current) clearTimeout(crayonBubbleTimer.current);
      crayonBubbleTimer.current = setTimeout(() => setCrayonExchange(null), 5500);
      return next;
    });
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

  // Show a crayon cursor while drawing is active
  useEffect(() => {
    document.body.style.cursor = drawingMode ? "crosshair" : "";
    return () => { document.body.style.cursor = ""; };
  }, [drawingMode]);

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

  // Story auto-play: start when panel opens, advance one message at a time
  useEffect(() => {
    if (activePanel === "story" && visibleCount === 0 && !isAutoPlaying) {
      setIsAutoPlaying(true);
      setVisibleCount(1);
    }
    if (activePanel !== "story") {
      // Reset when panel closes
      setVisibleCount(0);
      setIsAutoPlaying(false);
      setChatMessages([]);
      setUserMessageCount(0);
      setChatFailed(false);
      setBoopRevealed(false);
      setChatInput("");
    }
  }, [activePanel]);

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
    if (activePanel !== "collection") {
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
  }, [activePanel]);

  useEffect(() => {
    if (progressPhase !== "phrases") return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % progressPhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [progressPhase, progressPhrases.length]);

  // Spray paint colors from brand palette
  const sprayColors = useRef([
    "rgba(255, 107, 157,",  // pink
    "rgba(74, 144, 217,",   // blue
    "rgba(245, 224, 80,",   // yellow
    "rgba(124, 184, 96,",   // green
    "rgba(255, 140, 66,",   // orange
    "rgba(157, 78, 221,",   // purple
    "rgba(230, 57, 70,",    // red
    "rgba(46, 196, 182,",   // teal
  ]);

  const pickNewColor = useCallback(() => {
    const colors = sprayColors.current;
    let idx = Math.floor(Math.random() * colors.length);
    if (sprayColorRef.current.h === idx) idx = (idx + 1) % colors.length;
    sprayColorRef.current = { h: idx, color: colors[idx] };
  }, []);

  // Initialize spray paint canvas
  useEffect(() => {
    const canvas = sprayCanvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    pickNewColor();

    const colorInterval = setInterval(pickNewColor, 3000 + Math.random() * 2000);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(colorInterval);
    };
  }, [pickNewColor]);

  // Spray paint draw handler
  useEffect(() => {
    const canvas = sprayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const spray = (x: number, y: number, density: number) => {
      const baseColor = sprayColorRef.current.color;
      const radius = 18;

      for (let i = 0; i < density; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * Math.random() * radius;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const size = Math.random() * 2.5 + 0.5;
        const opacity = 0.15 + Math.random() * 0.25;

        ctx.beginPath();
        ctx.arc(x + dx, y + dy, size, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor} ${opacity})`;
        ctx.fill();
      }
    };

    const handleMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const last = lastPosRef.current;

      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.max(1, Math.floor(dist / 4));

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const ix = last.x + dx * t;
          const iy = last.y + dy * t;
          spray(ix, iy, 8);
        }
      } else {
        spray(x, y, 12);
      }

      lastPosRef.current = { x, y };
    };

    const handleLeave = () => {
      lastPosRef.current = null;
    };

    // Big splat on click
    const handleClick = (e: MouseEvent) => {
      // Don't splat when clicking buttons, links, inputs, or the control panel
      if ((e.target as HTMLElement).closest("button, a, input, textarea, .control-panel")) return;
      const x = e.clientX;
      const y = e.clientY;
      const baseColor = sprayColorRef.current.color;

      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * Math.random() * 35;
        const size = Math.random() * 4 + 1;
        const opacity = 0.2 + Math.random() * 0.35;
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, size, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor} ${opacity})`;
        ctx.fill();
      }

      const dropletCount = 12 + Math.floor(Math.random() * 10);
      for (let i = 0; i < dropletCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const flingDist = 30 + Math.random() * 60;
        const dx = Math.cos(angle) * flingDist;
        const dy = Math.sin(angle) * flingDist;
        const size = Math.random() * 3 + 0.8;
        const opacity = 0.25 + Math.random() * 0.3;

        const trailSteps = 3 + Math.floor(Math.random() * 3);
        for (let s = 0; s <= trailSteps; s++) {
          const t = s / trailSteps;
          const trailSize = size * (0.3 + t * 0.7);
          const trailOpacity = opacity * (0.2 + t * 0.8);
          ctx.beginPath();
          ctx.arc(x + dx * t, y + dy * t, trailSize, 0, Math.PI * 2);
          ctx.fillStyle = `${baseColor} ${trailOpacity})`;
          ctx.fill();
        }
      }

      pickNewColor();
    };

    // Fade existing paint slowly by erasing it (destination-out) so no color
    // is ever painted over the page — prevents a tint building up over time.
    const fadeInterval = setInterval(() => {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }, 100);

    // Only draw while drawing mode is active
    if (drawingMode) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseleave", handleLeave);
      window.addEventListener("click", handleClick);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("click", handleClick);
      clearInterval(fadeInterval);
      lastPosRef.current = null;
    };
  }, [drawingMode, pickNewColor]);

  return (
    <ResetContext.Provider value={resetSignal}>
    <main className={`${darkMode ? 'dark-bg' : 'paper-bg'} min-h-screen flex flex-col items-center justify-center p-4 pt-16 pb-24 md:p-8 relative overflow-hidden transition-colors duration-500`}>

      {/* HAND-PAINTED SPLATTER BACKGROUND (inverts in dark mode) */}
      <div className={`bg-splatter ${darkMode ? 'bg-splatter-dark' : ''}`} />

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

      {/* INTERACTIVE CHERUB - Left (Blue) - Toggles Drawing Mode */}
      <div className="fixed left-2 md:left-8 top-1/2 -translate-y-1/2 z-40 animate-load-cherub-left">
        <button
          onClick={toggleDrawing}
          className="cherub-btn animate-float-1"
          title={drawingMode ? "Put the crayons away" : "Can I have some crayons?"}
        >
          <Image
            src="/assets/cherub-blue.png"
            alt="Toggle drawing mode"
            width={100}
            height={120}
            className={`w-[64px] sm:w-[100px] md:w-[150px] transition-all duration-300 ${drawingMode ? 'drop-shadow-[0_0_10px_rgba(124,160,217,0.9)] scale-110' : ''}`}
          />
        </button>

        {/* Crayon speech bubbles - stacked above the cherub */}
        {crayonExchange && (
          <div className="crayon-bubbles">
            <div className="crayon-bubble crayon-bubble-you">
              {crayonExchange === "ask"
                ? "psst… can I have some crayons?"
                : "here, crayons back 🖍️"}
            </div>
            <div className="crayon-bubble crayon-bubble-al">
              {crayonExchange === "ask"
                ? "knock yourself out. the messier the better 🖍️"
                : "…why are they soggy. did you chew on these?"}
            </div>
          </div>
        )}
      </div>

      {/* INTERACTIVE CHERUB - Right (Pink) - Makes letters fall */}
      <div className="fixed right-2 md:right-8 top-1/2 -translate-y-1/2 z-40 animate-load-cherub-right">
        <button
          onClick={() => { triggerChaos('fall'); cleanUp(); }}
          className="cherub-btn animate-float-2"
          title="Shake it back into place"
        >
          <Image
            src="/assets/cherub-pink.png"
            alt="Shake things up"
            width={100}
            height={120}
            className="w-[64px] sm:w-[100px] md:w-[150px] hover:animate-shake"
          />
        </button>
      </div>

      {/* INTERACTIVE CHERUB - Top (Green) - Spins letters */}
      <div className="fixed top-4 md:top-8 right-4 md:left-1/4 md:right-auto z-40 animate-load-cherub-top">
        <button
          onClick={() => triggerChaos('spin')}
          className="cherub-btn animate-float-3"
          title="Spin it"
        >
          <Image
            src="/assets/cherub-green.png"
            alt="Spin letters"
            width={80}
            height={100}
            className="w-[68px] sm:w-[95px] md:w-[125px] opacity-90 hover:animate-spin-slow"
          />
        </button>
      </div>

      {/* SPRAY PAINT CANVAS */}
      <canvas
        ref={sprayCanvasRef}
        className="fixed inset-0 pointer-events-none z-10"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* CRT OVERLAY - Fuzzy TV effect */}
      {crtOn && <div className="crt-overlay pointer-events-none"></div>}

      {/* BACKGROUND MUSIC + SUBMIT JINGLE */}
      <audio ref={audioRef} src="/assets/website-ui.mp3" loop preload="auto" />
      <audio ref={jingleRef} src="/assets/as-jingle.wav" preload="auto" />

      {/* CONTROL PANEL - toggles for demo */}
      <div className="control-panel">
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
      </div>

      {/* MAIN CONTENT */}
      <div className="text-center z-20 max-w-4xl">
        {/* Logo */}
        <div className="mb-3 md:mb-6 animate-load-logo">
          <Image
            src="/assets/already spilled main.png"
            alt="Already Spilled"
            width={200}
            height={100}
            className="mx-auto w-[150px] sm:w-[240px] md:w-[380px]"
            priority
          />
        </div>

        {/* BIG HEADLINE - letters are draggable */}
        <div className="mb-5 md:mb-8 select-none">
          <div className="cutout-line mb-2 md:mb-3">
            <div className="flex items-center -space-x-px">
              <DraggableLetter className={`inline-block letter-hover ${!initialAnimationDone ? 'animate-letter letter-delay-1' : ''} ${chaos === 'fall' ? 'animate-fall-1' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>
                <Image src="/assets/letters-v2/E1.png" alt="E" width={123} height={172} className="h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px] w-auto" draggable={false} priority />
              </DraggableLetter>
              <DraggableLetter className={`inline-block letter-hover ${!initialAnimationDone ? 'animate-letter letter-delay-2' : ''} ${chaos === 'fall' ? 'animate-fall-2' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-1' : ''}`}>
                <Image src="/assets/letters-v2/M1.png" alt="M" width={173} height={172} className="h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px] w-auto" draggable={false} priority />
              </DraggableLetter>
              <DraggableLetter className={`inline-block letter-hover ${!initialAnimationDone ? 'animate-letter letter-delay-3' : ''} ${chaos === 'fall' ? 'animate-fall-3' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-2' : ''}`}>
                <Image src="/assets/letters-v2/B1.png" alt="B" width={147} height={172} className="h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px] w-auto" draggable={false} priority />
              </DraggableLetter>
              <DraggableLetter className={`inline-block letter-hover ${!initialAnimationDone ? 'animate-letter letter-delay-4' : ''} ${chaos === 'fall' ? 'animate-fall-4' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>
                <Image src="/assets/letters-v2/R1.png" alt="R" width={106} height={172} className="h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px] w-auto" draggable={false} priority />
              </DraggableLetter>
              <DraggableLetter className={`inline-block letter-hover ${!initialAnimationDone ? 'animate-letter letter-delay-5' : ''} ${chaos === 'fall' ? 'animate-fall-5' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-1' : ''}`}>
                <Image src="/assets/letters-v2/A1.png" alt="A" width={146} height={172} className="h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px] w-auto" draggable={false} priority />
              </DraggableLetter>
              <DraggableLetter className={`inline-block letter-hover ${!initialAnimationDone ? 'animate-letter letter-delay-6' : ''} ${chaos === 'fall' ? 'animate-fall-6' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-2' : ''}`}>
                <Image src="/assets/letters-v2/C1.png" alt="C" width={107} height={172} className="h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px] w-auto" draggable={false} priority />
              </DraggableLetter>
              <DraggableLetter className={`inline-block letter-hover ${!initialAnimationDone ? 'animate-letter letter-delay-7' : ''} ${chaos === 'fall' ? 'animate-fall-7' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>
                <Image src="/assets/letters-v2/E2.png" alt="E" width={132} height={172} className="h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px] w-auto" draggable={false} priority />
              </DraggableLetter>
            </div>
          </div>
          <div className="cutout-line">
            <DraggableLetter className={`inline-block letter-hover ${!initialAnimationDone ? 'animate-letter letter-delay-8' : ''} ${chaos === 'fall' ? 'animate-fall-3' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-1' : ''}`}>
              <Image src="/assets/letters-v2/The.png" alt="the" width={167} height={170} className="h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px] w-auto" draggable={false} priority />
            </DraggableLetter>
            <div className="flex items-center -space-x-px">
              <DraggableLetter className={`inline-block letter-hover ${!initialAnimationDone ? 'animate-letter letter-delay-9' : ''} ${chaos === 'fall' ? 'animate-fall-1' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>
                <Image src="/assets/letters-v2/M2.png" alt="M" width={164} height={170} className="h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px] w-auto" draggable={false} priority />
              </DraggableLetter>
              <DraggableLetter className={`inline-block letter-hover ${!initialAnimationDone ? 'animate-letter letter-delay-10' : ''} ${chaos === 'fall' ? 'animate-fall-5' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-2' : ''}`}>
                <Image src="/assets/letters-v2/Em.png" alt="E" width={124} height={170} className="h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px] w-auto" draggable={false} priority />
              </DraggableLetter>
              <DraggableLetter className={`inline-block letter-hover ${!initialAnimationDone ? 'animate-letter letter-delay-11' : ''} ${chaos === 'fall' ? 'animate-fall-2' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-1' : ''}`}>
                <Image src="/assets/letters-v2/S1.png" alt="S" width={120} height={170} className="h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px] w-auto" draggable={false} priority />
              </DraggableLetter>
              <DraggableLetter className={`inline-block letter-hover ${!initialAnimationDone ? 'animate-letter letter-delay-12' : ''} ${chaos === 'fall' ? 'animate-fall-6' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>
                <Image src="/assets/letters-v2/S2.png" alt="S" width={114} height={170} className="h-[44px] sm:h-[70px] md:h-[104px] lg:h-[122px] w-auto" draggable={false} priority />
              </DraggableLetter>
            </div>
          </div>
        </div>

        {/* BUTTONS - clickable and draggable */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 animate-load-buttons">
          <DraggableButton onClick={() => setActivePanel("story")}>
            <Image src="/assets/buttons/story-time.png" alt="Story Time" width={1331} height={426} className="h-[44px] md:h-[56px] lg:h-[66px] w-auto" draggable={false} />
          </DraggableButton>
          <DraggableButton onClick={() => setActivePanel("collection")}>
            <Image src="/assets/buttons/el-boletin.png" alt="El Boletín" width={1326} height={456} className="h-[44px] md:h-[56px] lg:h-[66px] w-auto" draggable={false} />
          </DraggableButton>
          <DraggableButton onClick={() => setActivePanel("signup")}>
            <Image src="/assets/buttons/spill-it.png" alt="Spill It" width={1334} height={617} className="h-[44px] md:h-[56px] lg:h-[66px] w-auto" draggable={false} />
          </DraggableButton>
        </div>
      </div>

      {/* EXPANDABLE PANELS */}
      {activePanel && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={closePanel}
        >
          <div
            className="relative max-w-[95vw] sm:max-w-md md:max-w-lg w-full animate-panel-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* STORY PANEL - AIM Chat Style */}
            {activePanel === "story" && (
              <div className="aim-window">
                <div className="aim-titlebar">
                  <span>AlreadySpilled - Instant Message</span>
                  <button onClick={closePanel} className="aim-close">×</button>
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
                        <div className="aim-dropdown-item" onClick={closePanel}>Close Window</div>
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
            {activePanel === "collection" && (
              <div className="construction-popup">
                <div className="construction-titlebar">
                  <span>🚧 http://www.alreadyspilled.com/collection 🚧</span>
                  <button onClick={closePanel} className="construction-close">×</button>
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
            {activePanel === "signup" && (
              <div className="web95">
                <div className="web95-titlebar">
                  <span>☕ Already Spilled - Guestbook</span>
                  <button onClick={closePanel} className="web95-close">×</button>
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
      )}

      {/* FOOTER */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 animate-load-footer">
        <Image src="/assets/2026.png" alt="© 2026 Already Spilled" width={520} height={88} className="h-[28px] md:h-[38px] w-auto" draggable={false} />
      </div>
    </main>
    </ResetContext.Provider>
  );
}
