"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type IconName =
  | "arrow"
  | "star"
  | "shield"
  | "leaf"
  | "home"
  | "building"
  | "sparkles"
  | "key"
  | "phone"
  | "calendar"
  | "check"
  | "clock"
  | "message"
  | "language"
  | "paw"
  | "family"
  | "quote"
  | "play"
  | "pause"
  | "menu"
  | "close"
  | "instagram"
  | "facebook";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    star: <path d="m12 2.8 2.8 5.7 6.3.9-4.5 4.4 1 6.2-5.6-2.9L6.4 20l1.1-6.2L3 9.4l6.2-.9L12 2.8Z"/>,
    shield: <><path d="M12 3 5 6v5c0 4.6 2.8 8.2 7 10 4.2-1.8 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></>,
    leaf: <><path d="M20 4C12 4 5 7.4 5 14c0 3.3 2.4 5 5 5 6.6 0 9-7 10-15Z"/><path d="M4 21c2-5 6-8 11-11"/></>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>,
    building: <><path d="M4 21V5l8-3v19"/><path d="M12 8h8v13"/><path d="M8 7v1M8 11v1M8 15v1M16 12v1M16 16v1"/></>,
    sparkles: <><path d="m12 3 1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4L12 3Z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14ZM5 12l.8 2.2L8 15l-2.2.8L5 18l-.8-2.2L2 15l2.2-.8L5 12Z"/></>,
    key: <><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l2 2M18 5l2 2"/></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="m8 15 2 2 5-5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.5-5A7 7 0 0 1 3 13V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7Z"/><path d="M8 10h8M8 14h5"/></>,
    language: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z"/></>,
    paw: <><circle cx="7" cy="8" r="2"/><circle cx="12" cy="5.5" r="2"/><circle cx="17" cy="8" r="2"/><path d="M8.2 13.1c1.9-2.2 5.7-2.2 7.6 0l1.2 1.5c1.6 2-.1 5-2.7 4.4l-2.3-.6-2.3.6c-2.6.6-4.3-2.4-2.7-4.4l1.2-1.5Z"/></>,
    family: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6M14 15c.8-.8 1.8-1.2 3-1.2 2.4 0 3.8 1.7 4 4.7"/></>,
    quote: <path d="M7 17H3l2-5H3V7h6v5l-2 5Zm10 0h-4l2-5h-2V7h6v5l-2 5Z"/>,
    play: <path d="m9 7 8 5-8 5V7Z"/>,
    pause: <><path d="M9 5v14"/><path d="M15 5v14"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
    facebook: <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1Z"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const services = [
  { icon: "building" as IconName, number: "01", title: "Commercial spaces", copy: "Reliable cleaning that keeps offices, studios, and client-facing spaces ready for business.", meta: "Flexible · After-hours · Recurring" },
  { icon: "home" as IconName, number: "02", title: "Residential cleaning", copy: "A thoughtful, room-by-room clean tailored to your home, schedule, and routines.", meta: "Weekly · Biweekly · Monthly" },
  { icon: "sparkles" as IconName, number: "03", title: "Deep cleaning", copy: "A detailed reset for the areas that need extra care, from baseboards to overlooked corners.", meta: "Seasonal · One-time · Custom" },
  { icon: "key" as IconName, number: "04", title: "Move in & move out", copy: "Leave the old place spotless or arrive at a new home that already feels fresh and ready.", meta: "Apartments · Homes · Rentals" },
];

const faqs = [
  ["Do I need to be home during the cleaning?", "Not at all. Many clients provide secure access instructions, and our insured team handles the rest. We confirm arrival and completion so you always know what is happening."],
  ["Do you bring your own supplies?", "Yes. We arrive fully equipped with professional supplies and tools. If you prefer specific products or eco-friendly options, simply mention that in your quote request."],
  ["Can I customize my cleaning plan?", "Absolutely. Every home and business works differently. We tailor the checklist, frequency, priority areas, and access instructions around your needs."],
  ["What happens if I need to reschedule?", "Just let us know as early as possible. Your final booking policy will clearly explain the rescheduling window and available options."],
];

type QuoteDetails = {
  fullName: string;
  address: string;
  propertySize: string;
  phone: string;
  email: string;
};

const initialQuoteDetails: QuoteDetails = {
  fullName: "",
  address: "",
  propertySize: "",
  phone: "",
  email: "",
};

const quoteSteps = [
  { label: "Service", title: "What would you like us to clean?", hint: "Choose one or more services. You can fine-tune the details with our team later." },
  { label: "Space", title: "Tell us about your space.", hint: "A little context helps us prepare a more accurate, thoughtful quote." },
  { label: "Contact", title: "Where should we send your quote?", hint: "No spam or pressure—just a personalized response about your request." },
  { label: "Review", title: "Everything look right?", hint: "Review the details and confirm the policies before sending your request." },
] as const;

const cleaningOptions: { label: string; description: string; icon: IconName }[] = [
  { label: "Office Cleaning", description: "Reliable care for productive workspaces", icon: "building" },
  { label: "Recurring Cleaning", description: "Consistent weekly or biweekly care", icon: "calendar" },
  { label: "Deep Cleaning", description: "A detailed top-to-bottom reset", icon: "sparkles" },
  { label: "Move-In Cleaning", description: "A fresh start before you unpack", icon: "home" },
  { label: "Move-Out Cleaning", description: "Leave every room ready for what is next", icon: "key" },
  { label: "Post-Construction Cleaning", description: "Fine dust and finishing details handled", icon: "building" },
  { label: "Airbnb Turnover", description: "Guest-ready care between every stay", icon: "star" },
];

