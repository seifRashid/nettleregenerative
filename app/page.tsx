"use client";

import React from "react";
import {
  Navbar,
  HeroSection,
  BentoGridSection,
  AboutSection,
  FocusAreasSection,
  SustainabilitySection,
  StoryCardsSection,
  ImmersiveBannerSection,
  FooterSection,
} from "./components";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F6] text-[#11231A] selection:bg-[#84C135] selection:text-[#113B27] overflow-x-hidden">
      {/* 1. Floating Navigation Bar & Mobile Drawer */}
      <Navbar />

      <main className="grow">
        {/* 2. Hero Section with Cinematic Parallax & Live Demo Farm Gauge */}
        <HeroSection />

        {/* 3. Bento Grid / Impact Stats with Animated Number Counters */}
        <BentoGridSection />

        {/* 4. Who We Are & Founder's Resilience Mission */}
        <AboutSection />

        {/* 5. Strategic Focus Areas (3 Pillars) */}
        <FocusAreasSection />

        {/* 6. Sustainability in Practice & Living Classroom Showcase */}
        <SustainabilitySection />

        {/* 7. Three-Column Story Cards & Nursery Hub */}
        <StoryCardsSection />

        {/* 8. Mid-Page Immersive Dark Forest Banner */}
        <ImmersiveBannerSection />
      </main>

      {/* 9. Footer & Signature Newsletter Capsule */}
      <FooterSection />
    </div>
  );
}
