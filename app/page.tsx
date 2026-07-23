"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import ServiceAreaMap from "./ServiceAreaMap";
import { createLeadRequestId, submitLead } from "@/lib/lead-client";
import Turnstile from "./Turnstile";

/* eslint-disable @next/next/no-img-element -- vinext's current next/image client shim duplicates React hooks during hydration. */

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
  | "heart"
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
    heart: <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z"/>,
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

function mobileAssetPath(src: string) {
  return src.replace(/(\.[^.]+)$/, "-mobile$1");
}

function carePreviewPath(src: string, layout: "vertical" | "horizontal") {
  const name = src.replace(/^.*\//, "").replace(/\.[^.]+$/, "");
  return `/care-previews/${name}-${layout}.webp`;
}

function optimizedResultPath(src: string) {
  return src.replace(/\.jpeg$/i, ".webp");
}

const services = [
  { icon: "building" as IconName, number: "01", title: "Commercial spaces", copy: "Reliable cleaning that keeps offices, studios, and client-facing spaces ready for business.", meta: "Flexible · After-hours · Recurring" },
  { icon: "home" as IconName, number: "02", title: "Residential cleaning", copy: "A thoughtful, room-by-room clean tailored to your home, schedule, and routines.", meta: "Weekly · Biweekly · Monthly" },
  { icon: "sparkles" as IconName, number: "03", title: "Deep cleaning", copy: "A detailed reset for the areas that need extra care, from baseboards to overlooked corners.", meta: "Seasonal · One-time · Custom" },
  { icon: "key" as IconName, number: "04", title: "Move in & move out", copy: "Leave the old place spotless or arrive at a new home that already feels fresh and ready.", meta: "Apartments · Homes · Rentals" },
];

const faqs = [
  ["Do I need to be home during the cleaning?", "Not at all. Many clients provide secure access instructions, and our insured team handles the rest. We confirm arrival and completion so you always know what is happening."],
  ["Do you bring your own supplies?", "Yes. We arrive fully equipped with professional supplies and tools. If you prefer specific products or eco-friendly options, simply mention that in your estimate request."],
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

type ConciergeStep = "service" | "address" | "propertySize" | "fullName" | "phone" | "email" | "consent" | "complete";

type ConciergeMessage = {
  id: number;
  sender: "ai" | "user";
  text: string;
};

const initialQuoteDetails: QuoteDetails = {
  fullName: "",
  address: "",
  propertySize: "",
  phone: "",
  email: "",
};

const initialConciergeMessages: ConciergeMessage[] = [
  {
    id: 1,
    sender: "ai",
    text: "Hi! I can prepare your free estimate right here in our chat. First, which cleaning service do you need?",
  },
];

const conciergeStepOrder: ConciergeStep[] = ["service", "address", "propertySize", "fullName", "phone", "email", "consent", "complete"];

const conciergeInputConfig: Partial<Record<ConciergeStep, { label: string; placeholder: string; type: "text" | "number" | "tel" | "email"; autoComplete: string }>> = {
  address: { label: "Full service address", placeholder: "Street, City, State, ZIP", type: "text", autoComplete: "street-address" },
  propertySize: { label: "Approximate property size", placeholder: "e.g. 1800 sq ft", type: "number", autoComplete: "off" },
  fullName: { label: "Full name", placeholder: "Your full name", type: "text", autoComplete: "name" },
  phone: { label: "Phone number", placeholder: "(555) 000-0000", type: "tel", autoComplete: "tel" },
  email: { label: "Email address", placeholder: "you@email.com", type: "email", autoComplete: "email" },
};

const quoteSteps = [
  { label: "Service", title: "What would you like us to clean?", hint: "Choose one or more services. You can fine-tune the details with our team later." },
  { label: "Space", title: "Tell us about your space.", hint: "A little context helps us prepare a more accurate, thoughtful estimate." },
  { label: "Contact", title: "Where should we send your estimate?", hint: "No spam or pressure—just a personalized response about your request." },
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
    image: "/hero-commercial-man-5.webp",
    alt: "SparClean male professional in a black uniform and tan gloves cleaning a conference table in a modern office",
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
    image: "/hero-commercial-man-cart-tan-gloves.webp",
    alt: "SparClean male professional in a black uniform and tan gloves cleaning a conference table beside a service cart",
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
    image: "/hero-residential-woman-3.webp",
    alt: "SparClean female professional in a black uniform and tan gloves cleaning a dining table in a bright residential interior",
    width: 1122,
    height: 1402,
    position: "50% 50%",
    mobilePosition: "50% 48%",
    icon: "home" as IconName,
  },
] as const;

const clientCareSlides = [
  {
    id: "english-speaking",
    title: "English-speaking team",
    shortTitle: "English-speaking",
    copy: "From your first question to the final walkthrough, our team keeps every detail clear, friendly, and easy to understand.",
    image: "/care-english-speaking.webp",
    alt: "A smiling SparClean professional having a friendly conversation with a client in a bright home",
    icon: "language" as IconName,
  },
  {
    id: "pet-friendly",
    title: "Pet-friendly care",
    shortTitle: "Pet-friendly",
    copy: "We work calmly around your pets, keep supplies safely placed, and adapt our routine so they feel comfortable in their own space.",
    image: "/care-pet-friendly.webp",
    alt: "A SparClean professional cleaning carefully beside a relaxed golden retriever",
    icon: "paw" as IconName,
  },
  {
    id: "child-friendly",
    title: "Child-friendly cleaning",
    shortTitle: "Child-friendly",
    copy: "Thoughtful product placement and family-conscious routines help us care for busy, everyday spaces with children at home.",
    image: "/care-child-friendly.webp",
    alt: "A SparClean professional cleaning while a parent and child play safely nearby",
    icon: "family" as IconName,
  },
  {
    id: "senior-friendly",
    title: "Senior-friendly care",
    shortTitle: "Senior-friendly",
    copy: "Respectful routines, clear communication, and an unhurried approach help older adults feel comfortable while we care for their home.",
    image: "/care-senior-friendly.jpg",
    alt: "A smiling SparClean professional cleaning a bright living room while an older client relaxes comfortably nearby",
    icon: "heart" as IconName,
  },
] as const;

const clientReviews = [
  {
    title: "“It feels like a reset every time.”",
    copy: "The communication is excellent, the team remembers the little things, and the house always feels calm when I walk back in.",
    name: "Sarah M.",
    service: "Recurring home cleaning",
  },
  {
    title: "“Professional from start to finish.”",
    copy: "Booking was simple and the result exceeded expectations. Every surface in our office looked fresh without disrupting our team.",
    name: "David R.",
    service: "Commercial cleaning",
  },
  {
    title: "“They noticed what others missed.”",
    copy: "Our move-out clean was incredibly detailed. The process was clear, punctual, and completely stress-free.",
    name: "Amanda L.",
    service: "Move-out cleaning",
  },
  {
    title: "“Thoughtful around our pets.”",
    copy: "They took time to understand our routine, worked calmly around our dog, and left every room beautifully cared for.",
    name: "Melissa T.",
    service: "Deep home cleaning",
  },
  {
    title: "“The consistency is exceptional.”",
    copy: "Every biweekly visit is just as detailed as the first. Coming home after SparClean has become the best part of our week.",
    name: "Jordan K.",
    service: "Biweekly cleaning",
  },
  {
    title: "“Our workspace finally feels polished.”",
    copy: "The team works discreetly around our schedule and keeps our client-facing areas immaculate. The difference is immediately noticeable.",
    name: "Priya N.",
    service: "Recurring office care",
  },
  {
    title: "“We could settle in right away.”",
    copy: "Walking into a spotless home made moving day feel so much lighter. Every cabinet, surface, and corner was ready for us.",
    name: "Lauren B.",
    service: "Move-in cleaning",
  },
  {
    title: "“A remarkable final transformation.”",
    copy: "They handled the fine construction dust with incredible precision and turned the space into something truly presentation-ready.",
    name: "Michael R.",
    service: "Post-construction cleaning",
  },
] as const;

const transformationCaseCatalog = [
  {
    id: "styled-surface",
    title: "A polished finishing touch",
    room: "Living space",
    service: "Detail cleaning",
    copy: "Surface marks and everyday buildup give way to a clean, composed finish—captured honestly in the client’s own space.",
    note: "Original client photos · no artificial retouching.",
    aspect: "16 / 9",
    before: { src: "/results/living-space-detail-before.jpeg", width: 1600, height: 720, alt: "Decorative living-space surface with visible marks before professional detail cleaning" },
    after: { src: "/results/living-space-detail-after.jpeg", width: 1600, height: 720, alt: "The same decorative living-space surface clean and neatly arranged after professional detail cleaning" },
  },
  {
    id: "shower-niche",
    title: "Shower niche detail",
    room: "Bathroom",
    service: "Deep bathroom cleaning",
    copy: "A small, easily overlooked area becomes noticeably brighter once residue and buildup are carefully removed.",
    note: "A close-up that shows the value of meticulous detail work.",
    aspect: "3 / 4",
    before: { src: "/results/shower-niche-before.jpeg", width: 642, height: 856, alt: "Bathroom shower niche with visible residue before professional deep cleaning" },
    after: { src: "/results/shower-niche-after.jpeg", width: 642, height: 856, alt: "The same bathroom shower niche clean after professional deep cleaning" },
  },
  {
    id: "laundry-reset",
    title: "Behind-the-appliance reset",
    room: "Laundry area",
    service: "Deep cleaning",
    copy: "The hidden space behind an appliance is cleared of dust, debris, and buildup for a genuinely complete clean.",
    note: "The kind of care that reaches beyond visible surfaces.",
    aspect: "3 / 4",
    before: { src: "/results/laundry-appliance-area-before.jpeg", width: 1200, height: 1600, alt: "Floor behind a laundry appliance covered with debris before professional deep cleaning" },
    after: { src: "/results/laundry-appliance-area-after.jpeg", width: 1200, height: 1600, alt: "The same floor behind the laundry appliance clean and clear after professional deep cleaning" },
  },
  {
    id: "grill-side",
    title: "Outdoor grill restoration",
    room: "Outdoor kitchen",
    service: "Detailed appliance cleaning",
    copy: "Grease and weathered buildup are lifted from the grill’s side surfaces, restoring a crisp stainless-steel finish.",
    note: "A candid result with a clearly visible change in finish.",
    aspect: "9 / 16",
    before: { src: "/results/outdoor-grill-side-before.jpeg", width: 1080, height: 1920, alt: "Outdoor grill side surfaces with grease and buildup before detailed appliance cleaning" },
    after: { src: "/results/outdoor-grill-side-after.jpeg", width: 1080, height: 1920, alt: "The same outdoor grill side surfaces polished after detailed appliance cleaning" },
  },
  {
    id: "grill-front",
    title: "Grill front, renewed",
    room: "Outdoor kitchen",
    service: "Detailed appliance cleaning",
    copy: "The front view reveals the full transformation—from a dull, marked exterior to a bright and presentation-ready finish.",
    note: "A second viewpoint documents the complete appliance result.",
    aspect: "9 / 16",
    before: { src: "/results/outdoor-grill-front-before.jpeg", width: 1080, height: 1920, alt: "Outdoor grill front with grime and marks before detailed appliance cleaning" },
    after: { src: "/results/outdoor-grill-front-after.jpeg", width: 1080, height: 1920, alt: "The same outdoor grill front bright and polished after detailed appliance cleaning" },
  },
  {
    id: "cabinet-interior",
    title: "Cabinet interior care",
    room: "Kitchen storage",
    service: "Deep cleaning",
    copy: "Crumbs and residue are removed from the cabinet interior, leaving the space clean, dry, and ready to use again.",
    note: "Careful work in the places that are usually out of sight.",
    aspect: "9 / 16",
    before: { src: "/results/cabinet-interior-before.jpeg", width: 720, height: 1600, alt: "Kitchen cabinet interior with crumbs and residue before professional deep cleaning" },
    after: { src: "/results/cabinet-interior-after.jpeg", width: 720, height: 1600, alt: "The same kitchen cabinet interior clean after professional deep cleaning" },
  },
  {
    id: "shower-base",
    title: "Shower base revival",
    room: "Bathroom",
    service: "Deep bathroom cleaning",
    copy: "Dark buildup across the shower base is removed, revealing a visibly cleaner and brighter surface around the drain.",
    note: "A straightforward transformation with no staged lighting.",
    aspect: "9 / 16",
    before: { src: "/results/shower-base-before.jpeg", width: 1080, height: 1920, alt: "Bathroom shower base with dark buildup before professional deep cleaning" },
    after: { src: "/results/shower-base-after.jpeg", width: 720, height: 1600, alt: "The same bathroom shower base bright and clean after professional deep cleaning" },
  },
  {
    id: "oven-glass",
    title: "Oven glass clarity",
    room: "Kitchen",
    service: "Oven cleaning",
    copy: "Grease and cooked-on residue are cleared from the oven glass, bringing back its transparency and polished black frame.",
    note: "The door detail records the finish up close.",
    aspect: "3 / 4",
    before: { src: "/results/oven-glass-before.jpeg", width: 1536, height: 2048, alt: "Kitchen oven door glass with grease and cooked-on residue before professional cleaning" },
    after: { src: "/results/oven-glass-after.jpeg", width: 1536, height: 2048, alt: "The same kitchen oven glass clear and polished after professional cleaning" },
  },
  {
    id: "oven-interior",
    title: "Oven interior reset",
    room: "Kitchen",
    service: "Oven cleaning",
    copy: "The interior, racks, and oven floor are restored from heavy baked-on residue to a clean, even finish.",
    note: "A full-view record of the appliance interior.",
    aspect: "3 / 4",
    before: { src: "/results/oven-interior-before.jpeg", width: 1536, height: 2048, alt: "Kitchen oven interior with heavy baked-on residue before professional cleaning" },
    after: { src: "/results/oven-interior-after.jpeg", width: 1536, height: 2048, alt: "The same kitchen oven interior and racks clean after professional cleaning" },
  },
  {
    id: "freezer-reset",
    title: "Freezer reset",
    room: "Kitchen",
    service: "Refrigerator cleaning",
    copy: "The freezer is emptied, cleaned, and restored to a fresh, orderly interior ready for food storage.",
    note: "The original appliance details confirm the matching space.",
    aspect: "3 / 4",
    before: { src: "/results/freezer-before.jpeg", width: 1079, height: 1436, alt: "Kitchen freezer with clutter and visible residue before professional refrigerator cleaning" },
    after: { src: "/results/freezer-after.jpeg", width: 1079, height: 1440, alt: "The same kitchen freezer empty and clean after professional refrigerator cleaning" },
  },
  {
    id: "refrigerator-drawers",
    title: "Refrigerator drawer detail",
    room: "Kitchen",
    service: "Refrigerator cleaning",
    copy: "Built-up spills and residue around the drawer assembly are removed before every component is cleaned and returned.",
    note: "A close view makes the depth of cleaning easy to see.",
    aspect: "3 / 4",
    before: { src: "/results/refrigerator-drawers-before.jpeg", width: 1079, height: 1436, alt: "Kitchen refrigerator drawer area with spills and residue before professional cleaning" },
    after: { src: "/results/refrigerator-drawers-after.jpeg", width: 1079, height: 1440, alt: "The same kitchen refrigerator drawer area clean and reassembled after professional cleaning" },
  },
  {
    id: "glass-partition",
    title: "Glass, restored to clarity",
    room: "Bathroom",
    service: "Glass and shower cleaning",
    copy: "A cloudy glass partition is cleared of mineral film and residue, restoring visibility across the entire panel.",
    note: "The matching hinge and tile line preserve the original viewpoint.",
    aspect: "3 / 4",
    before: { src: "/results/bathroom-glass-before.jpeg", width: 1079, height: 1440, alt: "Cloudy bathroom glass partition with mineral film before professional cleaning" },
    after: { src: "/results/bathroom-glass-after.jpeg", width: 1079, height: 1440, alt: "The same bathroom glass partition clear after professional mineral buildup removal" },
  },
  {
    id: "stainless-sink",
    title: "Stainless-steel finish",
    room: "Kitchen",
    service: "Detailed kitchen cleaning",
    copy: "Water marks and residue are removed from the sink, leaving the basin and fixtures with a clean, even sheen.",
    note: "Natural reflections show the true finish of the steel.",
    aspect: "3 / 4",
    before: { src: "/results/stainless-sink-before.jpeg", width: 1079, height: 1436, alt: "Kitchen stainless-steel sink with water marks before professional detail cleaning" },
    after: { src: "/results/stainless-sink-after.jpeg", width: 1079, height: 1436, alt: "The same kitchen stainless-steel sink polished after professional detail cleaning" },
  },
  {
    id: "appliance-floor",
    title: "The space beneath",
    room: "Kitchen appliance area",
    service: "Deep cleaning",
    copy: "Once the appliance is moved, embedded debris is removed from the floor and edges for a complete, hygienic reset.",
    note: "Proof that hidden areas receive the same level of care.",
    aspect: "3 / 4",
    before: { src: "/results/appliance-floor-before.jpeg", width: 1200, height: 1600, alt: "Floor beneath a kitchen appliance covered with debris before professional deep cleaning" },
    after: { src: "/results/appliance-floor-after.jpeg", width: 1200, height: 1600, alt: "The same floor beneath the kitchen appliance clean and clear after professional deep cleaning" },
  },
  {
    id: "toilet-detail",
    title: "Bathroom detail restored",
    room: "Bathroom",
    service: "Detailed bathroom cleaning",
    copy: "Visible staining inside the bowl is removed, leaving a clean and refreshed finish throughout the fixture.",
    note: "A direct client photo with an unmistakable result.",
    aspect: "9 / 16",
    before: { src: "/results/toilet-detail-before.jpeg", width: 921, height: 2048, alt: "Bathroom toilet bowl with visible staining before professional detail cleaning" },
    after: { src: "/results/toilet-detail-after.jpeg", width: 1080, height: 1687, alt: "The same bathroom toilet bowl clean after professional detail cleaning" },
  },
  {
    id: "stovetop-restoration",
    title: "Stovetop restoration",
    room: "Kitchen",
    service: "Deep appliance cleaning",
    copy: "Heavy grease and cooked-on buildup are removed across the burners, controls, and stainless surface for a dramatic final reveal.",
    note: "One of the collection’s strongest transformations.",
    aspect: "4 / 3",
    before: { src: "/results/stovetop-before.jpeg", width: 640, height: 480, alt: "Kitchen stovetop covered with heavy grease and cooked-on buildup before professional deep cleaning" },
    after: { src: "/results/stovetop-after.jpeg", width: 1600, height: 1200, alt: "The same kitchen stovetop clean and polished after professional deep cleaning" },
  },
] as const;

const transformationCases = [
  transformationCaseCatalog[transformationCaseCatalog.length - 1],
  ...transformationCaseCatalog.slice(1, -1),
  transformationCaseCatalog[0],
];

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
  const [clientCareIndex, setClientCareIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [transformationIndex, setTransformationIndex] = useState(0);
  const [compare, setCompare] = useState(50);
  const [aiMode, setAiMode] = useState<"voice" | "chat">("voice");
  const [chatOpen, setChatOpen] = useState(false);
  const [conciergeStep, setConciergeStep] = useState<ConciergeStep>("service");
  const [conciergeMessages, setConciergeMessages] = useState<ConciergeMessage[]>(() => [...initialConciergeMessages]);
  const [conciergeInput, setConciergeInput] = useState("");
  const [conciergeError, setConciergeError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [leadReference, setLeadReference] = useState("");
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [conciergeSubmitting, setConciergeSubmitting] = useState(false);
  const [quoteTurnstileToken, setQuoteTurnstileToken] = useState("");
  const [conciergeTurnstileToken, setConciergeTurnstileToken] = useState("");
  const [quoteTurnstileReset, setQuoteTurnstileReset] = useState(0);
  const [conciergeTurnstileReset, setConciergeTurnstileReset] = useState(0);
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
  const conciergeLogRef = useRef<HTMLDivElement>(null);
  const conciergeInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroTouchStartRef = useRef<number | null>(null);
  const transformationTouchStartRef = useRef<number | null>(null);
  const quoteIdempotencyRef = useRef<string | null>(null);
  const conciergeIdempotencyRef = useRef<string | null>(null);

  const activeHero = heroSlides[heroIndex];
  const activeTransformation = transformationCases[transformationIndex];
  const conciergeProgressIndex = conciergeStepOrder.indexOf(conciergeStep);
  const activeConciergeInput = conciergeInputConfig[conciergeStep];
  const heroAutoplayPaused = heroPaused || heroHoverPaused || heroFocusPaused || !heroInView || !heroPageVisible || heroReducedMotion;

  function selectHeroSlide(index: number) {
    const nextIndex = (index + heroSlides.length) % heroSlides.length;
    setHeroIndex(nextIndex);
    setHeroAnnouncement(`${heroSlides[nextIndex].label}, slide ${nextIndex + 1} of ${heroSlides.length}.`);
  }

  function moveHero(direction: -1 | 1) {
    selectHeroSlide(heroIndex + direction);
  }

  function moveTransformation(direction: -1 | 1) {
    setTransformationIndex(current => (current + direction + transformationCases.length) % transformationCases.length);
  }

  function toggleCleaningType(type: string) {
    setCleaningTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    setFormError("");
  }

  function updateQuoteDetail(field: keyof QuoteDetails, value: string) {
    setQuoteDetails(prev => ({ ...prev, [field]: value }));
    setFormError("");
  }

  function addConciergeExchange(userText: string, aiText: string, nextStep: ConciergeStep) {
    setConciergeMessages(current => [
      ...current,
      { id: current.length + 1, sender: "user", text: userText },
      { id: current.length + 2, sender: "ai", text: aiText },
    ]);
    setConciergeStep(nextStep);
    setConciergeInput("");
    setConciergeError("");
    window.setTimeout(() => conciergeInputRef.current?.focus(), 0);
  }

  function continueConciergeServices() {
    if (cleaningTypes.length === 0) {
      setConciergeError("Choose at least one service to continue.");
      return;
    }
    addConciergeExchange(
      cleaningTypes.join(" · "),
      "Perfect. What is the full address where you would like the cleaning?",
      "address",
    );
  }

  function submitConciergeInput(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = conciergeInput.trim();
    if (!value) {
      setConciergeError("Please enter your answer to continue.");
      return;
    }

    if (conciergeStep === "address") {
      if (value.length < 5) {
        setConciergeError("Please enter the complete service address.");
        return;
      }
      updateQuoteDetail("address", value);
      addConciergeExchange(value, "About how many square feet is the property? An estimate is perfectly fine.", "propertySize");
      return;
    }

    if (conciergeStep === "propertySize") {
      const propertySize = Number(value.replace(/[^\d.]/g, ""));
      if (!Number.isFinite(propertySize) || propertySize < 1) {
        setConciergeError("Enter an approximate property size greater than zero.");
        return;
      }
      const normalizedSize = String(Math.round(propertySize));
      updateQuoteDetail("propertySize", normalizedSize);
      addConciergeExchange(`${Number(normalizedSize).toLocaleString()} sq ft`, "Thank you. What is your full name?", "fullName");
      return;
    }

    if (conciergeStep === "fullName") {
      if (value.length < 2) {
        setConciergeError("Please enter your full name.");
        return;
      }
      updateQuoteDetail("fullName", value);
      addConciergeExchange(value, `Nice to meet you, ${value.split(" ")[0]}. What is the best phone number for our follow-up?`, "phone");
      return;
    }

    if (conciergeStep === "phone") {
      if (value.replace(/\D/g, "").length < 7) {
        setConciergeError("Please enter a valid phone number.");
        return;
      }
      updateQuoteDetail("phone", value);
      addConciergeExchange(value, "And which email address should we use for your estimate?", "email");
      return;
    }

    if (conciergeStep === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setConciergeError("Please enter a valid email address.");
        return;
      }
      updateQuoteDetail("email", value);
      addConciergeExchange(value, "One last step: review and accept our Terms of Use and Company Policies.", "consent");
    }
  }

  async function completeConciergeEstimate() {
    if (!termsAccepted || !policyAccepted) {
      setConciergeError("Please accept both confirmations to complete your request.");
      return;
    }

    const userConfirmation = "Terms and company policies accepted.";
    const completionMessage = `Perfect, ${quoteDetails.fullName}. Your request has been securely received. The SparClean team can now follow up by phone or email.`;
    const transcript = [
      ...conciergeMessages.map(({ sender, text }) => ({ sender, text })),
      { sender: "user" as const, text: userConfirmation },
      { sender: "ai" as const, text: completionMessage },
    ];

    setConciergeSubmitting(true);
    setConciergeError("");
    try {
      conciergeIdempotencyRef.current ??= createLeadRequestId();
      const result = await submitLead({
        source: "website_chat",
        idempotencyKey: conciergeIdempotencyRef.current,
        ...quoteDetails,
        propertySize: Number(quoteDetails.propertySize),
        services: cleaningTypes,
        termsAccepted,
        policyAccepted,
        transcript,
        turnstileToken: conciergeTurnstileToken,
      });
      setLeadReference(result.reference);
      addConciergeExchange(userConfirmation, completionMessage, "complete");
    } catch (error) {
      setConciergeError(error instanceof Error ? error.message : "We could not send your request. Please try again.");
      setConciergeTurnstileToken("");
      setConciergeTurnstileReset(current => current + 1);
    } finally {
      setConciergeSubmitting(false);
    }
  }

  function resetConcierge() {
    resetQuote();
    setConciergeStep("service");
    setConciergeMessages([...initialConciergeMessages]);
    setConciergeInput("");
    setConciergeError("");
    setConciergeSubmitting(false);
    setConciergeTurnstileToken("");
    setConciergeTurnstileReset(current => current + 1);
    conciergeIdempotencyRef.current = null;
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
    setLeadReference("");
    setQuoteSubmitting(false);
    setQuoteTurnstileToken("");
    setQuoteTurnstileReset(current => current + 1);
    setQuoteStep(1);
    setQuoteDetails(initialQuoteDetails);
    setCleaningTypes([]);
    setTermsAccepted(false);
    setPolicyAccepted(false);
    setFormError("");
    quoteIdempotencyRef.current = null;
  }

  useEffect(() => {
    if (!chatOpen) return;
    const log = conciergeLogRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [chatOpen, conciergeMessages, conciergeStep]);

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

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
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

    setQuoteSubmitting(true);
    setFormError("");
    try {
      quoteIdempotencyRef.current ??= createLeadRequestId();
      const result = await submitLead({
        source: "website_form",
        idempotencyKey: quoteIdempotencyRef.current,
        ...quoteDetails,
        propertySize: Number(quoteDetails.propertySize),
        services: cleaningTypes,
        termsAccepted,
        policyAccepted,
        turnstileToken: quoteTurnstileToken,
      });
      setLeadReference(result.reference);
      setSubmitted(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "We could not send your request. Please try again.");
      setQuoteTurnstileToken("");
      setQuoteTurnstileReset(current => current + 1);
    } finally {
      setQuoteSubmitting(false);
    }
  }

  return (
    <main id="main-content" className={heroInView ? "hero-visible" : ""}>
      <div className="announcement">
        <div className="shell announcement-inner">
          <span><Icon name="sparkles" size={15}/> The SparClean Signature Standard · Meticulous care, beautifully delivered</span>
          <a href="#estimate">Request a private estimate <Icon name="arrow" size={16}/></a>
        </div>
      </div>

      <header className="site-header">
        <div className="shell nav-wrap">
          <a className="brand" href="#top" aria-label="SparClean home">
            <img className="brand-logo" src="/sparclean-logo-220.webp" width="220" height="42" fetchPriority="high" decoding="async" alt="SparClean"/>
          </a>
          <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Main navigation">
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#areas" onClick={() => setMenuOpen(false)}>Areas</a>
            <a href="#results" onClick={() => setMenuOpen(false)}>Results</a>
            <a href="#reviews" onClick={() => setMenuOpen(false)}>Reviews</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          </nav>
          <a className="button button-small header-cta" href="#estimate">Request an estimate <Icon name="arrow" size={18}/></a>
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
              <a className="button" href="#estimate">Request a tailored estimate <Icon name="arrow"/></a>
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
                {[activeHero].map((slide) => (
                  <div
                    className="hero-slide active"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${heroIndex + 1} of ${heroSlides.length}: ${slide.kicker}`}
                    key={slide.id}
                  >
                    <picture>
                      <source media="(max-width: 600px)" srcSet={mobileAssetPath(slide.image)}/>
                    <img
                      src={slide.image}
                      width={slide.width}
                      height={slide.height}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      style={{
                        "--hero-position": slide.position,
                        "--hero-mobile-position": slide.mobilePosition,
                      } as React.CSSProperties}
                      alt={slide.alt}
                    />
                    </picture>
                  </div>
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
                      aria-label={`0${index + 1} — Go to slide ${index + 1}: ${slide.kicker}`}
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

      <section className="client-differentials" aria-labelledby="client-care-title">
        <div className="shell client-care-layout">
          <header className="client-care-intro">
            <div className="eyebrow">The SparClean difference</div>
            <h2 id="client-care-title">Considered care,<br/><em>made personal.</em></h2>
            <p>Every household moves differently. Explore the thoughtful details we build into every visit.</p>
            <div className="client-care-position" aria-hidden="true">
              <strong>{String(clientCareIndex + 1).padStart(2, "0")}</strong><span>/ {String(clientCareSlides.length).padStart(2, "0")}</span>
            </div>
          </header>

          <div className="client-care-carousel" aria-label="Our client care promises">
            {clientCareSlides.map((slide, index) => {
              const active = index === clientCareIndex;
              return (
                <article className={`client-care-panel${active ? " active" : ""}`} data-care-slide={slide.id} key={slide.id}>
                  <button
                    className="client-care-trigger"
                    type="button"
                    id={`client-care-tab-${slide.id}`}
                    aria-expanded={active}
                    aria-controls={`client-care-panel-${slide.id}`}
                    onClick={() => setClientCareIndex(index)}
                    onKeyDown={(event) => {
                      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
                      event.preventDefault();
                      const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
                      const next = (index + direction + clientCareSlides.length) % clientCareSlides.length;
                      setClientCareIndex(next);
                      document.getElementById(`client-care-tab-${clientCareSlides[next].id}`)?.focus();
                    }}
                  >
                    <span className="client-care-trigger-preview" aria-hidden="true">
                      <picture>
                        <source media="(max-width: 720px)" srcSet={carePreviewPath(slide.image, "horizontal")}/>
                        <img src={carePreviewPath(slide.image, "vertical")} alt={`Preview: ${slide.alt}`} width="260" height="620" loading="lazy" decoding="async"/>
                      </picture>
                    </span>
                    <span className="client-care-trigger-icon"><Icon name={slide.icon} size={20}/></span>
                    <span className="client-care-trigger-title">{slide.shortTitle}</span>
                    <span className="sr-only">{slide.title}</span>
                    <span className="client-care-trigger-mark" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  </button>

                  <div
                    className="client-care-media"
                    id={`client-care-panel-${slide.id}`}
                    role="region"
                    aria-labelledby={`client-care-tab-${slide.id}`}
                    hidden={!active}
                  >
                    {active && (
                      <>
                      <picture>
                        <source media="(max-width: 720px)" srcSet={mobileAssetPath(slide.image)}/>
                        <img src={slide.image} alt={slide.alt} width="1200" height="800" loading="lazy" decoding="async"/>
                      </picture>
                      <div className="client-care-caption">
                        <span>The SparClean standard</span>
                        <h3>{slide.title}</h3>
                        <p>{slide.copy}</p>
                      </div>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <span className="sr-only" aria-live="polite">{clientCareSlides[clientCareIndex].title} selected</span>
        </div>
      </section>

      <section className="section quote-section" id="estimate">
        <div className="shell quote-grid">
          <div className="quote-copy" data-reveal>
            <div className="eyebrow">A service tailored to your space</div>
            <h2 className="display-sm">Your standard of clean,<br/><em>beautifully elevated.</em></h2>
            <p>Share a few details and we’ll prepare a considered, no-pressure proposal for your home or business.</p>
            <div className="quote-highlights">
              <div><span><Icon name="clock" size={19}/></span><p><strong>About 2 minutes</strong><small>Four simple, guided steps</small></p></div>
              <div><span><Icon name="shield" size={19}/></span><p><strong>No obligation</strong><small>A thoughtful estimate, never pressure</small></p></div>
            </div>
            <div className="quote-contact"><span><Icon name="phone"/></span><div><small>Prefer to talk?</small><strong><a href="tel:+19165460021">(916) 546-0021</a></strong><p>Our concierge is available 24/7</p></div></div>
            <div className="privacy-note"><Icon name="shield" size={18}/> Your information stays private and is only used to prepare your request.</div>
          </div>
          <div className="quote-form-card" data-reveal>
            {submitted ? (
              <div className="success-state" role="status" aria-live="polite">
                <span><Icon name="check" size={34}/></span>
                <div className="eyebrow centered">Request received</div>
                <h3>Your estimate request is safely with us.</h3>
                <p>The SparClean team can now review your details and follow up by phone or email. Keep reference <strong>{leadReference}</strong> for your records.</p>
                <button className="button" onClick={resetQuote}>Start another request <Icon name="arrow"/></button>
              </div>
            ) : (
              <form ref={quoteFormRef} onSubmit={submitQuote} noValidate>
                <div className="form-head">
                  <div><small>Free estimate request</small><strong>{quoteSteps[quoteStep - 1].label}</strong></div>
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
                  <div className="quote-progress-track" role="progressbar" aria-label="Estimate request progress" aria-valuemin={1} aria-valuemax={4} aria-valuenow={quoteStep}>
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
                      <div className="form-note privacy"><span><Icon name="shield" size={19}/></span><p><strong>Your details stay private.</strong><small>We only use them to prepare and follow up on your estimate.</small></p></div>
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

                  {quoteStep === 4 && <Turnstile key={quoteTurnstileReset} action="estimate_form" onToken={setQuoteTurnstileToken}/>}

                  {formError && <div className="form-error" id="quote-form-error" role="alert"><Icon name="message" size={17}/><span>{formError}</span></div>}

                  <div className={quoteStep === 1 ? "form-actions first-step" : "form-actions"}>
                    {quoteStep > 1 ? <button type="button" className="back-button" onClick={() => changeQuoteStep(quoteStep - 1)}><Icon name="arrow" size={17}/> Back</button> : <span className="form-security"><Icon name="shield" size={16}/> No payment required</span>}
                    {quoteStep < 4 ? <button type="button" className="button form-next" onClick={advanceQuoteStep}>Continue <Icon name="arrow"/></button> : <button type="submit" className="button form-next" disabled={quoteSubmitting}>{quoteSubmitting ? "Sending securely…" : "Request my free estimate"} <Icon name="arrow"/></button>}
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
            <div className="heading-aside"><p>From weekly home care to detailed commercial cleaning, every service is shaped around your space—not a generic checklist.</p><a className="text-link" href="#estimate">Build your cleaning plan <Icon name="arrow" size={18}/></a></div>
          </div>
          <div className="service-grid">
            {services.map((item, index) => (
              <article className="service-card" data-reveal style={{ "--delay": `${index * 80}ms` } as React.CSSProperties} key={item.title}>
                <div className="service-top"><span className="service-icon"><Icon name={item.icon} size={25}/></span><span className="service-number">{item.number}</span></div>
                <h3>{item.title}</h3><p>{item.copy}</p><small>{item.meta}</small>
                <a href="#estimate" aria-label={`Request ${item.title}`}><Icon name="arrow"/></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-section" id="about" aria-labelledby="about-title">
        <div className="about-glow about-glow-one" aria-hidden="true"/>
        <div className="about-glow about-glow-two" aria-hidden="true"/>
        <div className="shell about-grid">
          <header className="about-heading" data-reveal>
            <div className="eyebrow">SparClean Cleaning Services LLC</div>
            <h2 className="display-sm" id="about-title">About <em>Us</em></h2>
            <p className="about-welcome">Thank you for considering SparClean Cleaning Services LLC.</p>
            <div className="about-signature" aria-hidden="true"><span>SC</span><i/></div>
          </header>

          <article className="about-story" data-reveal>
            <p className="about-lead">We are a locally owned residential and commercial cleaning company proudly serving Sacramento and surrounding areas. We specialize in delivering a refined, high-standard cleaning experience for clients who value excellence, discretion, and consistency.</p>

            <div className="about-columns">
              <div data-chapter="01">
                <p>Our company is fully insured, and every member of our team is background-checked, carefully selected, and extensively trained. Our services are performed by dedicated teams of two to three professionals, allowing us to work efficiently while maintaining exceptional attention to detail.</p>
                <p>We use professional-grade equipment and premium cleaning products to deliver outstanding results. Homeowners are kindly asked to provide one roll of paper towels and trash bags. If you prefer that we use your own cleaning products, we are happy to accommodate; however, results may vary depending on the quality of the products provided. Please leave them on the kitchen countertop or provide clear instructions.</p>
              </div>
              <div data-chapter="02">
                <p>Our teams arrive in uniform, wearing gloves and masks at all times. Shoe covers are always worn to help protect your floors and keep your home clean throughout the service. We never send inexperienced cleaners into our clients&apos; homes. Our reputation is built on precision, professionalism, integrity, and trust, and we proudly uphold a consistent 5-star standard of service.</p>
                <p>To maintain this level of quality, we intentionally accept a limited number of recurring clients, with availability for weekly, bi-weekly, or monthly cleaning services.</p>
              </div>
            </div>

            <p className="about-closing"><Icon name="sparkles" size={22}/> <span>Spend your time with your family doing what you love. Let us take care of your home while you enjoy the moments that matter most.</span></p>
          </article>
        </div>
      </section>

      <ServiceAreaMap/>

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
            <a href="#estimate" className="button">Request your transformation <Icon name="arrow"/></a>
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

      <section className="section transformation-gallery-section" aria-labelledby="transformation-gallery-title">
        <div className="shell">
          <div className="transformation-gallery-heading" data-reveal>
            <div>
              <div className="eyebrow">Real spaces · Honest results</div>
              <h2 className="display-sm" id="transformation-gallery-title">Every transformation,<br/><em>beautifully framed.</em></h2>
            </div>
            <p>Client photos do not need to feel like campaign photography. A consistent crop, quiet matte frame, and a little context let the result speak for itself.</p>
          </div>

          <div
            className="transformation-gallery"
            data-reveal
            role="region"
            aria-roledescription="carousel"
            aria-label="Client before and after cleaning gallery"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              moveTransformation(event.key === "ArrowRight" ? 1 : -1);
            }}
            onTouchStart={(event) => { transformationTouchStartRef.current = event.touches[0]?.clientX ?? null; }}
            onTouchEnd={(event) => {
              if (transformationTouchStartRef.current === null) return;
              const distance = event.changedTouches[0].clientX - transformationTouchStartRef.current;
              transformationTouchStartRef.current = null;
              if (Math.abs(distance) > 48) moveTransformation(distance < 0 ? 1 : -1);
            }}
          >
            <div className="transformation-photo-pair" key={activeTransformation.id}>
              <figure className="transformation-photo-frame before">
                <div className="transformation-photo-media" style={{ "--photo-image": `url("${optimizedResultPath(activeTransformation.before.src)}")` } as React.CSSProperties}>
                  <img
                    src={optimizedResultPath(activeTransformation.before.src)}
                    width={activeTransformation.before.width}
                    height={activeTransformation.before.height}
                    loading="lazy"
                    decoding="async"
                    alt={activeTransformation.before.alt}
                  />
                </div>
                <figcaption className="transformation-photo-label"><span>Before</span><small>Original condition</small></figcaption>
              </figure>
              <figure className="transformation-photo-frame after">
                <div className="transformation-photo-media" style={{ "--photo-image": `url("${optimizedResultPath(activeTransformation.after.src)}")` } as React.CSSProperties}>
                  <img
                    src={optimizedResultPath(activeTransformation.after.src)}
                    width={activeTransformation.after.width}
                    height={activeTransformation.after.height}
                    loading="lazy"
                    decoding="async"
                    alt={activeTransformation.after.alt}
                  />
                </div>
                <figcaption className="transformation-photo-label"><span>After</span><small>SparClean finish</small></figcaption>
              </figure>
            </div>

            <aside className="transformation-case-note" aria-live="polite">
              <span className="transformation-case-number">Transformation {String(transformationIndex + 1).padStart(2, "0")} <i/> {String(transformationCases.length).padStart(2, "0")}</span>
              <h3>{activeTransformation.title}</h3>
              <p>{activeTransformation.copy}</p>
              <dl>
                <div><dt>Space</dt><dd>{activeTransformation.room}</dd></div>
                <div><dt>Service</dt><dd>{activeTransformation.service}</dd></div>
              </dl>
              <div className="transformation-photo-guidance"><Icon name="star" size={16}/><span>{activeTransformation.note}</span></div>
              <div className="transformation-gallery-arrows">
                <button type="button" className="previous" aria-label="Show previous transformation" onClick={() => moveTransformation(-1)}><Icon name="arrow" size={17}/></button>
                <button type="button" aria-label="Show next transformation" onClick={() => moveTransformation(1)}><Icon name="arrow" size={17}/></button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section concierge-section">
        <div className="concierge-glow"/><div className="shell concierge-grid">
          <div className="concierge-copy" data-reveal>
            <div className="eyebrow light"><span className="live-dot"/> One estimate · every channel</div>
            <h2 className="display-sm light-text">One conversation.<br/><em>One complete estimate.</em></h2>
            <p>Whether a client starts with the form, website chat, or a phone call, the SparClean concierge follows the same guided intake and prepares one consistent estimate request for your team.</p>
            <div className="mode-toggle" role="group" aria-label="Concierge demo mode">
              <button className={aiMode === "voice" ? "active" : ""} onClick={() => setAiMode("voice")}><Icon name="phone" size={17}/> Voice assistant</button>
              <button className={aiMode === "chat" ? "active" : ""} onClick={() => setAiMode("chat")}><Icon name="message" size={17}/> Website chat</button>
            </div>
            <ul className="feature-checks"><li><Icon name="check" size={17}/> Service type and cleaning needs</li><li><Icon name="check" size={17}/> Full address and approximate property size</li><li><Icon name="check" size={17}/> Name, phone, email, and required confirmations</li></ul>
            <small className="demo-note">One shared intake flow · form, chat, and voice</small>
          </div>
          <div className="concierge-demo" data-reveal>
            {aiMode === "voice" ? (
              <div className="phone-demo">
                <div className="phone-top"><span>9:41</span><div/><span>•••</span></div>
                <div className="call-content"><div className="ai-avatar"><span/><span/><span/></div><small>SparClean estimate concierge</small><h3>Let’s prepare your estimate.</h3><div className="waveform">{Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ "--h": `${12 + ((i * 17) % 32)}px`, "--d": `${i * 45}ms` } as React.CSSProperties}/>)}</div><p>“Recurring cleaning for my home in Folsom. It’s about 1,800 square feet.”</p><div className="call-time">00:42</div></div>
                <div className="call-actions"><button aria-label="Open message options"><Icon name="message"/></button><button className="hangup" aria-label="End demonstration call"><Icon name="phone"/></button><button aria-label="Open scheduling options"><Icon name="calendar"/></button></div>
              </div>
            ) : (
              <div className="chat-demo">
                <div className="chat-head"><div className="ai-avatar small"><span/><span/><span/></div><div><strong>SparClean Concierge</strong><small><i/> Online now</small></div><span>•••</span></div>
                <div className="chat-body"><div className="chat-date">Today · 9:41 AM</div><div className="bubble ai">Hi! I can prepare the same free estimate available in our website form. Which cleaning service do you need?</div><div className="bubble user">Recurring cleaning for my home.</div><div className="bubble ai">Great. Next I’ll confirm the full address, approximate size, and your name, phone, and email for follow-up. ✦</div><div className="typing"><i/><i/><i/></div></div>
                <div className="chat-input">Tell us what you need… <button aria-label="Send message"><Icon name="arrow"/></button></div>
              </div>
            )}
            <div className="automation-card"><span><Icon name="check"/></span><div><small>One intake · every channel</small><strong>Estimate request in progress</strong></div><em>Just now</em></div>
          </div>
        </div>
      </section>

      <section className="section reviews-section" id="reviews">
        <div className="shell">
          <div className="reviews-top" data-reveal><div><div className="eyebrow">Kind words from clean spaces</div><h2 className="display-sm">Trusted in the homes<br/><em>that matter most.</em></h2></div><div className="google-score"><span className="google-g">G</span><div><div className="big-stars">★★★★★</div><strong>4.9 from local clients</strong><small>Google reviews integration</small></div></div></div>
          <div
            className="review-slider"
            data-reveal
            role="region"
            aria-roledescription="carousel"
            aria-label="Client reviews"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              setReviewIndex(current => (current + (event.key === "ArrowRight" ? 1 : -1) + clientReviews.length) % clientReviews.length);
            }}
          >
            <div className="review-stage" aria-live="polite">
              <article className="review-card review-card-featured" key={clientReviews[reviewIndex].name}>
                <div className="review-feature-copy">
                  <div className="review-card-top"><span className="big-stars">★★★★★</span><Icon name="quote" size={42}/></div>
                  <h3>{clientReviews[reviewIndex].title}</h3>
                  <p>{clientReviews[reviewIndex].copy}</p>
                </div>
                <div className="review-feature-meta">
                  <span className="review-slide-count">{String(reviewIndex + 1).padStart(2, "0")} <i>/ {String(clientReviews.length).padStart(2, "0")}</i></span>
                  <div className="reviewer"><span>{clientReviews[reviewIndex].name.split(" ").map(x => x[0]).join("")}</span><div><strong>{clientReviews[reviewIndex].name}</strong><small>{clientReviews[reviewIndex].service} · Verified</small></div></div>
                </div>
              </article>
            </div>
            <div className="review-controls">
              <div className="review-pagination" role="tablist" aria-label="Choose a review">
                {clientReviews.map((review, index) => <button key={review.name} type="button" className={index === reviewIndex ? "active" : ""} role="tab" aria-selected={index === reviewIndex} aria-label={`Show review ${index + 1} from ${review.name}`} onClick={() => setReviewIndex(index)}><span>{String(index + 1).padStart(2, "0")}</span></button>)}
              </div>
              <div className="review-arrows">
                <button type="button" className="previous" aria-label="Show previous review" onClick={() => setReviewIndex(current => (current - 1 + clientReviews.length) % clientReviews.length)}><Icon name="arrow" size={18}/></button>
                <button type="button" aria-label="Show next review" onClick={() => setReviewIndex(current => (current + 1) % clientReviews.length)}><Icon name="arrow" size={18}/></button>
              </div>
            </div>
          </div>
          <p className="placeholder-disclosure">Demonstration testimonials and ratings — replace with verified Google Business reviews before launch.</p>
        </div>
      </section>

      <section className="membership-section">
        <div className="shell membership-card" data-reveal>
          <div className="membership-pattern"/><div className="membership-copy"><div className="eyebrow light">SparClean Signature Care</div><h2 className="display-sm light-text">An immaculate home.<br/><em>Beautifully effortless.</em></h2><p>Recurring care means a familiar team, remembered preferences, priority scheduling, and an exceptional standard maintained quietly, week after week.</p><a href="#estimate" className="button button-cream">Discover signature care <Icon name="arrow"/></a></div>
          <div className="membership-benefits"><div><span><Icon name="calendar"/></span><strong>Priority scheduling</strong><p>Your preferred day, protected whenever possible.</p></div><div><span><Icon name="clock"/></span><strong>Time back, every week</strong><p>Consistent care that fits quietly into your routine.</p></div><div><span><Icon name="star"/></span><strong>Preferred client perks</strong><p>Easy add-ons and thoughtful seasonal touches.</p></div></div>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="shell faq-grid"><div className="faq-heading" data-reveal><div className="eyebrow">Good to know</div><h2 className="display-sm">Questions,<br/><em>beautifully simple.</em></h2><p>Still curious? Our team—or the 24/7 concierge—can help with anything not covered here.</p><button className="text-link" onClick={() => setChatOpen(true)}>Ask the concierge <Icon name="arrow" size={18}/></button></div><div className="faq-list" data-reveal>{faqs.map(([q,a], i) => <details key={q} open={i === 0}><summary><span>{String(i+1).padStart(2,"0")}</span>{q}<i>+</i></summary><p>{a}</p></details>)}</div></div>
      </section>

      <footer className="footer">
        <div className="shell footer-top"><div className="footer-brand"><a className="brand light-brand" href="#top" aria-label="SparClean home"><img className="brand-logo" src="/sparclean-logo-220.webp" width="220" height="42" loading="lazy" decoding="async" alt="SparClean"/></a><p>Luxury is having one less thing to worry about.</p><div className="socials"><a href="#" aria-label="Instagram"><Icon name="instagram"/></a><a href="#" aria-label="Facebook"><Icon name="facebook"/></a></div></div><div className="footer-links"><div><strong>Explore</strong><a href="#services">Services</a><a href="#about">About us</a><a href="#areas">Areas we serve</a><a href="#results">Our results</a><a href="#reviews">Reviews</a></div><div><strong>Services</strong><a href="#services">Residential</a><a href="#services">Commercial</a><a href="#services">Deep cleaning</a><a href="#services">Move in / out</a></div><div><strong>Contact</strong><a href="tel:+19165460021">(916) 546-0021</a><span>Sacramento & surrounding areas</span><span>Mon–Fri · 8am–6pm</span><span>AI concierge · 24/7</span></div></div></div>
        <div className="shell footer-bottom"><span>© 2026 SparClean · Demonstration concept</span><div><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Accessibility</a></div><span>Made with care ✦</span></div>
      </footer>

      <button className={chatOpen ? "floating-chat active" : "floating-chat"} onClick={() => setChatOpen(v => !v)} aria-label={chatOpen ? "Close AI concierge" : "Open AI concierge"} aria-expanded={chatOpen}><span className="live-dot"/><Icon name={chatOpen ? "close" : "message"}/><i>Ask SparClean</i></button>
      {chatOpen && (
        <div className="mini-chat open" role="dialog" aria-labelledby="concierge-title" aria-describedby="concierge-status">
          <div className="mini-chat-head">
            <div className="ai-avatar tiny"><span/><span/><span/></div>
            <div>
              <strong id="concierge-title">SparClean Concierge</strong>
              <small id="concierge-status"><i/> Estimate conversation · step {Math.min(conciergeProgressIndex + 1, 7)} of 7</small>
            </div>
            <button type="button" onClick={() => setChatOpen(false)} aria-label="Close chat"><Icon name="close"/></button>
          </div>

          <div className="mini-chat-progress" role="progressbar" aria-label="Estimate conversation progress" aria-valuemin={1} aria-valuemax={7} aria-valuenow={Math.min(conciergeProgressIndex + 1, 7)}>
            <span style={{ width: `${Math.min(((conciergeProgressIndex + 1) / 7) * 100, 100)}%` }}/>
          </div>

          <div className="mini-chat-body" ref={conciergeLogRef} role="log" aria-live="polite" aria-relevant="additions text">
            {conciergeMessages.map(message => (
              <div className={`bubble ${message.sender}`} key={message.id}>{message.text}</div>
            ))}

            {conciergeStep === "service" && (
              <div className="concierge-service-picker" aria-label="Choose cleaning services">
                {cleaningOptions.map(option => {
                  const selected = cleaningTypes.includes(option.label);
                  return (
                    <button type="button" className={selected ? "selected" : ""} aria-pressed={selected} onClick={() => { toggleCleaningType(option.label); setConciergeError(""); }} key={option.label}>
                      <Icon name={option.icon} size={15}/><span>{option.label}</span><i><Icon name="check" size={11}/></i>
                    </button>
                  );
                })}
                <button type="button" className="concierge-continue" onClick={continueConciergeServices}>Continue with {cleaningTypes.length || "selected"} service{cleaningTypes.length === 1 ? "" : "s"} <Icon name="arrow" size={15}/></button>
              </div>
            )}

            {conciergeStep === "consent" && (
              <div className="concierge-consent">
                <div className={termsAccepted ? "accepted" : ""}>
                  <input id="concierge-terms" type="checkbox" checked={termsAccepted} onChange={event => { setTermsAccepted(event.target.checked); setConciergeError(""); }}/>
                  <span><label htmlFor="concierge-terms">Terms of Use</label><small>I have read and agree. <button type="button" onClick={() => setShowTermsModal(true)}>Read terms</button></small></span>
                </div>
                <div className={policyAccepted ? "accepted" : ""}>
                  <input id="concierge-policies" type="checkbox" checked={policyAccepted} onChange={event => { setPolicyAccepted(event.target.checked); setConciergeError(""); }}/>
                  <span><label htmlFor="concierge-policies">Company Policies</label><small>I accept the scheduling and cancellation policies. <button type="button" onClick={() => setShowPolicyModal(true)}>View policies</button></small></span>
                </div>
                <Turnstile key={conciergeTurnstileReset} action="concierge_chat" onToken={setConciergeTurnstileToken}/>
                <button type="button" className="concierge-continue" onClick={completeConciergeEstimate} disabled={conciergeSubmitting}>{conciergeSubmitting ? "Sending securely…" : "Complete my request"} <Icon name="arrow" size={15}/></button>
              </div>
            )}

            {conciergeStep === "complete" && (
              <div className="concierge-summary">
                <span><Icon name="check" size={18}/></span>
                <div><small>Estimate request received · {leadReference}</small><strong>{cleaningTypes.join(" · ")}</strong><p>{quoteDetails.address} · {Number(quoteDetails.propertySize).toLocaleString()} sq ft</p><p>{quoteDetails.phone} · {quoteDetails.email}</p></div>
                <button type="button" onClick={resetConcierge}>Start another conversation</button>
              </div>
            )}

            {conciergeError && <div className="concierge-error" role="alert">{conciergeError}</div>}
          </div>

          {activeConciergeInput && (
            <form className="mini-chat-input" onSubmit={submitConciergeInput}>
              <label className="sr-only" htmlFor="concierge-answer">{activeConciergeInput.label}</label>
              <input
                ref={conciergeInputRef}
                id="concierge-answer"
                type={activeConciergeInput.type}
                inputMode={conciergeStep === "propertySize" ? "numeric" : undefined}
                autoComplete={activeConciergeInput.autoComplete}
                min={conciergeStep === "propertySize" ? 1 : undefined}
                value={conciergeInput}
                onChange={event => { setConciergeInput(event.target.value); setConciergeError(""); }}
                placeholder={activeConciergeInput.placeholder}
              />
              <button type="submit" aria-label={`Send ${activeConciergeInput.label.toLowerCase()}`} disabled={!conciergeInput.trim()}><Icon name="arrow"/></button>
            </form>
          )}
        </div>
      )}

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
              <p>SparClean provides professional residential and commercial cleaning services. The scope of services will be as outlined in your estimate and confirmed booking.</p>
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
              <p>To cancel or reschedule without charge, please notify us at least <strong>48 hours</strong> before your scheduled appointment. Cancellations with less than 48 hours’ notice will incur a fee of 50% of the scheduled service estimate.</p>
              <h4>Same-Day Cancellation</h4>
              <p>Cancellations made on the day of service or no-shows will be charged 100% of the service estimate.</p>
              <h4>Rescheduling</h4>
              <p>You may reschedule free of charge up to 48 hours before your appointment. Contact us via phone, email, or through the AI concierge.</p>
              <h4>Access to Property</h4>
              <p>Clients are responsible for providing safe and clear access to the property at the scheduled time. If our team cannot access the property, the appointment will be treated as a same-day cancellation.</p>
              <h4>Satisfaction Guarantee</h4>
              <p>If you are not satisfied with any aspect of your clean, please contact us within 24 hours and we will return to address the concern without increasing the original estimate.</p>
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
