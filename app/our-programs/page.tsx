"use client";

import React from "react";
import Link from "next/link";
import { FaLeaf, FaChevronRight } from "react-icons/fa6";
import {
  Navbar,
  FocusAreasSection,
  FooterSection,
  FloatingDesignSystemBadge,
} from "../components";

export default function OurProgramsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F6] text-[#11231A] selection:bg-[#84C135] selection:text-[#113B27] overflow-x-hidden">
      <Navbar />

      <main className="grow">
        {/* Page Banner Header - Full bleed under navbar */}
        <section className="pt-32 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-8 bg-gradient-to-b from-[#091E14] via-[#113B27] to-[#0D2E1E] text-white">
          <div className="max-w-7xl mx-auto text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#84C135] text-xs font-semibold uppercase tracking-wider mb-4 border border-white/15">
              <FaLeaf className="w-3 h-3 text-[#84C135]" />
              <span>Community & Agriculture</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
              Our Programs
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-6">
              Discover our hands-on farmer workshops, permaculture mentorship, indigenous tree distribution, and food forest initiatives.
            </p>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/70">
              <Link href="/" className="hover:text-[#84C135] transition-colors">Home</Link>
              <FaChevronRight className="w-2.5 h-2.5 opacity-50" />
              <span className="text-[#84C135] font-semibold">Our Programs</span>
            </div>
          </div>
        </section>

        {/* Existing Strategic Focus Areas as initial content */}
        <FocusAreasSection />
      </main>

      <FooterSection />
      <FloatingDesignSystemBadge />
    </div>
  );
}
