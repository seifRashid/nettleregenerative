"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaLeaf,
  FaArrowRight,
  FaLocationDot,
  FaSeedling,
  FaTree,
  FaWheatAwn,
  FaUsers,
  FaCheck,
  FaBars,
  FaXmark,
  FaEnvelope,
  FaEarthAfrica,
  FaBasketShopping,
  FaGraduationCap,
  FaHandsHoldingCircle,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";
import {
  AnimatedCounter,
  AnimatedGauge,
  FadeIn,
  staggerContainerVariants,
  staggerItemVariants,
} from "./components/MotionComponents";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // GSAP Parallax Refs
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const showcaseImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || shouldReduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero background slow cinematic parallax
      if (heroBgRef.current && heroSectionRef.current) {
        gsap.to(heroBgRef.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // 2. Showcase image subtle parallax
      if (showcaseImageRef.current) {
        gsap.to(showcaseImageRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: showcaseImageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F6] text-[#11231A] selection:bg-[#84C135] selection:text-[#113B27] overflow-x-hidden">
      {/* ──────────────────────────────────────────────────────────
          1. FLOATING NAVIGATION BAR WITH ENTRANCE ANIMATION
      ────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 sm:pt-6 transition-all"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Separate Brand Logo on Left (as in attached design) */}
          <a href="#" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-full overflow-hidden bg-white border border-white/40 shadow-xl flex items-center justify-center shrink-0 relative transition-transform"
            >
              <Image
                src="/images/logo.jpg"
                alt="Nettle Regenerative (K) Limited Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight leading-tight text-white drop-shadow-md group-hover:text-[#84C135] transition-colors">
                Nettle Regenerative
              </span>
              <span className="text-[10px] text-white/80 tracking-wider uppercase font-medium drop-shadow-sm">
                Kilifi County, Kenya
              </span>
            </div>
          </a>

          {/* Separate Frosted Glass Pill Menu on Right (as in attached design) */}
          <nav className="hidden md:flex items-center bg-white/15 backdrop-blur-xl border border-white/20 rounded-full p-1.5 shadow-2xl text-white">
            <a
              href="#who-we-are"
              className="px-4 py-1.5 rounded-full bg-white text-[#113B27] text-xs sm:text-sm font-semibold shadow-sm hover:bg-[#84C135] hover:text-[#091E14] transition-all"
            >
              Who We Are
            </a>
            <a
              href="#focus-areas"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/85 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              Our Focus
            </a>
            <a
              href="#sustainability"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/85 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              Sustainability
            </a>
            <a
              href="#nursery"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/85 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              Seedling Hub
            </a>
            <a
              href="#founder"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/85 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              Our Story
            </a>
            <motion.a
              href="#sustainability"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="ml-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#84C135] text-[#091E14] text-xs sm:text-sm font-semibold tracking-wide hover:bg-[#99D34C] transition-colors shadow-md"
            >
              <span>Visit Farm</span>
              <FaArrowRight className="w-2.5 h-2.5" />
            </motion.a>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 flex items-center justify-center text-white focus:outline-none shadow-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaXmark className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
          </motion.button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden mt-2 p-5 rounded-3xl bg-[#113B27]/98 backdrop-blur-2xl border border-white/20 text-white shadow-2xl flex flex-col gap-3"
            >
              {[
                { label: "Who We Are", href: "#who-we-are" },
                { label: "Our Focus", href: "#focus-areas" },
                { label: "Sustainability in Practice", href: "#sustainability" },
                { label: "Plant Nursery", href: "#nursery" },
                { label: "Founder's Journey", href: "#founder" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-4 rounded-xl hover:bg-white/10 font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#sustainability"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 py-3 rounded-full bg-[#84C135] text-[#091E14] text-center font-semibold text-sm flex items-center justify-center gap-2"
              >
                <span>Visit Our Farm</span>
                <FaArrowRight className="w-3 h-3" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ──────────────────────────────────────────────────────────
          2. HERO SECTION (CINEMATIC PARALLAX & STAGGERED REVEAL)
      ────────────────────────────────────────────────────────── */}
      <section
        ref={heroSectionRef}
        className="relative min-h-[92vh] sm:min-h-screen flex items-center pt-28 pb-16 px-4 sm:px-8 overflow-hidden"
      >
        {/* Parallax Background Container */}
        <div ref={heroBgRef} className="absolute inset-0 z-0 will-change-transform">
          <Image
            src="/images/heroimage.jpg"
            alt="Nettle Regenerative Farm in Baolala, Kilifi County, Kenya"
            fill
            priority
            className="object-cover object-center transform scale-110"
          />
          {/* Atmospheric Dark Gradient Scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#091E14] via-[#091E14]/55 to-[#091E14]/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#091E14]/85 via-[#091E14]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Main Hero Copy (Left) */}
          <div className="lg:col-span-8 flex flex-col items-start text-left text-white pt-8 sm:pt-16">
            {/* 1. Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#84C135] text-xs sm:text-sm font-semibold mb-6 tracking-wide shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#84C135] animate-ping" />
              <span>Baolala, Kilifi County • Regenerative Permaculture</span>
            </motion.div>

            {/* 2. Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] text-white max-w-3xl mb-6"
            >
              Empowering Communities. <br className="hidden sm:inline" />
              Restoring Nature. <br className="hidden sm:inline" />
              <span className="text-[#84C135]">Growing a Sustainable Future.</span>
            </motion.h1>

            {/* 3. Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl font-normal leading-relaxed mb-8"
            >
              At Nettle regenerative &apos;k&apos; limited, we equip local communities in Kilifi
              County, Kenya, with the knowledge and skills to grow food sustainably, restore the
              environment, and build better livelihoods.
            </motion.p>

            {/* 4. Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <motion.a
                href="#sustainability"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white text-[#113B27] text-sm sm:text-base font-semibold tracking-wide hover:bg-[#84C135] hover:text-[#091E14] transition-all duration-300 shadow-2xl"
              >
                <span>Visit Our Farm</span>
                <span className="w-7 h-7 rounded-full bg-black/5 group-hover:bg-black/10 flex items-center justify-center text-xs transition-transform duration-300 group-hover:translate-x-1">
                  <FaArrowRight className="w-3 h-3 text-[#113B27]" />
                </span>
              </motion.a>

              <motion.a
                href="#who-we-are"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 text-white text-sm sm:text-base font-semibold border border-white/25 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
              >
                <span>Our Story</span>
              </motion.a>
            </motion.div>

            {/* 5. Social / Direct Proof Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex items-center gap-3 pt-2"
            >
              <span className="text-xs text-white/60 tracking-wider uppercase font-medium">
                Connect:
              </span>
              {[
                { icon: FaLocationDot, href: "#contact", title: "Location" },
                { icon: FaSeedling, href: "#sustainability", title: "Training" },
                { icon: FaTree, href: "#nursery", title: "Trees" },
              ].map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full border border-white/25 bg-white/5 flex items-center justify-center text-white/80 hover:bg-[#84C135] hover:text-[#113B27] hover:border-[#84C135] transition-colors text-xs"
                  title={item.title}
                  aria-label={item.title}
                >
                  <item.icon className="w-3.5 h-3.5" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Floating Live Metric Overlay Card (Right / Bottom) */}
          <div className="lg:col-span-4 w-full flex justify-end">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              animate-float={!shouldReduceMotion ? "true" : undefined}
              className="w-full max-w-sm p-6 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-2xl text-white hover:shadow-[#84C135]/20 hover:border-white/40 transition-all duration-500"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#84C135] animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                    Live Demo Farm
                  </span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/20 text-white font-medium">
                  Baolala
                </span>
              </div>

              {/* Animated Circular Gauge Graphic */}
              <div className="flex items-center gap-4 mb-4">
                <AnimatedGauge percentage={100} duration={1.8} color="#84C135" />

                <div>
                  <div className="text-xl font-bold tracking-tight text-white">
                    Chemical-Free
                  </div>
                  <p className="text-xs text-white/70">
                    Permaculture & Organic Soil Care
                  </p>
                </div>
              </div>

              {/* Mini Preview Box */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-3 rounded-2xl bg-black/20 border border-white/10 flex items-center gap-3 transition-colors hover:bg-black/30"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                  <Image
                    src="/images/nursery.jpg"
                    alt="Seedlings preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    Plant Nursery & Seedling Hub
                  </p>
                  <p className="text-[11px] text-[#84C135]">
                    Fruit, indigenous & herbs ready
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          3. BENTO GRID / IMPACT STATS SECTION WITH NUMBER COUNTERS
      ────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F7F9F6]">
        <div className="max-w-7xl mx-auto">
          {/* Centered Section Header */}
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27]/80 bg-[#113B27]/10 px-4 py-1.5 rounded-full inline-block mb-3">
              Permaculture in Action
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight">
              Transforming Soil, Nourishing Lives in Kilifi
            </h2>
          </FadeIn>

          {/* 3-Card Bento Grid */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {/* Card 1: Rich Image Card with Animated Counter & Pulse */}
            <motion.div
              variants={staggerItemVariants}
              whileHover={!shouldReduceMotion ? { y: -6 } : {}}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-3xl p-8 min-h-[380px] flex flex-col justify-between text-white shadow-xl group border border-white/15"
            >
              <Image
                src="/images/nursery.jpg"
                alt="Plant nursery with fruit and indigenous tree saplings"
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091E14]/95 via-[#113B27]/50 to-transparent" />

              <div className="relative z-10">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#84C135] bg-black/30 px-3 py-1 rounded-full backdrop-blur-md inline-block mb-3 border border-white/10">
                  Reforestation Hub
                </span>
                <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                  Trees planted including fruit trees, indigenous and herbs
                </h3>
              </div>

              <div className="relative z-10 flex items-end justify-between pt-6 border-t border-white/20">
                <div>
                  <span className="text-xs text-white/70 uppercase tracking-wider block">
                    Total Capacity
                  </span>
                  <div className="text-3xl font-bold tracking-tight text-[#84C135]">
                    <AnimatedCounter from={100} to={3500} suffix="+" duration={2} />
                  </div>
                  <span className="text-xs text-white/80 block">
                    Seedlings Distributed
                  </span>
                </div>

                {/* Radial Gauge Graphic */}
                <div className="w-14 h-14 rounded-full border-2 border-white/20 border-t-[#84C135] border-r-[#84C135] transform rotate-45 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#84C135] animate-pulse" />
                </div>
              </div>
            </motion.div>

            {/* Card 2: Clean Surface Card - Soil Health */}
            <motion.div
              variants={staggerItemVariants}
              whileHover={!shouldReduceMotion ? { y: -6, boxShadow: "0 20px 40px -15px rgba(17, 59, 39, 0.12)" } : {}}
              transition={{ duration: 0.3 }}
              className="rounded-3xl p-8 bg-white border border-[#113B27]/10 shadow-sm transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.05 }}
                  className="w-14 h-14 rounded-2xl bg-[#F2F7F4] text-[#113B27] flex items-center justify-center text-2xl mb-6 shadow-inner"
                >
                  <FaWheatAwn className="w-7 h-7 text-[#113B27]" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#113B27] mb-3">
                  Soil Healing & Compost
                </h3>
                <p className="text-sm text-[#52665B] leading-relaxed">
                  Rebuilding soil fertility in the semi-arid sandy loam ground of Baolala
                  through organic matter, active composting, and water-harvesting swales
                  without chemical fertilizers.
                </p>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#113B27]">
                <span>100% Natural Fertility</span>
                <span className="w-6 h-6 rounded-full bg-[#84C135]/20 flex items-center justify-center text-[#3B660E]">
                  <FaCheck className="w-3 h-3 text-[#3B660E]" />
                </span>
              </div>
            </motion.div>

            {/* Card 3: Clean Surface Card - Community Empowerment */}
            <motion.div
              variants={staggerItemVariants}
              whileHover={!shouldReduceMotion ? { y: -6, boxShadow: "0 20px 40px -15px rgba(17, 59, 39, 0.12)" } : {}}
              transition={{ duration: 0.3 }}
              className="rounded-3xl p-8 bg-white border border-[#113B27]/10 shadow-sm transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <motion.div
                  whileHover={{ rotate: -8, scale: 1.05 }}
                  className="w-14 h-14 rounded-2xl bg-[#F2F7F4] text-[#113B27] flex items-center justify-center text-2xl mb-6 shadow-inner"
                >
                  <FaHandsHoldingCircle className="w-7 h-7 text-[#113B27]" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#113B27] mb-3">
                  Economic Self-Reliance
                </h3>
                <p className="text-sm text-[#52665B] leading-relaxed">
                  Providing local families with a viable, sustainable alternative to
                  deforesting charcoal burning, ensuring stable livelihoods and nutritious food
                  for their children.
                </p>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#113B27]">
                <span>Eradicating Hunger</span>
                <span className="w-6 h-6 rounded-full bg-[#84C135]/20 flex items-center justify-center text-[#3B660E]">
                  <FaCheck className="w-3 h-3 text-[#3B660E]" />
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. WHO WE ARE & ABOUT US SECTION
      ────────────────────────────────────────────────────────── */}
      <section id="who-we-are" className="py-20 sm:py-28 px-4 sm:px-8 bg-white border-y border-[#113B27]/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column (Left) */}
            <div className="lg:col-span-6 relative">
              <FadeIn yOffset={32}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-[#113B27]/10 group">
                  <Image
                    src="/images/community.jpg"
                    alt="Lenox Kipondah and local community members in Baolala permaculture workshop"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </FadeIn>

              {/* Floating Badge on Image with subtle slide-in */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="absolute -bottom-6 -right-4 sm:bottom-6 sm:-right-6 p-5 rounded-2xl bg-[#113B27] text-white shadow-2xl border border-white/20 max-w-[260px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#84C135] flex items-center justify-center text-[#113B27] shrink-0 shadow-md">
                    <FaLeaf className="w-5 h-5 text-[#113B27]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-tight">Lenox Chome Kipondah</h4>
                    <p className="text-[11px] text-white/75">Founder & Permaculture Specialist</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Narrative Column (Right) */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <FadeIn>
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#84C135] bg-[#113B27] px-4 py-1.5 rounded-full inline-block mb-4">
                  Who We Are
                </span>

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight mb-6">
                  Rooted in Baolala, Healing the Earth for Generations
                </h2>

                <p className="text-base sm:text-lg text-[#11231A] font-medium leading-relaxed mb-4">
                  Nettle Regenerative Farm is a community-based initiative founded by{" "}
                  <strong className="text-[#113B27] font-bold">Lenox Chome Kipondah</strong> to
                  empower people through{" "}
                  <strong className="text-[#113B27] font-bold">permaculture</strong> — a sustainable
                  approach to farming that heals the soil, strengthens food security, and uplifts
                  livelihoods.
                </p>

                <p className="text-base text-[#52665B] leading-relaxed mb-6">
                  From our base in{" "}
                  <strong className="text-[#113B27]">Baolala, Kilifi County</strong>, we teach
                  farmers and families practical, eco-friendly ways to grow nutritious food while
                  protecting the planet for future generations.
                </p>
              </FadeIn>

              {/* Highlight Box: Founder Insight */}
              <FadeIn delay={0.2} className="w-full">
                <div id="founder" className="p-6 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10 mb-8 hover:border-[#84C135]/40 transition-colors">
                  <h4 className="text-sm font-bold text-[#113B27] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FaSeedling className="w-4 h-4 text-[#84C135]" />
                    <span>Founder&apos;s Mission & Resilience</span>
                  </h4>
                  <p className="text-sm text-[#52665B] leading-relaxed italic">
                    &ldquo;After surviving a life-threatening injury and experiencing the miraculous healing
                    power of natural nutritional remedies, I dedicated my life to Permaculture. Trained
                    by the Permaculture Research Institute Kenya, I founded Nettle Farm to reverse the
                    severe environmental degradation, deforestation, and poverty in remote Kilifi.&rdquo;
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <motion.a
                  href="#sustainability"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#113B27] text-white text-sm font-semibold tracking-wide hover:bg-[#174A32] transition-all shadow-md"
                >
                  <span>Learn How We Work</span>
                  <FaArrowRight className="w-3.5 h-3.5" />
                </motion.a>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          5. OUR FOCUS AREA SECTION (3 PILLARS)
      ────────────────────────────────────────────────────────── */}
      <section id="focus-areas" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F7F9F6]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27]/80 bg-[#113B27]/10 px-4 py-1.5 rounded-full inline-block mb-3">
              Strategic Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight">
              Our Focus Area
            </h2>
            <p className="mt-3 text-base text-[#52665B]">
              Addressing the root causes of climate vulnerability and poverty through integrated
              permaculture action.
            </p>
          </FadeIn>

          {/* 3 Pillars Grid */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Pillar 1 */}
            <motion.div
              variants={staggerItemVariants}
              whileHover={!shouldReduceMotion ? { y: -8, boxShadow: "0 25px 50px -12px rgba(17, 59, 39, 0.15)" } : {}}
              transition={{ duration: 0.3 }}
              className="group p-8 rounded-3xl bg-white border border-[#113B27]/10 shadow-sm transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#EBF7D9] text-[#3B660E] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <FaWheatAwn className="w-8 h-8 text-[#3B660E]" />
                </div>
                <h3 className="text-xl font-bold text-[#113B27] mb-3 group-hover:text-[#3B660E] transition-colors">
                  Regenerative Agriculture
                </h3>
                <p className="text-sm sm:text-base text-[#52665B] leading-relaxed">
                  Promoting sustainable farming practices that restore soil health and increase
                  yields naturally. Rebuilding the moisture retention and microbial life of
                  sandy loam soil without harmful agrochemicals.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-semibold text-[#113B27]">
                <span className="w-2 h-2 rounded-full bg-[#84C135]" />
                <span>Zero Agrochemicals • Higher Yields</span>
              </div>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div
              variants={staggerItemVariants}
              whileHover={!shouldReduceMotion ? { y: -8, boxShadow: "0 25px 50px -12px rgba(17, 59, 39, 0.15)" } : {}}
              transition={{ duration: 0.3 }}
              className="group p-8 rounded-3xl bg-white border border-[#113B27]/10 shadow-sm transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#E4EDE8] text-[#113B27] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <FaUsers className="w-8 h-8 text-[#113B27]" />
                </div>
                <h3 className="text-xl font-bold text-[#113B27] mb-3 group-hover:text-[#174A32] transition-colors">
                  Community Empowerment
                </h3>
                <p className="text-sm sm:text-base text-[#52665B] leading-relaxed">
                  Equipping individuals and families with hands-on training for self-sufficiency
                  and better livelihoods. Supplying seedlings, technical knowledge, and fair
                  economic opportunities to sell surplus crops.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-semibold text-[#113B27]">
                <span className="w-2 h-2 rounded-full bg-[#84C135]" />
                <span>Youth & Women • Self-Reliance</span>
              </div>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div
              variants={staggerItemVariants}
              whileHover={!shouldReduceMotion ? { y: -8, boxShadow: "0 25px 50px -12px rgba(17, 59, 39, 0.15)" } : {}}
              transition={{ duration: 0.3 }}
              className="group p-8 rounded-3xl bg-white border border-[#113B27]/10 shadow-sm transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#F1E9E0] text-[#654320] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <FaEarthAfrica className="w-8 h-8 text-[#654320]" />
                </div>
                <h3 className="text-xl font-bold text-[#113B27] mb-3 group-hover:text-[#654320] transition-colors">
                  Environmental Restoration
                </h3>
                <p className="text-sm sm:text-base text-[#52665B] leading-relaxed">
                  Rebuilding ecosystems through tree planting, soil regeneration, and caring for
                  the earth at large. Counteracting the devastating deforestation caused by
                  charcoal burning and unsustainable overgrazing.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-semibold text-[#113B27]">
                <span className="w-2 h-2 rounded-full bg-[#84C135]" />
                <span>Reforestation • Watershed Care</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          6. SUSTAINABILITY IN PRACTICE (SPLIT SHOWCASE)
      ────────────────────────────────────────────────────────── */}
      <section id="sustainability" className="py-20 sm:py-28 px-4 sm:px-8 bg-white border-y border-[#113B27]/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <FadeIn>
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27]/80 bg-[#113B27]/10 px-4 py-1.5 rounded-full inline-block mb-4">
                  Demonstration Site
                </span>

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight mb-6">
                  Sustainability in Practice
                </h2>

                <p className="text-base sm:text-lg text-[#11231A] font-medium leading-relaxed mb-4">
                  At <strong className="text-[#113B27]">Nettle Regenerative Farm</strong>, our land is
                  more than just soil — it’s a living classroom for sustainability and community
                  empowerment. Located in the heart of{" "}
                  <strong className="text-[#113B27]">Baolala, Kilifi County</strong>, our
                  demonstration site showcases how regenerative agriculture can restore soil
                  health, improve food security, and rebuild livelihoods.
                </p>

                <p className="text-base text-[#52665B] leading-relaxed mb-6">
                  Here, we train local farmers and community members on practical, hands-on
                  techniques in{" "}
                  <strong className="text-[#113B27]">
                    permaculture, composting, tree planting
                  </strong>
                  , and{" "}
                  <strong className="text-[#113B27]">
                    chemical-free food production
                  </strong>
                  . The farm also serves as a seedling hub, where we grow and distribute tree and
                  vegetable seedlings to promote reforestation and self-reliance.
                </p>
              </FadeIn>

              {/* Core Feature Checklist with Stagger Animation */}
              <div className="space-y-3 mb-8 w-full">
                {[
                  "Hands-on Permaculture & Living Soil Composting Workshops",
                  "Indigenous Tree, Fruit & Vegetable Seedling Nursery Distribution",
                  "Nutritious, 100% Chemical-Free Food Production for Fair Economic Growth",
                ].map((item, idx) => (
                  <FadeIn key={idx} delay={0.15 * (idx + 1)}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10 hover:border-[#84C135]/40 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#84C135] flex items-center justify-center text-[#113B27] text-xs shrink-0 shadow-sm">
                        <FaCheck className="w-3.5 h-3.5 text-[#113B27]" />
                      </div>
                      <span className="text-sm font-semibold text-[#11231A]">
                        {item}
                      </span>
                    </motion.div>
                  </FadeIn>
                ))}
              </div>

              {/* Primary Pill Button */}
              <FadeIn delay={0.4}>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#113B27] text-white text-base font-semibold tracking-wide hover:bg-[#174A32] transition-all shadow-xl"
                >
                  <span>Visit Our Farm</span>
                  <span className="w-6 h-6 rounded-full bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <FaArrowRight className="w-3 h-3 text-white" />
                  </span>
                </motion.a>
              </FadeIn>
            </div>

            {/* Right Visual Column with Parallax & Floating Widget */}
            <div className="lg:col-span-6 relative">
              <FadeIn yOffset={32}>
                <div
                  ref={showcaseImageRef}
                  className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-[#113B27]/10 will-change-transform group"
                >
                  <Image
                    src="/images/demo-farm.jpg"
                    alt="Nettle Regenerative Farm demonstration site in Baolala with solar panels, compost bays, and vegetable beds"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </FadeIn>

              {/* Frosted Glassmorphic Overlay Widget with subtle float */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="absolute -bottom-6 -left-4 sm:bottom-6 sm:-left-6 p-6 rounded-3xl bg-[#113B27]/90 backdrop-blur-xl border border-white/25 shadow-2xl text-white max-w-[280px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#84C135] font-semibold">
                    Living Classroom
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#84C135] animate-ping" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white/25 border-t-[#84C135] border-r-[#84C135] flex items-center justify-center text-[#84C135]">
                    <FaSeedling className="w-5 h-5 text-[#84C135]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight">Baolala</div>
                    <p className="text-xs text-white/70">Kilifi Demonstration Site</p>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-white/80 border-t border-white/15 pt-2">
                  Open for farmer field days, youth training & tours.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          7. THREE-COLUMN STORY / PHOTO SECTION (VISUAL PROOF)
      ────────────────────────────────────────────────────────── */}
      <section id="nursery" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F7F9F6]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27]/80 bg-[#113B27]/10 px-4 py-1.5 rounded-full inline-block mb-3">
              Field Realities & Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight">
              From Sandy Soil to Bountiful Food Forests
            </h2>
          </FadeIn>

          {/* 3 Tall Portrait Story Cards */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                src: "/images/community.jpg",
                alt: "Practical community training",
                icon: FaGraduationCap,
                step: "Step 01 • Education",
                title: "The Mission of Knowledge",
                desc: "Training youth, women, and local smallholders in permaculture, natural pest control, and water retention.",
              },
              {
                src: "/images/nursery.jpg",
                alt: "Plant nursery with seedlings",
                icon: FaTree,
                step: "Step 02 • Reforestation",
                title: "Nursery & Seedling Supply",
                desc: "Supplying indigenous, fruit, and medicinal seedlings to reverse deforestation and rebuild native tree cover.",
              },
              {
                src: "/images/harvest.jpg",
                alt: "Fresh organic harvest",
                icon: FaBasketShopping,
                step: "Step 03 • Abundance",
                title: "Chemical-Free Abundance",
                desc: "Nutritious food for families and surplus sales for school fees, healthcare, and poverty eradication.",
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                variants={staggerItemVariants}
                whileHover={!shouldReduceMotion ? { y: -8 } : {}}
                transition={{ duration: 0.35 }}
                className="relative rounded-3xl overflow-hidden shadow-xl min-h-[440px] flex flex-col justify-between p-8 text-white group border border-white/15"
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091E14]/95 via-[#113B27]/40 to-transparent" />

                <div className="relative z-10 flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md"
                  >
                    <card.icon className="w-5 h-5 text-white" />
                  </motion.div>
                </div>

                <div className="relative z-10">
                  <span className="text-xs text-[#84C135] uppercase tracking-wider font-semibold block mb-1">
                    {card.step}
                  </span>
                  <h3 className="text-xl font-bold leading-tight mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          8. MID-PAGE IMMERSIVE BANNER (DARK FOREST WITH AMBIENT GLOW)
      ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-8 bg-[#F7F9F6]">
        <FadeIn>
          <div className="max-w-7xl mx-auto rounded-[36px] bg-[#113B27] text-white p-8 sm:p-16 relative overflow-hidden shadow-2xl">
            {/* Ambient Breathing Glow */}
            <motion.div
              animate={!shouldReduceMotion ? { opacity: [0.12, 0.28, 0.12] } : { opacity: 0.15 }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-96 h-96 bg-[#84C135] rounded-full blur-3xl pointer-events-none"
            />

            <div className="relative z-10 text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#84C135] mb-3 inline-block">
                Earth Care • People Care • Fair Share
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
                Where Ancient Ecological Wisdom Meets Modern Food Security.
              </h2>
              <div className="flex justify-center">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#113B27] font-semibold text-sm sm:text-base hover:bg-[#84C135] hover:text-[#091E14] transition-all shadow-xl"
                >
                  <span>Support the Movement</span>
                  <FaArrowRight className="w-3.5 h-3.5" />
                </motion.a>
              </div>
            </div>

            {/* 3 Docked Horizontal Glass Cards */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/15"
            >
              {[
                {
                  step: "01",
                  title: "Restore Soil Health",
                  desc: "Replacing toxic agrochemicals with organic compost and living mulch.",
                },
                {
                  step: "02",
                  title: "Halt Deforestation",
                  desc: "Providing sustainable farming livelihoods to replace destructive charcoal burning.",
                },
                {
                  step: "03",
                  title: "Empower Generations",
                  desc: "Helping children stay in school and empowering youth with lifelong agrarian skills.",
                },
              ].map((dock, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItemVariants}
                  whileHover={!shouldReduceMotion ? { y: -4, backgroundColor: "rgba(255, 255, 255, 0.16)" } : {}}
                  className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-start gap-4 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-[#84C135] text-[#113B27] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {dock.step}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{dock.title}</h4>
                    <p className="text-xs text-white/70">{dock.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </FadeIn>
      </section>

      {/* ──────────────────────────────────────────────────────────
          9. FOOTER & NEWSLETTER (DARK)
      ────────────────────────────────────────────────────────── */}
      <footer id="contact" className="mt-auto bg-[#091E14] text-white rounded-t-[40px] pt-16 pb-12 px-4 sm:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Newsletter Banner */}
          <FadeIn className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-16 border-b border-white/15">
            <div className="lg:col-span-6">
              <span className="text-xs uppercase tracking-wider text-[#84C135] font-semibold block mb-2">
                Stay Connected
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Join the Regenerative Movement
              </h3>
              <p className="text-sm text-white/70 mt-2 max-w-md">
                Get regular updates on our permaculture workshops, seedling distributions, and
                community impact in Kilifi County.
              </p>
            </div>

            <div className="lg:col-span-6 flex justify-start lg:justify-end">
              <form
                onSubmit={handleSubscribe}
                className="relative flex items-center w-full max-w-md bg-white/10 backdrop-blur-md rounded-full border border-white/25 p-1.5 focus-within:border-[#84C135] focus-within:ring-2 focus-within:ring-[#84C135]/40 transition-all"
              >
                <div className="pl-4 pr-2 text-white/60">
                  <FaEnvelope className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="Your email address here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-white/50 text-sm focus:outline-none py-2"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  type="submit"
                  className="w-10 h-10 rounded-full bg-white text-[#113B27] flex items-center justify-center font-bold hover:bg-[#84C135] transition-colors cursor-pointer shrink-0 shadow-md"
                  aria-label="Subscribe"
                >
                  <FaArrowRight className="w-3.5 h-3.5 text-[#113B27]" />
                </motion.button>
              </form>
            </div>
          </FadeIn>

          {/* Subscription alert banner */}
          <AnimatePresence>
            {subscribed && (
              <motion.div
                initial={{ opacity: 0, y: 8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="mt-4 p-3 rounded-2xl bg-[#84C135]/20 border border-[#84C135] text-[#84C135] text-xs text-center font-medium"
              >
                Thank you for subscribing to Nettle Regenerative Farm updates!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Links Tree */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
            {/* Brand Col */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-white border-2 border-[#84C135]/40 shadow-md flex items-center justify-center shrink-0 relative">
                  <Image
                    src="/images/logo.jpg"
                    alt="Nettle Regenerative (K) Limited Logo"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <span className="font-bold text-lg tracking-tight">Nettle Regenerative</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed mb-4">
                Nettle Regenerative &apos;K&apos; Limited. Empowering communities in Kilifi County
                through permaculture, soil restoration, and food sovereignty.
              </p>
              <div className="text-xs text-white/60 space-y-1">
                <p className="flex items-center gap-2">
                  <FaLocationDot className="w-3 h-3 text-[#84C135]" />
                  <span>Baolala, Kilifi County, Kenya</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="w-3 h-3 text-[#84C135]" />
                  <span>info@nettleregenerative.co.ke</span>
                </p>
              </div>

              {/* Social Icons with Spring Micro-Interactions */}
              <div className="flex items-center gap-2.5 mt-4">
                {[
                  { icon: FaXTwitter, label: "Twitter / X", href: "#" },
                  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
                  { icon: FaInstagram, label: "Instagram", href: "#" },
                  { icon: FaWhatsapp, label: "WhatsApp", href: "#" },
                ].map((item, idx) => (
                  <motion.a
                    key={idx}
                    href={item.href}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-[#84C135] hover:text-[#113B27] transition-colors"
                    aria-label={item.label}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li><a href="#" className="hover:text-[#84C135] transition-colors">Home</a></li>
                <li><a href="#who-we-are" className="hover:text-[#84C135] transition-colors">Who We Are</a></li>
                <li><a href="#focus-areas" className="hover:text-[#84C135] transition-colors">Our Focus Area</a></li>
                <li><a href="#sustainability" className="hover:text-[#84C135] transition-colors">Demonstration Site</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Programs
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li><a href="#sustainability" className="hover:text-[#84C135] transition-colors">Permaculture Workshops</a></li>
                <li><a href="#nursery" className="hover:text-[#84C135] transition-colors">Seedling Distribution</a></li>
                <li><a href="#sustainability" className="hover:text-[#84C135] transition-colors">Composting & Soil Care</a></li>
                <li><a href="#who-we-are" className="hover:text-[#84C135] transition-colors">School & Community Gardens</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Impact & Partners
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                <li><a href="#founder" className="hover:text-[#84C135] transition-colors">Lenox Kipondah Story</a></li>
                <li><a href="#sustainability" className="hover:text-[#84C135] transition-colors">PRI Kenya Collaboration</a></li>
                <li><a href="#contact" className="hover:text-[#84C135] transition-colors">Sponsor a Food Forest</a></li>
                <li><a href="#contact" className="hover:text-[#84C135] transition-colors">Contact & Farm Visits</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p>© {new Date().getFullYear()} Nettle Regenerative &apos;K&apos; Limited. All rights reserved.</p>
            <p>Baolala Demonstration Site • Kilifi County, Kenya</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
