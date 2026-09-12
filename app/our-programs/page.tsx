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
  FaGraduationCap,
  FaHandsHoldingCircle,
  FaLocationDot,
  FaChevronRight,
} from "react-icons/fa6";
import {
  Navbar,
  FooterSection,
  FadeIn,
  staggerContainerVariants,
  staggerItemVariants,
} from "../components";

export default function OurProgramsPage() {
  const shouldReduceMotion = useReducedMotion();

  // The 4 Core Programs from User Copy
  const programs = [
    {
      id: "01",
      icon: FaGraduationCap,
      category: "Hands-on Education",
      title: "Regenerative Agriculture Training",
      subtitle: "Transforming soil health and agricultural resilience through theory and practice",
      primaryBullets: [
        "Teaching sustainable farming methods that improve soil fertility and food security.",
        "Conducted at our demonstration site with both theory and practice.",
      ],
      detailedActivities: [
        "Biological composting, vermiculture, and microbial soil inoculants",
        "Water harvesting earthworks, swales, keyline design, and active mulching",
        "Natural companion planting, organic pest deterrence, and zero-synthetic soil nutrition",
        "Field-scale crop rotation and biological cover cropping for dryland regeneration",
      ],
      setting: "Baolala Demonstration Farm, Kilifi County",
      targetAudience: "Smallholder farmers, youth groups, extension workers & families",
      expectedOutcome: "Restored soil fertility, drought resilience & increased crop yields",
      image: "/images/learn.jpg",
      imageAlt: "Farmers learning hands-on regenerative agriculture methods at Nettle Farm",
      ctaText: "Enroll / Inquire for Training",
      ctaHref: "/contact-us?subject=Regenerative%20Agriculture%20Training",
      accentColor: "bg-[#113B27] text-[#84C135]",
    },
    {
      id: "02",
      icon: FaWheatAwn,
      category: "Grassroots Food Sovereignty",
      title: "Community Gardens Project",
      subtitle: "Empowering families to grow their own fresh food and build economic resilience",
      primaryBullets: [
        "Helping local families and groups establish gardens to grow their own food and sell the surplus.",
      ],
      detailedActivities: [
        "Designing climate-resilient kitchen gardens and productive family vegetable plots",
        "Low-cost micro-drip irrigation, greywater reuse, and rainwater catchment setups",
        "Seed saving, indigenous vegetable varieties, and organic nutrition diversification",
        "Aggregating harvests for local coastal markets to generate reliable household revenue",
      ],
      setting: "Kilifi County Homesteads & Community Centers",
      targetAudience: "Local families, women's self-help groups & rural homesteads",
      expectedOutcome: "Daily clean nutrition, food security & supplementary family income",
      image: "/images/Lenox with tomatoes.jpg",
      imageAlt: "Lenox Chome with organic community garden tomatoes in Kilifi County",
      ctaText: "Start a Community Garden",
      ctaHref: "/contact-us?subject=Community%20Gardens%20Project",
      accentColor: "bg-[#84C135] text-[#091E14]",
    },
    {
      id: "03",
      icon: FaTree,
      category: "Reforestation & Nursery",
      title: "Tree Planting & Environmental Care",
      subtitle: "Restoring coastal forest canopies, biodiversity, and living microclimates",
      primaryBullets: [
        "Operating a community plant nursery.",
        "Supplying seedlings and educating locals about the importance of reforestation and soil care.",
      ],
      detailedActivities: [
        "Propagation of indigenous coastal trees, nitrogen-fixing species, and drought-hardy fruit trees",
        "Affordable community distribution of moringa, neem, cashew, citrus, and acacia seedlings",
        "Agroforestry integration to shield topsoil from coastal wind erosion and solar evaporation",
        "Educational field workshops for schools and rural groups on tree stewardship",
      ],
      setting: "Nettle Community Nursery Hub, Baolala",
      targetAudience: "Schools, smallholders, conservation partners & local landholders",
      expectedOutcome: "45,000+ seedlings raised, enhanced rainfall retention & shade canopy",
      image: "/images/nursery 2.jpg",
      imageAlt: "Community plant nursery with indigenous and fruit seedlings in Baolala",
      ctaText: "Order Seedlings & Inquire",
      ctaHref: "/contact-us?subject=Tree%20Planting%20%26%20Environmental%20Care",
      accentColor: "bg-[#3B660E] text-[#EBF7D9]",
    },
    {
      id: "04",
      icon: FaUsers,
      category: "Inclusive Economic Mobility",
      title: "Youth & Women Empowerment through Farming",
      subtitle: "Building dignified livelihoods, agribusiness knowledge, and self-reliance",
      primaryBullets: [
        "Supporting youth and women to gain practical skills for income generation.",
      ],
      detailedActivities: [
        "Hands-on mentorship in high-value organic horticulture and value-added farm produce",
        "Basic business management, financial literacy, record-keeping, and cooperative pricing",
        "Equipping women and youth with self-sustaining agro-enterprise toolkits",
        "Fostering peer-to-peer farmer networks across coastal and arid communities",
      ],
      setting: "Kilifi County & Surrounding Rural Districts",
      targetAudience: "Young aspiring agrarian leaders, women-led households & rural youth",
      expectedOutcome: "Dignified rural employment, financial self-determination & community leadership",
      image: "/images/who we are.jpg",
      imageAlt: "Local women and youth participating in regenerative agriculture empowerment in Kenya",
      ctaText: "Partner on Empowerment",
      ctaHref: "/contact-us?subject=Youth%20%26%20Women%20Empowerment",
      accentColor: "bg-[#654320] text-[#F7F9F6]",
    },
  ];

  // The 3 Triple-Impact Pillars from Prompt Copy
  const impactPillars = [
    {
      icon: FaSeedling,
      title: "Restoring Soil Health",
      desc: "Rebuilding biological vitality, active microbial life, and organic moisture capacity without chemical fertilizers or synthetic sprays.",
      badge: "Living Soil",
    },
    {
      icon: FaWheatAwn,
      title: "Promoting Food Security",
      desc: "Empowering rural households to grow diverse, nutrient-rich vegetables and crops directly in their own home and community plots.",
      badge: "Clean Nutrition",
    },
    {
      icon: FaHandsHoldingCircle,
      title: "Fostering Economic Independence",
      desc: "Enabling local farmers, women, and youth to commercialize surplus organic yields, gain market access, and secure resilient livelihoods.",
      badge: "Fair Prosperity",
    },
  ];

  // 4-Step Program Journey Roadmap
  const programSteps = [
    {
      step: "01",
      title: "Connect & Register",
      desc: "Reach out online or visit our Baolala demonstration site to discover the program that aligns with your household or group goals.",
    },
    {
      step: "02",
      title: "Hands-on Immersion",
      desc: "Participate in theoretical classroom lessons followed by real-world field practice in living soil care, composting, and companion planting.",
    },
    {
      step: "03",
      title: "Establish & Plant",
      desc: "Apply practical agroecological techniques to build family kitchen gardens, establish farm swales, or plant indigenous nursery trees.",
    },
    {
      step: "04",
      title: "Harvest & Thrive",
      desc: "Enjoy chemical-free harvests for your family, sell surplus produce for income, and share regenerative methods with your community.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F6] text-[#11231A] selection:bg-[#84C135] selection:text-[#113B27] overflow-x-hidden">
      {/* Global Navigation Bar */}
      <Navbar />

      <main className="grow">
        {/* ──────────────────────────────────────────────────────────
            1. HERO BANNER (FULL-BLEED CINEMATIC PHOTOGRAPHY)
        ────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[50vh] sm:min-h-[58vh] flex items-center justify-center pt-32 sm:pt-40 pb-20 px-4 sm:px-8 overflow-hidden bg-[#091E14]">
          {/* Background Photography with Dark Atmospheric Scrim */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/heroimage.jpg"
              alt="Nettle Regenerative Farm agricultural programs in Kilifi County"
              fill
              priority
              className="object-cover object-center transform scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091E14] via-[#091E14]/80 to-[#091E14]/85" />
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
              <span>🌿 What We Do</span>
            </motion.div>

            {/* Display Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight text-white mb-6"
            >
              Our Programs
            </motion.h1>

            {/* Lead Narrative Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.35 }}
              className="text-base sm:text-xl text-white/85 max-w-2xl mx-auto font-normal leading-relaxed mb-8"
            >
              Equipping individuals and communities with the practical knowledge, living soils, and agroecological skills to thrive sustainably.
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
              <span className="text-[#84C135] font-semibold">Our Programs</span>
            </motion.div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            2. WHAT WE DO: PHILOSOPHY & LONG-TERM IMPACT OVERVIEW
        ────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 bg-white border-b border-[#113B27]/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Core Narrative (Exact Copy from Prompt) */}
              <div className="lg:col-span-6 flex flex-col items-start">
                <FadeIn>
                  <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#84C135] bg-[#113B27] px-4 py-1.5 rounded-full inline-block mb-4">
                    🌿 What We Do
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight mb-6">
                    Equipping Communities for Long-Term Ecological Change
                  </h2>

                  {/* Paragraph 1 - Exact Prompt Copy */}
                  <p className="text-base sm:text-lg text-[#11231A] font-medium leading-relaxed mb-4">
                    At Nettle Regenerative Farm, our programs are designed to equip individuals and communities with the knowledge and practical skills needed to care for the earth and improve livelihoods. Through hands-on training, community engagement, and sustainable practices, we empower people to adopt regenerative agriculture as a way of life.
                  </p>

                  {/* Paragraph 2 - Exact Prompt Copy */}
                  <p className="text-sm sm:text-base text-[#52665B] leading-relaxed mb-8">
                    Each program focuses on creating long-term impact — restoring soil health, promoting food security, and fostering economic independence, especially among rural communities in Kilifi County and beyond.
                  </p>
                </FadeIn>

                {/* Key Metrics Strip */}
                <FadeIn delay={0.2} className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-200/80 w-full">

                    <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10 text-center sm:text-left">
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-[#3B660E] tabular-nums">
                        100%
                      </div>
                      <div className="text-xs text-[#52665B] mt-1 font-medium">
                        Chemical-Free Care
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10 text-center sm:text-left">
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-[#113B27] tabular-nums">
                        3,200+
                      </div>
                      <div className="text-xs text-[#52665B] mt-1 font-medium">
                        Farmers Reached
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10 text-center sm:text-left">
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

              {/* Right Column: Triple Impact Pillars Bento */}
              <div className="lg:col-span-6 space-y-4">
                <FadeIn delay={0.1}>
                  <div className="text-xs uppercase tracking-wider font-mono text-[#52665B] mb-2 font-semibold">
                    Core Impact Focus
                  </div>
                </FadeIn>

                {impactPillars.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <FadeIn key={idx} delay={0.15 + idx * 0.1}>
                      <div className="p-6 rounded-3xl bg-[#F7F9F6] border border-[#113B27]/10 hover:border-[#84C135]/50 transition-all shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#113B27] text-[#84C135] flex items-center justify-center text-xl shrink-0 shadow-md">
                          <Icon />
                        </div>
                        <div className="space-y-1 grow">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#113B27]">
                              {pillar.title}
                            </h3>
                            <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-[#84C135]/20 text-[#113B27] font-semibold">
                              {pillar.badge}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#52665B] leading-relaxed">
                            {pillar.desc}
                          </p>
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            3. FOUR CORE PROGRAMS (EDITORIAL ALTERNATING SHOWCASE)
        ────────────────────────────────────────────────────────── */}
        <section id="programs-list" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F7F9F6] border-b border-[#113B27]/10">
          <div className="max-w-7xl mx-auto">
            <FadeIn className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27]/80 bg-[#113B27]/10 px-4 py-1.5 rounded-full inline-block mb-3">
                Hands-on Initiatives
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight mb-3">
                Explore Our Four Core Programs
              </h2>
              <p className="text-sm sm:text-base text-[#52665B]">
                Discover how our training, community gardens, tree nursery, and empowerment projects turn sustainable ideas into everyday realities.
              </p>
            </FadeIn>

            <div className="space-y-16 sm:space-y-24">
              {programs.map((program, index) => {
                const Icon = program.icon;
                const isEven = index % 2 === 1;

                return (
                  <FadeIn
                    key={program.id}
                    yOffset={32}
                    className="p-6 sm:p-10 rounded-[32px] bg-white border border-[#113B27]/10 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      {/* Visual Image Column (Alternates based on odd/even) */}
                      <div className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] border border-[#113B27]/10 group">
                          <Image
                            src={program.image}
                            alt={program.imageAlt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#091E14]/80 via-transparent to-transparent" />
                          
                          {/* Floating Badge on Top Left */}
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#113B27] text-[#84C135] text-xs font-mono font-bold flex items-center justify-center shadow-md">
                              {program.id}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-[#091E14]/80 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                              {program.category}
                            </span>
                          </div>

                          {/* Location Tag on Bottom */}
                          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white text-xs font-medium">
                            <FaLocationDot className="w-3.5 h-3.5 text-[#84C135] shrink-0" />
                            <span className="truncate">{program.setting}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Column */}
                      <div className={`lg:col-span-7 space-y-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-[#EBF7D9] text-[#3B660E] flex items-center justify-center text-lg shrink-0 shadow-sm">
                              <Icon />
                            </div>
                            <span className="text-xs uppercase font-mono tracking-wider text-[#52665B] font-semibold">
                              Program {program.id}
                            </span>
                          </div>

                          <h3 className="text-2xl sm:text-3xl font-bold text-[#113B27] tracking-tight leading-tight">
                            {program.title}
                          </h3>
                          <p className="text-sm text-[#52665B] mt-1 font-medium">
                            {program.subtitle}
                          </p>
                        </div>

                        {/* Primary Bullets from Prompt */}
                        <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-[#113B27] font-bold">
                            Core Mission Focus:
                          </div>
                          {program.primaryBullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#11231A] font-medium leading-relaxed">
                              <span className="w-5 h-5 rounded-full bg-[#84C135] text-[#091E14] flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-xs">
                                <FaCheck />
                              </span>
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>

                        {/* Key Features / Activities List */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-[#113B27] uppercase tracking-wider">
                            Key Program Activities:
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#52665B]">
                            {program.detailedActivities.map((act, aIdx) => (
                              <li key={aIdx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#84C135] shrink-0 mt-1.5" />
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Metadata Pills: Audience & Outcomes */}
                        <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                          <span className="px-3 py-1 rounded-full bg-white border border-[#113B27]/15 text-[#113B27] font-medium">
                            <strong>Beneficiaries:</strong> {program.targetAudience}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-[#EBF7D9] text-[#3B660E] border border-[#84C135]/30 font-medium">
                            <strong>Expected Impact:</strong> {program.expectedOutcome}
                          </span>
                        </div>

                        {/* Call to Action Button */}
                        <div className="pt-2">
                          <Link
                            href={program.ctaHref}
                            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#113B27] text-white text-xs sm:text-sm font-semibold hover:bg-[#174A32] transition-colors shadow-md"
                          >
                            <span>{program.ctaText}</span>
                            <FaArrowRight className="w-3 h-3 text-[#84C135]" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            4. HOW TO PARTICIPATE: 4-STEP PROGRAM JOURNEY
        ────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 bg-white border-b border-[#113B27]/10">
          <div className="max-w-7xl mx-auto">
            <FadeIn className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27]/80 bg-[#113B27]/10 px-4 py-1.5 rounded-full inline-block mb-3">
                Simple Roadmap
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight mb-3">
                How to Get Involved
              </h2>
              <p className="text-sm sm:text-base text-[#52665B]">
                Whether you are an individual farmer, a family group, or a community partner, here is how our programs guide you every step of the way.
              </p>
            </FadeIn>

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {programSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItemVariants}
                  whileHover={!shouldReduceMotion ? { y: -6 } : {}}
                  transition={{ duration: 0.3 }}
                  className="p-6 sm:p-8 rounded-3xl bg-[#F7F9F6] border border-[#113B27]/10 flex flex-col justify-between hover:border-[#84C135]/40 transition-all shadow-sm"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#113B27] text-white font-mono font-bold text-sm flex items-center justify-center mb-6 shadow-md">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-bold text-[#113B27] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#52665B] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-200/70 flex items-center gap-2 text-xs font-semibold text-[#3B660E]">
                    <FaCheck className="w-3 h-3 text-[#84C135]" />
                    <span>Structured Guidance</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            5. PANORAMIC CALL TO ACTION (INSPIRED BY VILLAGEX)
        ────────────────────────────────────────────────────────── */}
        <section className="py-20 px-4 sm:px-8 bg-white">
          <FadeIn>
            <div className="max-w-7xl mx-auto rounded-[36px] bg-gradient-to-r from-[#091E14] via-[#113B27] to-[#091E14] text-white p-8 sm:p-16 relative overflow-hidden shadow-2xl text-center">
              {/* Subtle ambient circle decoration */}
              <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#84C135]/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#84C135]/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto">
                <span className="text-xs uppercase tracking-widest text-[#84C135] font-semibold mb-3 inline-block">
                  A Practical Movement for People & Planet
                </span>

                {/* Exact Prompt Conclusion Copy */}
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
                  Turning sustainable ideas into practical solutions for people and the planet.
                </h2>

                <p className="text-base sm:text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Explore our work, visit our demonstration farm in Baolala, or reach out to learn how you can be part of the change.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/our-farm"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#84C135] text-[#091E14] font-bold text-sm sm:text-base hover:bg-[#99D34C] transition-all shadow-xl hover:scale-105 cursor-pointer"
                  >
                    <span>Visit Our Demonstration Farm</span>
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 text-white font-bold text-sm sm:text-base hover:bg-white/20 border border-white/20 transition-all shadow-md cursor-pointer"
                  >
                    <span>Connect With Our Team</span>
                    <FaChevronRight className="w-3 h-3 opacity-70" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
