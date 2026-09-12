"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLeaf,
  FaArrowRight,
  FaCheck,
  FaXmark,
  FaCopy,
  FaSeedling,
  FaTree,
  FaWheatAwn,
  FaSun,
  FaShieldHalved,
  FaCircleCheck,
  FaCircleExclamation,
  FaTriangleExclamation,
  FaCircleInfo,
  FaMagnifyingGlass,
  FaArrowLeft,
  FaChevronDown,
  FaSliders,
  FaPalette,
  FaFont,
  FaRulerCombined,
  FaShapes,
  FaTableCellsLarge,
  FaWpforms,
  FaArrowsSplitUpAndLeft,
  FaCode,
  FaCirclePlay,
  FaArrowRotateRight,
} from "react-icons/fa6";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM DATA & TOKENS
// ─────────────────────────────────────────────────────────────────────────────

interface ColorToken {
  name: string;
  token: string;
  hex: string;
  hsl: string;
  usage: string;
  textLight?: boolean;
}

const PRIMARY_COLORS: ColorToken[] = [
  { name: "Primary 950", token: "primary-950", hex: "#091E14", hsl: "hsl(154, 55%, 8%)", usage: "Ultra-deep forest, hero base, footer", textLight: true },
  { name: "Primary 900 (Brand Base)", token: "primary-900", hex: "#113B27", hsl: "hsl(154, 55%, 15%)", usage: "Hero bg, dark cards, primary brand authority", textLight: true },
  { name: "Primary 800", token: "primary-800", hex: "#174A32", hsl: "hsl(154, 52%, 19%)", usage: "Card surface on dark mode, button hover", textLight: true },
  { name: "Primary 700", token: "primary-700", hex: "#226343", hsl: "hsl(151, 49%, 26%)", usage: "Interactive borders, dark headers", textLight: true },
  { name: "Primary 600", token: "primary-600", hex: "#2F7E56", hsl: "hsl(150, 46%, 34%)", usage: "Muted accent lines, decorative borders", textLight: true },
  { name: "Primary 200", token: "primary-200", hex: "#C3D8CD", hsl: "hsl(149, 23%, 81%)", usage: "Subtle tint for dark-on-light cards", textLight: false },
  { name: "Primary 100", token: "primary-100", hex: "#E4EDE8", hsl: "hsl(147, 23%, 91%)", usage: "Light surface badge background", textLight: false },
  { name: "Primary 50", token: "primary-50", hex: "#F2F7F4", hsl: "hsl(144, 23%, 96%)", usage: "Soft tinted page canvas", textLight: false },
];

const SECONDARY_COLORS: ColorToken[] = [
  { name: "Secondary 600", token: "secondary-600", hex: "#6BA327", hsl: "hsl(86, 61%, 40%)", usage: "Hover state for lime buttons", textLight: true },
  { name: "Secondary 500 (Brand Base)", token: "secondary-500", hex: "#84C135", hsl: "hsl(86, 57%, 48%)", usage: "Energy metrics, radial arcs, active dots, vibrant CTAs", textLight: false },
  { name: "Secondary 400", token: "secondary-400", hex: "#99D34C", hsl: "hsl(86, 61%, 56%)", usage: "High-contrast text on dark surfaces", textLight: false },
  { name: "Secondary 200", token: "secondary-200", hex: "#D2EEA2", hsl: "hsl(86, 69%, 78%)", usage: "Translucent chart fills", textLight: false },
  { name: "Secondary 100", token: "secondary-100", hex: "#EBF7D9", hsl: "hsl(86, 67%, 91%)", usage: "Success badge backgrounds", textLight: false },
  { name: "Secondary 50", token: "secondary-50", hex: "#F6FCED", hsl: "hsl(86, 64%, 96%)", usage: "Highlight card tint", textLight: false },
];

const ACCENT_COLORS: ColorToken[] = [
  { name: "Accent 700", token: "accent-700", hex: "#4B3116", hsl: "hsl(31, 55%, 19%)", usage: "Deep shadow tint, dark wood text", textLight: true },
  { name: "Accent 600 (Brand Base)", token: "accent-600", hex: "#654320", hsl: "hsl(31, 52%, 26%)", usage: "Timber Bronze, architectural accents, soil tokens", textLight: true },
  { name: "Accent 500", token: "accent-500", hex: "#7F562B", hsl: "hsl(31, 49%, 33%)", usage: "Hover state for earthy elements", textLight: true },
  { name: "Accent 200", token: "accent-200", hex: "#D8C4B0", hsl: "hsl(30, 36%, 77%)", usage: "Warm card border", textLight: false },
  { name: "Accent 100", token: "accent-100", hex: "#F1E9E0", hsl: "hsl(31, 38%, 91%)", usage: "Warm tag background", textLight: false },
  { name: "Accent 50", token: "accent-50", hex: "#FAF7F3", hsl: "hsl(34, 38%, 97%)", usage: "Warm neutral surface", textLight: false },
];

const NEUTRAL_SURFACES = [
  { name: "White Surface", token: "neutral-white", hex: "#FFFFFF", role: "Card surfaces, light button pills, headings on dark", border: true },
  { name: "Canvas Sage", token: "neutral-canvas", hex: "#F7F9F6", role: "Main light page background with warm sage hint", border: true },
  { name: "Canvas Alt", token: "neutral-canvas-alt", hex: "#EFF2EE", role: "Subtle section alternating background", border: true },
  { name: "Text Primary", token: "neutral-text-primary", hex: "#11231A", role: "Body and header text on light surfaces", textLight: true },
  { name: "Text Secondary", token: "neutral-text-secondary", hex: "#52665B", role: "Descriptions, subheadings, metadata", textLight: true },
  { name: "Text Muted", token: "neutral-text-muted", hex: "#7E9387", role: "Captions, helper labels, disabled states", textLight: true },
  { name: "Card Border", token: "neutral-card-border", hex: "rgba(17, 59, 39, 0.08)", role: "Delicate 1px card boundaries", border: true },
];

const SEMANTIC_FEEDBACK = [
  { state: "Success", fg: "#1E5C1B", bg: "#ECF8EB", border: "#A6E09D", usage: "Positive metrics, successful submission alerts, active solar" },
  { state: "Warning", fg: "#7A4B00", bg: "#FFF8E6", border: "#F7D278", usage: "Advisory notices, maintenance window, battery low" },
  { state: "Error", fg: "#8E1E1E", bg: "#FDF2F2", border: "#F5A3A3", usage: "Validation errors, input failure, offline sensor alerts" },
  { state: "Info", fg: "#113B27", bg: "#F2F7F4", border: "#C3D8CD", usage: "Informative tips, explanatory tooltips, calculation notes" },
];

const TYPOGRAPHY_LEVELS = [
  { level: "display-hero", role: "Hero Main Title", size: "4.25rem (68px)", mobile: "2.5rem (40px)", weight: "Bold 700", tracking: "-0.025em", sample: "Regenerative Earth" },
  { level: "h1", role: "Major Section Header", size: "3.25rem (52px)", mobile: "2.125rem (34px)", weight: "Bold 700", tracking: "-0.02em", sample: "Rooted in Community" },
  { level: "h2", role: "Feature & Bento Title", size: "2.25rem (36px)", mobile: "1.75rem (28px)", weight: "SemiBold 600", tracking: "-0.015em", sample: "Eco-Futuristic Agriculture" },
  { level: "h3", role: "Card & Widget Heading", size: "1.5rem (24px)", mobile: "1.25rem (20px)", weight: "SemiBold 600", tracking: "-0.01em", sample: "Kilifi Permaculture Hub" },
  { level: "h4", role: "Sub-card & Item Title", size: "1.125rem (18px)", mobile: "1.0rem (16px)", weight: "SemiBold 600", tracking: "0", sample: "Micro-Climate Solar Inverters" },
  { level: "eyebrow", role: "Category Pre-title", size: "0.8125rem (13px)", mobile: "0.75rem (12px)", weight: "SemiBold 600", tracking: "+0.06em", sample: "BAOLALA • SUSTAINABILITY" },
  { level: "body-large", role: "Lead / Subtitle Copy", size: "1.1875rem (19px)", mobile: "1.0625rem (17px)", weight: "Regular 400", tracking: "0", sample: "Restoring soil fertility through organic compost and indigenous tree nurseries." },
  { level: "body", role: "Standard Body Copy", size: "1.0rem (16px)", mobile: "0.9375rem (15px)", weight: "Regular 400", tracking: "0", sample: "Our farm combines traditional ecological wisdom with solar-powered precision irrigation." },
  { level: "body-small", role: "Captions & Metadata", size: "0.875rem (14px)", mobile: "0.8125rem (13px)", weight: "Regular 400", tracking: "+0.01em", sample: "Updated 12 mins ago • Kilifi County Sensor Network" },
  { level: "metric-stat", role: "Metric & Kilowatt Display", size: "1.75rem (28px)", mobile: "1.5rem (24px)", weight: "Bold 700", tracking: "-0.02em", sample: "700 kW • 45,000+" },
];

