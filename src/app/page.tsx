"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

export default function Home() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [chaos, setChaos] = useState<string | null>(null);
  const [stainsKey, setStainsKey] = useState(0);
  const [postcardFlipped, setPostcardFlipped] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "you" | "them" | "them-away"; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
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
    "11 shirts. 11 stories. infinite stains. stay tuned",
    "what if i told u the stain IS the design",
    "collecting things in perfect condition is just hoarding with anxiety",
    "the beans have been spilled. there's no going back now",
    "every scuff tells a story. what's urs?",
    "we're not messy, we're EXPERIENCED",
    "pristine is just code for 'never actually used'",
    "ur grandma's favorite recipe has stains on it for a reason",
    "if it's not a little bit wrecked, did u even live?",
    "we're basically a support group for people who ruin nice things",
    "already spilled... so now we can actually enjoy the moment",
  ];

  const handleChatSend = () => {
    const msg = chatInput.trim();
    if (!msg || isTyping) return;

    setChatMessages((prev) => [...prev, { sender: "you", text: msg }]);
    setChatInput("");
    setIsTyping(true);

    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const reply = spilledReplies[Math.floor(Math.random() * spilledReplies.length)];
      setChatMessages((prev) => [...prev, { sender: "them", text: reply }]);
      setIsTyping(false);
    }, delay);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

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

    // Fade existing paint slowly
    const fadeInterval = setInterval(() => {
      ctx.fillStyle = darkMode
        ? "rgba(26, 26, 26, 0.012)"
        : "rgba(245, 240, 232, 0.012)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, 100);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("click", handleClick);
      clearInterval(fadeInterval);
    };
  }, [darkMode]);

  return (
    <main className={`${darkMode ? 'dark-bg' : 'paper-bg'} min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden transition-colors duration-500`}>

      {/* ANIMATED STAINS - thrown against the wall */}
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

      {/* INTERACTIVE CHERUB - Left (Blue) - Toggles Dark Mode */}
      <div className="fixed left-2 md:left-8 top-1/2 -translate-y-1/2 z-10 animate-load-cherub-left">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="cherub-btn animate-float-1"
          title="Toggle lights"
        >
          <Image
            src="/assets/cherub-blue.png"
            alt="Toggle dark mode"
            width={100}
            height={120}
            className={`w-[70px] sm:w-[90px] md:w-[120px] transition-all duration-300 ${darkMode ? 'brightness-50' : 'brightness-100'}`}
          />
        </button>
      </div>

      {/* INTERACTIVE CHERUB - Right (Pink) - Makes letters fall */}
      <div className="fixed right-2 md:right-8 top-1/2 -translate-y-1/2 z-10 animate-load-cherub-right">
        <button
          onClick={() => triggerChaos('fall')}
          className="cherub-btn animate-float-2"
          title="Cause chaos"
        >
          <Image
            src="/assets/cherub-pink.png"
            alt="Shake things up"
            width={100}
            height={120}
            className="w-[70px] sm:w-[90px] md:w-[120px] hover:animate-shake"
          />
        </button>
      </div>

      {/* INTERACTIVE CHERUB - Top (Green) - Spins letters */}
      <div className="fixed top-4 md:top-8 right-4 md:left-1/4 md:right-auto z-10 animate-load-cherub-top">
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
            className="w-[50px] sm:w-[65px] md:w-[80px] opacity-90 hover:animate-spin-slow"
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
      <div className="crt-overlay pointer-events-none"></div>

      {/* MAIN CONTENT */}
      <div className="text-center z-20 max-w-4xl">
        {/* Logo */}
        <div className="mb-6 animate-load-logo">
          <Image
            src="/assets/already spilled main.png"
            alt="Already Spilled"
            width={200}
            height={100}
            className="mx-auto w-[160px] sm:w-[180px] md:w-[200px]"
            priority
          />
        </div>

        {/* BIG HEADLINE */}
        <div className="mb-8">
          <div className="cutout-line mb-2 md:mb-3">
            <span className={`cutout cut-4 text-4xl md:text-6xl lg:text-7xl ${!initialAnimationDone ? 'animate-letter letter-delay-1' : ''} ${chaos === 'fall' ? 'animate-fall-1' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>E</span>
            <span className={`cutout cut-2 text-4xl md:text-6xl lg:text-7xl ${!initialAnimationDone ? 'animate-letter letter-delay-2' : ''} ${chaos === 'fall' ? 'animate-fall-2' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-1' : ''}`}>M</span>
            <span className={`cutout cut-9 text-4xl md:text-6xl lg:text-7xl ${!initialAnimationDone ? 'animate-letter letter-delay-3' : ''} ${chaos === 'fall' ? 'animate-fall-3' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-2' : ''}`}>B</span>
            <span className={`cutout cut-3 text-4xl md:text-6xl lg:text-7xl ${!initialAnimationDone ? 'animate-letter letter-delay-4' : ''} ${chaos === 'fall' ? 'animate-fall-4' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>R</span>
            <span className={`cutout cut-1 text-4xl md:text-6xl lg:text-7xl ${!initialAnimationDone ? 'animate-letter letter-delay-5' : ''} ${chaos === 'fall' ? 'animate-fall-5' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-1' : ''}`}>A</span>
            <span className={`cutout cut-5 text-4xl md:text-6xl lg:text-7xl ${!initialAnimationDone ? 'animate-letter letter-delay-6' : ''} ${chaos === 'fall' ? 'animate-fall-6' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-2' : ''}`}>C</span>
            <span className={`cutout cut-7 text-4xl md:text-6xl lg:text-7xl ${!initialAnimationDone ? 'animate-letter letter-delay-7' : ''} ${chaos === 'fall' ? 'animate-fall-7' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>E</span>
          </div>
          <div className="cutout-line">
            <span className={`cutout cut-6 text-3xl md:text-5xl lg:text-6xl ${!initialAnimationDone ? 'animate-letter letter-delay-8' : ''} ${chaos === 'fall' ? 'animate-fall-3' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-1' : ''}`}>the</span>
            <span className={`cutout cut-9 text-5xl md:text-7xl lg:text-8xl ${!initialAnimationDone ? 'animate-letter letter-delay-9' : ''} ${chaos === 'fall' ? 'animate-fall-1' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>M</span>
            <span className={`cutout cut-2 text-5xl md:text-7xl lg:text-8xl ${!initialAnimationDone ? 'animate-letter letter-delay-10' : ''} ${chaos === 'fall' ? 'animate-fall-5' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-2' : ''}`}>E</span>
            <span className={`cutout cut-3 text-5xl md:text-7xl lg:text-8xl ${!initialAnimationDone ? 'animate-letter letter-delay-11' : ''} ${chaos === 'fall' ? 'animate-fall-2' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-1' : ''}`}>S</span>
            <span className={`cutout cut-4 text-5xl md:text-7xl lg:text-8xl ${!initialAnimationDone ? 'animate-letter letter-delay-12' : ''} ${chaos === 'fall' ? 'animate-fall-6' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>S</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 animate-load-buttons">
          <button
            onClick={() => setActivePanel("story")}
            className="cutout cut-8 text-sm md:text-base px-4 py-2 cursor-pointer hover:scale-105 transition-transform"
          >
            The Story
          </button>
          <button
            onClick={() => setActivePanel("collection")}
            className="cutout cut-9 text-sm md:text-base px-4 py-2 cursor-pointer hover:scale-105 transition-transform"
          >
            Collection
          </button>
          <button
            onClick={() => setActivePanel("signup")}
            className="cutout cut-3 text-sm md:text-base px-4 py-2 cursor-pointer hover:scale-105 transition-transform"
          >
            Spill It
          </button>
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
                        <div className="aim-dropdown-item" onClick={() => setActiveMenu(null)}>😎 Smiley</div>
                        <div className="aim-dropdown-item" onClick={() => setActiveMenu(null)}>☕ Coffee Stain</div>
                        <div className="aim-dropdown-item" onClick={() => setActiveMenu(null)}>🫘 Spilled Beans</div>
                        <div className="aim-dropdown-item" onClick={() => setActiveMenu(null)}>👼 Cherub</div>
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
                <div className="aim-chat">
                  <div className="aim-message aim-them">
                    <span className="aim-screenname">AlreadySpilled:</span>
                    <span className="aim-text">hey, wanna hear something wild?</span>
                  </div>
                  <div className="aim-message aim-them">
                    <span className="aim-screenname">AlreadySpilled:</span>
                    <span className="aim-text">in the world of collectibles, condition is EVERYTHING</span>
                  </div>
                  <div className="aim-message aim-them">
                    <span className="aim-screenname">AlreadySpilled:</span>
                    <span className="aim-text">mint. sealed. untouched. &quot;perfect&quot;</span>
                  </div>
                  <div className="aim-message aim-you">
                    <span className="aim-screenname">You:</span>
                    <span className="aim-text">sounds boring lol</span>
                  </div>
                  <div className="aim-message aim-them">
                    <span className="aim-screenname">AlreadySpilled:</span>
                    <span className="aim-text">EXACTLY</span>
                  </div>
                  <div className="aim-message aim-them">
                    <span className="aim-screenname">AlreadySpilled:</span>
                    <span className="aim-text">&quot;a knight in shining armor has never had his mettle tested&quot;</span>
                  </div>
                  <div className="aim-message aim-them">
                    <span className="aim-screenname">AlreadySpilled:</span>
                    <span className="aim-text">we celebrate the stains, the scuffs, the stories they tell</span>
                  </div>
                  <div className="aim-message aim-them">
                    <span className="aim-screenname">AlreadySpilled:</span>
                    <span className="aim-text">the coffee ring on ur fav book ☕</span>
                  </div>
                  <div className="aim-message aim-them">
                    <span className="aim-screenname">AlreadySpilled:</span>
                    <span className="aim-text">the grass stain from that winning catch 🏆</span>
                  </div>
                  <div className="aim-message aim-you">
                    <span className="aim-screenname">You:</span>
                    <span className="aim-text">ohhh i get it</span>
                  </div>
                  <div className="aim-message aim-them">
                    <span className="aim-screenname">AlreadySpilled:</span>
                    <span className="aim-text">these aren&apos;t flaws—they&apos;re PROOF OF LIFE</span>
                  </div>
                  <div className="aim-message aim-them aim-away">
                    <span className="aim-screenname">AlreadySpilled:</span>
                    <span className="aim-text">brb, spilling something 😎</span>
                  </div>
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`aim-message ${msg.sender === "you" ? "aim-you" : "aim-them"}${msg.sender === "them-away" ? " aim-away" : ""}`}>
                      <span className="aim-screenname">{msg.sender === "you" ? "You:" : "AlreadySpilled:"}</span>
                      <span className="aim-text">{msg.text}</span>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="aim-message aim-them">
                      <span className="aim-screenname">AlreadySpilled:</span>
                      <span className="aim-text aim-typing">is typing...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
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
                <div className="aim-status">
                  <span>AlreadySpilled is online</span>
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
        <span className="cutout cut-6 text-xs">© 2026 Already Spilled</span>
      </div>
    </main>
  );
}
