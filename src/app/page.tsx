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
  const [postcardFlipped, setPostcardFlipped] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            className={`w-[50px] sm:w-[70px] md:w-[120px] transition-all duration-300 ${darkMode ? 'brightness-50' : 'brightness-100'}`}
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
            className="w-[50px] sm:w-[70px] md:w-[120px] hover:animate-shake"
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
            className="w-[40px] sm:w-[60px] md:w-[80px] opacity-90 hover:animate-spin-slow"
          />
        </button>
      </div>

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
            className="mx-auto"
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
                </div>
                <div className="aim-input-area">
                  <input type="text" className="aim-input" placeholder="Type a message..." disabled />
                  <button className="aim-send">Send</button>
                </div>
                <div className="aim-status">
                  <span>AlreadySpilled is online</span>
                  <span className="aim-timestamp">Est. 2025</span>
                </div>
              </div>
            )}

            {/* COLLECTION PANEL - Spammy Popup */}
            {activePanel === "collection" && (
              <div className="spam-popup">
                <div className="spam-titlebar">
                  <span>⚠️ CONGRATULATIONS!!! ⚠️</span>
                  <button onClick={closePanel} className="spam-close">×</button>
                </div>
                <div className="spam-content">
                  <div className="spam-flash">
                    🎉 YOU ARE THE 1,000,000th VISITOR!!! 🎉
                  </div>

                  <div className="spam-arrows">
                    👇👇👇 CLICK HERE 👇👇👇
                  </div>

                  <div className="spam-image-wrapper">
                    <Image
                      src="/assets/main artwork.png"
                      alt="Can of Lonely Beans"
                      width={200}
                      height={200}
                      className="spam-image"
                    />
                  </div>

                  <div className="spam-prize">
                    YOU&apos;VE WON ACCESS TO THE<br/>
                    <span className="spam-highlight">EXCLUSIVE COLLECTION</span>
                  </div>

                  <div className="spam-details">
                    <p className="spam-count">🔥 11 SHIRTS 🔥</p>
                    <p className="spam-count">🔥 11 STORIES 🔥</p>
                    <p className="spam-count">🔥 1 TREASURE HUNT 🔥</p>
                  </div>

                  <div className="spam-warning">
                    ⏰ LIMITED TIME OFFER ⏰
                  </div>

                  <button className="spam-cta">
                    🚨 CLAIM YOUR PRIZE NOW 🚨
                  </button>

                  <p className="spam-fine-print">
                    *Details coming soon. No purchase necessary.
                    By clicking you agree that stains are beautiful.
                  </p>

                  <div className="spam-fake-btns">
                    <span className="spam-fake-x">✕</span>
                    <span className="spam-fake-x">✕</span>
                    <span className="spam-fake-x">✕</span>
                  </div>
                </div>
              </div>
            )}

            {/* SIGNUP PANEL - Early Internet Style */}
            {activePanel === "signup" && (
              <div className="web95">
                <div className="web95-titlebar">
                  <span>📧 Already Spilled - Mailing List</span>
                  <button onClick={closePanel} className="web95-close">×</button>
                </div>

                <div className="web95-content">
                  {!submitted ? (
                    <div className="web95-inner">
                      <div className="web95-marquee">
                        ⭐ JOIN OUR MAILING LIST!!! ⭐
                      </div>

                      <div className="web95-rainbow"></div>

                      <p className="web95-comic text-center text-sm mb-4">
                        Be the <b>FIRST</b> to know when the beans spill!!!
                      </p>

                      <div className="web95-construction">
                        🚧 <span>NEW COLLECTION COMING SOON</span> 🚧
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                          <label className="block text-xs mb-1">Your E-Mail Address:</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="coolperson@aol.com"
                            required
                            className="web95-input"
                          />
                        </div>
                        <div className="text-center">
                          <button type="submit" className="web95-btn">
                            ✉️ SUBSCRIBE NOW ✉️
                          </button>
                        </div>
                      </form>

                      <div className="web95-rainbow"></div>

                      <div className="text-center mt-4">
                        <span className="web95-counter">Visitors: 000,847</span>
                      </div>

                      <p className="text-center text-xs mt-3 text-gray-600">
                        We only write when it matters. <span className="web95-link">Sign our Guestbook!</span>
                      </p>

                      <div className="text-center mt-3">
                        <span className="web95-badge">🏆 Best viewed in Netscape Navigator 🏆</span>
                      </div>
                    </div>
                  ) : (
                    <div className="web95-inner text-center">
                      <div className="web95-marquee">
                        🎉 WELCOME TO THE CLUB!!! 🎉
                      </div>

                      <div className="web95-rainbow"></div>

                      <p className="text-4xl my-4">
                        <span className="web95-email">📧</span>
                      </p>

                      <p className="web95-comic text-lg mb-2">
                        <b>You&apos;re in!</b>
                      </p>

                      <p className="text-sm text-gray-600 mb-4">
                        The mess awaits...
                      </p>

                      <div className="web95-bevel">
                        <p className="text-xs">
                          Thank you for signing up!<br/>
                          You are visitor #847
                        </p>
                      </div>

                      <div className="web95-rainbow"></div>

                      <p className="text-xs mt-3">
                        <span className="web95-link">Click here</span> to tell your friends!
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
