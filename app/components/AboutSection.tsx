"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaLeaf, FaSeedling, FaArrowRight } from "react-icons/fa6";
import { FadeIn } from "./MotionComponents";

export function AboutSection() {
  return (
    <section id="who-we-are" className="py-20 sm:py-28 px-4 sm:px-8 bg-white border-y border-[#113B27]/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Column (Left) */}
          <div className="lg:col-span-6 relative">
            <FadeIn yOffset={32}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-[#113B27]/10 group">
                <Image
                  src="/images/who we are.jpg"
                  alt="Who We Are - Nettle Regenerative community in Baolala, Kilifi"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </FadeIn>

            {/* Floating Badge on Image */}
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
  );
}