const heroSlides = [
  {
    id: "office",
    label: "Offices",
    badge: "Commercial focus",
    kicker: "Offices & workplaces",
    title: "Ready before the workday begins.",
    copy: "Discreet, dependable care scheduled around your operations—from reception to every workstation.",
    meta: "Recurring · After-hours · Fully insured",
    image: "/hero-commercial-man-action.webp",
    alt: "SparClean male professional in a black uniform and gloves cleaning a conference table in a modern office",
    width: 1122,
    height: 1402,
    position: "52% 44%",
    mobilePosition: "54% 40%",
    icon: "building" as IconName,
  },
  {
    id: "business",
    label: "Businesses",
    badge: "Commercial focus",
    kicker: "Companies & shared spaces",
    title: "A polished first impression, consistently.",
    copy: "Tailored cleaning for receptions, clinics, studios and shared spaces—without disrupting your day.",
    meta: "Flexible schedules · Custom scope",
    image: "/hero-commercial-man-cart.webp",
    alt: "SparClean male professional in a black uniform and gloves cleaning a conference table beside a service cart",
    width: 1122,
    height: 1402,
    position: "50% 42%",
    mobilePosition: "50% 40%",
    icon: "building" as IconName,
  },
  {
    id: "home",
    label: "Homes",
    badge: "Residential care",
    kicker: "Signature residential care",
    title: "A calmer, beautifully maintained home.",
    copy: "Meticulous recurring, deep and move-in care personalized around your household and routines.",
    meta: "Weekly · Biweekly · Deep cleaning",
    image: "/hero-residential-woman-action.webp",
    alt: "SparClean female professional in a black uniform and gloves cleaning a dining table in a bright residential interior",
    width: 1122,
    height: 1402,
    position: "50% 50%",
    mobilePosition: "50% 48%",
    icon: "home" as IconName,
  },
] as const;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [heroHoverPaused, setHeroHoverPaused] = useState(false);
  const [heroFocusPaused, setHeroFocusPaused] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [heroPageVisible, setHeroPageVisible] = useState(true);
  const [heroReducedMotion, setHeroReducedMotion] = useState(false);
  const [heroAnnouncement, setHeroAnnouncement] = useState("");
  const [compare, setCompare] = useState(50);
  const [aiMode, setAiMode] = useState<"voice" | "chat">("voice");
  const [chatOpen, setChatOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteStep, setQuoteStep] = useState(1);
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails>(initialQuoteDetails);
  const [cleaningTypes, setCleaningTypes] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [formError, setFormError] = useState("");
  const quoteFormRef = useRef<HTMLFormElement>(null);
  const quoteStepTitleRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroTouchStartRef = useRef<number | null>(null);

  const activeHero = heroSlides[heroIndex];
  const heroAutoplayPaused = heroPaused || heroHoverPaused || heroFocusPaused || !heroInView || !heroPageVisible || heroReducedMotion;

  function selectHeroSlide(index: number) {
    const nextIndex = (index + heroSlides.length) % heroSlides.length;
    setHeroIndex(nextIndex);
    setHeroAnnouncement(`${heroSlides[nextIndex].label}, slide ${nextIndex + 1} of ${heroSlides.length}.`);
  }

  function moveHero(direction: -1 | 1) {
    selectHeroSlide(heroIndex + direction);
  }

  function toggleCleaningType(type: string) {
    setCleaningTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    setFormError("");
  }

  function updateQuoteDetail(field: keyof QuoteDetails, value: string) {
    setQuoteDetails(prev => ({ ...prev, [field]: value }));
    setFormError("");
  }

  function changeQuoteStep(step: number) {
    setQuoteStep(Math.min(4, Math.max(1, step)));
    setFormError("");
    window.setTimeout(() => quoteStepTitleRef.current?.focus(), 0);
  }

  function validateQuoteStep(step: number) {
    if (step === 1 && cleaningTypes.length === 0) {
      setFormError("Please choose at least one cleaning service to continue.");
      return false;
    }

    const panel = quoteFormRef.current?.querySelector<HTMLElement>(`[data-quote-step="${step}"]`);
    const invalidControl = panel?.querySelector<HTMLInputElement>("input:invalid");
    if (invalidControl) {
      setFormError("Please complete the highlighted details before continuing.");
      invalidControl.reportValidity();
      invalidControl.focus();
      return false;
    }

    return true;
  }

  function advanceQuoteStep() {
    if (!validateQuoteStep(quoteStep)) return;
    changeQuoteStep(quoteStep + 1);
  }

  function resetQuote() {
    setSubmitted(false);
    setQuoteStep(1);
    setQuoteDetails(initialQuoteDetails);
    setCleaningTypes([]);
    setTermsAccepted(false);
    setPolicyAccepted(false);
    setFormError("");
  }

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.14 }
    );
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setHeroReducedMotion(reducedMotion.matches);
    const syncPageVisibility = () => setHeroPageVisible(!document.hidden);

    syncMotionPreference();
    syncPageVisibility();
    reducedMotion.addEventListener("change", syncMotionPreference);
    document.addEventListener("visibilitychange", syncPageVisibility);

    return () => {
      reducedMotion.removeEventListener("change", syncMotionPreference);
      document.removeEventListener("visibilitychange", syncPageVisibility);
    };
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.28 },
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (heroAutoplayPaused) return;
    const timer = window.setTimeout(() => {
      setHeroIndex(current => (current + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [heroIndex, heroAutoplayPaused]);

  function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (quoteStep < 4) {
      advanceQuoteStep();
      return;
    }

    const hasCompleteDetails = quoteDetails.fullName.trim().length >= 2
      && quoteDetails.address.trim().length >= 5
      && Number(quoteDetails.propertySize) > 0
      && quoteDetails.phone.trim().length >= 7
      && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quoteDetails.email);

    if (cleaningTypes.length === 0 || !hasCompleteDetails) {
      setFormError("Some details are incomplete. Please review the previous steps.");
      return;
    }

    if (!termsAccepted || !policyAccepted) {
      setFormError("Please accept the Terms of Use and Company Policies to send your request.");
      return;
    }

    setFormError("");
    setSubmitted(true);
  }

  return (
    <main className={heroInView ? "hero-visible" : ""}>
      <div className="announcement">
        <div className="shell announcement-inner">
          <span><Icon name="sparkles" size={15}/> The SparClean Signature Standard · Meticulous care, beautifully delivered</span>
          <a href="#quote">Request a private quote <Icon name="arrow" size={16}/></a>
        </div>
      </div>

      <header className="site-header">
        <div className="shell nav-wrap">
          <a className="brand" href="#top" aria-label="SparClean home">
            <img className="brand-logo" src="/sparclean-logo-hq.png" width="1884" height="358" alt="SparClean"/>
          </a>
          <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Main navigation">
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#difference" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#results" onClick={() => setMenuOpen(false)}>Results</a>
            <a href="#reviews" onClick={() => setMenuOpen(false)}>Reviews</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          </nav>
          <a className="button button-small header-cta" href="#quote">Request a quote <Icon name="arrow" size={18}/></a>
          <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <Icon name={menuOpen ? "close" : "menu"}/>
          </button>
        </div>
      </header>

      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/>
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow hero-in delay-1"><span className="eyebrow-icon"><Icon name="building" size={15}/></span><span className="hero-eyebrow-text">Commercial cleaning specialists<span className="hero-eyebrow-secondary"> · Residential care</span></span></div>
            <h1 className="display hero-in delay-2">Immaculate at work.<br/><em>Effortless at home.</em></h1>
            <p className="hero-lede hero-in delay-3">
              <span className="hero-lede-desktop">Commercial cleaning is our specialty—meticulous, reliable care for offices, businesses, and client-facing spaces. The same signature standard is also available for homes.</span>
              <span className="hero-lede-mobile">Commercial cleaning for offices and businesses, with the same meticulous standard available for homes.</span>
            </p>
            <div className="hero-actions hero-in delay-4">
              <a className="button" href="#quote">Request a tailored quote <Icon name="arrow"/></a>
              <a className="text-link" href="#services">Explore commercial care <Icon name="arrow" size={18}/></a>
            </div>
            <div className="trust-row hero-in delay-5">
              <div><span><Icon name="building"/></span><p><strong>Commercial</strong> specialists</p></div>
              <div><span><Icon name="clock"/></span><p><strong>Flexible</strong> after-hours care</p></div>
              <div><span><Icon name="shield"/></span><p><strong>Fully</strong> insured</p></div>
            </div>
          </div>
          <div className="hero-visual hero-in delay-3">
            <div
              className={heroAutoplayPaused ? "hero-carousel is-paused" : "hero-carousel"}
              role="region"
              aria-roledescription="carousel"
              aria-label="SparClean commercial and residential cleaning"
              onMouseEnter={() => setHeroHoverPaused(true)}
              onMouseLeave={() => setHeroHoverPaused(false)}
              onFocusCapture={() => setHeroFocusPaused(true)}
              onBlurCapture={event => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeroFocusPaused(false);
              }}
              onTouchStart={event => { heroTouchStartRef.current = event.touches[0]?.clientX ?? null; }}
              onTouchEnd={event => {
                const start = heroTouchStartRef.current;
                const end = event.changedTouches[0]?.clientX;
                heroTouchStartRef.current = null;
                if (start == null || end == null || Math.abs(start - end) < 45) return;
                moveHero(start > end ? 1 : -1);
              }}
            >
              <div className="hero-image-wrap" id="hero-carousel-stage">
                {heroSlides.map((slide, index) => (
                  <article
                    className={index === heroIndex ? "hero-slide active" : "hero-slide"}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${heroSlides.length}: ${slide.kicker}`}
                    aria-hidden={index !== heroIndex}
                    key={slide.id}
                  >
                    <img
                      src={slide.image}
                      width={slide.width}
                      height={slide.height}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      decoding="async"
                      style={{
                        "--hero-position": slide.position,
                        "--hero-mobile-position": slide.mobilePosition,
                      } as React.CSSProperties}
                      alt={slide.alt}
                    />
                  </article>
                ))}
                <div className="hero-image-shade"/>
              </div>

              <div className="hero-slide-badge" key={`${activeHero.id}-badge`}>
                <span><Icon name={activeHero.icon} size={15}/></span>
                <small>{activeHero.badge}</small>
              </div>

              <div className="hero-slide-caption" key={`${activeHero.id}-caption`}>
                <small>{activeHero.kicker}</small>
                <strong>{activeHero.title}</strong>
                <p>{activeHero.copy}</p>
                <span>{activeHero.meta}</span>
              </div>

              <div className="hero-carousel-controls">
                <div
                  className="hero-pagination"
                  role="group"
                  aria-label="Choose a cleaning scenario"
                  onKeyDown={event => {
                    if (event.key === "ArrowLeft") { event.preventDefault(); moveHero(-1); }
                    if (event.key === "ArrowRight") { event.preventDefault(); moveHero(1); }
                  }}
                >
                  {heroSlides.map((slide, index) => (
                    <button
                      type="button"
                      className={index === heroIndex ? "active" : ""}
                      aria-label={`Go to slide ${index + 1}: ${slide.kicker}`}
                      aria-current={index === heroIndex ? "true" : undefined}
                      aria-controls="hero-carousel-stage"
                      onClick={() => selectHeroSlide(index)}
                      key={slide.id}
                    >
                      <span>0{index + 1}</span><i/>
                    </button>
                  ))}
                </div>

                <div className="hero-arrow-controls">
                  <button type="button" className="hero-pause" aria-label={heroPaused ? "Resume automatic slide rotation" : "Pause automatic slide rotation"} onClick={() => setHeroPaused(value => !value)}>
                    <Icon name={heroPaused ? "play" : "pause"} size={17}/>
                  </button>
                  <button type="button" className="hero-previous" aria-label="Show previous slide" onClick={() => moveHero(-1)}><Icon name="arrow" size={18}/></button>
                  <button type="button" aria-label="Show next slide" onClick={() => moveHero(1)}><Icon name="arrow" size={18}/></button>
                </div>
              </div>
            </div>
            <span className="sr-only" aria-live="polite" aria-atomic="true">{heroAnnouncement}</span>
          </div>
        </div>
      </section>

      <section className="client-differentials" aria-label="SparClean client-friendly service advantages">
        <div className="shell differential-grid">
          <article><span><Icon name="language" size={22}/></span><div><strong>English-speaking team</strong><small>Clear communication at every step.</small></div></article>
          <article><span><Icon name="paw" size={22}/></span><div><strong>Pet-friendly care</strong><small>Thoughtful routines around your pets.</small></div></article>
          <article><span><Icon name="family" size={22}/></span><div><strong>Child-friendly cleaning</strong><small>Family-conscious care for everyday spaces.</small></div></article>
        </div>
      </section>

      <section className="section quote-section" id="quote">
        <div className="shell quote-grid">
          <div className="quote-copy" data-reveal>
            <div className="eyebrow">A service tailored to your space</div>
            <h2 className="display-sm">Your standard of clean,<br/><em>beautifully elevated.</em></h2>
            <p>Share a few details and we’ll prepare a considered, no-pressure proposal for your home or business.</p>
            <div className="quote-highlights">
              <div><span><Icon name="clock" size={19}/></span><p><strong>About 2 minutes</strong><small>Four simple, guided steps</small></p></div>
              <div><span><Icon name="shield" size={19}/></span><p><strong>No obligation</strong><small>A thoughtful quote, never pressure</small></p></div>
            </div>
            <div className="quote-contact"><span><Icon name="phone"/></span><div><small>Prefer to talk?</small><strong>(555) 014-7727</strong><p>Our concierge is available 24/7</p></div></div>
            <div className="privacy-note"><Icon name="shield" size={18}/> Your information stays private and is only used to prepare your request.</div>
          </div>
          <div className="quote-form-card" data-reveal>
            {submitted ? (
              <div className="success-state" role="status" aria-live="polite">
                <span><Icon name="check" size={34}/></span>
                <div className="eyebrow centered">Request received</div>
                <h3>That was the first step.</h3>
                <p>This is a demonstration flow. In the final site, the request can be sent to email, a CRM, or the AI concierge dashboard.</p>
                <button className="button" onClick={resetQuote}>Start another request <Icon name="arrow"/></button>
              </div>
            ) : (
              <form ref={quoteFormRef} onSubmit={submitQuote} noValidate>
                <div className="form-head">
                  <div><small>Free quote request</small><strong>{quoteSteps[quoteStep - 1].label}</strong></div>
                  <span className="form-step-count">Step {String(quoteStep).padStart(2, "0")} of 04</span>
                </div>

                <div className="quote-progress">
                  <span className="sr-only" aria-live="polite">Step {quoteStep} of 4: {quoteSteps[quoteStep - 1].label}</span>
                  <ol aria-hidden="true">
                    {quoteSteps.map((step, index) => {
                      const stepNumber = index + 1;
                      const state = stepNumber < quoteStep ? "complete" : stepNumber === quoteStep ? "active" : "";
                      return <li className={state} key={step.label}><span>{stepNumber < quoteStep ? <Icon name="check" size={13}/> : stepNumber}</span><small>{step.label}</small></li>;
                    })}
                  </ol>
                  <div className="quote-progress-track" role="progressbar" aria-label="Quote request progress" aria-valuemin={1} aria-valuemax={4} aria-valuenow={quoteStep}>
                    <span style={{ width: `${((quoteStep - 1) / (quoteSteps.length - 1)) * 100}%` }}/>
                  </div>
                </div>

                <fieldset className="quote-step-panel" data-quote-step={quoteStep}>
                  <legend className="sr-only">{quoteSteps[quoteStep - 1].title}</legend>
                  <div className="quote-step-intro">
                    <span>0{quoteStep}</span>
                    <h3 ref={quoteStepTitleRef} tabIndex={-1}>{quoteSteps[quoteStep - 1].title}</h3>
                    <p>{quoteSteps[quoteStep - 1].hint}</p>
                  </div>

                  {quoteStep === 1 && (
                    <div className="cleaning-type-grid">
                      {cleaningOptions.map(option => {
                        const selected = cleaningTypes.includes(option.label);
                        return (
                          <label key={option.label} className={selected ? "cleaning-type-option selected" : "cleaning-type-option"}>
                            <input name="cleaningTypes" type="checkbox" value={option.label} checked={selected} onChange={() => toggleCleaningType(option.label)}/>
                            <span className="cleaning-option-icon"><Icon name={option.icon} size={20}/></span>
                            <span className="cleaning-option-copy"><strong>{option.label}</strong><small>{option.description}</small></span>
                            <i className="cleaning-option-check"><Icon name="check" size={13}/></i>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {quoteStep === 2 && (
                    <div className="quote-step-fields">
                      <div className="input-grid">
                        <label className="full" htmlFor="quote-address">Full address <span>*</span><input id="quote-address" name="address" required minLength={5} autoComplete="street-address" type="text" value={quoteDetails.address} onChange={e => updateQuoteDetail("address", e.target.value)} placeholder="Street, City, State, ZIP" aria-describedby={formError ? "quote-form-error" : undefined}/></label>
                        <label className="full" htmlFor="quote-size">Approximate property size <span>*</span><div className="input-with-suffix"><input id="quote-size" name="propertySize" required type="number" min="1" inputMode="numeric" value={quoteDetails.propertySize} onChange={e => updateQuoteDetail("propertySize", e.target.value)} placeholder="e.g. 1200" aria-describedby={formError ? "quote-form-error" : undefined}/><span>sq ft</span></div></label>
                      </div>
                      <div className="form-note"><span><Icon name="sparkles" size={19}/></span><p><strong>An estimate is perfect.</strong><small>We will confirm the details with you before finalizing anything.</small></p></div>
                    </div>
                  )}

                  {quoteStep === 3 && (
                    <div className="quote-step-fields">
                      <div className="input-grid">
                        <label className="full" htmlFor="quote-name">Full name <span>*</span><input id="quote-name" name="fullName" required minLength={2} autoComplete="name" type="text" value={quoteDetails.fullName} onChange={e => updateQuoteDetail("fullName", e.target.value)} placeholder="Your full name" aria-describedby={formError ? "quote-form-error" : undefined}/></label>
                        <label htmlFor="quote-phone">Phone <span>*</span><input id="quote-phone" name="phone" required minLength={7} autoComplete="tel" type="tel" value={quoteDetails.phone} onChange={e => updateQuoteDetail("phone", e.target.value)} placeholder="(555) 000-0000" aria-describedby={formError ? "quote-form-error" : undefined}/></label>
                        <label htmlFor="quote-email">Email <span>*</span><input id="quote-email" name="email" required autoComplete="email" type="email" value={quoteDetails.email} onChange={e => updateQuoteDetail("email", e.target.value)} placeholder="you@email.com" aria-describedby={formError ? "quote-form-error" : undefined}/></label>
                      </div>
                      <div className="form-note privacy"><span><Icon name="shield" size={19}/></span><p><strong>Your details stay private.</strong><small>We only use them to prepare and follow up on this quote.</small></p></div>
                    </div>
                  )}

                  {quoteStep === 4 && (
                    <div className="quote-review">
                      <div className="review-summary">
                        <div><span className="review-summary-icon"><Icon name="sparkles" size={18}/></span><p><small>Selected service{cleaningTypes.length > 1 ? "s" : ""}</small><strong>{cleaningTypes.join(" · ")}</strong></p><button type="button" onClick={() => changeQuoteStep(1)}>Edit</button></div>
                        <div><span className="review-summary-icon"><Icon name="home" size={18}/></span><p><small>Your space</small><strong>{quoteDetails.address}</strong><em>{Number(quoteDetails.propertySize).toLocaleString()} sq ft</em></p><button type="button" onClick={() => changeQuoteStep(2)}>Edit</button></div>
                        <div><span className="review-summary-icon"><Icon name="message" size={18}/></span><p><small>Contact</small><strong>{quoteDetails.fullName}</strong><em>{quoteDetails.phone} · {quoteDetails.email}</em></p><button type="button" onClick={() => changeQuoteStep(3)}>Edit</button></div>
                      </div>
                      <div className="consent-group">
                        <div className={termsAccepted ? "consent-option accepted" : "consent-option"}>
                          <input id="quote-terms" type="checkbox" checked={termsAccepted} onChange={e => { setTermsAccepted(e.target.checked); setFormError(""); }}/>
                          <div><label htmlFor="quote-terms">Terms of Use</label><span>I have read and agree to the terms. <button type="button" className="inline-link" onClick={() => setShowTermsModal(true)}>Read terms</button></span></div>
                        </div>
                        <div className={policyAccepted ? "consent-option accepted" : "consent-option"}>
                          <input id="quote-policies" type="checkbox" checked={policyAccepted} onChange={e => { setPolicyAccepted(e.target.checked); setFormError(""); }}/>
                          <div><label htmlFor="quote-policies">Company Policies</label><span>I accept the cancellation and scheduling policies. <button type="button" className="inline-link" onClick={() => setShowPolicyModal(true)}>View policies</button></span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {formError && <div className="form-error" id="quote-form-error" role="alert"><Icon name="message" size={17}/><span>{formError}</span></div>}

                  <div className={quoteStep === 1 ? "form-actions first-step" : "form-actions"}>
                    {quoteStep > 1 ? <button type="button" className="back-button" onClick={() => changeQuoteStep(quoteStep - 1)}><Icon name="arrow" size={17}/> Back</button> : <span className="form-security"><Icon name="shield" size={16}/> No payment required</span>}
                    {quoteStep < 4 ? <button type="button" className="button form-next" onClick={advanceQuoteStep}>Continue <Icon name="arrow"/></button> : <button type="submit" className="button form-next">Request my free quote <Icon name="arrow"/></button>}
                  </div>
                </fieldset>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="shell">
          <div className="section-heading split-heading" data-reveal>
            <div><div className="eyebrow">Considered care for every space</div><h2 className="display-sm">Beyond clean.<br/><em>Beautifully cared for.</em></h2></div>
            <div className="heading-aside"><p>From weekly home care to detailed commercial cleaning, every service is shaped around your space—not a generic checklist.</p><a className="text-link" href="#quote">Build your cleaning plan <Icon name="arrow" size={18}/></a></div>
          </div>
          <div className="service-grid">
            {services.map((item, index) => (
              <article className="service-card" data-reveal style={{ "--delay": `${index * 80}ms` } as React.CSSProperties} key={item.title}>
                <div className="service-top"><span className="service-icon"><Icon name={item.icon} size={25}/></span><span className="service-number">{item.number}</span></div>
                <h3>{item.title}</h3><p>{item.copy}</p><small>{item.meta}</small>
                <a href="#quote" aria-label={`Request ${item.title}`}><Icon name="arrow"/></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section difference-section" id="difference">
        <div className="shell difference-grid">
          <div className="difference-visual" data-reveal>
            <div className="arch-card arch-main"><span className="arch-big">98%</span><p>of recurring clients say they feel more relaxed after a SparClean clean.</p></div>
            <div className="arch-card arch-small"><Icon name="leaf" size={34}/><strong>Care in every detail</strong><span>People-safe options available</span></div>
            <div className="orbit-text"><span>DETAILS MATTER · CARE SHOWS · </span></div>
          </div>
          <div className="difference-copy" data-reveal>
            <div className="eyebrow light">The SparClean Signature Standard</div>
            <h2 className="display-sm light-text">Reliable care.<br/><em>Remarkable details.</em></h2>
            <p>We built a better cleaning experience around the things that matter most: clear communication, trusted professionals, and consistently beautiful results.</p>
            <div className="difference-list">
              <div><span>01</span><div><strong>Thoughtfully matched team</strong><p>Professional, insured cleaners selected for your space.</p></div></div>
              <div><span>02</span><div><strong>Your preferences, remembered</strong><p>Notes, priority rooms, products, and access details stay organized.</p></div></div>
              <div><span>03</span><div><strong>Simple, proactive communication</strong><p>Helpful confirmations before, during, and after every clean.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="shell">
          <div className="center-heading" data-reveal><div className="eyebrow centered">Simple from the very first step</div><h2 className="display-sm">A fresh space is<br/><em>closer than you think.</em></h2></div>
          <div className="process-line" data-reveal><span/></div>
          <div className="process-grid">
            <article data-reveal><span className="process-num">01</span><div className="process-icon"><Icon name="message" size={28}/></div><h3>Tell us about your space</h3><p>Share your needs online or with our AI concierge. It only takes a few minutes.</p></article>
            <article data-reveal><span className="process-num">02</span><div className="process-icon"><Icon name="calendar" size={28}/></div><h3>Choose what works</h3><p>Review your personalized plan and select a time that fits your schedule.</p></article>
            <article data-reveal><span className="process-num">03</span><div className="process-icon"><Icon name="sparkles" size={28}/></div><h3>Come home to clean</h3><p>Your trusted team handles the details while you get your time back.</p></article>
          </div>
        </div>
      </section>

      <section className="section results-section" id="results">
        <div className="shell results-grid">
          <div className="results-copy" data-reveal>
            <div className="eyebrow">Quality you can see and feel</div>
            <h2 className="display-sm">The difference<br/>is in the <em>details.</em></h2>
            <p>Slide to explore a representative transformation. Every clean is guided by a detailed checklist and finished with a quality review.</p>
            <div className="result-stats"><div><strong>50+</strong><span>quality points checked</span></div><div><strong>100%</strong><span>carefully reviewed</span></div></div>
            <a href="#quote" className="button">Request your transformation <Icon name="arrow"/></a>
          </div>
          <div className="compare-card" data-reveal style={{ "--compare-position": `${compare}%` } as React.CSSProperties}>
            <div className="compare-image after"><img src="/kitchen-after.webp" width="1400" height="1050" loading="lazy" decoding="async" alt="Bright, polished kitchen after professional cleaning"/><span className="image-label">After</span></div>
            <div className="compare-image before"><img src="/kitchen-before-matched.webp" width="1400" height="1050" loading="lazy" decoding="async" alt="The same kitchen dirty and disorganized before professional cleaning"/><span className="image-label">Before</span></div>
            <div className="compare-handle"><span><Icon name="arrow" size={14}/><Icon name="arrow" size={14}/></span></div>
            <input aria-label="Compare before and after" aria-valuetext={`${compare}% before, ${100 - compare}% after`} type="range" min="4" max="96" value={compare} onChange={e => setCompare(Number(e.target.value))}/>
            <div className="compare-caption"><span>Slide to reveal</span><strong>Kitchen reset · 2.5 hours</strong></div>
          </div>
        </div>
      </section>

      <section className="section concierge-section">
        <div className="concierge-glow"/><div className="shell concierge-grid">
          <div className="concierge-copy" data-reveal>
            <div className="eyebrow light"><span className="live-dot"/> Meet your 24/7 cleaning concierge</div>
            <h2 className="display-sm light-text">Questions answered.<br/><em>Bookings simplified.</em></h2>
            <p>Whether a visitor prefers to call or type, SparClean’s AI concierge can answer common questions, collect quote details, and help schedule the next step—day or night.</p>
            <div className="mode-toggle" role="group" aria-label="Concierge demo mode">
              <button className={aiMode === "voice" ? "active" : ""} onClick={() => setAiMode("voice")}><Icon name="phone" size={17}/> Voice assistant</button>
              <button className={aiMode === "chat" ? "active" : ""} onClick={() => setAiMode("chat")}><Icon name="message" size={17}/> Website chat</button>
            </div>
            <ul className="feature-checks"><li><Icon name="check" size={17}/> Answers service and availability questions</li><li><Icon name="check" size={17}/> Collects detailed quote information</li><li><Icon name="check" size={17}/> Transfers complex requests to a person</li></ul>
            <small className="demo-note">Interactive concept · final integrations configured after approval</small>
          </div>
          <div className="concierge-demo" data-reveal>
            {aiMode === "voice" ? (
              <div className="phone-demo">
                <div className="phone-top"><span>9:41</span><div/><span>•••</span></div>
                <div className="call-content"><div className="ai-avatar"><span/><span/><span/></div><small>SparClean AI concierge</small><h3>How can I help today?</h3><div className="waveform">{Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ "--h": `${12 + ((i * 17) % 32)}px`, "--d": `${i * 45}ms` } as React.CSSProperties}/>)}</div><p>“I’d like a quote for biweekly cleaning.”</p><div className="call-time">00:42</div></div>
                <div className="call-actions"><button><Icon name="message"/></button><button className="hangup"><Icon name="phone"/></button><button><Icon name="calendar"/></button></div>
              </div>
            ) : (
              <div className="chat-demo">
                <div className="chat-head"><div className="ai-avatar small"><span/><span/><span/></div><div><strong>SparClean Concierge</strong><small><i/> Online now</small></div><span>•••</span></div>
                <div className="chat-body"><div className="chat-date">Today · 9:41 AM</div><div className="bubble ai">Hi! I can help you find the right cleaning plan. What kind of space would you like us to care for?</div><div className="bubble user">A 3-bedroom home. I’m interested in biweekly cleaning.</div><div className="bubble ai">Perfect. I’ll collect a few details and prepare your quote request. ✦</div><div className="typing"><i/><i/><i/></div></div>
                <div className="chat-input">Type your message… <button><Icon name="arrow"/></button></div>
              </div>
            )}
            <div className="automation-card"><span><Icon name="check"/></span><div><small>Lead captured</small><strong>Quote request ready</strong></div><em>Just now</em></div>
          </div>
        </div>
      </section>

      <section className="section reviews-section" id="reviews">
        <div className="shell">
          <div className="reviews-top" data-reveal><div><div className="eyebrow">Kind words from clean spaces</div><h2 className="display-sm">Trusted in the homes<br/><em>that matter most.</em></h2></div><div className="google-score"><span className="google-g">G</span><div><div className="big-stars">★★★★★</div><strong>4.9 from local clients</strong><small>Google reviews integration</small></div></div></div>
          <div className="review-grid">
            {[
              ["“It feels like a reset every time.”", "The communication is excellent, the team remembers the little things, and the house always feels calm when I walk back in.", "Sarah M.", "Recurring home cleaning"],
              ["“Professional from start to finish.”", "Booking was simple and the result exceeded expectations. Every surface in our office looked fresh without disrupting our team.", "David R.", "Commercial cleaning"],
              ["“They noticed what others missed.”", "Our move-out clean was incredibly detailed. The process was clear, punctual, and completely stress-free.", "Amanda L.", "Move-out cleaning"],
            ].map((review, index) => <article className="review-card" data-reveal style={{ "--delay": `${index * 90}ms` } as React.CSSProperties} key={review[2]}><div className="review-card-top"><span className="big-stars">★★★★★</span><Icon name="quote" size={34}/></div><h3>{review[0]}</h3><p>{review[1]}</p><div className="reviewer"><span>{review[2].split(" ").map(x => x[0]).join("")}</span><div><strong>{review[2]}</strong><small>{review[3]} · Verified</small></div></div></article>)}
          </div>
          <p className="placeholder-disclosure">Demonstration testimonials and ratings — replace with verified Google Business reviews before launch.</p>
        </div>
      </section>

      <section className="membership-section">
        <div className="shell membership-card" data-reveal>
          <div className="membership-pattern"/><div className="membership-copy"><div className="eyebrow light">SparClean Signature Care</div><h2 className="display-sm light-text">An immaculate home.<br/><em>Beautifully effortless.</em></h2><p>Recurring care means a familiar team, remembered preferences, priority scheduling, and an exceptional standard maintained quietly, week after week.</p><a href="#quote" className="button button-cream">Discover signature care <Icon name="arrow"/></a></div>
          <div className="membership-benefits"><div><span><Icon name="calendar"/></span><strong>Priority scheduling</strong><p>Your preferred day, protected whenever possible.</p></div><div><span><Icon name="clock"/></span><strong>Time back, every week</strong><p>Consistent care that fits quietly into your routine.</p></div><div><span><Icon name="star"/></span><strong>Preferred client perks</strong><p>Easy add-ons and thoughtful seasonal touches.</p></div></div>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="shell faq-grid"><div className="faq-heading" data-reveal><div className="eyebrow">Good to know</div><h2 className="display-sm">Questions,<br/><em>beautifully simple.</em></h2><p>Still curious? Our team—or the 24/7 concierge—can help with anything not covered here.</p><button className="text-link" onClick={() => setChatOpen(true)}>Ask the concierge <Icon name="arrow" size={18}/></button></div><div className="faq-list" data-reveal>{faqs.map(([q,a], i) => <details key={q} open={i === 0}><summary><span>{String(i+1).padStart(2,"0")}</span>{q}<i>+</i></summary><p>{a}</p></details>)}</div></div>
      </section>

      <footer className="footer">
        <div className="shell footer-top"><div className="footer-brand"><a className="brand light-brand" href="#top" aria-label="SparClean home"><img className="brand-logo" src="/sparclean-logo-hq.png" width="1884" height="358" alt="SparClean"/></a><p>Thoughtful cleaning for lighter living.</p><div className="socials"><a href="#" aria-label="Instagram"><Icon name="instagram"/></a><a href="#" aria-label="Facebook"><Icon name="facebook"/></a></div></div><div className="footer-links"><div><strong>Explore</strong><a href="#services">Services</a><a href="#difference">About us</a><a href="#results">Our results</a><a href="#reviews">Reviews</a></div><div><strong>Services</strong><a href="#services">Residential</a><a href="#services">Commercial</a><a href="#services">Deep cleaning</a><a href="#services">Move in / out</a></div><div><strong>Contact</strong><a href="tel:5550147727">(555) 014-7727</a><a href="mailto:hello@sparclean.com">hello@sparclean.com</a><span>Mon–Fri · 8am–6pm</span><span>AI concierge · 24/7</span></div></div></div>
        <div className="shell footer-bottom"><span>© 2026 SparClean · Demonstration concept</span><div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Accessibility</a></div><span>Made with care ✦</span></div>
      </footer>

      <button className={chatOpen ? "floating-chat active" : "floating-chat"} onClick={() => setChatOpen(v => !v)} aria-label="Open AI concierge"><span className="live-dot"/><Icon name={chatOpen ? "close" : "message"}/><i>Ask SparClean</i></button>
      <div className={chatOpen ? "mini-chat open" : "mini-chat"} aria-hidden={!chatOpen}><div className="mini-chat-head"><div className="ai-avatar tiny"><span/><span/><span/></div><div><strong>SparClean Concierge</strong><small><i/> Ready to help</small></div><button onClick={() => setChatOpen(false)} aria-label="Close chat"><Icon name="close"/></button></div><div className="mini-chat-body"><div className="bubble ai">Hi! I can answer questions or help start your free quote. What would you like to know?</div><div className="quick-replies"><button onClick={() => {setChatOpen(false); document.querySelector("#quote")?.scrollIntoView({behavior:"smooth"});}}>Get a quote</button><button onClick={() => {setChatOpen(false); document.querySelector("#services")?.scrollIntoView({behavior:"smooth"});}}>View services</button></div></div><div className="mini-chat-input">Type a message… <button><Icon name="arrow"/></button></div></div>

      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Terms of Use</h3>
              <button onClick={() => setShowTermsModal(false)} aria-label="Close"><Icon name="close"/></button>
            </div>
            <div className="modal-body">
              <h4>1. Acceptance of Terms</h4>
              <p>By using SparClean’s services, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.</p>
              <h4>2. Scope of Services</h4>
              <p>SparClean provides professional residential and commercial cleaning services. The scope of services will be as agreed upon in your quote and confirmed booking.</p>
              <h4>3. Liability</h4>
              <p>SparClean is fully insured. In the unlikely event of damage or loss, clients must notify us within 24 hours of the cleaning date so we can address the issue appropriately.</p>
              <h4>4. Privacy</h4>
              <p>We collect only the information necessary to deliver and improve our services. We do not sell or share your personal data with third parties.</p>
              <h4>5. Modifications</h4>
              <p>SparClean reserves the right to update these terms at any time. Continued use of our services constitutes acceptance of any changes.</p>
            </div>
            <div className="modal-footer">
              <button className="button" onClick={() => { setTermsAccepted(true); setShowTermsModal(false); }}>I Agree <Icon name="check" size={16}/></button>
            </div>
          </div>
        </div>
      )}

      {showPolicyModal && (
        <div className="modal-overlay" onClick={() => setShowPolicyModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Company Policies</h3>
              <button onClick={() => setShowPolicyModal(false)} aria-label="Close"><Icon name="close"/></button>
            </div>
            <div className="modal-body">
              <h4>Cancellation Policy</h4>
              <p>To cancel or reschedule without charge, please notify us at least <strong>48 hours</strong> before your scheduled appointment. Cancellations with less than 48 hours’ notice will incur a fee of 50% of the scheduled service value.</p>
              <h4>Same-Day Cancellation</h4>
              <p>Cancellations made on the day of service or no-shows will be charged 100% of the service value.</p>
              <h4>Rescheduling</h4>
              <p>You may reschedule free of charge up to 48 hours before your appointment. Contact us via phone, email, or through the AI concierge.</p>
              <h4>Access to Property</h4>
              <p>Clients are responsible for providing safe and clear access to the property at the scheduled time. If our team cannot access the property, the appointment will be treated as a same-day cancellation.</p>
              <h4>Satisfaction Guarantee</h4>
              <p>If you are not satisfied with any aspect of your clean, please contact us within 24 hours and we will return to address the concern at no additional cost.</p>
            </div>
            <div className="modal-footer">
              <button className="button" onClick={() => { setPolicyAccepted(true); setShowPolicyModal(false); }}>I Acknowledge <Icon name="check" size={16}/></button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
