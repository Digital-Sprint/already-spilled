"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [chaos, setChaos] = useState<string | null>(null);
  const [stainsKey, setStainsKey] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    // Trigger stain re-animation on mode change
    setStainsKey(prev => prev + 1);
  }, [darkMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const closePanel = () => setActivePanel(null);

  // Chaotic interactions
  const triggerChaos = (type: string) => {
    setChaos(type);
    setTimeout(() => setChaos(null), 3000);
  };

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
      <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-10">
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
            className={`w-[80px] md:w-[120px] transition-all duration-300 ${darkMode ? 'brightness-50' : 'brightness-100'}`}
          />
        </button>
      </div>

      {/* INTERACTIVE CHERUB - Right (Pink) - Makes letters fall */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-10">
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
            className="w-[80px] md:w-[120px] hover:animate-shake"
          />
        </button>
      </div>

      {/* INTERACTIVE CHERUB - Top (Green) - Spins letters */}
      <div className="fixed top-8 left-1/4 z-10 hidden lg:block">
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
            className="opacity-90 hover:animate-spin-slow"
          />
        </button>
      </div>

      {/* CRT OVERLAY - Fuzzy TV effect */}
      <div className="crt-overlay pointer-events-none"></div>

      {/* MAIN CONTENT */}
      <div className="text-center z-20 max-w-4xl">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/assets/already spilled main.png"
            alt="Already Spilled"
            width={200}
            height={100}
            className="mx-auto"
            priority
          />
        </div>

        {/* BIG HEADLINE */}
        <div className="mb-8">
          <div className="cutout-line mb-2 md:mb-3">
            <span className={`cutout cut-4 text-4xl md:text-6xl lg:text-7xl ${chaos === 'fall' ? 'animate-fall-1' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>E</span>
            <span className={`cutout cut-2 text-4xl md:text-6xl lg:text-7xl ${chaos === 'fall' ? 'animate-fall-2' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-1' : ''}`}>M</span>
            <span className={`cutout cut-9 text-4xl md:text-6xl lg:text-7xl ${chaos === 'fall' ? 'animate-fall-3' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-2' : ''}`}>B</span>
            <span className={`cutout cut-3 text-4xl md:text-6xl lg:text-7xl ${chaos === 'fall' ? 'animate-fall-4' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>R</span>
            <span className={`cutout cut-1 text-4xl md:text-6xl lg:text-7xl ${chaos === 'fall' ? 'animate-fall-5' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-1' : ''}`}>A</span>
            <span className={`cutout cut-5 text-4xl md:text-6xl lg:text-7xl ${chaos === 'fall' ? 'animate-fall-6' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-2' : ''}`}>C</span>
            <span className={`cutout cut-7 text-4xl md:text-6xl lg:text-7xl ${chaos === 'fall' ? 'animate-fall-7' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>E</span>
          </div>
          <div className="cutout-line">
            <span className={`cutout cut-6 text-3xl md:text-5xl lg:text-6xl ${chaos === 'fall' ? 'animate-fall-3' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-1' : ''}`}>the</span>
            <span className={`cutout cut-9 text-5xl md:text-7xl lg:text-8xl ${chaos === 'fall' ? 'animate-fall-1' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>M</span>
            <span className={`cutout cut-2 text-5xl md:text-7xl lg:text-8xl ${chaos === 'fall' ? 'animate-fall-5' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-2' : ''}`}>E</span>
            <span className={`cutout cut-3 text-5xl md:text-7xl lg:text-8xl ${chaos === 'fall' ? 'animate-fall-2' : ''} ${chaos === 'spin' ? 'animate-spin-letter-delay-1' : ''}`}>S</span>
            <span className={`cutout cut-4 text-5xl md:text-7xl lg:text-8xl ${chaos === 'fall' ? 'animate-fall-6' : ''} ${chaos === 'spin' ? 'animate-spin-letter' : ''}`}>S</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
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
            Get Notified
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
            className="relative max-w-lg w-full animate-panel-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closePanel}
              className="absolute -top-3 -right-3 cutout cut-9 text-lg w-10 h-10 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-10"
            >
              ×
            </button>

            {/* STORY PANEL */}
            {activePanel === "story" && (
              <div className="torn-paper">
                <div className="torn-edge-top"></div>
                <div className="panel-content">
                  <div className="panel-header">
                    <span className="panel-date">Est. 2025</span>
                    <span className="panel-edition">Vol. 1, No. 1</span>
                  </div>

                  <h2 className="panel-headline">The Story</h2>
                  <div className="panel-divider"></div>

                  <div className="panel-body space-y-4">
                    <p className="panel-lead">
                      In the world of collectibles, <span className="cutout cut-2 text-sm">condition is everything.</span> Mint in box. Factory sealed. Never opened.
                    </p>

                    <p className="panel-bold">We disagree.</p>

                    <div className="panel-quote">
                      &ldquo;A knight in shining armor has not seen battle.&rdquo;
                    </div>

                    <p className="panel-text">
                      Already Spilled celebrates the <span className="cutout cut-7 text-xs">stains,</span> the <span className="cutout cut-4 text-xs">scuffs,</span> and the stories they tell. The coffee ring on your favorite book. The grass stain from that winning catch.
                    </p>

                    <p className="panel-text">
                      These aren&apos;t flaws — they&apos;re <span className="cutout cut-10 text-xs">proof of life.</span>
                    </p>
                  </div>
                </div>
                <div className="torn-edge-bottom"></div>
              </div>
            )}

            {/* COLLECTION PANEL */}
            {activePanel === "collection" && (
              <div className="torn-paper">
                <div className="torn-edge-top"></div>
                <div className="panel-content">
                  <h2 className="panel-headline">Collection</h2>
                  <div className="panel-divider"></div>
                  <div className="photo-cutout mb-4">
                    <Image
                      src="/assets/main artwork.png"
                      alt="Can of Lonely Beans"
                      width={400}
                      height={280}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="panel-subtitle">Can of Lonely Beans</h3>
                    <p className="panel-text mb-3">First Collection</p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm">
                      <span className="cutout cut-6">11 shirts</span>
                      <span className="cutout cut-7">11 stories</span>
                      <span className="cutout cut-10">1 treasure hunt</span>
                    </div>
                    <div className="mt-4">
                      <span className="cutout cut-9 text-sm">SPILLVILLE, IOWA</span>
                    </div>
                  </div>
                </div>
                <div className="torn-edge-bottom"></div>
              </div>
            )}

            {/* SIGNUP PANEL */}
            {activePanel === "signup" && (
              <div className="torn-paper">
                <div className="torn-edge-top"></div>
                <div className="panel-content">
                  <h2 className="panel-headline">Get Notified</h2>
                  <div className="panel-divider"></div>
                  {!submitted ? (
                    <>
                      <p className="text-center panel-text mb-6">
                        Be the first to know when the beans spill.
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="panel-input w-full"
                        />
                        <button type="submit" className="panel-btn w-full">
                          Subscribe
                        </button>
                      </form>
                      <p className="text-center text-xs mt-4 panel-text opacity-70">
                        We only write when it matters.
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="cutout cut-5 text-4xl inline-block mb-4">✓</div>
                      <p className="text-xl font-semibold mb-2 panel-text">
                        You&apos;re in!
                      </p>
                      <p className="panel-text opacity-80">
                        The mess awaits...
                      </p>
                    </div>
                  )}
                </div>
                <div className="torn-edge-bottom"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <span className="cutout cut-6 text-xs">© 2025 Already Spilled</span>
      </div>
    </main>
  );
}
