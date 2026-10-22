"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FaLeaf,
  FaArrowRight,
  FaCheck,
  FaSeedling,
  FaTree,
  FaWheatAwn,
  FaUsers,
  FaDroplet,
  FaSun,
  FaGraduationCap,
  FaHandsHoldingCircle,
  FaLocationDot,
  FaChevronRight,
  FaChevronLeft,
  FaXmark,
  FaEye,
  FaCalendarDays,
  FaCircleCheck,
  FaShieldHalved,
  FaClock,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";
import {
  Navbar,
  FooterSection,
  FadeIn,
  AnimatedCounter,
  AnimatedGauge,
  staggerContainerVariants,
  staggerItemVariants,
} from "../components";

// Photo item interface
interface FarmPhoto {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  category: "permaculture" | "nursery" | "training" | "harvest";
  categoryLabel: string;
  location: string;
}

export default function OurFarmPage() {
  const shouldReduceMotion = useReducedMotion();

  // 1. Gallery State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [lightboxPhoto, setLightboxPhoto] = useState<FarmPhoto | null>(null);

  // Gallery Photos Data from actual project assets in public/images
  const farmPhotos: FarmPhoto[] = [
    {
      id: "photo-1",
      src: "/images/demo-farm.jpg",
      title: "Demonstration Farm Overview",
      subtitle:
        "Panoramic view of our living classroom in Baolala, showcasing rainwater swales, tree windbreaks, and biodiverse plots.",
      category: "permaculture",
      categoryLabel: "Permaculture Garden",
      location: "Baolala Site, Kilifi",
    },
    {
      id: "photo-2",
      src: "/images/demo site.jpg",
      title: "Bio-Intensive Raised Beds",
      subtitle:
        "Organic garden beds rich with biological compost and mulching designed to trap moisture in coastal sandy loam.",
      category: "permaculture",
      categoryLabel: "Permaculture Garden",
      location: "Zone 1 Demonstration",
    },
    {
      id: "photo-3",
      src: "/images/nursery.jpg",
      title: "Community Plant Nursery",
      subtitle:
        "Thriving seedling beds propagating indigenous coastal trees, moringa, fruit species, and nitrogen-fixers.",
      category: "nursery",
      categoryLabel: "Tree Nursery",
      location: "Central Nursery Hub",
    },
    {
      id: "photo-4",
      src: "/images/learn.jpg",
      title: "Community Training in Action",
      subtitle:
        "Smallholder farmers, youth, and women gathering in the field for hands-on regenerative agriculture workshops.",
      category: "training",
      categoryLabel: "Training Plots",
      location: "Training Grounds",
    },
    {
      id: "photo-5",
      src: "/images/Lenox with tomatoes.jpg",
      title: "Bountiful Organic Harvest",
      subtitle:
        "Lenox Chome with vine-ripened tomatoes grown purely with natural organic amendments and zero synthetic chemicals.",
      category: "harvest",
      categoryLabel: "Harvest & Community",
      location: "Production Plots",
    },
    {
      id: "photo-6",
      src: "/images/demo site 2.jpg",
      title: "Water Retention Earthworks",
      subtitle:
        "Contour swales and ground-covering organic mulch that capture every drop of rain and rebuild natural soil microbiomes.",
      category: "permaculture",
      categoryLabel: "Permaculture Garden",
      location: "Water Swale Zone",
    },
    {
      id: "photo-7",
      src: "/images/nursery 2.jpg",
      title: "Potted Seedlings for Households",
      subtitle:
        "Thousands of hardy saplings prepared for distribution to local homesteads, schools, and agroforestry projects.",
      category: "nursery",
      categoryLabel: "Tree Nursery",
      location: "Propagation Area",
    },
    {
      id: "photo-8",
      src: "/images/who we are.jpg",
      title: "Peer-to-Peer Field Exchange",
      subtitle:
        "Farmers testing and sharing agroecological methods to combat dryland degradation and boost family nutrition.",
      category: "training",
      categoryLabel: "Training Plots",
      location: "Experiential Center",
    },
    {
      id: "photo-9",
      src: "/images/harvest.jpg",
      title: "Clean, Chemical-Free Food",
      subtitle:
        "Nutrient-dense harvest gathered from our demonstration beds, proving what healthy living soil can yield.",
      category: "harvest",
      categoryLabel: "Harvest & Community",
      location: "Baolala Harvest Hub",
    },
    {
      id: "photo-10",
      src: "/images/community.jpg",
      title: "Community Gathering & Field Day",
      subtitle:
        "Neighbors, local leaders, and students meeting at the farm to celebrate local food sovereignty and self-reliance.",
      category: "harvest",
      categoryLabel: "Harvest & Community",
      location: "Demonstration Pavilion",
    },
    {
      id: "photo-11",
      src: "/images/lenox.jpg",
      title: "On-Site Agronomy Guidance",
      subtitle:
        "Guiding sustainable crop rotation, compost tea fermentation, and biological pest management in the field.",
      category: "training",
      categoryLabel: "Training Plots",
      location: "Baolala Demonstration Farm",
    },
    {
      id: "photo-12",
      src: "/images/Lenox with tomatos.jpg",
      title: "Quality & Soil Health Assessment",
      subtitle:
        "Inspecting produce quality and soil moisture levels to continuously refine our regenerative dryland practices.",
      category: "harvest",
      categoryLabel: "Harvest & Community",
      location: "Crop Trial Plots",
    },
  ];

  // Filter logic
  const filteredPhotos =
    selectedCategory === "all"
      ? farmPhotos
      : farmPhotos.filter((item) => item.category === selectedCategory);

  const displayedPhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPhotos.length;

  // Handle category change
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(6); // Reset to 6 on filter change
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxPhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxPhoto(null);
      } else if (e.key === "ArrowRight") {
        const currentIndex = filteredPhotos.findIndex(
          (p) => p.id === lightboxPhoto.id
        );
        if (currentIndex < filteredPhotos.length - 1) {
          setLightboxPhoto(filteredPhotos[currentIndex + 1]);
        } else {
          setLightboxPhoto(filteredPhotos[0]);
        }
      } else if (e.key === "ArrowLeft") {
        const currentIndex = filteredPhotos.findIndex(
          (p) => p.id === lightboxPhoto.id
        );
        if (currentIndex > 0) {
          setLightboxPhoto(filteredPhotos[currentIndex - 1]);
        } else {
          setLightboxPhoto(filteredPhotos[filteredPhotos.length - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxPhoto, filteredPhotos]);

  // The 4 Core Demonstration Zones from Prompt Copy
  const farmZones = [
    {
      id: "01",
      title: "Thriving Permaculture Garden",
      category: "Soil & Water Systems",
      description:
        "A thriving permaculture garden demonstrating soil regeneration and water conservation techniques.",
      image: "/images/demo site.jpg",
      imageAlt: "Permaculture garden beds and water conservation at Nettle Farm",
      icon: FaWheatAwn,
      stat: "100%",
      statLabel: "Organic & Synthetic-Free",
    },
    {
      id: "02",
      title: "Community Training Plots",
      category: "Grassroots Education",
      description:
        "Training plots where community members practice sustainable agriculture.",
      image: "/images/learn.jpg",
      imageAlt: "Community members practicing sustainable agriculture at Nettle Farm",
      icon: FaGraduationCap,
      stat: "500+",
      statLabel: "Farmers & Students Trained",
    },
    {
      id: "03",
      title: "Community Tree Nursery",
      category: "Agroforestry & Reforestation",
      description:
        "A tree nursery supplying thousands of seedlings to local households.",
      image: "/images/nursery.jpg",
      imageAlt: "Tree nursery supplying thousands of seedlings in Baolala",
      icon: FaTree,
      stat: "3,500+",
      statLabel: "Seedlings Raised & Distributed",
    },
    {
      id: "04",
      title: "Workshops & Field Visits",
      category: "Experiential Learning",
      description:
        "Workshops and field visits for farmers, students, and organizations interested in sustainable agriculture.",
      image: "/images/community.jpg",
      imageAlt: "Workshops and field visits for farmers and students at Nettle Farm",
      icon: FaUsers,
      stat: "40+",
      statLabel: "Field Days & Workshops Hosted",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F6] text-[#11231A] selection:bg-[#84C135] selection:text-[#113B27] overflow-x-hidden">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      <main className="grow">
        {/* ──────────────────────────────────────────────────────────
            1. HERO SECTION (ATMOSPHERIC DEEP FOREST)
        ────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-32 sm:pt-40 pb-20 px-4 sm:px-8 overflow-hidden bg-[#091E14]">
          {/* Background Photography with Deep Forest Scrim */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/demo-farm.jpg"
              alt="Nettle Regenerative Farm in Baolala, Kilifi County, Kenya"
              fill
              priority
              className="object-cover object-center transform scale-105"
            />
            {/* Dark Brand Atmospheric Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#091E14] via-[#091E14]/80 to-[#091E14]/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#091E14]/90 via-[#091E14]/65 to-[#091E14]/80" />
            {/* Subtle Dot Matrix Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#84C135_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
            {/* Category Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#84C135] text-xs sm:text-sm font-semibold mb-6 tracking-wide shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#84C135] animate-ping" />
              <FaLocationDot className="w-3.5 h-3.5 text-[#84C135]" />
              <span>Baolala, Kilifi County • Living Classroom</span>
            </motion.div>

            {/* Display Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight text-white mb-6"
            >
              Our Farm
            </motion.h1>

            {/* Exact Primary Copy Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 max-w-3xl mx-auto mb-10"
            >
              <p className="text-lg sm:text-2xl text-white/95 leading-relaxed font-medium">
                Our farm in Baolala, Kilifi County, is the heart of Nettle Regenerative Farm — a living classroom where knowledge, nature, and community come together.
              </p>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
                Here, we showcase how regenerative farming principles can transform dry, degraded land into fertile, productive ecosystems.
              </p>
            </motion.div>


            {/* Action Buttons & Breadcrumbs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <a
                href="#what-youll-find"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#84C135] text-[#091E14] font-bold text-sm hover:bg-[#99D34C] transition-all shadow-lg hover:shadow-[#84C135]/30 cursor-pointer"
              >
                <span>Explore What You’ll Find</span>
                <FaArrowRight className="w-3 h-3" />
              </a>
              <Link
                href="/contact-us?subject=Visit%20Our%20Farm"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white/15 backdrop-blur-md text-white font-semibold text-sm hover:bg-white/25 border border-white/25 transition-colors cursor-pointer"
              >
                <span>Plan a Farm Visit</span>
                <FaChevronRight className="w-2.5 h-2.5 opacity-70" />
              </Link>
            </motion.div>

            {/* Breadcrumbs */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/60">
              <Link href="/" className="hover:text-[#84C135] transition-colors">
                Home
              </Link>
              <FaChevronRight className="w-2.5 h-2.5 opacity-40" />
              <span className="text-[#84C135] font-semibold">Our Farm</span>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            2. FARM OVERVIEW: FROM DEGRADED LAND TO LIVING ECOSYSTEM
        ────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 bg-white border-b border-[#113B27]/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Narrative & Principles */}
              <div className="lg:col-span-6 flex flex-col items-start">
                <FadeIn>
                  <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27] bg-[#E4EDE8] px-4 py-1.5 rounded-full inline-block mb-4">
                    Farm Overview
                  </span>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#113B27] leading-tight mb-6">
                    A Demonstration Site Built on Regenerative Principles
                  </h2>

                  <p className="text-base sm:text-lg text-[#11231A] font-medium leading-relaxed mb-4">
                    Kilifi County experiences semi-arid conditions, seasonal droughts, and sandy coastal loam soils that quickly lose organic matter when mismanaged.
                  </p>

                  <p className="text-sm sm:text-base text-[#52665B] leading-relaxed mb-8">
                    At our Baolala demonstration farm, we practice and teach methods that reverse this cycle. By capturing every drop of rainfall in swales, layering organic mulch, cultivating beneficial soil microbes, and planting climate-resilient trees, we demonstrate that degraded drylands can become abundant food forests.
                  </p>
                </FadeIn>

                {/* 3 Pillars Grid */}
                <FadeIn delay={0.2} className="w-full space-y-4">
                  <div className="p-5 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF7D9] text-[#3B660E] flex items-center justify-center shrink-0 mt-0.5">
                      <FaWheatAwn className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#113B27] mb-1">
                        Soil Biology Restoration
                      </h4>
                      <p className="text-xs sm:text-sm text-[#52665B] leading-relaxed">
                        Bio-fertilizers, active composting, and vermiculture feed the living soil food web without toxic synthetic inputs.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E4EDE8] text-[#113B27] flex items-center justify-center shrink-0 mt-0.5">
                      <FaDroplet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#113B27] mb-1">
                        Rainwater & Moisture Harvesting
                      </h4>
                      <p className="text-xs sm:text-sm text-[#52665B] leading-relaxed">
                        Earthwork swales on contour lines slow, sink, and spread rainfall, sustaining crops deep into the dry season.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F1E9E0] text-[#654320] flex items-center justify-center shrink-0 mt-0.5">
                      <FaHandsHoldingCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#113B27] mb-1">
                        Community-Centered Stewardship
                      </h4>
                      <p className="text-xs sm:text-sm text-[#52665B] leading-relaxed">
                        Open-source training for local families, women, and youth to duplicate proven techniques on their own plots.
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column: Visual Composition with Image & Floating Glass Widgets */}
              <div className="lg:col-span-6 relative">
                <FadeIn delay={0.25}>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#113B27]/10 aspect-[4/3] sm:aspect-[16/11]">
                    <Image
                      src="/images/demo site 2.jpg"
                      alt="Water retention swales and living beds at Baolala Demonstration Farm"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091E14]/85 via-transparent to-transparent" />

                    {/* Bottom Floating Glass Card */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-5 sm:p-6 rounded-2xl bg-[#091E14]/85 backdrop-blur-md border border-white/20 text-white shadow-xl">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-[#84C135] font-semibold block">
                            Regenerative Impact Metric
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold mt-0.5">
                            Soil Organic Matter & Vitality
                          </h3>
                          <p className="text-xs text-white/70 mt-1 max-w-sm">
                            Demonstrated transformation from depleted sand to rich, moisture-retaining loam.
                          </p>
                        </div>
                        <div className="shrink-0 flex items-center justify-center">
                          <AnimatedGauge percentage={100} color="#84C135" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Overlapping Image Badge */}
                  <div className="hidden sm:flex items-center gap-3 absolute -top-6 -right-6 p-4 rounded-2xl bg-white border border-[#113B27]/15 shadow-xl">
                    <div className="w-12 h-12 rounded-xl bg-[#EBF7D9] flex items-center justify-center text-[#3B660E]">
                      <FaLeaf className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-[#52665B] uppercase tracking-wider font-semibold">
                        Location Hub
                      </div>
                      <div className="text-sm font-bold text-[#113B27]">
                        Baolala, Kilifi County
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            3. "WHAT YOU’LL FIND HERE" (THE 4 CORE DEMONSTRATION ZONES)
        ────────────────────────────────────────────────────────── */}
        <section id="what-youll-find" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F7F9F6] scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            {/* Centered Section Heading */}
            <FadeIn className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27] bg-[#E4EDE8] px-4 py-1.5 rounded-full inline-block mb-3">
                Living Classroom Exploration
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#113B27] leading-tight mb-5">
                What You’ll Find Here
              </h2>
              <p className="text-base sm:text-lg text-[#52665B] leading-relaxed">
                Step inside our demonstration site to experience four interconnected zones designed to educate, regenerate, and empower the local community.
              </p>
            </FadeIn>

            {/* 4 Feature Zones Grid */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10"
            >
              {farmZones.map((zone) => {
                const IconComponent = zone.icon;
                return (
                  <motion.div
                    key={zone.id}
                    variants={staggerItemVariants}
                    whileHover={!shouldReduceMotion ? { y: -6 } : {}}
                    transition={{ duration: 0.3 }}
                    className="rounded-3xl bg-white border border-[#113B27]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Card Top Image Container */}
                    <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                      <Image
                        src={zone.image}
                        alt={zone.imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#091E14]/80 via-transparent to-transparent" />

                      {/* Number Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#091E14]/75 backdrop-blur-md border border-white/20 text-[#84C135] text-xs font-mono font-bold">
                        Zone {zone.id}
                      </div>

                      {/* Floating Zone Tag */}
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#113B27] text-xs font-semibold">
                        {zone.category}
                      </div>

                      {/* Stat highlight on bottom of image */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                        <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                          {zone.statLabel}
                        </span>
                        <span className="text-xl font-bold text-[#84C135] font-mono">
                          {zone.stat}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 sm:p-8 flex flex-col grow justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F2F7F4] text-[#113B27] flex items-center justify-center shrink-0">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-[#113B27] leading-snug">
                            {zone.title}
                          </h3>
                        </div>

                        {/* Exact user copy primary description */}
                        <p className="text-sm sm:text-base text-[#11231A] font-medium leading-relaxed mb-6">
                          {zone.description}
                        </p>

                      </div>

                      {/* Card Action Link */}
                      <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-xs text-[#7E9387]">
                          Kilifi Demonstration Hub
                        </span>
                        <Link
                          href="/contact-us?subject=Farm%20Zone%20Inquiry"
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#113B27] hover:text-[#84C135] transition-colors"
                        >
                          <span>Explore This Zone</span>
                          <FaArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            4. "WHY IT MATTERS" (A LIVING MODEL FOR CHANGE)
        ────────────────────────────────────────────────────────── */}
        <section className="py-24 sm:py-32 px-4 sm:px-8 bg-gradient-to-b from-[#091E14] via-[#113B27] to-[#091E14] text-white relative overflow-hidden">
          {/* Decorative Background Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#84C135]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#84C135]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10 text-center">
            {/* Pill Eyebrow */}
            <FadeIn>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#84C135] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-6">
                <FaLeaf className="w-3.5 h-3.5 text-[#84C135]" />
                <span>Our Core Purpose</span>
              </span>

              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-8">
                Why It Matters
              </h2>

              {/* Exact User Copy Block */}
              <div className="max-w-3xl mx-auto mb-14 space-y-6">
                <blockquote className="text-xl sm:text-3xl font-semibold text-white/95 leading-relaxed italic border-l-4 border-[#84C135] pl-6 sm:pl-8 text-left my-6 bg-white/5 py-4 rounded-r-2xl">
                  “Our demonstration site is more than a farm — it’s a model for change.”
                </blockquote>
                <p className="text-base sm:text-xl text-white/85 leading-relaxed font-normal">
                  It shows what’s possible when people work with nature, not against it. Through the farm, we prove that even in harsh conditions, life can thrive again when we care for the soil and the community.
                </p>
              </div>
            </FadeIn>

            {/* 3 Impact Columns */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left pt-6"
            >
              <motion.div
                variants={staggerItemVariants}
                className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#84C135]/20 border border-[#84C135]/40 text-[#84C135] flex items-center justify-center mb-6">
                    <FaSun className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Working With Nature
                  </h3>
                  <p className="text-sm text-white/75 leading-relaxed">
                    Rather than imposing synthetic chemicals or forcing industrial monocultures, we cooperate with coastal microclimates, indigenous biodiversity, and organic biological cycles.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/15 flex items-center justify-between">
                  <span className="text-xs text-[#84C135] font-semibold uppercase tracking-wider">
                    Approach
                  </span>
                  <span className="text-xs font-mono text-white/80">
                    Permaculture Design
                  </span>
                </div>
              </motion.div>

              <motion.div
                variants={staggerItemVariants}
                className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#84C135]/20 border border-[#84C135]/40 text-[#84C135] flex items-center justify-center mb-6">
                    <FaSeedling className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Proof in Harsh Conditions
                  </h3>
                  <p className="text-sm text-white/75 leading-relaxed">
                    By showing vibrant crops and deep mulch in dry Baolala, we remove fear and skepticism, proving that regenerative techniques generate reliable food security in challenging climates.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/15 flex items-center justify-between">
                  <span className="text-xs text-[#84C135] font-semibold uppercase tracking-wider">
                    Verification
                  </span>
                  <span className="text-xs font-mono text-white/80">
                    Living Classroom
                  </span>
                </div>
              </motion.div>

              <motion.div
                variants={staggerItemVariants}
                className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#84C135]/20 border border-[#84C135]/40 text-[#84C135] flex items-center justify-center mb-6">
                    <FaHandsHoldingCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Catalyst for Community
                  </h3>
                  <p className="text-sm text-white/75 leading-relaxed">
                    The farm is not an isolated island. Every insight gained here flows outwards to smallholder households, women’s self-help groups, and schools throughout Kilifi County.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/15 flex items-center justify-between">
                  <span className="text-xs text-[#84C135] font-semibold uppercase tracking-wider">
                    Community Reach
                  </span>
                  <span className="text-xs font-mono text-white/80">
                    Thousands Empowered
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            5. FARM OVERVIEW: PICTURES & INTERACTIVE GALLERY (WITH LOAD MORE)
        ────────────────────────────────────────────────────────── */}
        <section id="pictures-gallery" className="py-20 sm:py-28 px-4 sm:px-8 bg-white border-b border-[#113B27]/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            {/* Header with Title and Copy */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
              <FadeIn className="max-w-2xl">
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27] bg-[#E4EDE8] px-4 py-1.5 rounded-full inline-block mb-3">
                  Visual Tour
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#113B27] leading-tight mb-4">
                  Pictures
                </h2>
                <p className="text-base sm:text-lg text-[#52665B] leading-relaxed">
                  Explore authentic photos from our Baolala demonstration site. Witness regenerative farming in action, from soil preparation and seedling nurseries to harvest and community workshops.
                </p>
              </FadeIn>

              {/* Photo Count Indicator */}
              <FadeIn delay={0.15}>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#F7F9F6] border border-[#113B27]/10 text-xs sm:text-sm font-semibold text-[#113B27]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#84C135]" />
                  <span>
                    Showing {displayedPhotos.length} of {filteredPhotos.length} Photos
                  </span>
                </div>
              </FadeIn>
            </div>

            {/* Category Filter Pills */}
            <FadeIn delay={0.2} className="mb-10 sm:mb-12">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {[
                  { key: "all", label: "All Pictures" },
                  { key: "permaculture", label: "Permaculture Gardens" },
                  { key: "nursery", label: "Tree Nursery" },
                  { key: "training", label: "Training Plots" },
                  { key: "harvest", label: "Harvest & Community" },
                ].map((tab) => {
                  const isActive = selectedCategory === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => handleCategoryChange(tab.key)}
                      className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#113B27] text-white shadow-md shadow-[#113B27]/20 border border-[#113B27]"
                          : "bg-[#F7F9F6] text-[#52665B] hover:text-[#113B27] hover:bg-[#E4EDE8] border border-[#113B27]/10"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </FadeIn>

            {/* Photos Responsive Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              <AnimatePresence>
                {displayedPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={!shouldReduceMotion ? { y: -6 } : {}}
                    onClick={() => setLightboxPhoto(photo)}
                    className="group relative rounded-3xl overflow-hidden bg-neutral-100 border border-[#113B27]/10 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-end aspect-[4/3] sm:aspect-[4/3]"
                  >
                    {/* Image */}
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091E14]/95 via-[#091E14]/40 to-transparent group-hover:via-[#091E14]/50 transition-colors" />

                    {/* Floating Zoom Icon on Hover */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <FaEye className="w-4 h-4" />
                    </div>

                    {/* Category Chip on Top Left */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#091E14]/80 backdrop-blur-md text-[#84C135] text-[11px] font-semibold border border-white/15">
                      {photo.categoryLabel}
                    </div>

                    {/* Bottom Metadata */}
                    <div className="relative z-10 p-5 sm:p-6 text-white">
                      <h3 className="text-lg sm:text-xl font-bold leading-snug group-hover:text-[#84C135] transition-colors">
                        {photo.title}
                      </h3>
                      <p className="text-xs text-white/80 mt-1 line-clamp-2 leading-relaxed">
                        {photo.subtitle}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Progressive "Load More" Action Button */}
            {hasMore ? (
              <FadeIn delay={0.3} className="text-center mt-12 sm:mt-16">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#113B27] text-white font-bold text-sm sm:text-base hover:bg-[#174A32] transition-all shadow-lg hover:shadow-xl hover:shadow-[#113B27]/20 cursor-pointer group"
                >
                  <span>Load More</span>
                  <FaChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="block text-xs text-[#7E9387] mt-3">
                  Click to view more pictures from Baolala Farm
                </span>
              </FadeIn>
            ) : (
              <div className="text-center mt-12 sm:mt-16">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F7F9F6] border border-[#113B27]/10 text-xs sm:text-sm text-[#52665B] font-medium">
                  <FaCircleCheck className="w-4 h-4 text-[#84C135]" />
                  <span>All pictures loaded in this category</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            6. PRACTICAL VISITOR INFORMATION (BAOLALA, KILIFI COUNTY)
        ────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F7F9F6]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* Left Column: Guidelines & Visiting Info */}
              <div className="lg:col-span-7">
                <FadeIn>
                  <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27] bg-[#E4EDE8] px-4 py-1.5 rounded-full inline-block mb-3">
                    Plan Your Visit
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#113B27] leading-tight mb-6">
                    Visiting the Baolala Demonstration Farm
                  </h2>
                  <p className="text-base sm:text-lg text-[#52665B] leading-relaxed mb-8">
                    We welcome farmers, researchers, school groups, and eco-conscious visitors who wish to see living regenerative systems firsthand.
                  </p>
                </FadeIn>

                <FadeIn delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-[#113B27]/10 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF7D9] text-[#3B660E] flex items-center justify-center mb-3">
                      <FaCalendarDays className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-[#113B27] mb-1">
                      Field Visit Days
                    </h4>
                    <p className="text-xs text-[#52665B] leading-relaxed">
                      Guided tours and workshops run Monday through Saturday by prior appointment to ensure dedicated staff accompaniment.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#113B27]/10 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#E4EDE8] text-[#113B27] flex items-center justify-center mb-3">
                      <FaTree className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-[#113B27] mb-1">
                      Seedling Collection
                    </h4>
                    <p className="text-xs text-[#52665B] leading-relaxed">
                      Our tree nursery is open for local farmers and organizations to inspect, purchase, or order tree and vegetable seedlings.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#113B27]/10 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#F1E9E0] text-[#654320] flex items-center justify-center mb-3">
                      <FaGraduationCap className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-[#113B27] mb-1">
                      Educational Modules
                    </h4>
                    <p className="text-xs text-[#52665B] leading-relaxed">
                      Curriculum-aligned practical lessons in composting, soil health, water conservation, and coastal agroforestry.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#113B27]/10 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#F2F7F4] text-[#113B27] flex items-center justify-center mb-3">
                      <FaShieldHalved className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-[#113B27] mb-1">
                      What to Bring
                    </h4>
                    <p className="text-xs text-[#52665B] leading-relaxed">
                      Sun protection, comfortable walking shoes or boots, a notebook, and an eagerness to get hands-on with the soil!
                    </p>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column: Interactive Location Card */}
              <div className="lg:col-span-5">
                <FadeIn delay={0.25}>
                  <div className="p-8 sm:p-10 rounded-3xl bg-[#091E14] text-white border border-white/15 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#84C135]/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#84C135] text-xs font-semibold mb-6">
                        <FaLocationDot className="w-3.5 h-3.5" />
                        <span>Kilifi County, Kenya</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                        Nettle Regenerative Farm
                      </h3>

                      <p className="text-sm text-white/80 leading-relaxed mb-6">
                        Located in the heart of Baolala, Kilifi County. Accessible from the Malindi-Salagate road network.
                      </p>

                      <div className="space-y-4 pt-6 border-t border-white/15 text-sm">
                        <div className="flex items-center gap-3 text-white/90">
                          <FaClock className="w-4 h-4 text-[#84C135] shrink-0" />
                          <span>Visiting Hours: 8:00 AM – 5:00 PM (Mon – Sat)</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/90">
                          <FaEnvelope className="w-4 h-4 text-[#84C135] shrink-0" />
                          <span>
                            Direct inquiries:{" "}
                            <a
                              href="mailto:info@nettleregenerativefarm.com"
                              className="text-white hover:text-[#84C135] underline transition-colors"
                            >
                              info@nettleregenerativefarm.com
                            </a>
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-white/90">
                          <FaLocationDot className="w-4 h-4 text-[#84C135] shrink-0" />
                          <span>Baolala Demonstration Site, Kilifi County</span>
                        </div>
                      </div>

                      <div className="pt-8 mt-8 border-t border-white/15">
                        <Link
                          href="/contact-us?subject=Schedule%20a%20Farm%20Visit"
                          className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-[#84C135] text-[#091E14] font-bold text-sm hover:bg-[#99D34C] transition-colors shadow-lg cursor-pointer"
                        >
                          <span>Schedule Your Visit Today</span>
                          <FaArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            7. CALL TO ACTION (CTA BANNER)
        ────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24 px-4 sm:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="relative rounded-3xl overflow-hidden bg-[#113B27] p-8 sm:p-14 lg:p-16 text-white text-center shadow-2xl border border-white/10">
                {/* Background ambient lighting */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#84C135_0%,transparent_65%)] opacity-20 pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#84C135] text-xs sm:text-sm font-semibold mb-6">
                    <FaSeedling className="w-3.5 h-3.5 text-[#84C135]" />
                    <span>Join Us on the Ground</span>
                  </span>

                  <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                    Experience the Transformation Firsthand
                  </h2>

                  <p className="text-base sm:text-xl text-white/85 leading-relaxed mb-10">
                    Whether you are an aspiring farmer, a school looking for field-based environmental science, or an organization eager to partner for community food sovereignty, our doors in Baolala are open.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/contact-us?subject=Visit%20Our%20Farm"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#84C135] text-[#091E14] font-bold text-sm sm:text-base hover:bg-[#99D34C] transition-all shadow-xl hover:shadow-[#84C135]/40 cursor-pointer"
                    >
                      <span>Book a Demonstration Tour</span>
                      <FaArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/our-programs"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-white font-semibold text-sm sm:text-base hover:bg-white/20 border border-white/25 transition-colors cursor-pointer"
                    >
                      <span>Explore Our Programs</span>
                      <FaChevronRight className="w-3 h-3 opacity-70" />
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* ──────────────────────────────────────────────────────────
          8. FULLSCREEN LIGHTBOX MODAL
      ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8"
            onClick={() => setLightboxPhoto(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxPhoto(null)}
              aria-label="Close photo preview"
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-xl"
            >
              <FaXmark className="w-5 h-5" />
            </button>

            {/* Prev Photo Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredPhotos.findIndex(
                  (p) => p.id === lightboxPhoto.id
                );
                if (currentIndex > 0) {
                  setLightboxPhoto(filteredPhotos[currentIndex - 1]);
                } else {
                  setLightboxPhoto(filteredPhotos[filteredPhotos.length - 1]);
                }
              }}
              aria-label="Previous photo"
              className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-xl"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Photo Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = filteredPhotos.findIndex(
                  (p) => p.id === lightboxPhoto.id
                );
                if (currentIndex < filteredPhotos.length - 1) {
                  setLightboxPhoto(filteredPhotos[currentIndex + 1]);
                } else {
                  setLightboxPhoto(filteredPhotos[0]);
                }
              }}
              aria-label="Next photo"
              className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-xl"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>

            {/* Content Container */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-[#091E14] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative w-full h-[55vh] sm:h-[65vh] bg-black">
                <Image
                  src={lightboxPhoto.src}
                  alt={lightboxPhoto.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Caption & Metadata Bar */}
              <div className="p-5 sm:p-6 bg-[#091E14] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/15">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#84C135] text-[#091E14] font-bold">
                      {lightboxPhoto.categoryLabel}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {lightboxPhoto.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl leading-relaxed">
                    {lightboxPhoto.subtitle}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-xs font-mono text-white/60">
                    {filteredPhotos.findIndex((p) => p.id === lightboxPhoto.id) + 1} / {filteredPhotos.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Footer */}
      <FooterSection />
    </div>
  );
}
