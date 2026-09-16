"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaArrowRight,
  FaLocationDot,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaPhone,
} from "react-icons/fa6";
import { FadeIn } from "./MotionComponents";

export function FooterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail("");
    }
  };

  const socialLinks = [
    { icon: FaXTwitter, label: "Twitter / X", href: "#" },
    { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
    { icon: FaInstagram, label: "Instagram", href: "#" },
    { icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/254115198300" },
  ];

  return (
    <footer id="contact" className="mt-auto bg-[#091E14] text-white rounded-t-[40px] pt-16 pb-12 px-4 sm:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Banner */}
        <FadeIn className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-16 border-b border-white/15">
          <div className="lg:col-span-6">
            <span className="text-xs uppercase tracking-wider text-[#84C135] font-semibold block mb-2">
              Stay Connected
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Join the Regenerative Movement
            </h3>
            <p className="text-sm text-white/70 mt-2 max-w-md">
              Get regular updates on our permaculture workshops, seedling distributions, and
              community impact in Kilifi County.
            </p>
          </div>

          <div className="lg:col-span-6 flex justify-start lg:justify-end">
            <form
              onSubmit={handleSubscribe}
              className="relative flex items-center w-full max-w-md bg-white/10 backdrop-blur-md rounded-full border border-white/25 p-1.5 focus-within:border-[#84C135] focus-within:ring-2 focus-within:ring-[#84C135]/40 transition-all"
            >
              <div className="pl-4 pr-2 text-white/60">
                <FaEnvelope className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="Your email address here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/50 text-sm focus:outline-none py-2"
                required
              />
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="submit"
                className="w-10 h-10 rounded-full bg-white text-[#113B27] flex items-center justify-center font-bold hover:bg-[#84C135] transition-colors cursor-pointer shrink-0 shadow-md"
                aria-label="Subscribe"
              >
                <FaArrowRight className="w-3.5 h-3.5 text-[#113B27]" />
              </motion.button>
            </form>
          </div>
        </FadeIn>

        {/* Subscription alert banner */}
        <AnimatePresence>
          {subscribed && (
            <motion.div
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mt-4 p-3 rounded-2xl bg-[#84C135]/20 border border-[#84C135] text-[#84C135] text-xs text-center font-medium"
            >
              Thank you for subscribing to Nettle Regenerative Farm updates!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Links Tree */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white border-2 border-[#84C135]/40 shadow-md flex items-center justify-center shrink-0 relative">
                <Image
                  src="/images/logo.jpg"
                  alt="Nettle Regenerative (K) Limited Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="font-bold text-lg tracking-tight">Nettle Regenerative &apos;K&apos; Limited</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Nettle Regenerative &apos;K&apos; Limited. Empowering communities in Kilifi County
              through permaculture, soil restoration, and food sovereignty.
            </p>
            <div className="text-xs text-white/60 space-y-1">
              <p className="flex items-center gap-2">
                <FaLocationDot className="w-3 h-3 text-[#84C135]" />
                <span>Baolala, Kilifi County, Kenya</span>
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="w-3 h-3 text-[#84C135]" />
                <span>info@nettleregenerative.co.ke</span>
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="w-3 h-3 text-[#84C135]" />
                <a href="tel:+254115198300" className="hover:text-white transition-colors">
                  +254 115 198 300
                </a>
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 mt-4">
              {socialLinks.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-[#84C135] hover:text-[#113B27] transition-colors"
                  aria-label={item.label}
                >
                  <item.icon className="w-3.5 h-3.5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link href="/" className="hover:text-[#84C135] transition-colors">Home</Link></li>
              <li><Link href="/about-us" className="hover:text-[#84C135] transition-colors">About Us</Link></li>
              <li><Link href="/our-programs" className="hover:text-[#84C135] transition-colors">Our Programs</Link></li>
              <li><Link href="/our-farm" className="hover:text-[#84C135] transition-colors">Our Farm</Link></li>
              <li><Link href="/contact-us" className="hover:text-[#84C135] transition-colors">Contact Us</Link></li>
              <li>
                <Link href="/design-system" className="text-[#84C135] font-semibold hover:underline flex items-center gap-1.5 mt-2">
                  <span>📐 Design System</span> →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Programs
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><a href="#sustainability" className="hover:text-[#84C135] transition-colors">Permaculture Workshops</a></li>
              <li><a href="#nursery" className="hover:text-[#84C135] transition-colors">Seedling Distribution</a></li>
              <li><a href="#sustainability" className="hover:text-[#84C135] transition-colors">Composting & Soil Care</a></li>
              <li><a href="#who-we-are" className="hover:text-[#84C135] transition-colors">School & Community Gardens</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Impact & Partners
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><a href="#founder" className="hover:text-[#84C135] transition-colors">Lenox Kipondah Story</a></li>
              <li><a href="#sustainability" className="hover:text-[#84C135] transition-colors">PRI Kenya Collaboration</a></li>
              <li><a href="#contact" className="hover:text-[#84C135] transition-colors">Sponsor a Food Forest</a></li>
              <li><a href="#contact" className="hover:text-[#84C135] transition-colors">Contact & Farm Visits</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Nettle Regenerative &apos;K&apos; Limited. All rights reserved.</p>
          <p>Baolala Demonstration Site • Kilifi County, Kenya</p>
        </div>
      </div>
    </footer>
  );
}
