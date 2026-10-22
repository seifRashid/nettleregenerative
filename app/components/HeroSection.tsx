"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaArrowRight,
  FaLocationDot,
  FaSeedling,
  FaTree,
} from "react-icons/fa6";
import { AnimatedGauge } from "./MotionComponents";

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || shouldReduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
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
    });

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  return (
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
            <Link
              href="/contact-us"
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white text-[#113B27] text-sm sm:text-base font-semibold tracking-wide hover:bg-[#84C135] hover:text-[#091E14] transition-all duration-300 shadow-2xl hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <span>Visit Our Farm</span>
              <span className="w-7 h-7 rounded-full bg-black/5 group-hover:bg-black/10 flex items-center justify-center text-xs transition-transform duration-300 group-hover:translate-x-1">
                <FaArrowRight className="w-3 h-3 text-[#113B27]" />
              </span>
            </Link>

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
  );
}
