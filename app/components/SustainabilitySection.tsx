"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaCheck, FaArrowRight, FaSeedling } from "react-icons/fa6";
import { FadeIn } from "./MotionComponents";

export function SustainabilitySection() {
  const shouldReduceMotion = useReducedMotion();
  const showcaseImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || shouldReduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
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

  return (
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
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#113B27] text-white text-base font-semibold tracking-wide hover:bg-[#174A32] transition-all shadow-xl cursor-pointer"
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
                  src="/images/demo site.jpg"
                  alt="Nettle Regenerative Farm demonstration site in Baolala with solar panels, compost bays, and vegetable beds"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </FadeIn>

            {/* Frosted Glassmorphic Overlay Widget */}
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
  );
}
