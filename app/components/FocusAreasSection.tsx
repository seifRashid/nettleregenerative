"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaWheatAwn, FaUsers, FaEarthAfrica } from "react-icons/fa6";
import {
  FadeIn,
  staggerContainerVariants,
  staggerItemVariants,
} from "./MotionComponents";

export function FocusAreasSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="focus-areas" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F7F9F6] scroll-mt-24 sm:scroll-mt-28">
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
  );
}
