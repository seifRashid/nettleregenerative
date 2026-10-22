"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLocationDot,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaPhone,
} from "react-icons/fa6";

export function FooterSection() {
  const socialLinks = [
    { icon: FaXTwitter, label: "Twitter / X", href: "#" },
    { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
    { icon: FaInstagram, label: "Instagram", href: "#" },
    { icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/254115198300" },
  ];

  return (
    <footer id="contact" className="mt-auto bg-[#091E14] text-white rounded-t-[40px] pt-16 pb-12 px-4 sm:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Links Tree */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
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
              <li><Link href="/contact-us" className="hover:text-[#84C135] transition-colors">Sponsor a Food Forest</Link></li>
              <li><Link href="/contact-us" className="hover:text-[#84C135] transition-colors">Contact & Farm Visits</Link></li>
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
