"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import {
  FadeIn,
  staggerContainerVariants,
  staggerItemVariants,
} from "./MotionComponents";

export function ImmersiveBannerSection() {
  const shouldReduceMotion = useReducedMotion();

  const dockCards = [
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
  ];

  return (
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
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#113B27] font-semibold text-sm sm:text-base hover:bg-[#84C135] hover:text-[#091E14] transition-all shadow-xl cursor-pointer"
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
            {dockCards.map((dock, idx) => (
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
  );
}
