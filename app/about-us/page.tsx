"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaLeaf,
  FaArrowRight,
  FaCheck,
  FaSeedling,
  FaTree,
  FaWheatAwn,
  FaUsers,
  FaEarthAfrica,
  FaGraduationCap,
  FaHandsHoldingCircle,
  FaShieldHalved,
  FaLocationDot,
  FaChevronRight,
} from "react-icons/fa6";
import {
  Navbar,
  FooterSection,
  FloatingDesignSystemBadge,
  FadeIn,
  staggerContainerVariants,
  staggerItemVariants,
} from "../components";

export default function AboutUsPage() {
  const shouldReduceMotion = useReducedMotion();

  const coreValues = [
    {
      title: "Integrity",
      icon: FaShieldHalved,
      color: "bg-[#EBF7D9] text-[#3B660E]",
      copy: "We uphold honesty, transparency, and ethical practices in all our interactions. Our commitment to doing what is right builds trust with our community, partners, and the environment we serve.",
    },
    {
      title: "Professionalism",
      icon: FaGraduationCap,
      color: "bg-[#E4EDE8] text-[#113B27]",
      copy: "We carry out our work with excellence, consistency, and accountability. Every activity — from training to farm operations — is done with dedication and respect for quality standards.",
    },
    {
      title: "Teamwork",
      icon: FaUsers,
      color: "bg-[#F2F7F4] text-[#113B27]",
      copy: "We believe in the power of collaboration. By working together with the community, our team, and partners, we achieve greater results and foster a spirit of unity and shared purpose.",
    },
    {
      title: "Customer Focus",
      icon: FaHandsHoldingCircle,
      color: "bg-[#EBF7D9] text-[#3B660E]",
      copy: "We value the needs of the people we serve. Whether it’s training farmers, supporting families, or nurturing the land, our focus remains on delivering meaningful, lasting impact for our beneficiaries.",
    },
    {
      title: "Innovativeness",
      icon: FaSeedling,
      color: "bg-[#F1E9E0] text-[#654320]",
      copy: "We continuously seek new and creative ways to improve sustainable farming practices. Through innovation, we find practical solutions to local challenges and create better opportunities for the community.",
    },
    {
      title: "Sustainability & Community Impact",
      icon: FaEarthAfrica,
      color: "bg-[#E4EDE8] text-[#113B27]",
      copy: "We are committed to protecting the environment while improving lives. Every action we take — from planting trees to teaching regenerative agriculture — contributes to a healthier planet and stronger, self-reliant communities.",
    },
  ];

  const missionPillars = [
    {
      step: "01",
      title: "Knowledge & Skills",
      desc: "Providing knowledge and skills on regenerative agriculture through theory and hands-on training.",
    },
    {
      step: "02",
      title: "Nutritious Food & Fair Livelihoods",
      desc: "Supporting communities to grow and sell nutritious, chemical-free food for better livelihoods.",
    },
    {
      step: "03",
      title: "Community & Home Gardens",
      desc: "Encouraging the creation of community and home gardens for food security and income generation.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F6] text-[#11231A] selection:bg-[#84C135] selection:text-[#113B27] overflow-x-hidden">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      <main className="grow">
        {/* ──────────────────────────────────────────────────────────
            1. HERO BANNER (FULL-BLEED CINEMATIC BACKGROUND)
        ────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[50vh] sm:min-h-[58vh] flex items-center justify-center pt-32 sm:pt-40 pb-20 px-4 sm:px-8 overflow-hidden bg-[#091E14]">
          {/* Background Photography with Dark Atmospheric Scrim */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/heroimage.jpg"
              alt="Nettle Regenerative Farm in Kilifi County, Kenya"
              fill
              priority
              className="object-cover object-center transform scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091E14] via-[#091E14]/75 to-[#091E14]/80" />
            <div className="absolute inset-0 bg-[radial-gradient(#84C135_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            {/* Category Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#84C135] text-xs sm:text-sm font-semibold mb-6 tracking-wide shadow-sm"
            >
              <FaLeaf className="w-3.5 h-3.5 text-[#84C135]" />
              <span>About Nettle Regenerative</span>
            </motion.div>

            {/* Display Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight text-white mb-6"
            >
              About Us
            </motion.h1>

            {/* Lead Narrative Subtitle (Exact copy from prompt) */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.35 }}
              className="text-base sm:text-xl text-white/90 leading-relaxed font-normal max-w-3xl mx-auto mb-8"
            >
              Nettle Regenerative Farm is a social-impact initiative dedicated to empowering communities through sustainable farming and environmental stewardship
            </motion.p>

            {/* Breadcrumb Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/70"
            >
              <Link href="/" className="hover:text-[#84C135] transition-colors">
                Home
              </Link>
              <FaChevronRight className="w-2.5 h-2.5 opacity-50" />
              <span className="text-[#84C135] font-semibold">About Us</span>
            </motion.div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            2. PHILOSOPHY & ARTISTIC PHOTO COLLAGE (INSPIRED BY VILLAGEX)
        ────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 bg-white border-b border-[#113B27]/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Narrative & Stats */}
              <div className="lg:col-span-5 flex flex-col items-start">
                <FadeIn>
                  <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#84C135] bg-[#113B27] px-4 py-1.5 rounded-full inline-block mb-4">
                    Healing Soil • Healing People
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight mb-6">
                    Restoring Both the Land and Livelihoods
                  </h2>

                  {/* Exact copy from prompt */}
                  <p className="text-base sm:text-lg text-[#11231A] font-medium leading-relaxed mb-4">
                    We believe that by healing the soil, we heal the people — restoring both the land and livelihoods through regenerative agriculture.
                  </p>

                  <p className="text-sm sm:text-base text-[#52665B] leading-relaxed mb-8">
                    Our work focuses on education, food security, and community resilience in the face of climate change. From our hub in Baolala, we equip families with practical, sustainable agroecological methods that produce clean, chemical-free food.
                  </p>
                </FadeIn>

                {/* Key Statistics Grid (Inspired by Villagex left block) */}
                <FadeIn delay={0.2} className="w-full">
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200/80 w-full">
                    <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10">
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-[#113B27] tabular-nums">
                        3,500+
                      </div>
                      <div className="text-xs text-[#52665B] mt-1 font-medium">
                        Trees & Seedlings Distributed
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10">
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-[#3B660E] tabular-nums">
                        100%
                      </div>
                      <div className="text-xs text-[#52665B] mt-1 font-medium">
                        Chemical-Free Soil Care
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10">
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-[#113B27] tabular-nums">
                        3,200+
                      </div>
                      <div className="text-xs text-[#52665B] mt-1 font-medium">
                        Community Farmers Reached
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10">
                      <div className="text-xl sm:text-2xl font-bold text-[#654320]">
                        Baolala
                      </div>
                      <div className="text-xs text-[#52665B] mt-1 font-medium">
                        Kilifi County Hub
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column: Multi-Image Collage Composition (Inspired by Villagex) */}
              <div className="lg:col-span-7 relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  {/* Top Photo Card */}
                  <FadeIn yOffset={24} className="space-y-6">
                    <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] border border-black/10 group">
                      <Image
                        src="/images/demo site 2.jpg"
                        alt="Nettle Regenerative demonstration farm site in Baolala"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-semibold">
                        Demonstration Farm Site
                      </div>
                    </div>

                    {/* Green Accent Badge Card */}
                    <div className="p-6 rounded-3xl bg-[#113B27] text-white shadow-xl border border-[#84C135]/30 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#84C135] text-[#091E14] flex items-center justify-center text-xl shrink-0 shadow-md">
                        <FaSeedling />
                      </div>
                      <div>
                        <h4 className="text-base font-bold leading-snug">
                          Embrace the Healing
                        </h4>
                        <p className="text-xs text-white/75 mt-0.5">
                          Regenerating earth, soil & human nutrition
                        </p>
                      </div>
                    </div>
                  </FadeIn>

                  {/* Bottom Portrait Photo Card */}
                  <FadeIn yOffset={40} delay={0.2} className="space-y-6 sm:mt-10">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] border border-black/10 group">
                      <Image
                        src="/images/nursery.jpg"
                        alt="Indigenous tree and seedling nursery"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#091E14]/80 via-transparent to-transparent" />
                      <div className="absolute bottom-5 left-5 right-5 text-white">
                        <span className="text-[10px] uppercase font-mono text-[#84C135] tracking-widest block mb-1">
                          NURSERY HUB
                        </span>
                        <div className="text-sm font-bold leading-tight">
                          45,000+ Seedlings Distributed
                        </div>
                      </div>
                    </div>

                    {/* Cultural Value Pillars */}
                    <div className="space-y-2.5 p-5 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10 text-xs text-[#52665B]">
                      <div className="flex items-center gap-2 text-[#113B27] font-semibold">
                        <FaCheck className="w-3.5 h-3.5 text-[#84C135]" />
                        <span>Living Soil & Active Composting</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#113B27] font-semibold">
                        <FaCheck className="w-3.5 h-3.5 text-[#84C135]" />
                        <span>Zero Chemical Fertilizers or Sprays</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#113B27] font-semibold">
                        <FaCheck className="w-3.5 h-3.5 text-[#84C135]" />
                        <span>Empowering Smallholder Families</span>
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            3. OUR FOUNDER'S STORY (EDITORIAL SECTION)
        ────────────────────────────────────────────────────────── */}
        <section id="founder" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F7F9F6] border-b border-[#113B27]/10">
          <div className="max-w-7xl mx-auto">
            <FadeIn className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27]/80 bg-[#113B27]/10 px-4 py-1.5 rounded-full inline-block mb-3">
                Origins & Resilience
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight">
                Our Founder&apos;s Story
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image & Founder Badge (Left) */}
              <div className="lg:col-span-5 relative">
                <FadeIn yOffset={28}>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] border border-[#113B27]/10 group">
                    <Image
                      src="/images/lenox.jpg"
                      alt="Lenox Chome Kipondah, Founder of Nettle Regenerative"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091E14]/90 via-[#091E14]/30 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="w-10 h-10 rounded-full bg-[#84C135] text-[#113B27] flex items-center justify-center text-base mb-3 shadow-md">
                        <FaLeaf />
                      </div>
                      <h3 className="text-xl font-bold leading-tight">
                        Lenox Chome Kipondah
                      </h3>
                      <p className="text-xs text-white/80 mt-1">
                        Founder & Permaculture Specialist • Nettle Regenerative
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Founder Narrative (Right - Exact copy from prompt) */}
              <div className="lg:col-span-7 space-y-6 text-[#52665B] leading-relaxed">
                <FadeIn delay={0.1}>
                  <p className="text-base sm:text-lg text-[#11231A] font-medium leading-relaxed">
                    Lenox Chome Kipondah, the founder of Nettle regenerative &apos;k&apos; limited, was born and raised in humble beginnings in Kilifi County, Kenya.
                  </p>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <p className="text-sm sm:text-base">
                    After surviving a traumatic robbery that left him seriously injured, Lenox discovered natural healing through nutrition and nature. This experience ignited a deep curiosity about how the earth itself provides healing and nourishment.
                  </p>
                </FadeIn>

                {/* Highlight Quote Box */}
                <FadeIn delay={0.25}>
                  <div className="p-6 rounded-2xl bg-white border-l-4 border-[#84C135] shadow-sm">
                    <p className="text-sm sm:text-base text-[#113B27] font-semibold italic">
                      &ldquo;His journey led him to study Permaculture — a regenerative form of farming that rebuilds soil health and supports ecosystems — at the Permaculture Research Institute, Kenya.&rdquo;
                    </p>
                  </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <p className="text-sm sm:text-base">
                    Since then, Lenox has worked across Kenya, from the arid lands of the North to the coastal regions, sharing sustainable farming techniques with local communities. His passion and experience culminated in the founding of Nettle Regenerative Farm in Baolala, a place where transformation, learning, and growth happen every day.
                  </p>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <div className="pt-4">
                    <Link
                      href="/our-farm"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#113B27] text-white text-sm font-semibold hover:bg-[#174A32] transition-colors shadow-md"
                    >
                      <span>Explore Baolala Farm</span>
                      <FaArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            4. PANORAMIC MID-PAGE BANNER (INSPIRED BY VILLAGEX)
        ────────────────────────────────────────────────────────── */}
        <section className="py-20 px-4 sm:px-8 bg-white">
          <FadeIn>
            <div className="max-w-7xl mx-auto rounded-[36px] bg-gradient-to-r from-[#091E14] via-[#113B27] to-[#091E14] text-white p-8 sm:p-16 relative overflow-hidden shadow-2xl text-center">
              <div className="relative z-10 max-w-3xl mx-auto">
                <span className="text-xs uppercase tracking-widest text-[#84C135] font-semibold mb-3 inline-block">
                  A Living Classroom in Kilifi County
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
                  Where transformation, learning, and growth happen every day.
                </h2>
                <p className="text-base sm:text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                  Equipping local farmers and families with the knowledge to grow food sustainably, protect biodiversity, and secure resilient livelihoods.
                </p>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#84C135] text-[#091E14] font-bold text-sm sm:text-base hover:bg-[#99D34C] transition-all shadow-xl hover:scale-105"
                >
                  <span>Connect With Our Team</span>
                  <FaArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ──────────────────────────────────────────────────────────
            5. VISION & MISSION SECTION (STRUCTURED BENTO)
        ────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F7F9F6] border-y border-[#113B27]/10">
          <div className="max-w-7xl mx-auto">
            <FadeIn className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27]/80 bg-[#113B27]/10 px-4 py-1.5 rounded-full inline-block mb-3">
                Purpose & Direction
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight">
                Our Vision & Mission
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Vision Bento Card */}
              <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-[#113B27] text-white shadow-xl flex flex-col justify-between border border-[#174A32]">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#84C135] text-[#091E14] flex items-center justify-center text-2xl mb-6 shadow-md">
                    <FaSeedling />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#84C135] block mb-2">
                    Our Vision
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold leading-snug">
                    To empower communities to care for the earth and grow food sustainably for healthy living and poverty eradication.
                  </h3>
                </div>

                <div className="mt-8 pt-6 border-t border-white/15 text-xs text-white/70">
                  Rooted in earth care, people care, and equitable abundance.
                </div>
              </div>

              {/* Mission Bento Card with 3 Pillars */}
              <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-[#113B27]/10 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#84C135] bg-[#113B27] px-3.5 py-1 rounded-full inline-block mb-4">
                    Our Mission
                  </span>
                  <h3 className="text-2xl font-bold text-[#113B27] mb-2">
                    We achieve our mission by:
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52665B] mb-6">
                    A three-pronged framework grounded in grassroots agricultural empowerment.
                  </p>

                  <div className="space-y-4">
                    {missionPillars.map((pillar) => (
                      <div
                        key={pillar.step}
                        className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10 flex items-start gap-4 hover:border-[#84C135]/40 transition-colors"
                      >
                        <span className="w-8 h-8 rounded-full bg-[#113B27] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {pillar.step}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-[#113B27] mb-0.5">
                            {pillar.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-[#52665B] leading-relaxed">
                            {pillar.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            6. OUR CORE VALUES (6 BENTO CARDS GRID - EXACT PROMPT COPY)
        ────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <FadeIn className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27]/80 bg-[#113B27]/10 px-4 py-1.5 rounded-full inline-block mb-3">
                Guiding Principles
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight mb-3">
                Our Core Values
              </h2>
              <p className="text-sm sm:text-base text-[#52665B]">
                The bedrock values shaping our relationships, ethical standards, and agricultural training across Kenya.
              </p>
            </FadeIn>

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {coreValues.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={staggerItemVariants}
                    whileHover={!shouldReduceMotion ? { y: -6, boxShadow: "0 20px 40px -15px rgba(17, 59, 39, 0.12)" } : {}}
                    transition={{ duration: 0.3 }}
                    className="p-8 rounded-3xl bg-white border border-[#113B27]/10 shadow-sm flex flex-col justify-between hover:border-[#84C135]/40 transition-all"
                  >
                    <div>
                      <div className={`w-14 h-14 rounded-2xl ${value.color} flex items-center justify-center text-2xl mb-6 shadow-sm`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold text-[#113B27] mb-3">
                        {value.title}
                      </h3>
                      {/* Exact copy from user prompt */}
                      <p className="text-sm text-[#52665B] leading-relaxed">
                        {value.copy}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-semibold text-[#113B27]">
                      <span className="w-2 h-2 rounded-full bg-[#84C135]" />
                      <span>Committed to Excellence</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer & Floating Design System Badge */}
      <FooterSection />
      <FloatingDesignSystemBadge />
    </div>
  );
}