const SPACING_SCALE = [
  { token: "space-1", px: "4px", rem: "0.25rem", role: "Micro gap, icon padding" },
  { token: "space-2", px: "8px", rem: "0.5rem", role: "Badge internal padding, tight gap" },
  { token: "space-3", px: "12px", rem: "0.75rem", role: "Pill button Y padding, input Y padding" },
  { token: "space-4", px: "16px", rem: "1.0rem", role: "Standard element gap, base padding" },
  { token: "space-5", px: "20px", rem: "1.25rem", role: "Card compact padding" },
  { token: "space-6", px: "24px", rem: "1.5rem", role: "Pill button X padding, card padding" },
  { token: "space-8", px: "32px", rem: "2.0rem", role: "Large card internal padding, layout gap" },
  { token: "space-12", px: "48px", rem: "3.0rem", role: "Bento grid gutter, section divider" },
  { token: "space-16", px: "64px", rem: "4.0rem", role: "Standard section vertical margin" },
  { token: "space-20", px: "80px", rem: "5.0rem", role: "Medium section padding" },
  { token: "space-24", px: "96px", rem: "6.0rem", role: "Major landing section vertical padding" },
  { token: "space-32", px: "128px", rem: "8.0rem", role: "Hero and feature separation" },
];

const RADII_SCALE = [
  { name: "rounded-sm", px: "6px", usage: "Tooltips, fine micro UI indicators" },
  { name: "rounded-md", px: "10px", usage: "Sub-badges, internal tags" },
  { name: "rounded-lg", px: "14px", usage: "Small input fields, compact containers" },
  { name: "rounded-xl", px: "18px", usage: "Dropdown menus, popover containers" },
  { name: "rounded-2xl", px: "22px", usage: "Standard cards, dialog containers, form cards" },
  { name: "rounded-3xl", px: "28–32px", usage: "Primary Bento Cards, Photos, Story Modules (Brand Signature)" },
  { name: "rounded-full", px: "9999px", usage: "All buttons, badges, chips, newsletter capsule (Brand Signature)" },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  // Interactive State
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [canvasBg, setCanvasBg] = useState<"sage" | "dark" | "white">("sage");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive Gauge Controls
  const [gaugePercent, setGaugePercent] = useState(75);
  const [metricValue, setMetricValue] = useState(700);
  const [gaugeColor, setGaugeColor] = useState("#84C135");

  // Interactive Type Tester
  const [typeSample, setTypeSample] = useState("Empowering Kilifi communities through regenerative agriculture.");
  const [testFontSize, setTestFontSize] = useState(24);

  // Interactive Tabs
  const [activeTab, setActiveTab] = useState(0);

  // Interactive Stepper
  const [currentStep, setCurrentStep] = useState(1);

  // Interactive Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Field Testing
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);

  // Toast helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setToastMessage(`Copied ${label}: ${text}`);
    setTimeout(() => {
      setCopiedText(null);
      setToastMessage(null);
    }, 2500);
  };

  const navCategories = [
    { id: "overview", name: "Philosophy", icon: FaLeaf },
    { id: "colors", name: "Colors & Tokens", icon: FaPalette },
    { id: "typography", name: "Typography", icon: FaFont },
    { id: "spacing", name: "Spacing & Grid", icon: FaRulerCombined },
    { id: "radii-shadows", name: "Radii & Shadows", icon: FaShapes },
    { id: "buttons", name: "Buttons & Pills", icon: FaCirclePlay },
    { id: "badges", name: "Badges & Tags", icon: FaShieldHalved },
    { id: "metrics", name: "Radial Gauges", icon: FaSun },
    { id: "glass-overlays", name: "Glass Overlays", icon: FaTableCellsLarge },
    { id: "cards", name: "Bento Containers", icon: FaTableCellsLarge },
    { id: "forms", name: "Forms & Newsletter", icon: FaWpforms },
    { id: "tabs-nav", name: "Navigation & Tabs", icon: FaArrowsSplitUpAndLeft },
    { id: "feedback", name: "Feedback & Modals", icon: FaCircleCheck },
    { id: "guidelines", name: "Do's & Don'ts", icon: FaShieldHalved },
    { id: "developer", name: "Developer Tokens", icon: FaCode },
  ];

  // Canvas background class helper
  const getCanvasBgClass = () => {
    switch (canvasBg) {
      case "dark":
        return "bg-[#113B27] text-white";
      case "white":
        return "bg-white text-[#11231A]";
      case "sage":
      default:
        return "bg-[#F7F9F6] text-[#11231A]";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#11231A] selection:bg-[#84C135] selection:text-[#113B27] relative">
      {/* ──────────────────────────────────────────────────────────
          FLOATING TOAST NOTIFICATION
      ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-[#113B27] text-white border border-[#84C135]/40 shadow-2xl backdrop-blur-lg"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#84C135] animate-pulse"></span>
            <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────────
          1. HEADER & CONTROL BAR
      ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#113B27]/95 backdrop-blur-xl border-b border-white/10 text-white transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Brand & System Title */}
          <div className="flex items-center gap-3.5">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white border border-white/40 shadow-lg flex items-center justify-center shrink-0 relative transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.jpg"
                  alt="Nettle Regenerative"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg tracking-tight leading-none text-white group-hover:text-[#84C135] transition-colors">
                  Nettle Regenerative &apos;K&apos; Limited
                </span>
                <span className="text-[10px] text-white/70 tracking-widest uppercase font-semibold mt-1">
                  Design System & UI Library
                </span>
              </div>
            </Link>

            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#84C135]/20 text-[#99D34C] border border-[#84C135]/30">
              v1.0 (Tailwind v4)
            </span>
          </div>

          {/* Quick Actions & Canvas Switcher */}
          <div className="flex items-center gap-3">
            {/* Canvas Background Stage Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-black/25 p-1 rounded-full border border-white/15 text-xs font-medium">
              <span className="px-2 text-white/60 text-[11px]">Preview Stage:</span>
              <button
                onClick={() => setCanvasBg("sage")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  canvasBg === "sage"
                    ? "bg-white text-[#113B27] font-semibold shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Sage Canvas
              </button>
              <button
                onClick={() => setCanvasBg("dark")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  canvasBg === "dark"
                    ? "bg-[#84C135] text-[#091E14] font-semibold shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Deep Forest
              </button>
              <button
                onClick={() => setCanvasBg("white")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  canvasBg === "white"
                    ? "bg-white text-[#113B27] font-semibold shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Pure White
              </button>
            </div>

            {/* Back to Home Page Link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#113B27] text-xs sm:text-sm font-semibold hover:bg-[#84C135] transition-all duration-200 shadow-md cursor-pointer"
            >
              <FaArrowLeft className="w-3 h-3" />
              <span>Back to Farm</span>
            </Link>
          </div>
        </div>

        {/* Category Navigation Strip */}
        <div className="border-t border-white/10 bg-[#091E14]/60 backdrop-blur-md overflow-x-auto scrollbar-none py-2 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
            {navCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/75 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Icon className="w-3 h-3 text-[#84C135]" />
                  <span>{cat.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────
          HERO BANNER & SYSTEM STATS
      ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#113B27] via-[#0D2E1E] to-[#091E14] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#174A32]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#84C135_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#84C135]/15 border border-[#84C135]/30 text-[#99D34C] text-xs font-semibold uppercase tracking-wider mb-4">
                <FaLeaf className="w-3 h-3 text-[#84C135]" />
                Atmospheric Clean-Tech & Eco-Futurism Design System
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white mb-4">
                Visualizing the Nettle Regenerative Design Language
              </h1>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
                The authoritative design specification and live interactive component explorer for{" "}
                <span className="text-[#84C135] font-medium">my-app</span>. Built on Next.js 16, React 19, and Tailwind CSS v4, combining organic permaculture landscapes with high-precision digital interfaces.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <div className="text-2xl font-bold text-[#84C135] tabular-nums">3</div>
                <div className="text-xs text-white/70 mt-0.5">Core Brand Colors</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <div className="text-2xl font-bold text-white tabular-nums">8pt</div>
                <div className="text-xs text-white/70 mt-0.5">Foundational Grid</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <div className="text-2xl font-bold text-[#84C135] tabular-nums">28px</div>
                <div className="text-xs text-white/70 mt-0.5">Bento Radius</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <div className="text-2xl font-bold text-white tabular-nums">100%</div>
                <div className="text-xs text-white/70 mt-0.5">Pill Geometry</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          MAIN CONTENT CONTAINER (AFFECTED BY PREVIEW STAGE)
      ────────────────────────────────────────────────────────── */}
      <main className={`transition-colors duration-300 ${getCanvasBgClass()} py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto space-y-20">

          {/* ──────────────────────────────────────────────────────────
              SECTION 1: PHILOSOPHY & PRINCIPLES
          ────────────────────────────────────────────────────────── */}
          <section id="overview" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>01</span>
                <span>•</span>
                <span>Philosophy & Principles</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Core Design Principles
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                Governing visual and architectural decisions across all Nettle Regenerative web properties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Principle 1 */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#174A32]/60 backdrop-blur-md border border-black/5 dark:border-white/15 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#113B27] text-[#84C135] flex items-center justify-center text-lg mb-4 shadow-sm">
                  <FaLeaf />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Organic Architecture Meets Precision</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Clean energy and permaculture feel natural, serene, and grounded. Hyper-precise digital metrics (fine gauges, crisp typography) balance with lush organic imagery and warm earthy undertones.
                </p>
              </div>

              {/* Principle 2 */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#174A32]/60 backdrop-blur-md border border-black/5 dark:border-white/15 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#84C135] text-[#091E14] flex items-center justify-center text-lg mb-4 shadow-sm">
                  <FaSun />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Luminous Contrast & Depth</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Dramatic tonal shifts between deep immersive forest zones (`#113B27`) and tranquil light sage canvases (`#F7F9F6`), accented with frosted glassmorphism overlays that float organically over imagery.
                </p>
              </div>

              {/* Principle 3 */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#174A32]/60 backdrop-blur-md border border-black/5 dark:border-white/15 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#654320] text-white flex items-center justify-center text-lg mb-4 shadow-sm">
                  <FaShapes />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Tactile Pill Geometry</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Every primary interactive element employs a smooth pill form factor (`rounded-full`), while content modules use generous 28px–32px radii (`rounded-3xl`) to create an inviting, human-friendly aesthetic.
                </p>
              </div>

              {/* Principle 4 */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#174A32]/60 backdrop-blur-md border border-black/5 dark:border-white/15 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#113B27] text-white flex items-center justify-center text-lg mb-4 shadow-sm">
                  <FaWheatAwn />
                </div>
                <h3 className="text-lg font-semibold mb-2">4. Micro-Metric Storytelling</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Data points (kilowatts saved, seedling counts, hectares revitalized) are elevated to primary visual anchors through circular radial gauges, tabular numerals, and glowing solar-lime accents.
                </p>
              </div>

              {/* Principle 5 */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#174A32]/60 backdrop-blur-md border border-black/5 dark:border-white/15 shadow-sm hover:shadow-md transition-all lg:col-span-2">
                <div className="w-12 h-12 rounded-2xl bg-[#84C135]/20 text-[#84C135] flex items-center justify-center text-lg mb-4 shadow-sm border border-[#84C135]/30">
                  <FaShieldHalved />
                </div>
                <h3 className="text-lg font-semibold mb-2">5. Restraint in Color Application</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Brand colors serve strict functional roles. Deep Forest (`#113B27`) provides grounding authority; Solar Lime (`#84C135`) acts solely as an energetic pulse for action and feedback; Timber Bronze (`#654320`) anchors natural earth. Lime is never flooded carelessly across wide backgrounds.
                </p>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 2: COLOR SYSTEM & TOKENS
          ────────────────────────────────────────────────────────── */}
          <section id="colors" className="scroll-mt-32">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                  <span>02</span>
                  <span>•</span>
                  <span>Color System & Semantic Tokens</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                  Color Palette & Design Tokens
                </h2>
                <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                  Click any swatch to copy its Hex, HSL, or Tailwind token directly to your clipboard.
                </p>
              </div>

              <div className="text-xs opacity-60 flex items-center gap-1.5">
                <FaCopy className="w-3 h-3 text-[#84C135]" />
                <span>Click swatches to copy token</span>
              </div>
            </div>

            {/* 1. Primary Pine Scale */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#113B27] ring-2 ring-[#84C135]" />
                  <h3 className="text-base sm:text-lg font-bold">Brand Primary: Deep Forest Pine (`#113B27`)</h3>
                </div>
                <span className="text-xs font-mono opacity-60">--color-brand-primary</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {PRIMARY_COLORS.map((c) => (
                  <button
                    key={c.token}
                    onClick={() => copyToClipboard(c.hex, c.token)}
                    className="group text-left p-3 rounded-2xl border border-black/10 dark:border-white/15 transition-all hover:scale-[1.03] hover:shadow-lg cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden"
                    style={{ backgroundColor: c.hex }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[11px] font-semibold ${c.textLight ? "text-white" : "text-[#11231A]"}`}>
                        {c.name.split(" ")[0]}
                      </span>
                      <FaCopy className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${c.textLight ? "text-white/80" : "text-black/60"}`} />
                    </div>
                    <div>
                      <div className={`text-xs font-mono font-bold ${c.textLight ? "text-white" : "text-[#11231A]"}`}>
                        {c.hex}
                      </div>
                      <div className={`text-[10px] truncate ${c.textLight ? "text-white/70" : "text-black/60"}`}>
                        {c.usage}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Secondary Solar Lime Scale */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#84C135] ring-2 ring-[#113B27]" />
                  <h3 className="text-base sm:text-lg font-bold">Brand Secondary: Vibrant Solar Lime (`#84C135`)</h3>
                </div>
                <span className="text-xs font-mono opacity-60">--color-brand-secondary</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {SECONDARY_COLORS.map((c) => (
                  <button
                    key={c.token}
                    onClick={() => copyToClipboard(c.hex, c.token)}
                    className="group text-left p-3 rounded-2xl border border-black/10 dark:border-white/15 transition-all hover:scale-[1.03] hover:shadow-lg cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden"
                    style={{ backgroundColor: c.hex }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[11px] font-semibold ${c.textLight ? "text-white" : "text-[#11231A]"}`}>
                        {c.name.split(" ")[0]}
                      </span>
                      <FaCopy className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${c.textLight ? "text-white/80" : "text-black/60"}`} />
                    </div>
                    <div>
                      <div className={`text-xs font-mono font-bold ${c.textLight ? "text-white" : "text-[#11231A]"}`}>
                        {c.hex}
                      </div>
                      <div className={`text-[10px] truncate ${c.textLight ? "text-white/70" : "text-black/60"}`}>
                        {c.usage}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Accent Timber Bronze Scale */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#654320] ring-2 ring-[#84C135]" />
                  <h3 className="text-base sm:text-lg font-bold">Brand Accent: Warm Timber Bronze (`#654320`)</h3>
                </div>
                <span className="text-xs font-mono opacity-60">--color-brand-accent</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.token}
                    onClick={() => copyToClipboard(c.hex, c.token)}
                    className="group text-left p-3 rounded-2xl border border-black/10 dark:border-white/15 transition-all hover:scale-[1.03] hover:shadow-lg cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden"
                    style={{ backgroundColor: c.hex }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[11px] font-semibold ${c.textLight ? "text-white" : "text-[#11231A]"}`}>
                        {c.name.split(" ")[0]}
                      </span>
                      <FaCopy className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${c.textLight ? "text-white/80" : "text-black/60"}`} />
                    </div>
                    <div>
                      <div className={`text-xs font-mono font-bold ${c.textLight ? "text-white" : "text-[#11231A]"}`}>
                        {c.hex}
                      </div>
                      <div className={`text-[10px] truncate ${c.textLight ? "text-white/70" : "text-black/60"}`}>
                        {c.usage}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Surfaces, Neutrals & Semantic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Neutrals */}
              <div className="p-6 rounded-3xl bg-white/70 dark:bg-black/20 backdrop-blur-md border border-black/5 dark:border-white/10">
                <h4 className="text-sm uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
                  <FaLeaf className="w-3 h-3 text-[#84C135]" />
                  <span>Surfaces & Neutrals</span>
                </h4>
                <div className="space-y-2.5">
                  {NEUTRAL_SURFACES.map((n) => (
                    <div
                      key={n.token}
                      onClick={() => copyToClipboard(n.hex, n.token)}
                      className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-xl shrink-0 ${n.border ? "border border-black/15 shadow-inner" : ""}`}
                          style={{ backgroundColor: n.hex }}
                        />
                        <div>
                          <div className="text-xs font-semibold">{n.name}</div>
                          <div className="text-[11px] opacity-70">{n.role}</div>
                        </div>
                      </div>
                      <div className="text-xs font-mono opacity-80 text-right">
                        <div>{n.hex}</div>
                        <div className="text-[10px] opacity-60">.{n.token}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Feedback States */}
              <div className="p-6 rounded-3xl bg-white/70 dark:bg-black/20 backdrop-blur-md border border-black/5 dark:border-white/10">
                <h4 className="text-sm uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
                  <FaCircleCheck className="w-3 h-3 text-[#84C135]" />
                  <span>Semantic & Feedback States</span>
                </h4>
                <div className="space-y-3">
                  {SEMANTIC_FEEDBACK.map((s) => (
                    <div
                      key={s.state}
                      className="p-3.5 rounded-2xl flex items-start justify-between gap-3"
                      style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.fg }}
                    >
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          {s.state === "Success" && <FaCircleCheck className="w-3.5 h-3.5" />}
                          {s.state === "Warning" && <FaTriangleExclamation className="w-3.5 h-3.5" />}
                          {s.state === "Error" && <FaCircleExclamation className="w-3.5 h-3.5" />}
                          {s.state === "Info" && <FaCircleInfo className="w-3.5 h-3.5" />}
                          <span>{s.state}</span>
                        </div>
                        <p className="text-xs mt-1 opacity-90">{s.usage}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(s.fg, `${s.state} Foreground`)}
                        className="px-2 py-1 rounded-full text-[10px] font-mono font-semibold bg-white/80 text-black border border-black/10 hover:bg-white transition-colors cursor-pointer shrink-0"
                      >
                        {s.fg}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 3: TYPOGRAPHY & TEXT HIERARCHY
          ────────────────────────────────────────────────────────── */}
          <section id="typography" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>03</span>
                <span>•</span>
                <span>Typography System</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Typographic Scale & Hierarchy
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                Font pairings combine Plus Jakarta Sans for crisp display presence and Inter for high-comfort body reading.
              </p>
            </div>

            {/* Font Stack Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-5 rounded-3xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <span className="text-xs uppercase font-semibold text-[#84C135] tracking-wider">Display Font</span>
                <h4 className="text-xl font-bold mt-1">Plus Jakarta Sans</h4>
                <p className="text-xs opacity-75 mt-1 font-mono">--font-display</p>
                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 text-2xl font-bold">
                  Aa Bb Gg 123
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <span className="text-xs uppercase font-semibold text-[#84C135] tracking-wider">Body UI Font</span>
                <h4 className="text-xl font-bold mt-1">Inter / Geist Sans</h4>
                <p className="text-xs opacity-75 mt-1 font-mono">--font-body</p>
                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 text-2xl font-medium">
                  Aa Bb Gg 123
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <span className="text-xs uppercase font-semibold text-[#84C135] tracking-wider">Metric & Figures</span>
                <h4 className="text-xl font-bold mt-1">Geist Mono (tabular-nums)</h4>
                <p className="text-xs opacity-75 mt-1 font-mono">--font-mono</p>
                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 text-2xl font-mono">
                  700 kW • 01/03
                </div>
              </div>
            </div>

            {/* Typographic Hierarchy Table */}
            <div className="overflow-x-auto rounded-3xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md mb-8">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[11px] uppercase tracking-wider font-semibold opacity-75">
                    <th className="py-3 px-4">Level / Token</th>
                    <th className="py-3 px-4">Desktop Size</th>
                    <th className="py-3 px-4">Weight & Tracking</th>
                    <th className="py-3 px-4">Live Preview Specimen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {TYPOGRAPHY_LEVELS.map((t) => (
                    <tr key={t.level} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono font-semibold text-[#113B27] dark:text-[#84C135]">
                        <div>{t.level}</div>
                        <div className="text-[10px] font-normal opacity-70">{t.role}</div>
                      </td>
                      <td className="py-4 px-4 font-mono">{t.size}</td>
                      <td className="py-4 px-4">
                        <div>{t.weight}</div>
                        <div className="text-[10px] font-mono opacity-60">track: {t.tracking}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`block truncate max-w-md ${
                            t.level === "display-hero"
                              ? "text-2xl sm:text-3xl font-bold tracking-tight"
                              : t.level === "h1"
                              ? "text-xl sm:text-2xl font-bold"
                              : t.level === "h2"
                              ? "text-lg sm:text-xl font-semibold"
                              : t.level === "h3"
                              ? "text-base font-semibold"
                              : t.level === "eyebrow"
                              ? "text-xs uppercase font-semibold tracking-wider text-[#84C135]"
                              : t.level === "metric-stat"
                              ? "text-xl font-mono font-bold"
                              : "text-sm"
                          }`}
                        >
                          {t.sample}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Interactive Type Tester */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <FaFont className="w-4 h-4 text-[#84C135]" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">Live Typeface Sandbox</h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono opacity-70">Size: {testFontSize}px</span>
                  <input
                    type="range"
                    min="14"
                    max="64"
                    value={testFontSize}
                    onChange={(e) => setTestFontSize(Number(e.target.value))}
                    className="w-36 accent-[#84C135] cursor-pointer"
                  />
                </div>
              </div>

              <input
                type="text"
                value={typeSample}
                onChange={(e) => setTypeSample(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-white dark:bg-black/30 border border-black/10 dark:border-white/20 text-xs sm:text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#84C135]"
                placeholder="Type sample phrase here..."
              />

              <div
                className="p-6 rounded-2xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 min-h-[90px] flex items-center overflow-x-hidden"
                style={{ fontSize: `${testFontSize}px`, lineHeight: 1.25 }}
              >
                <span className="font-semibold tracking-tight">{typeSample}</span>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 4: SPACING & GRID SYSTEM
          ────────────────────────────────────────────────────────── */}
          <section id="spacing" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>04</span>
                <span>•</span>
                <span>Spacing Scale & Grid Layout</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                8pt Foundational Spacing Scale
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                Rigorous 8pt spacing grid with 4pt micro-increments ensuring harmonious rhythm across widgets and layouts.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Visual Spacing Rulers */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-3">
                <h4 className="text-xs uppercase font-bold tracking-wider opacity-70 mb-2">Spacing Increments</h4>
                {SPACING_SCALE.map((s) => (
                  <div key={s.token} className="flex items-center gap-3 text-xs">
                    <span className="w-20 font-mono font-semibold opacity-80">{s.token}</span>
                    <span className="w-14 font-mono opacity-60">{s.px}</span>
                    <div className="grow flex items-center">
                      <div
                        className="h-4 rounded-full bg-[#84C135] transition-all"
                        style={{ width: `clamp(6px, ${s.px}, 240px)` }}
                      />
                    </div>
                    <span className="hidden sm:inline-block text-[11px] opacity-60 truncate max-w-[160px]">{s.role}</span>
                  </div>
                ))}
              </div>

              {/* Layout Containers Guide */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider opacity-70 mb-4">Container Boundaries</h4>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl border border-dashed border-black/20 dark:border-white/20">
                      <div className="flex justify-between text-xs font-mono font-bold mb-1">
                        <span>max-w-[1400px]</span>
                        <span>Hero & Cinematic Stage Frame</span>
                      </div>
                      <div className="h-3 rounded-full bg-[#113B27]/20 dark:bg-white/20 w-full" />
                    </div>

                    <div className="p-4 rounded-2xl border border-dashed border-[#84C135]/40 bg-[#84C135]/5">
                      <div className="flex justify-between text-xs font-mono font-bold text-[#113B27] dark:text-[#84C135] mb-1">
                        <span>max-w-7xl (1280px / 80rem)</span>
                        <span>Standard Content Max-Width</span>
                      </div>
                      <div className="h-3 rounded-full bg-[#84C135] w-[90%]" />
                    </div>

                    <div className="p-4 rounded-2xl border border-dashed border-black/20 dark:border-white/20">
                      <div className="flex justify-between text-xs font-mono font-bold mb-1">
                        <span>max-w-3xl (768px / 48rem)</span>
                        <span>Focused Form, Modals & Narrative</span>
                      </div>
                      <div className="h-3 rounded-full bg-[#654320]/40 w-[60%]" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-black/5 dark:bg-white/5 text-xs opacity-75">
                  <strong>Responsive Gutters:</strong> Desktop (≥1024px) utilizes <code className="font-mono">px-8 (32px)</code>; Tablet utilizes <code className="font-mono">px-6 (24px)</code>; Mobile uses <code className="font-mono">px-4 (16px)</code>.
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 5: CORNER RADII & ELEVATION
          ────────────────────────────────────────────────────────── */}
          <section id="radii-shadows" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>05</span>
                <span>•</span>
                <span>Radii & Shadows</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Border Radius & Elevation System
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                Soft organic geometry. <strong>Strict Rule:</strong> Never use square corners (`rounded-none`). Bento cards employ `rounded-3xl` (28–32px) and interactive elements employ `rounded-full`.
              </p>
            </div>

            {/* Radii Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
              {RADII_SCALE.map((r) => (
                <div
                  key={r.name}
                  className="p-4 bg-white/80 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col justify-between h-36"
                  style={{
                    borderRadius:
                      r.name === "rounded-sm"
                        ? "6px"
                        : r.name === "rounded-md"
                        ? "10px"
                        : r.name === "rounded-lg"
                        ? "14px"
                        : r.name === "rounded-xl"
                        ? "18px"
                        : r.name === "rounded-2xl"
                        ? "22px"
                        : r.name === "rounded-3xl"
                        ? "28px"
                        : "9999px",
                  }}
                >
                  <div className="text-xs font-mono font-bold text-[#113B27] dark:text-[#84C135]">{r.name}</div>
                  <div>
                    <div className="text-sm font-bold">{r.px}</div>
                    <div className="text-[10px] opacity-70 line-clamp-2 mt-0.5">{r.usage}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shadows & Glassmorphic Elevation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#174A32] shadow-[0_4px_20px_-4px_rgba(17,59,39,0.08)] border border-black/5">
                <div className="text-xs font-mono font-bold text-[#84C135] mb-2">--shadow-card-resting</div>
                <div className="text-sm font-semibold">Card Resting State</div>
                <p className="text-xs opacity-70 mt-1">Ambient 4px subtle elevation for light canvases.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#174A32] shadow-[0_20px_40px_-12px_rgba(17,59,39,0.18)] border border-black/5 transform -translate-y-1 transition-transform">
                <div className="text-xs font-mono font-bold text-[#84C135] mb-2">--shadow-card-hover</div>
                <div className="text-sm font-semibold">Card Hover State</div>
                <p className="text-xs opacity-70 mt-1">Deep 20px dynamic elevation with upward translation.</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/20 dark:bg-[#113B27]/80 backdrop-blur-xl border border-white/30 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.35)]">
                <div className="text-xs font-mono font-bold text-[#84C135] mb-2">--shadow-glass-float</div>
                <div className="text-sm font-semibold">Glassmorphic Float</div>
                <p className="text-xs opacity-70 mt-1">Deep dark scrim shadow for floating telemetry cards.</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#113B27] text-white shadow-[0_8px_24px_-4px_rgba(132,193,53,0.45)] border border-[#84C135]/40">
                <div className="text-xs font-mono font-bold text-[#84C135] mb-2">--shadow-glow-lime</div>
                <div className="text-sm font-semibold">Vibrant Solar Glow</div>
                <p className="text-xs opacity-70 mt-1">Energetic glow aura for primary CTAs and active nodes.</p>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 6: BUTTONS & INTERACTIVE PILLS
          ────────────────────────────────────────────────────────── */}
          <section id="buttons" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>06</span>
                <span>•</span>
                <span>Buttons & Interactive Pills</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Pill Buttons & Icon Triggers
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                All buttons strictly adhere to the <code className="font-mono">rounded-full</code> pill geometry with directional arrow micro-animations.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/70 dark:bg-black/30 border border-black/5 dark:border-white/10 backdrop-blur-md">
              {/* Primary Variants Row */}
              <div className="mb-8">
                <h4 className="text-xs uppercase font-bold tracking-wider opacity-70 mb-4">Core Button Variants</h4>
                <div className="flex flex-wrap items-center gap-4">
                  {/* 1. Primary Light Pill */}
                  <button className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-[#113B27] text-sm font-semibold tracking-wide border border-black/10 shadow-sm transition-all duration-300 hover:bg-[#84C135] hover:text-[#113B27] hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#84C135] cursor-pointer">
                    <span>Primary Light Pill</span>
                    <span className="w-6 h-6 rounded-full bg-black/5 group-hover:bg-black/10 flex items-center justify-center text-xs transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>

                  {/* 2. Primary Dark Pill */}
                  <button className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#113B27] text-white text-sm font-semibold tracking-wide shadow-sm transition-all duration-300 hover:bg-[#1B4F35] hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#84C135] cursor-pointer">
                    <span>Primary Dark Pill</span>
                    <span className="w-6 h-6 rounded-full bg-white/15 group-hover:bg-white/25 flex items-center justify-center text-xs transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>

                  {/* 3. Vibrant Solar Accent Pill */}
                  <button className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#84C135] text-[#091E14] text-sm font-bold tracking-wide shadow-md shadow-[#84C135]/25 transition-all duration-300 hover:bg-[#99D34C] hover:shadow-xl hover:shadow-[#84C135]/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#113B27] cursor-pointer">
                    <span>Vibrant Solar Accent</span>
                    <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>

                  {/* 4. Glass Ghost Pill */}
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/5 dark:bg-white/10 text-inherit border border-black/15 dark:border-white/20 backdrop-blur-md text-sm font-semibold hover:bg-black/10 dark:hover:bg-white/20 transition-all cursor-pointer">
                    <span>Glass Ghost Pill</span>
                    <FaArrowRight className="w-3 h-3 text-[#84C135]" />
                  </button>
                </div>
              </div>

              {/* Sizes & States */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-black/10 dark:border-white/10">
                {/* Sizes */}
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider opacity-70 mb-4">Button Sizing Scale</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="px-4 py-2 rounded-full bg-[#113B27] text-white text-xs font-semibold cursor-pointer">
                      Small (32px)
                    </button>
                    <button className="px-6 py-2.5 rounded-full bg-[#113B27] text-white text-sm font-semibold cursor-pointer">
                      Default (40px)
                    </button>
                    <button className="px-8 py-3.5 rounded-full bg-[#113B27] text-white text-base font-semibold cursor-pointer">
                      Large (48px)
                    </button>
                  </div>
                </div>

                {/* Circular Icon Buttons */}
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider opacity-70 mb-4">Circular Icon Triggers (44px)</h4>
                  <div className="flex items-center gap-3">
                    <button
                      className="w-11 h-11 rounded-full bg-[#113B27] text-white flex items-center justify-center shadow-md hover:bg-[#84C135] hover:text-[#091E14] transition-all cursor-pointer"
                      aria-label="Next step"
                    >
                      <FaArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      className="w-11 h-11 rounded-full bg-white border border-black/15 text-[#113B27] flex items-center justify-center shadow-sm hover:bg-[#84C135] transition-all cursor-pointer"
                      aria-label="Eco leaf"
                    >
                      <FaLeaf className="w-4 h-4" />
                    </button>
                    <button
                      className="w-11 h-11 rounded-full bg-[#84C135] text-[#091E14] flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer"
                      aria-label="Play video"
                    >
                      <FaCirclePlay className="w-4 h-4" />
                    </button>
                    <button
                      disabled
                      className="w-11 h-11 rounded-full bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 flex items-center justify-center cursor-not-allowed"
                      aria-label="Disabled"
                    >
                      <FaArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 7: BADGES & TAGS
          ────────────────────────────────────────────────────────── */}
          <section id="badges" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>07</span>
                <span>•</span>
                <span>Badges & Status Tags</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Status Indicators & Metadata Pills
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                Clean pill badges with micro-indicators for sensor states, active nodes, and category taxonomy.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/70 dark:bg-black/30 border border-black/5 dark:border-white/10 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-4">
                {/* Active Solar Live Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#84C135]/15 text-[#2E5A0B] dark:text-[#99D34C] border border-[#84C135]/30 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#84C135] animate-ping" />
                  <span>Solar Array Active</span>
                </div>

                {/* Eco Category Tag */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#113B27]/10 dark:bg-white/10 text-[#113B27] dark:text-white border border-[#113B27]/20 dark:border-white/20 text-xs font-semibold">
                  <FaSeedling className="w-3 h-3 text-[#84C135]" />
                  <span>Permaculture Guild</span>
                </div>

                {/* Timber Accent Tag */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#654320]/10 text-[#654320] dark:text-[#D8C4B0] border border-[#654320]/25 text-xs font-semibold">
                  <FaTree className="w-3 h-3" />
                  <span>Kilifi Agroforestry</span>
                </div>

                {/* Numerical Step Badges */}
                <div className="flex items-center gap-1.5">
                  <span className="w-7 h-7 rounded-full bg-white dark:bg-white/10 text-[#113B27] dark:text-[#84C135] border border-black/10 dark:border-white/20 flex items-center justify-center text-xs font-mono font-bold shadow-sm">
                    01
                  </span>
                  <span className="w-7 h-7 rounded-full bg-white dark:bg-white/10 text-[#113B27] dark:text-[#84C135] border border-black/10 dark:border-white/20 flex items-center justify-center text-xs font-mono font-bold shadow-sm">
                    02
                  </span>
                  <span className="w-7 h-7 rounded-full bg-white dark:bg-white/10 text-[#113B27] dark:text-[#84C135] border border-black/10 dark:border-white/20 flex items-center justify-center text-xs font-mono font-bold shadow-sm">
                    03
                  </span>
                </div>

                {/* Verified Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECF8EB] text-[#1E5C1B] border border-[#A6E09D] text-xs font-semibold">
                  <FaCircleCheck className="w-3.5 h-3.5 text-[#1E5C1B]" />
                  <span>100% Organic Certified</span>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 8: CIRCULAR GAUGES & METRICS (INTERACTIVE SANDBOX)
          ────────────────────────────────────────────────────────── */}
          <section id="metrics" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>08</span>
                <span>•</span>
                <span>Micro-Metric Storytelling & Gauges</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Interactive Circular Gauges & Real-time Meters
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                Directly inspired by the reference “Saving 610 kW” gauge. Adjust the sliders below to see the animated SVG arc and counter respond in real-time.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#113B27] text-white border border-[#174A32] shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Controller Panel */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#84C135] text-xs font-semibold">
                    <FaSliders className="w-3 h-3" />
                    <span>Live Gauge Playground</span>
                  </div>

                  {/* Percentage Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-2">
                      <span className="text-white/80">Gauge Capacity:</span>
                      <span className="font-bold text-[#84C135]">{gaugePercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={gaugePercent}
                      onChange={(e) => setGaugePercent(Number(e.target.value))}
                      className="w-full accent-[#84C135] cursor-pointer"
                    />
                  </div>

                  {/* Power Output Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-2">
                      <span className="text-white/80">Output Generation:</span>
                      <span className="font-bold text-white">{metricValue} kW</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1200"
                      step="10"
                      value={metricValue}
                      onChange={(e) => setMetricValue(Number(e.target.value))}
                      className="w-full accent-[#84C135] cursor-pointer"
                    />
                  </div>

                  {/* Color Preset Selector */}
                  <div>
                    <span className="block text-xs text-white/80 mb-2">Arc Accent Color:</span>
                    <div className="flex items-center gap-3">
                      {[
                        { color: "#84C135", name: "Solar Lime" },
                        { color: "#99D34C", name: "Bright Leaf" },
                        { color: "#D8C4B0", name: "Warm Bronze" },
                        { color: "#FFFFFF", name: "Pure White" },
                      ].map((item) => (
                        <button
                          key={item.color}
                          onClick={() => setGaugeColor(item.color)}
                          className={`w-7 h-7 rounded-full transition-all cursor-pointer ${
                            gaugeColor === item.color ? "ring-2 ring-white scale-110" : "opacity-80 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: item.color }}
                          title={item.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Preview Display */}
                <div className="lg:col-span-7 flex flex-wrap items-center justify-center gap-6">
                  {/* Gauge Card 1 */}
                  <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center gap-6 min-w-[260px]">
                    {/* SVG Radial Gauge */}
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-white/15"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          stroke={gaugeColor}
                          strokeDasharray={`${gaugePercent}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          fill="none"
                          className="transition-all duration-500 ease-out"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-xs font-mono font-bold text-white">{gaugePercent}%</span>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wider text-white/70 block">Saving</span>
                      <div className="text-3xl font-bold font-mono tracking-tight text-white">
                        {metricValue} <span className="text-sm font-normal text-white/80">kW</span>
                      </div>
                      <p className="text-[11px] text-white/60 mt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#84C135] animate-pulse" />
                        Baolala Solar Node
                      </p>
                    </div>
                  </div>

                  {/* Secondary Gauge Card */}
                  <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/15 min-w-[240px]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs uppercase tracking-wider text-white/70">Efficiency Index</span>
                      <FaLeaf className="w-4 h-4 text-[#84C135]" />
                    </div>
                    <div className="text-4xl font-mono font-bold text-[#84C135]">
                      +{Math.round(gaugePercent * 0.84)}%
                    </div>
                    <p className="text-xs text-white/70 mt-2">Permaculture biomass regeneration pace</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 9: GLASSMORPHIC FLOATING DATA OVERLAYS
          ────────────────────────────────────────────────────────── */}
          <section id="glass-overlays" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>09</span>
                <span>•</span>
                <span>Glassmorphic Data Overlays</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Floating Telemetry Widgets
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                Frosted glass overlays (<code className="font-mono">backdrop-blur-xl</code>) designed to float seamlessly over high-contrast nature photography.
              </p>
            </div>

            {/* Visual Simulated Background */}
            <div className="relative rounded-3xl overflow-hidden min-h-[360px] p-8 flex flex-col justify-between border border-black/10 dark:border-white/15 shadow-2xl bg-gradient-to-tr from-[#091E14] via-[#113B27] to-[#1E5C1B]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(132,193,53,0.2),transparent_50%)] pointer-events-none" />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#84C135] font-semibold">Visual Showcase</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Atmospheric Overlay Environment</h3>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/80 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#84C135] animate-pulse" />
                  Live Preview Mode
                </div>
              </div>

              {/* Floating Widgets Demonstration */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                {/* 1. Signature Kilowatt Floating Widget */}
                <div className="p-5 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-white/80 font-medium">Power Grid</span>
                    <span className="w-2 h-2 rounded-full bg-[#84C135] animate-pulse" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-white/20" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-[#84C135]" strokeDasharray="85, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-[10px] font-bold">85%</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold tracking-tight font-mono">700 <span className="text-xs font-normal text-white/80">kW</span></div>
                      <p className="text-[11px] text-white/70">Nettle Solar Grid</p>
                    </div>
                  </div>
                </div>

                {/* 2. Seedling Hub Widget */}
                <div className="p-5 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-xl text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-white/80 font-medium">Nursery Inventory</span>
                    <FaTree className="w-3.5 h-3.5 text-[#84C135]" />
                  </div>
                  <div className="text-2xl font-bold font-mono tracking-tight">45,000+</div>
                  <p className="text-[11px] text-white/70 mt-1">Indigenous & Fruit Saplings ready for planting</p>
                </div>

                {/* 3. Community Training Widget */}
                <div className="p-5 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-xl text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-white/80 font-medium">Kilifi Outreach</span>
                    <span className="text-xs font-mono font-bold text-[#84C135]">ACTIVE</span>
                  </div>
                  <div className="text-2xl font-bold font-mono tracking-tight">3,200+</div>
                  <p className="text-[11px] text-white/70 mt-1">Local farmers trained in organic soil renewal</p>
                </div>
              </div>

              <div className="relative z-10 text-[11px] text-white/60">
                Backdrop-blur: 16px–20px • Border: rgba(255,255,255,0.25) • Radius: rounded-3xl (28px)
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 10: BENTO CONTAINERS & CARDS
          ────────────────────────────────────────────────────────── */}
          <section id="cards" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>10</span>
                <span>•</span>
                <span>Cards & Bento Containers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Bento Architecture & Modular Cards
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                The four core card archetypes established in the Nettle Regenerative landing experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Clean White Bento Card */}
              <div className="p-6 rounded-3xl bg-white text-[#11231A] border border-black/5 shadow-[0_10px_30px_-10px_rgba(17,59,39,0.06)] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F2F7F4] text-[#113B27] flex items-center justify-center text-lg mb-4">
                    <FaSeedling />
                  </div>
                  <span className="text-xs font-semibold text-[#84C135] uppercase tracking-wider">Architecture 1</span>
                  <h3 className="text-lg font-bold mt-1">Clean Surface Bento</h3>
                  <p className="text-xs text-[#52665B] mt-2 leading-relaxed">
                    Pure white surface with soft 1px border and circular icon pod. Used for core pillars and value propositions.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-[#113B27]">
                  <span>Learn more</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 2: Dark Image-Backed Bento */}
              <div className="p-6 rounded-3xl bg-gradient-to-t from-[#091E14] via-[#113B27] to-[#174A32] text-white border border-white/15 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
                <div>
                  <span className="text-xs font-semibold text-[#84C135] uppercase tracking-wider">Architecture 2</span>
                  <h3 className="text-lg font-bold mt-1">Dark Metric Bento</h3>
                  <p className="text-xs text-white/75 mt-2 leading-relaxed">
                    Deep forest gradient scrim with circular kilowatt arc meter docked at the bottom.
                  </p>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-white/60 uppercase block">Saving</span>
                    <span className="text-2xl font-mono font-bold">610 kW</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-[#84C135] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#84C135] animate-ping" />
                  </div>
                </div>
              </div>

              {/* Card 3: Tall Story Portrait Card */}
              <div className="p-6 rounded-3xl bg-[#174A32] text-white border border-white/15 shadow-lg flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#091E14] via-[#113B27]/60 to-transparent z-10" />
                <div className="relative z-20 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                    <FaTree />
                  </div>
                </div>
                <div className="relative z-20">
                  <span className="text-[10px] uppercase tracking-widest text-[#84C135] font-semibold">Story Card</span>
                  <h3 className="text-base font-bold mt-1">Kilifi Native Flora</h3>
                  <p className="text-[11px] text-white/75 mt-1 line-clamp-2">
                    Resilient Baobab and Moringa tree nurseries restoring ecological balance.
                  </p>
                </div>
              </div>

              {/* Card 4: Docked Horizontal Glass Card */}
              <div className="p-5 rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-full bg-[#113B27] text-white dark:bg-[#84C135] dark:text-[#091E14] font-mono text-xs font-bold flex items-center justify-center">
                      01
                    </span>
                    <span className="text-[10px] font-mono opacity-60">STEP PROCESS</span>
                  </div>
                  <h3 className="text-sm font-bold">Soil Microbiome Rejuvenation</h3>
                  <p className="text-xs opacity-75 mt-1.5 leading-relaxed">
                    Zero-chemical biochar enrichment restoring biological diversity within 180 days.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#84C135]">
                  <span>Explore Stage 1</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 11: FORMS, INPUTS & THE SIGNATURE NEWSLETTER PILL
          ────────────────────────────────────────────────────────── */}
          <section id="forms" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>11</span>
                <span>•</span>
                <span>Forms & Signature Newsletter Capsule</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Inputs & Newsletter Pill Capsule
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                The signature footer element embeds the circular submit trigger directly within the pill-shaped input capsule.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Signature Newsletter Pill (Dark context demo) */}
              <div className="p-8 rounded-3xl bg-[#113B27] text-white border border-[#174A32] flex flex-col justify-between shadow-xl">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#84C135] font-semibold">Signature Pattern</span>
                  <h3 className="text-xl font-bold mt-1">Embedded Newsletter Pill Capsule</h3>
                  <p className="text-xs text-white/75 mt-2 leading-relaxed">
                    Seamless capsule (<code className="font-mono">rounded-full</code>) containing email input and a nested circular action button.
                  </p>
                </div>

                <div className="my-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newsletterEmail) {
                        setNewsletterSent(true);
                        setTimeout(() => setNewsletterSent(false), 4000);
                        setNewsletterEmail("");
                      }
                    }}
                    className="relative flex items-center w-full max-w-md bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-1.5 focus-within:border-[#84C135] focus-within:ring-2 focus-within:ring-[#84C135]/40 transition-all"
                  >
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      required
                      className="w-full bg-transparent text-white placeholder-white/50 text-xs sm:text-sm pl-4 pr-2 py-2 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-10 h-10 rounded-full bg-white text-[#113B27] hover:bg-[#84C135] hover:text-[#091E14] flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md"
                      aria-label="Subscribe"
                    >
                      <FaArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {newsletterSent && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#99D34C]">
                      <FaCircleCheck className="w-3.5 h-3.5" />
                      <span>Subscribed successfully to Kilifi updates!</span>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-white/60 font-mono">
                  class: rounded-full bg-white/10 border-white/20 focus-within:border-[#84C135]
                </div>
              </div>

              {/* Standard In-App Inputs */}
              <div className="p-8 rounded-3xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-4">
                <h4 className="text-xs uppercase font-bold tracking-wider opacity-70">Standard Form Elements</h4>

                {/* Pill Search Input */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Pill Search Bar</label>
                  <div className="relative">
                    <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 w-3.5 h-3.5" />
                    <input
                      type="text"
                      placeholder="Search species, metrics, plots..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-black/30 border border-black/10 dark:border-white/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#84C135]"
                    />
                  </div>
                </div>

                {/* Standard Input */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Standard Input Field (`rounded-2xl`)</label>
                  <input
                    type="text"
                    defaultValue="Baolala Farm Plot 4"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-black/30 border border-black/10 dark:border-white/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#84C135]"
                  />
                </div>

                {/* Select Dropdown */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Select Menu (`rounded-2xl`)</label>
                  <div className="relative">
                    <select className="w-full appearance-none px-4 py-2.5 rounded-2xl bg-white dark:bg-black/30 border border-black/10 dark:border-white/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#84C135] cursor-pointer">
                      <option>Kilifi Coastal Permaculture</option>
                      <option>Indigenous Tree Nursery</option>
                      <option>Solar Irrigation Network</option>
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 opacity-60 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 12: NAVIGATION, TABS & STEPPERS
          ────────────────────────────────────────────────────────── */}
          <section id="tabs-nav" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>12</span>
                <span>•</span>
                <span>Navigation & Segmented Switches</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Segmented Switches & Steppers
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                Tactile tabs and the testimonial counter stepper (<code className="font-mono">01 / 03</code>).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Segmented Pill Tabs */}
              <div className="p-8 rounded-3xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <h4 className="text-xs uppercase font-bold tracking-wider opacity-70 mb-4">Segmented Pill Switch</h4>
                
                <div className="inline-flex p-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/15 gap-1">
                  {["Overview", "Telemetry", "Agronomy", "Community"].map((tab, idx) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(idx)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === idx
                          ? "bg-[#113B27] text-white shadow-sm"
                          : "text-inherit opacity-70 hover:opacity-100"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 text-xs">
                  Active Tab Index: <span className="font-mono font-bold text-[#84C135]">{activeTab}</span> (Switches state smoothly)
                </div>
              </div>

              {/* Numerical Stepper / Pagination */}
              <div className="p-8 rounded-3xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider opacity-70 mb-4">
                    Testimonial Stepper Widget (`01 / 03`)
                  </h4>
                  <p className="text-xs opacity-75 mb-4">
                    Modeled directly on the reference pagination control with twin circular controls.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 font-mono font-bold text-sm tracking-wider">
                    0{currentStep} / 03
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentStep((prev) => (prev > 1 ? prev - 1 : 3))}
                      className="w-10 h-10 rounded-full border border-black/20 dark:border-white/25 flex items-center justify-center hover:bg-[#113B27] hover:text-white hover:border-[#113B27] transition-all cursor-pointer"
                      aria-label="Previous item"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentStep((prev) => (prev < 3 ? prev + 1 : 1))}
                      className="w-10 h-10 rounded-full border border-black/20 dark:border-white/25 flex items-center justify-center hover:bg-[#113B27] hover:text-white hover:border-[#113B27] transition-all cursor-pointer"
                      aria-label="Next item"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 13: FEEDBACK, ALERTS & MODALS
          ────────────────────────────────────────────────────────── */}
          <section id="feedback" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>13</span>
                <span>•</span>
                <span>Feedback, Alerts & Dialogs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Alert Banners & Interactive Modal
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                Clear system communications with rounded-2xl geometry and accessible color contrast.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Alert Banners */}
              <div className="space-y-3">
                {/* Success */}
                <div className="p-4 rounded-2xl bg-[#ECF8EB] text-[#1E5C1B] border border-[#A6E09D] flex items-start gap-3 text-xs">
                  <FaCircleCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Production Milestone Achieved</strong>
                    Baolala solar grid exceeded daily generation targets by 14.8%.
                  </div>
                </div>

                {/* Warning */}
                <div className="p-4 rounded-2xl bg-[#FFF8E6] text-[#7A4B00] border border-[#F7D278] flex items-start gap-3 text-xs">
                  <FaTriangleExclamation className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Water Reservoir Advisory</strong>
                    Rainwater catchment levels at 35%. Supplemental drip irrigation active.
                  </div>
                </div>

                {/* Error */}
                <div className="p-4 rounded-2xl bg-[#FDF2F2] text-[#8E1E1E] border border-[#F5A3A3] flex items-start gap-3 text-xs">
                  <FaCircleExclamation className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Telemetry Sensor Offline</strong>
                    Plot 3 soil moisture sensor failed to heartbeat at 14:00 EAT.
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 rounded-2xl bg-[#F2F7F4] text-[#113B27] border border-[#C3D8CD] flex items-start gap-3 text-xs">
                  <FaCircleInfo className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Permaculture Workshop Notice</strong>
                    Community session scheduled for Saturday 9:00 AM at Baolala nursery.
                  </div>
                </div>
              </div>

              {/* Modal Demo Trigger & Skeletons */}
              <div className="p-8 rounded-3xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider opacity-70 mb-3">Interactive Dialog Demo</h4>
                  <p className="text-xs opacity-75 mb-6">
                    Click to launch the modal dialog with backdrop blur and organic 32px rounded corners.
                  </p>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#113B27] text-white text-xs sm:text-sm font-semibold hover:bg-[#84C135] hover:text-[#091E14] transition-all cursor-pointer shadow-md"
                  >
                    <span>Launch Sample Dialog</span>
                    <FaArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Skeleton Shimmer */}
                <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
                  <span className="text-[11px] font-mono opacity-60 block mb-2">Skeleton Loading Shimmer:</span>
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded-full w-3/4" />
                    <div className="h-3 bg-black/10 dark:bg-white/10 rounded-full w-1/2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Modal Component */}
            <AnimatePresence>
              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsModalOpen(false)}
                    className="absolute inset-0 bg-[#091E14]/75 backdrop-blur-md"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative z-10 w-full max-w-lg rounded-[32px] bg-white text-[#11231A] p-8 shadow-2xl border border-black/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84C135]/15 text-[#113B27] text-xs font-semibold">
                        <FaLeaf className="w-3 h-3 text-[#84C135]" />
                        <span>Nettle Modal Dialog</span>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-sm cursor-pointer transition-colors"
                        aria-label="Close dialog"
                      >
                        <FaXmark className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight">Ecosystem Restoration Plan</h3>
                    <p className="text-sm text-[#52665B] mt-2 leading-relaxed">
                      This modal demonstrates our strict 32px rounded geometry, high legibility contrast, and clean pill dismiss action.
                    </p>

                    <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-end gap-3">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-5 py-2.5 rounded-full text-xs font-semibold text-neutral-600 hover:text-black cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2.5 rounded-full bg-[#113B27] text-white hover:bg-[#84C135] hover:text-[#091E14] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Confirm Action
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 14: DESIGN DO'S AND DON'TS
          ────────────────────────────────────────────────────────── */}
          <section id="guidelines" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>14</span>
                <span>•</span>
                <span>Design Guidelines</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Visual Do’s and Don’ts
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                Guarding the aesthetic integrity of Nettle Regenerative.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pair 1: Pill Buttons vs Square Buttons */}
              <div className="p-6 rounded-3xl bg-[#ECF8EB] dark:bg-[#1E5C1B]/20 border border-[#A6E09D] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1E5C1B] dark:text-[#A6E09D] uppercase tracking-wider mb-2">
                    <FaCircleCheck className="w-4 h-4" />
                    <span>DO: Always use Pill Buttons (`rounded-full`)</span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed mb-4">
                    All primary buttons, tags, search fields, and newsletter capsules must strictly use full pill curvature.
                  </p>
                </div>
                <button className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#113B27] text-white text-xs font-semibold shadow-sm">
                  <span>Explore Projects</span>
                  <span>→</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-[#FDF2F2] dark:bg-[#8E1E1E]/20 border border-[#F5A3A3] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8E1E1E] dark:text-[#F5A3A3] uppercase tracking-wider mb-2">
                    <FaCircleExclamation className="w-4 h-4" />
                    <span>DON’T: Never use Square Corners (`rounded-none`)</span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed mb-4">
                    Sharp 90-degree industrial edges violate the organic, human-friendly atmosphere.
                  </p>
                </div>
                <div className="self-start inline-flex items-center gap-2 px-5 py-2.5 bg-[#8E1E1E] text-white text-xs font-semibold rounded-none opacity-80 line-through">
                  <span>Explore Projects</span>
                  <span>→</span>
                </div>
              </div>

              {/* Pair 2: Bento Card Radii */}
              <div className="p-6 rounded-3xl bg-[#ECF8EB] dark:bg-[#1E5C1B]/20 border border-[#A6E09D] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1E5C1B] dark:text-[#A6E09D] uppercase tracking-wider mb-2">
                    <FaCircleCheck className="w-4 h-4" />
                    <span>DO: Use 28px–32px Bento Corners (`rounded-3xl`)</span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">
                    Main layout bento containers require generous modern corner radii and subtle ambient borders.
                  </p>
                </div>
                <div className="mt-4 p-4 rounded-3xl bg-white text-[#113B27] border border-black/10 text-xs font-semibold">
                  Generous 28px organic boundary
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#FDF2F2] dark:bg-[#8E1E1E]/20 border border-[#F5A3A3] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8E1E1E] dark:text-[#F5A3A3] uppercase tracking-wider mb-2">
                    <FaCircleExclamation className="w-4 h-4" />
                    <span>DON’T: Never Flood Solar Lime as Full Canvas</span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">
                    #84C135 (Solar Lime) is an energetic accent for feedback and gauges, never a background wash.
                  </p>
                </div>
                <div className="mt-4 p-4 bg-[#84C135] text-[#091E14] text-xs font-bold rounded-none opacity-80 line-through">
                  Avoid flooding lime canvas!
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              SECTION 15: DEVELOPER CODE TOKENS & EXPORT
          ────────────────────────────────────────────────────────── */}
          <section id="developer" className="scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#84C135] font-semibold">
                <span>15</span>
                <span>•</span>
                <span>Developer Tokens & Code Export</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                Developer Implementation Tokens
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-1 max-w-2xl">
                Ready-to-use Tailwind CSS v4 <code className="font-mono">@theme</code> and CSS variables directly copied from <code className="font-mono">design.md</code>.
              </p>
            </div>

            <div className="space-y-6">
              {/* Tailwind CSS v4 Theme Block */}
              <div className="rounded-3xl bg-[#091E14] text-white p-6 border border-white/15 font-mono text-xs overflow-hidden relative">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="text-xs font-sans text-white/70 ml-2">app/globals.css (@theme inline)</span>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `@theme inline {
  --color-brand-primary: #113B27;
  --color-brand-primary-hover: #174A32;
  --color-brand-primary-deep: #091E14;
  --color-brand-secondary: #84C135;
  --color-brand-secondary-hover: #6BA327;
  --color-brand-accent: #654320;
  --color-canvas: #F7F9F6;
  --radius-3xl: 28px;
}`,
                        "Tailwind Theme Tokens"
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                  >
                    <FaCopy className="w-3 h-3 text-[#84C135]" />
                    <span>Copy Theme</span>
                  </button>
                </div>

                <pre className="overflow-x-auto text-white/85 leading-relaxed">
{`@theme inline {
  /* Brand Core Colors */
  --color-brand-primary: #113B27;
  --color-brand-primary-hover: #174A32;
  --color-brand-primary-deep: #091E14;
  
  --color-brand-secondary: #84C135;
  --color-brand-secondary-hover: #6BA327;
  --color-brand-secondary-light: #EBF7D9;
  
  --color-brand-accent: #654320;
  --color-brand-accent-hover: #7F562B;

  /* Surfaces & Typography */
  --color-canvas: #F7F9F6;
  --font-sans: var(--font-geist-sans), "Inter", sans-serif;
  --font-mono: var(--font-geist-mono), monospace;

  /* Geometry */
  --radius-3xl: 28px;
}`}
                </pre>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ──────────────────────────────────────────────────────────
          FOOTER WITH QUICK RETURN
      ────────────────────────────────────────────────────────── */}
      <footer className="bg-[#091E14] text-white py-12 px-4 sm:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
              <FaLeaf className="text-[#113B27] w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm">Nettle Regenerative Design System</span>
              <p className="text-[11px] text-white/60">Kilifi County, Kenya • Authoritative UI Specification</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#84C135] text-[#091E14] text-xs font-bold hover:bg-[#99D34C] transition-colors shadow-lg cursor-pointer"
            >
              <span>Return to Farm Website</span>
              <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
