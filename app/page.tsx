"use client";

import { useEffect, useState, type FormEvent } from "react";

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
  | "quote"
  | "play"
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
    quote: <path d="M7 17H3l2-5H3V7h6v5l-2 5Zm10 0h-4l2-5h-2V7h6v5l-2 5Z"/>,
    play: <path d="m9 7 8 5-8 5V7Z"/>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
    facebook: <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1Z"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const services = [
  { icon: "home" as IconName, number: "01", title: "Residential cleaning", copy: "A thoughtful, room-by-room clean tailored to your home, schedule, and routines.", meta: "Weekly · Biweekly · Monthly" },
  { icon: "sparkles" as IconName, number: "02", title: "Deep cleaning", copy: "A detailed reset for the areas that need extra care, from baseboards to overlooked corners.", meta: "Seasonal · One-time · Custom" },
  { icon: "building" as IconName, number: "03", title: "Commercial spaces", copy: "Reliable cleaning that keeps offices, studios, and client-facing spaces ready for business.", meta: "Flexible · After-hours · Recurring" },
  { icon: "key" as IconName, number: "04", title: "Move in & move out", copy: "Leave the old place spotless or arrive at a new home that already feels fresh and ready.", meta: "Apartments · Homes · Rentals" },
];

const faqs = [
  ["Do I need to be home during the cleaning?", "Not at all. Many clients provide secure access instructions, and our insured team handles the rest. We confirm arrival and completion so you always know what is happening."],
  ["Do you bring your own supplies?", "Yes. We arrive fully equipped with professional supplies and tools. If you prefer specific products or eco-friendly options, simply mention that in your quote request."],
  ["Can I customize my cleaning plan?", "Absolutely. Every home and business works differently. We tailor the checklist, frequency, priority areas, and access instructions around your needs."],
  ["What happens if I need to reschedule?", "Just let us know as early as possible. Your final booking policy will clearly explain the rescheduling window and available options."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compare, setCompare] = useState(54);
  const [aiMode, setAiMode] = useState<"voice" | "chat">("voice");
  const [chatOpen, setChatOpen] = useState(false);
  const [quoteStep, setQuoteStep] = useState(1);
  const [service, setService] = useState("Recurring home cleaning");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.14 }
    );
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main>
      <div className="announcement">
        <div className="shell announcement-inner">
          <span><Icon name="sparkles" size={15}/> New clients receive $25 off their first recurring clean</span>
          <a href="#quote">Claim your welcome offer <Icon name="arrow" size={16}/></a>
        </div>
      </div>

      <header className="site-header">
        <div className="shell nav-wrap">
          <a className="brand" href="#top" aria-label="Lumora home">
            <span className="brand-mark"><i/><i/><i/></span>
            <span><strong>LUMORA</strong><small>Cleaning Co.</small></span>
          </a>
          <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Main navigation">
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#difference" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#results" onClick={() => setMenuOpen(false)}>Results</a>
            <a href="#reviews" onClick={() => setMenuOpen(false)}>Reviews</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          </nav>
          <a className="button button-small header-cta" href="#quote">Get a free quote <Icon name="arrow" size={18}/></a>
          <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <Icon name={menuOpen ? "close" : "menu"}/>
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/>
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow hero-in delay-1"><span className="eyebrow-icon"><Icon name="sparkles" size={15}/></span> Trusted local cleaning professionals</div>
            <h1 className="display hero-in delay-2">A cleaner home.<br/><em>A lighter life.</em></h1>
            <p className="hero-lede hero-in delay-3">Thoughtful cleaning for homes and businesses, delivered with care, consistency, and a meticulous eye for detail.</p>
            <div className="hero-actions hero-in delay-4">
              <a className="button" href="#quote">Get a free quote <Icon name="arrow"/></a>
              <a className="text-link" href="#services">Explore our services <Icon name="arrow" size={18}/></a>
            </div>
            <div className="trust-row hero-in delay-5">
              <div><span><Icon name="star"/></span><p><strong>4.9</strong> Google rating</p></div>
              <div><span><Icon name="shield"/></span><p><strong>Fully</strong> insured</p></div>
              <div><span><Icon name="leaf"/></span><p><strong>Eco-friendly</strong> options</p></div>
            </div>
          </div>
          <div className="hero-visual hero-in delay-3">
            <div className="hero-image-wrap"><img src="/hero-cleaning.webp" width="1400" height="933" fetchPriority="high" decoding="async" alt="Professional cleaning a bright, elegant living room"/></div>
            <div className="availability-card float-card">
              <span className="live-dot"/>
              <div><small>AI concierge</small><strong>Available 24/7</strong></div>
              <span className="mini-icon"><Icon name="phone" size={18}/></span>
            </div>
            <div className="review-float float-card">
              <div className="mini-stars">★★★★★</div>
              <p>“Every detail was perfect.”</p>
              <small>— Sarah M. · Verified client</small>
            </div>
          </div>
        </div>
      </section>

      <div className="service-ticker" aria-hidden="true">
        <div className="ticker-track"><span>Residential cleaning</span><b>✦</b><span>Commercial spaces</span><b>✦</b><span>Deep cleaning</span><b>✦</b><span>Move in & move out</span><b>✦</b><span>Recurring care</span><b>✦</b><span>Residential cleaning</span><b>✦</b><span>Commercial spaces</span><b>✦</b><span>Deep cleaning</span></div>
      </div>

      <section className="section services-section" id="services">
        <div className="shell">
          <div className="section-heading split-heading" data-reveal>
            <div><div className="eyebrow">Services designed around real life</div><h2 className="display-sm">One less thing<br/>on your <em>to-do list.</em></h2></div>
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
            <div className="arch-card arch-main"><span className="arch-big">98%</span><p>of recurring clients say they feel more relaxed after a Lumora clean.</p></div>
            <div className="arch-card arch-small"><Icon name="leaf" size={34}/><strong>Care in every detail</strong><span>People-safe options available</span></div>
            <div className="orbit-text"><span>DETAILS MATTER · CARE SHOWS · </span></div>
          </div>
          <div className="difference-copy" data-reveal>
            <div className="eyebrow light">The Lumora difference</div>
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
            <div className="eyebrow">See the Lumora standard</div>
            <h2 className="display-sm">The difference<br/>is in the <em>details.</em></h2>
            <p>Slide to explore a representative transformation. Every clean is guided by a detailed checklist and finished with a quality review.</p>
            <div className="result-stats"><div><strong>50+</strong><span>quality points checked</span></div><div><strong>100%</strong><span>carefully reviewed</span></div></div>
            <a href="#quote" className="button">Request your transformation <Icon name="arrow"/></a>
          </div>
          <div className="compare-card" data-reveal>
            <div className="compare-image after"><img src="/kitchen-after.webp" width="1400" height="1050" loading="lazy" decoding="async" alt="Bright kitchen after professional cleaning"/><span className="image-label">After</span></div>
            <div className="compare-image before" style={{ width: `${compare}%` }}><img src="/kitchen-before.webp" width="1400" height="1050" loading="lazy" decoding="async" alt="Kitchen before professional cleaning"/><span className="image-label">Before</span></div>
            <div className="compare-handle" style={{ left: `${compare}%` }}><span><Icon name="arrow" size={15}/><Icon name="arrow" size={15}/></span></div>
            <input aria-label="Compare before and after" type="range" min="8" max="92" value={compare} onChange={e => setCompare(Number(e.target.value))}/>
            <div className="compare-caption"><span>Drag to compare</span><strong>Kitchen reset · 2.5 hours</strong></div>
          </div>
        </div>
      </section>

      <section className="section concierge-section">
        <div className="concierge-glow"/><div className="shell concierge-grid">
          <div className="concierge-copy" data-reveal>
            <div className="eyebrow light"><span className="live-dot"/> Meet your 24/7 cleaning concierge</div>
            <h2 className="display-sm light-text">Questions answered.<br/><em>Bookings simplified.</em></h2>
            <p>Whether a visitor prefers to call or type, Lumora’s AI concierge can answer common questions, collect quote details, and help schedule the next step—day or night.</p>
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
                <div className="call-content"><div className="ai-avatar"><span/><span/><span/></div><small>Lumora AI concierge</small><h3>How can I help today?</h3><div className="waveform">{Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ "--h": `${12 + ((i * 17) % 32)}px`, "--d": `${i * 45}ms` } as React.CSSProperties}/>)}</div><p>“I’d like a quote for biweekly cleaning.”</p><div className="call-time">00:42</div></div>
                <div className="call-actions"><button><Icon name="message"/></button><button className="hangup"><Icon name="phone"/></button><button><Icon name="calendar"/></button></div>
              </div>
            ) : (
              <div className="chat-demo">
                <div className="chat-head"><div className="ai-avatar small"><span/><span/><span/></div><div><strong>Lumora Concierge</strong><small><i/> Online now</small></div><span>•••</span></div>
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
          <div className="membership-pattern"/><div className="membership-copy"><div className="eyebrow light">A home that stays ready</div><h2 className="display-sm light-text">Make clean your<br/><em>new normal.</em></h2><p>Recurring care means a familiar team, remembered preferences, priority scheduling, and one less thing to plan every week.</p><a href="#quote" className="button button-cream">Explore recurring care <Icon name="arrow"/></a></div>
          <div className="membership-benefits"><div><span><Icon name="calendar"/></span><strong>Priority scheduling</strong><p>Your preferred day, protected whenever possible.</p></div><div><span><Icon name="clock"/></span><strong>Time back, every week</strong><p>Consistent care that fits quietly into your routine.</p></div><div><span><Icon name="star"/></span><strong>Preferred client perks</strong><p>Easy add-ons and thoughtful seasonal touches.</p></div></div>
        </div>
      </section>

      <section className="section quote-section" id="quote">
        <div className="shell quote-grid">
          <div className="quote-copy" data-reveal><div className="eyebrow">Your cleaner space starts here</div><h2 className="display-sm">Tell us what<br/>would feel <em>lighter.</em></h2><p>Answer a few simple questions. We’ll use the details to prepare a personalized, no-pressure quote.</p><div className="quote-contact"><span><Icon name="phone"/></span><div><small>Prefer to talk?</small><strong>(555) 014-LUMORA</strong><p>Our concierge is available 24/7</p></div></div><div className="privacy-note"><Icon name="shield" size={18}/> Your information stays private and is only used to prepare your request.</div></div>
          <div className="quote-form-card" data-reveal>
            {submitted ? <div className="success-state"><span><Icon name="check" size={34}/></span><div className="eyebrow centered">Request received</div><h3>That was the first step.</h3><p>This is a demonstration flow. In the final site, the request can be sent to email, a CRM, or the AI concierge dashboard.</p><button className="button" onClick={() => {setSubmitted(false); setQuoteStep(1);}}>Start another request <Icon name="arrow"/></button></div> : <form onSubmit={submitQuote}>
              <div className="form-head"><div><small>Free quote request</small><strong>Step {quoteStep} of 3</strong></div><div className="form-progress"><i className={quoteStep >= 1 ? "active" : ""}/><i className={quoteStep >= 2 ? "active" : ""}/><i className={quoteStep >= 3 ? "active" : ""}/></div></div>
              {quoteStep === 1 && <fieldset><legend>What can we help you clean?</legend><p className="field-hint">Choose the option closest to what you need.</p><div className="choice-grid">{["Recurring home cleaning", "One-time deep clean", "Commercial space", "Move in / move out"].map((item, i) => <button type="button" className={service === item ? "choice active" : "choice"} onClick={() => setService(item)} key={item}><span><Icon name={(["home", "sparkles", "building", "key"] as IconName[])[i]}/></span>{item}<i><Icon name="check" size={15}/></i></button>)}</div><button type="button" className="button form-next" onClick={() => setQuoteStep(2)}>Continue <Icon name="arrow"/></button></fieldset>}
              {quoteStep === 2 && <fieldset><legend>Tell us about the space</legend><p className="field-hint">A few details help us shape the right plan.</p><div className="input-grid"><label>Bedrooms<select defaultValue="3"><option>Studio / none</option><option>1</option><option>2</option><option>3</option><option>4+</option></select></label><label>Bathrooms<select defaultValue="2"><option>1</option><option>2</option><option>3</option><option>4+</option></select></label><label className="full">ZIP code<input type="text" placeholder="e.g. 12345"/></label></div><div className="form-actions"><button type="button" className="back-button" onClick={() => setQuoteStep(1)}>Back</button><button type="button" className="button form-next" onClick={() => setQuoteStep(3)}>Continue <Icon name="arrow"/></button></div></fieldset>}
              {quoteStep === 3 && <fieldset><legend>Where should we send your quote?</legend><p className="field-hint">No spam. Just a personalized response about your request.</p><div className="input-grid"><label>First name<input required type="text" placeholder="Your name"/></label><label>Email<input required type="email" placeholder="you@email.com"/></label><label className="full">Phone number<input type="tel" placeholder="(555) 000-0000"/></label><label className="full">Anything else?<textarea placeholder={`Tell us more about your ${service.toLowerCase()} request…`}/></label></div><div className="form-actions"><button type="button" className="back-button" onClick={() => setQuoteStep(2)}>Back</button><button type="submit" className="button form-next">Request my free quote <Icon name="arrow"/></button></div></fieldset>}
            </form>}
          </div>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="shell faq-grid"><div className="faq-heading" data-reveal><div className="eyebrow">Good to know</div><h2 className="display-sm">Questions,<br/><em>beautifully simple.</em></h2><p>Still curious? Our team—or the 24/7 concierge—can help with anything not covered here.</p><button className="text-link" onClick={() => setChatOpen(true)}>Ask the concierge <Icon name="arrow" size={18}/></button></div><div className="faq-list" data-reveal>{faqs.map(([q,a], i) => <details key={q} open={i === 0}><summary><span>{String(i+1).padStart(2,"0")}</span>{q}<i>+</i></summary><p>{a}</p></details>)}</div></div>
      </section>

      <footer className="footer">
        <div className="shell footer-top"><div className="footer-brand"><a className="brand light-brand" href="#top"><span className="brand-mark"><i/><i/><i/></span><span><strong>LUMORA</strong><small>Cleaning Co.</small></span></a><p>Thoughtful cleaning for lighter living.</p><div className="socials"><a href="#" aria-label="Instagram"><Icon name="instagram"/></a><a href="#" aria-label="Facebook"><Icon name="facebook"/></a></div></div><div className="footer-links"><div><strong>Explore</strong><a href="#services">Services</a><a href="#difference">About us</a><a href="#results">Our results</a><a href="#reviews">Reviews</a></div><div><strong>Services</strong><a href="#services">Residential</a><a href="#services">Commercial</a><a href="#services">Deep cleaning</a><a href="#services">Move in / out</a></div><div><strong>Contact</strong><a href="tel:5550145866">(555) 014-LUMORA</a><a href="mailto:hello@lumoracleaning.com">hello@lumoracleaning.com</a><span>Mon–Fri · 8am–6pm</span><span>AI concierge · 24/7</span></div></div></div>
        <div className="shell footer-bottom"><span>© 2026 Lumora Cleaning Co. · Demonstration concept</span><div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Accessibility</a></div><span>Made with care ✦</span></div>
      </footer>

      <button className={chatOpen ? "floating-chat active" : "floating-chat"} onClick={() => setChatOpen(v => !v)} aria-label="Open AI concierge"><span className="live-dot"/><Icon name={chatOpen ? "close" : "message"}/><i>Ask Lumora</i></button>
      <div className={chatOpen ? "mini-chat open" : "mini-chat"} aria-hidden={!chatOpen}><div className="mini-chat-head"><div className="ai-avatar tiny"><span/><span/><span/></div><div><strong>Lumora Concierge</strong><small><i/> Ready to help</small></div><button onClick={() => setChatOpen(false)} aria-label="Close chat"><Icon name="close"/></button></div><div className="mini-chat-body"><div className="bubble ai">Hi! I can answer questions or help start your free quote. What would you like to know?</div><div className="quick-replies"><button onClick={() => {setChatOpen(false); document.querySelector("#quote")?.scrollIntoView({behavior:"smooth"});}}>Get a quote</button><button onClick={() => {setChatOpen(false); document.querySelector("#services")?.scrollIntoView({behavior:"smooth"});}}>View services</button></div></div><div className="mini-chat-input">Type a message… <button><Icon name="arrow"/></button></div></div>
    </main>
  );
}
