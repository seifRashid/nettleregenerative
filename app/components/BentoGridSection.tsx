"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FaWheatAwn, FaHandsHoldingCircle, FaCheck } from "react-icons/fa6";
import {
  AnimatedCounter,
  FadeIn,
  staggerContainerVariants,
  staggerItemVariants,
} from "./MotionComponents";

export function BentoGridSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
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
              src="/images/Lenox with tomatoes.jpg"
              alt="Lenox with fresh organic tomatoes at Nettle Regenerative Farm"
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
  );
}
