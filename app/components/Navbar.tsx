"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaBars,
  FaXmark,
  FaWhatsapp,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import { Home, Users, Sparkles, Sprout, Phone } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { CurvedNavbar, iNavItem } from "@/components/ui/curved-menu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // The 5 primary pages for Nettle Regenerative
  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "About Us", url: "/about-us", icon: Users },
    { name: "Our Programs", url: "/our-programs", icon: Sparkles },
    { name: "Our Farm", url: "/our-farm", icon: Sprout },
    { name: "Contact Us", url: "/contact-us", icon: Phone },
  ];

  const mobileCurvedNavItems: iNavItem[] = [
    {
      heading: "Home",
      href: "/",
      subheading: "Nettle Regenerative Farm",
    },
    {
      heading: "About Us",
      href: "/about-us",
      subheading: "Our Story & Vision in Kilifi",
    },
    {
      heading: "Our Programs",
      href: "/our-programs",
      subheading: "Permaculture & Farmer Training",
    },
    {
      heading: "Our Farm",
      href: "/our-farm",
      subheading: "Baolala Demonstration Site",
    },
    {
      heading: "Contact Us",
      href: "/contact-us",
      subheading: "Get in Touch & Farm Visits",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-[#091E14]/90 backdrop-blur-xl border-b border-white/15 shadow-xl"
          : "pt-4 sm:pt-6 pb-2"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo on Left */}
        <Link
          href="/"
          className="flex items-center gap-3 group transition-opacity hover:opacity-90"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white border border-white/40 shadow-md flex items-center justify-center shrink-0 relative transition-transform"
          >
            <Image
              src="/images/logo.jpg"
              alt="Nettle Regenerative (K) Limited Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </motion.div>
          <div className="flex flex-col pr-1">
            <span className="font-bold text-sm sm:text-base tracking-tight leading-tight text-white group-hover:text-[#84C135] transition-colors">
              Nettle Regenerative &apos;K&apos; Limited
            </span>
            <span className="text-[9px] text-[#84C135] tracking-widest uppercase font-semibold">
              Kilifi County, Kenya
            </span>
          </div>
        </Link>

        {/* Center Desktop Tubelight NavBar */}
        <div className="hidden md:flex items-center gap-3">
          <NavBar
            items={navItems}
            className="static sm:static left-auto bottom-auto sm:top-auto translate-x-0 mb-0 sm:pt-0 z-auto"
          />
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#84C135] text-[#091E14] text-xs sm:text-sm font-bold tracking-wide hover:bg-[#99D34C] transition-all shadow-lg hover:shadow-[#84C135]/30 cursor-pointer"
            >
              <span>Visit Farm</span>
              <FaArrowRight className="w-2.5 h-2.5" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-full bg-[#091E14]/80 backdrop-blur-xl border border-white/25 flex items-center justify-center text-white focus:outline-none shadow-xl cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaXmark className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Mobile Curved Sidebar Drawer Menu */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <CurvedNavbar
            setIsActive={setMobileMenuOpen}
            navItems={mobileCurvedNavItems}
            footer={
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.72, ease: [0.33, 1, 0.68, 1] as const }}
                className="flex flex-col gap-4 px-6 sm:px-10 py-6 border-t border-black/10 bg-black/[0.02]"
              >
                <Link
                  href="/contact-us"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 px-4 rounded-full bg-[#84C135] text-[#091E14] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#99D34C] transition-colors shadow-md"
                >
                  <span>Visit Our Farm</span>
                  <FaArrowRight className="w-3 h-3" />
                </Link>
                <div className="flex items-center justify-between pt-1 text-black/60">
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-black/50">
                    Kilifi, Kenya
                  </span>
                  <div className="flex items-center gap-2.5">
                    <a
                      href="https://wa.me/254115198300"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/70 hover:text-[#84C135] hover:bg-black/10 transition-colors"
                    >
                      <FaWhatsapp size={14} />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/70 hover:text-[#84C135] hover:bg-black/10 transition-colors"
                    >
                      <FaLinkedinIn size={14} />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/70 hover:text-[#84C135] hover:bg-black/10 transition-colors"
                    >
                      <FaInstagram size={14} />
                    </a>
                    <a
                      href="https://x.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X (Twitter)"
                      className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/70 hover:text-[#84C135] hover:bg-black/10 transition-colors"
                    >
                      <FaXTwitter size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            }
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
