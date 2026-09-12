"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FaGraduationCap, FaTree, FaBasketShopping } from "react-icons/fa6";
import {
  FadeIn,
  staggerContainerVariants,
  staggerItemVariants,
} from "./MotionComponents";

export function StoryCardsSection() {
  const shouldReduceMotion = useReducedMotion();

  const storyCards = [
    {
      src: "/images/learn.jpg",
      alt: "Practical community training and permaculture education",
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
  ];

  return (
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
          {storyCards.map((card, idx) => (
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
  );
}
