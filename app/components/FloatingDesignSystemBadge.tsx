"use client";

import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export function FloatingDesignSystemBadge() {
  return (
    <Link
      href="/design-system"
      className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#113B27]/95 text-white text-xs font-semibold backdrop-blur-xl border border-[#84C135]/40 shadow-2xl hover:bg-[#84C135] hover:text-[#091E14] transition-all hover:scale-105 group"
      title="Explore Nettle Regenerative Design System"
    >
      <span className="w-2 h-2 rounded-full bg-[#84C135] group-hover:bg-[#113B27] animate-pulse"></span>
      <span>Design System</span>
      <FaArrowRight className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}
