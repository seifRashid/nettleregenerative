"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaLeaf,
  FaArrowRight,
  FaLocationDot,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaCheck,
} from "react-icons/fa6";
import {
  Navbar,
  FooterSection,
} from "../components";

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Farm Visit Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", subject: "Farm Visit Inquiry", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F6] text-[#11231A] selection:bg-[#84C135] selection:text-[#113B27] overflow-x-hidden">
      <Navbar />

      <main className="grow">
        {/* Page Banner Header - Full bleed under navbar */}
        <section className="pt-32 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-8 bg-gradient-to-b from-[#091E14] via-[#113B27] to-[#0D2E1E] text-white">
          <div className="max-w-7xl mx-auto text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#84C135] text-xs font-semibold uppercase tracking-wider mb-4 border border-white/15">
              <FaLeaf className="w-3 h-3 text-[#84C135]" />
              <span>Connect With Us</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-6">
              Plan your visit to our Baolala demonstration site, collaborate on permaculture workshops, or inquire about seedling distribution.
            </p>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/70">
              <Link href="/" className="hover:text-[#84C135] transition-colors">Home</Link>
              <span className="opacity-50">››</span>
              <span className="text-[#84C135] font-semibold">Contact Us</span>
            </div>
          </div>
        </section>

        {/* Contact Information & Interactive Form */}
        <section className="py-20 px-4 sm:px-8 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Details (Left) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-wider text-[#84C135] font-semibold block">
                Direct Inquiries
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#113B27] tracking-tight">
                We Welcome Farmers, Partners & Visitors
              </h2>
              <p className="text-sm sm:text-base text-[#52665B] leading-relaxed">
                Whether you want to order indigenous tree seedlings, volunteer, sponsor a community food forest, or arrange a group training session in Baolala, we’d love to hear from you.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10">
                  <div className="w-10 h-10 rounded-full bg-[#113B27] text-[#84C135] flex items-center justify-center shrink-0">
                    <FaLocationDot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#113B27]">Farm Location</h4>
                    <p className="text-xs text-[#52665B] mt-0.5">Baolala, Kilifi County, Kenya</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10">
                  <div className="w-10 h-10 rounded-full bg-[#113B27] text-[#84C135] flex items-center justify-center shrink-0">
                    <FaEnvelope className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#113B27]">Email Address</h4>
                    <p className="text-xs text-[#52665B] mt-0.5">info@nettleregenerative.co.ke</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10">
                  <div className="w-10 h-10 rounded-full bg-[#113B27] text-[#84C135] flex items-center justify-center shrink-0">
                    <FaWhatsapp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#113B27]">WhatsApp / Phone</h4>
                    <p className="text-xs text-[#52665B] mt-0.5">+254 (0) 700 000 000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form (Right) */}
            <div className="lg:col-span-7 p-8 rounded-3xl bg-[#F7F9F6] border border-[#113B27]/10 shadow-sm">
              <h3 className="text-xl font-bold text-[#113B27] mb-6">Send Us a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#11231A] mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amani Mwangi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-[#113B27]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#84C135]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#11231A] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. amani@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-[#113B27]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#84C135]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#11231A] mb-1.5">
                    Subject / Reason for Inquiry
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-[#113B27]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#84C135] cursor-pointer"
                  >
                    <option>Farm Visit Inquiry</option>
                    <option>Permaculture Workshop Booking</option>
                    <option>Seedling Order / Inquiries</option>
                    <option>Partnership & Collaboration</option>
                    <option>General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#11231A] mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your project, visit dates, or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-[#113B27]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#84C135]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#113B27] text-white text-sm font-semibold hover:bg-[#84C135] hover:text-[#091E14] transition-all shadow-md cursor-pointer"
                >
                  <span>Send Message</span>
                  <FaArrowRight className="w-3 h-3" />
                </button>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-2xl bg-[#ECF8EB] text-[#1E5C1B] border border-[#A6E09D] text-xs flex items-center gap-2 font-medium"
                  >
                    <FaCheck className="w-3.5 h-3.5 text-[#1E5C1B]" />
                    <span>Thank you! Your message has been received. We will respond shortly.</span>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
