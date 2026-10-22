"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FaLeaf,
  FaArrowRight,
  FaLocationDot,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaChevronRight,
  FaChevronDown,
  FaCopy,
  FaCar,
  FaBus,
  FaMapLocationDot,
  FaSpinner,
  FaCircleCheck,
} from "react-icons/fa6";
import {
  Navbar,
  FooterSection,
  FadeIn,
  staggerContainerVariants,
  staggerItemVariants,
} from "../components";

// Exact Farm Coordinates
const FARM_COORDINATES = {
  lat: -3.169615,
  lng: 39.790677,
  dms: `3°10'10.6"S 39°47'26.4"E`,
  decimalString: "-3.169615, 39.790677",
};

// Map Directions Links
const GOOGLE_MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${FARM_COORDINATES.lat},${FARM_COORDINATES.lng}`;
const APPLE_MAPS_URL = `https://maps.apple.com/?daddr=${FARM_COORDINATES.lat},${FARM_COORDINATES.lng}`;

// Contact Form inner component utilizing useSearchParams
function ContactFormContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject") || "Schedule a Farm Visit & Tour";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: initialSubject,
    preferredMethod: "email",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync subject if URL search parameter changes
  useEffect(() => {
    const paramSubject = searchParams.get("subject");
    if (paramSubject) {
      setFormData((prev) => ({ ...prev, subject: paramSubject }));
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please provide details about your inquiry or visit";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ form: data.error || "Submission failed. Please try again." });
        }
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isTimeout = err?.name === "AbortError";
      setErrors({
        form: isTimeout
          ? "Request timed out. Please check your connection and try again."
          : "Network error occurred. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "Schedule a Farm Visit & Tour",
      preferredMethod: "email",
      message: "",
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="p-8 sm:p-10 rounded-3xl bg-white border border-[#113B27]/10 shadow-lg text-center flex flex-col items-center justify-center space-y-5"
      >
        <div className="w-16 h-16 rounded-full bg-[#EBF7D9] text-[#3B660E] flex items-center justify-center shadow-inner">
          <FaCircleCheck className="w-8 h-8 text-[#84C135]" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl font-bold text-[#113B27]">Message Received!</h3>
          <p className="text-sm text-[#52665B] leading-relaxed">
            Thank you, <span className="font-semibold text-[#11231A]">{formData.fullName}</span>.
            We have received your message regarding{" "}
            <span className="font-semibold text-[#11231A]">“{formData.subject}”</span>. Our team will
            reach out via your preferred method ({formData.preferredMethod}) within 24 hours.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/10 text-xs text-[#52665B] max-w-md w-full text-left space-y-1">
          <div className="font-bold text-[#113B27] mb-1">Direct Contact Backup:</div>
          <div>
            • Urgent inquiries: WhatsApp/Call <span className="font-medium text-[#11231A]">+254 115 198 300</span>
          </div>
          <div>
            • Email confirmation copy will be sent to:{" "}
            <span className="font-mono text-[#11231A]">{formData.email}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#113B27] text-white font-bold text-xs sm:text-sm hover:bg-[#174A32] transition-colors cursor-pointer shadow-md"
        >
          <span>Send Another Message</span>
          <FaArrowRight className="w-3 h-3" />
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="p-6 sm:p-10 rounded-3xl bg-white border border-[#113B27]/10 shadow-sm space-y-6"
    >
      <div className="border-b border-[#113B27]/10 pb-4">
        <h3 className="text-2xl font-bold text-[#113B27] tracking-tight">Send Us a Direct Message</h3>
        <p className="text-xs sm:text-sm text-[#52665B] mt-1">
          Fill out the details below and our team in Baolala will get back to you promptly.
        </p>
      </div>

      {errors.form && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium">
          {errors.form}
        </div>
      )}

      {/* Name and Email Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="fullName" className="block text-xs font-bold text-[#11231A] uppercase tracking-wider mb-1.5">
            Full Name <span className="text-rose-600">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            autoComplete="name"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              if (errors.fullName) setErrors({ ...errors, fullName: "" });
            }}
            placeholder="e.g. Amani Mwangi"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={`w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border text-sm text-[#11231A] placeholder-[#52665B]/50 transition-all focus:outline-none focus:bg-white ${
              errors.fullName
                ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
                : "border-[#113B27]/15 focus:border-[#84C135] focus:ring-2 focus:ring-[#84C135]/30"
            }`}
          />
          {errors.fullName && (
            <p id="fullName-error" className="text-xs text-rose-600 mt-1 font-medium">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-bold text-[#11231A] uppercase tracking-wider mb-1.5">
            Email Address <span className="text-rose-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            placeholder="e.g. amani@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border text-sm text-[#11231A] placeholder-[#52665B]/50 transition-all focus:outline-none focus:bg-white ${
              errors.email
                ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
                : "border-[#113B27]/15 focus:border-[#84C135] focus:ring-2 focus:ring-[#84C135]/30"
            }`}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-rose-600 mt-1 font-medium">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Phone Number & Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-xs font-bold text-[#11231A] uppercase tracking-wider mb-1.5">
            Phone / WhatsApp Number <span className="text-xs font-normal text-[#52665B]">(Optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. +254 115 198 300"
            className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/15 text-sm text-[#11231A] placeholder-[#52665B]/50 transition-all focus:outline-none focus:bg-white focus:border-[#84C135] focus:ring-2 focus:ring-[#84C135]/30"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-xs font-bold text-[#11231A] uppercase tracking-wider mb-1.5">
            Subject / Reason <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/15 text-sm text-[#11231A] appearance-none focus:outline-none focus:bg-white focus:border-[#84C135] focus:ring-2 focus:ring-[#84C135]/30 cursor-pointer pr-10"
            >
              <option value="Schedule a Farm Visit & Tour">Schedule a Farm Visit & Tour</option>
              <option value="Permaculture Training & Workshops">Permaculture Training & Workshops</option>
              <option value="Indigenous Tree Seedlings & Nursery Hub">Indigenous Tree Seedlings & Nursery Hub</option>
              <option value="Partnership & Institutional Collaboration">Partnership & Institutional Collaboration</option>
              <option value="Volunteer & Community Engagement">Volunteer & Community Engagement</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
            <FaChevronDown className="w-3.5 h-3.5 text-[#52665B] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label className="block text-xs font-bold text-[#11231A] uppercase tracking-wider mb-2">
          Preferred Reply Channel
        </label>
        <div className="flex flex-wrap gap-2.5">
          {[
            { id: "email", label: "Email", icon: FaEnvelope },
            { id: "whatsapp", label: "WhatsApp", icon: FaWhatsapp },
            { id: "phone", label: "Phone Call", icon: FaPhone },
          ].map((method) => {
            const Icon = method.icon;
            const isSelected = formData.preferredMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setFormData({ ...formData, preferredMethod: method.id })}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#113B27] text-white shadow-sm ring-2 ring-[#84C135]"
                    : "bg-[#F7F9F6] text-[#52665B] hover:text-[#11231A] border border-[#113B27]/10"
                }`}
              >
                <Icon className={`w-3 h-3 ${isSelected ? "text-[#84C135]" : ""}`} />
                <span>{method.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message Textarea */}
      <div>
        <label htmlFor="message" className="block text-xs font-bold text-[#11231A] uppercase tracking-wider mb-1.5">
          Your Message / Requirements <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={(e) => {
            setFormData({ ...formData, message: e.target.value });
            if (errors.message) setErrors({ ...errors, message: "" });
          }}
          placeholder="Tell us about your proposed visit dates, training needs, seedling quantities, or questions..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`w-full px-4 py-3 rounded-2xl bg-[#F7F9F6] border text-sm text-[#11231A] placeholder-[#52665B]/50 transition-all focus:outline-none focus:bg-white ${
            errors.message
              ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
              : "border-[#113B27]/15 focus:border-[#84C135] focus:ring-2 focus:ring-[#84C135]/30"
          }`}
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-rose-600 mt-1 font-medium">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button & Assurance */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#84C135] text-[#091E14] font-bold text-sm hover:bg-[#99D34C] transition-all shadow-lg hover:shadow-[#84C135]/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="w-3.5 h-3.5 animate-spin" />
              <span>Sending Message...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <FaArrowRight className="w-3 h-3" />
            </>
          )}
        </button>

        <span className="text-xs text-[#7E9387]">
          We respect your privacy. No spam or commercial data sharing.
        </span>
      </div>
    </form>
  );
}

export default function ContactUsPage() {
  const shouldReduceMotion = useReducedMotion();

  // Map view toggle: 'roadmap' | 'satellite'
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [copied, setCopied] = useState(false);

  // FAQ Accordion Active Item Index
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleCopyCoordinates = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(FARM_COORDINATES.decimalString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 4 Core Direct Communication Channels
  const contactChannels = [
    {
      title: "Direct Phone Call",
      value: "+254 115 198 300",
      caption: "Field coordinator line for prompt scheduling & urgent logistics.",
      badge: "Mon – Sat, 8AM – 5PM",
      icon: FaPhone,
      actionLabel: "Call Office",
      actionHref: "tel:+254115198300",
    },
    {
      title: "WhatsApp Direct Chat",
      value: "+254 115 198 300",
      caption: "Quick messaging for local farmers, photo sharing & visit inquiries.",
      badge: "Fastest Response",
      icon: FaWhatsapp,
      actionLabel: "Start WhatsApp Chat",
      actionHref: `https://wa.me/254115198300?text=${encodeURIComponent(
        "Hello Nettle Regenerative Team, I would like to inquire about visiting your Baolala farm."
      )}`,
      highlight: true,
    },
    {
      title: "Official Email",
      value: "info@nettleregenerativefarm.com",
      caption: "Formal inquiries, research partnerships, and seedling bulk orders.",
      badge: "24-Hour Reply",
      icon: FaEnvelope,
      actionLabel: "Send Email",
      actionHref: "mailto:info@nettleregenerativefarm.com?subject=Inquiry%20from%20Website",
    },
    {
      title: "Baolala Farm Site",
      value: "Baolala, Kilifi County",
      caption: "Demonstration site accessible off the Malindi-Salagate Road network.",
      badge: "Living Classroom",
      icon: FaLocationDot,
      actionLabel: "View Map Below",
      actionHref: "#location-map",
    },
  ];

  // Frequently Asked Questions
  const faqs = [
    {
      question: "Do I need to book my farm visit in advance?",
      answer:
        "Yes, we recommend reaching out at least 48 hours before your planned visit. Because our team actively works in the nursery, compost beds, and community training plots, advance notice ensures a dedicated field coordinator is available to guide your tour and answer your technical questions.",
    },
    {
      question: "Are regenerative farming workshops open to individual smallholder farmers?",
      answer:
        "Yes! Our living classroom in Baolala was specifically created for local smallholders, youth groups, and women's cooperatives. We host open community field days and hands-on bio-intensive workshops regularly. Inquire through our form or WhatsApp to join the next session.",
    },
    {
      question: "How do I purchase or order seedlings from the Tree Nursery Hub?",
      answer:
        "You can place orders by calling or messaging our nursery team directly. We propagate hardy indigenous coastal tree species, moringa, neem, cashew, citrus, and nitrogen-fixing companion plants. We offer collection at the farm and can coordinate delivery for bulk homestead or school agroforestry projects.",
    },
    {
      question: "Can educational institutions or university groups arrange dedicated field trips?",
      answer:
        "We welcome schools, agricultural colleges, research bodies, and NGOs. We tailor experiential walk-throughs covering rainwater contour swales, soil microbiology, pest repellent polycultures, and sustainable dryland food production. Contact us with your group size and desired focus areas.",
    },
  ];

  // Map Embed URL with exact coordinates
  // t=m for roadmap, t=k for satellite imagery
  const embedMapUrl = `https://maps.google.com/maps?q=${FARM_COORDINATES.lat},${FARM_COORDINATES.lng}&t=${
    mapType === "satellite" ? "k" : "m"
  }&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F6] text-[#11231A] selection:bg-[#84C135] selection:text-[#113B27] overflow-x-hidden">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      <main className="grow">
        {/* ──────────────────────────────────────────────────────────
            1. HERO SECTION (ATMOSPHERIC DEEP FOREST)
        ────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[50vh] sm:min-h-[55vh] flex items-center justify-center pt-32 sm:pt-40 pb-16 px-4 sm:px-8 overflow-hidden bg-[#091E14]">
          {/* Background Photography with Deep Forest Scrim */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/demo-farm.jpg"
              alt="Nettle Regenerative Farm in Baolala, Kilifi"
              fill
              priority
              className="object-cover object-center opacity-25 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#091E14]/90 via-[#113B27]/85 to-[#091E14]" />
            <div className="absolute inset-0 bg-[radial-gradient(#84C135_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            {/* Pill Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#84C135] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-5 shadow-lg"
            >
              <FaLeaf className="w-3.5 h-3.5 text-[#84C135]" />
              <span>Connect With Us • Kilifi County</span>
            </motion.div>

            {/* Display Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white mb-5"
            >
              Get in Touch & Plan Your Visit
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8 font-normal"
            >
              Whether you want to learn permaculture techniques, purchase indigenous seedlings, collaborate on
              community agroforestry, or walk our living demonstration site in Baolala — we welcome you.
            </motion.p>

            {/* Breadcrumb Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/60"
            >
              <Link href="/" className="hover:text-[#84C135] transition-colors">
                Home
              </Link>
              <FaChevronRight className="w-2.5 h-2.5 opacity-40" />
              <span className="text-[#84C135] font-semibold">Contact Us</span>
            </motion.div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            2. CORE CONTACT CHANNELS (4 TACTILE CARDS)
        ────────────────────────────────────────────────────────── */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 bg-white border-b border-[#113B27]/10 relative z-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {contactChannels.map((channel, idx) => {
                const Icon = channel.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={staggerItemVariants}
                    whileHover={!shouldReduceMotion ? { y: -4 } : {}}
                    transition={{ duration: 0.25 }}
                    className={`rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                      channel.highlight
                        ? "bg-[#EBF7D9]/40 border-[#84C135]/40 shadow-sm hover:shadow-md"
                        : "bg-[#F7F9F6] border-[#113B27]/10 hover:border-[#113B27]/20 shadow-xs hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            channel.highlight
                              ? "bg-[#113B27] text-[#84C135]"
                              : "bg-[#E4EDE8] text-[#113B27]"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white border border-[#113B27]/10 text-[#113B27]">
                          {channel.badge}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-[#52665B] uppercase tracking-wider mb-1">
                        {channel.title}
                      </h3>
                      <div className="text-base sm:text-lg font-bold text-[#113B27] leading-snug break-words mb-2">
                        {channel.value}
                      </div>
                      <p className="text-xs text-[#52665B] leading-relaxed mb-6">
                        {channel.caption}
                      </p>
                    </div>

                    <a
                      href={channel.actionHref}
                      target={channel.actionHref.startsWith("http") ? "_blank" : undefined}
                      rel={channel.actionHref.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={`inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        channel.highlight
                          ? "bg-[#84C135] text-[#091E14] hover:bg-[#99D34C] shadow-sm"
                          : "bg-white text-[#113B27] border border-[#113B27]/15 hover:bg-[#113B27] hover:text-white"
                      }`}
                    >
                      <span>{channel.actionLabel}</span>
                      <FaArrowRight className="w-2.5 h-2.5" />
                    </a>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            3. DIRECT INQUIRIES: CONTACT FORM
        ────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F7F9F6] border-b border-[#113B27]/10">
          <div className="max-w-7xl mx-auto">
            {/* Centered Section Header */}
            <FadeIn className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27] bg-[#E4EDE8] px-4 py-1.5 rounded-full inline-block mb-3">
                Direct Inquiries & Bookings
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#113B27] leading-tight mb-4">
                We’re Here to Collaborate & Answer Questions
              </h2>
              <p className="text-base sm:text-lg text-[#52665B] leading-relaxed">
                Connect with our Baolala agricultural team. Whether scheduling a guided field tour, requesting
                indigenous nursery seedlings, or discussing sustainable training partnerships, send us a note below.
              </p>
            </FadeIn>

            {/* Centered Interactive Form */}
            <div className="max-w-3xl mx-auto">
              <Suspense
                fallback={
                  <div className="p-10 rounded-3xl bg-white border border-[#113B27]/10 shadow-sm flex items-center justify-center min-h-[420px]">
                    <div className="flex items-center gap-3 text-sm text-[#52665B]">
                      <FaSpinner className="w-5 h-5 animate-spin text-[#84C135]" />
                      <span>Loading contact form...</span>
                    </div>
                  </div>
                }
              >
                <ContactFormContent />
              </Suspense>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            4. INTERACTIVE LOCATION MAP & DIRECTIONS CENTER
        ────────────────────────────────────────────────────────── */}
        <section id="location-map" className="py-20 sm:py-28 px-4 sm:px-8 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            {/* Header with Coordinates highlight */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27] bg-[#E4EDE8] px-4 py-1.5 rounded-full inline-block mb-3">
                  Physical Farm Location
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#113B27] leading-tight">
                  Find Us in Baolala, Kilifi County
                </h2>
                <p className="text-sm sm:text-base text-[#52665B] mt-2 max-w-2xl leading-relaxed">
                  Located off the Malindi-Salagate road corridor in coastal Kenya. Visitors can navigate using our
                  exact GPS coordinates or open turn-by-turn directions.
                </p>
              </div>

              {/* Coordinates Pill with Copy Action */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-2.5 rounded-2xl bg-[#F7F9F6] border border-[#113B27]/15 flex items-center gap-2 text-xs sm:text-sm font-mono text-[#113B27]">
                  <FaLocationDot className="w-3.5 h-3.5 text-[#84C135]" />
                  <span>{FARM_COORDINATES.decimalString}</span>
                  <span className="hidden sm:inline text-[#7E9387]">({FARM_COORDINATES.dms})</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCoordinates}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#113B27] text-white hover:bg-[#174A32] text-xs font-semibold transition-all cursor-pointer shadow-sm"
                  title="Copy GPS coordinates"
                >
                  <FaCopy className="w-3 h-3 text-[#84C135]" />
                  <span>{copied ? "Copied!" : "Copy GPS"}</span>
                </button>
              </div>
            </div>

            {/* Interactive Map Wrapper Card */}
            <div className="rounded-3xl border border-[#113B27]/15 overflow-hidden shadow-xl bg-[#091E14] text-white">
              {/* Map Top Bar with View Switcher & Action Buttons */}
              <div className="p-4 sm:p-5 bg-[#091E14] border-b border-white/15 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#84C135] text-[#091E14] flex items-center justify-center font-bold text-xs">
                    <FaMapLocationDot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">
                      Nettle Regenerative Farm Gate
                    </div>
                    <div className="text-[11px] text-white/70">
                      Baolala, Kilifi County • Lat: {FARM_COORDINATES.lat}, Lng: {FARM_COORDINATES.lng}
                    </div>
                  </div>
                </div>

                {/* Controls: Satellite / Street toggle + Directions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Map Type Switcher */}
                  <div className="bg-white/10 p-1 rounded-full border border-white/15 flex items-center">
                    <button
                      type="button"
                      onClick={() => setMapType("roadmap")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        mapType === "roadmap"
                          ? "bg-[#84C135] text-[#091E14] shadow-xs"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      Map View
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapType("satellite")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        mapType === "satellite"
                          ? "bg-[#84C135] text-[#091E14] shadow-xs"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      Satellite
                    </button>
                  </div>

                  {/* External Directions CTAs */}
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#113B27] font-bold text-xs hover:bg-[#84C135] transition-colors cursor-pointer shadow-sm"
                  >
                    <span>Google Maps</span>
                    <FaArrowRight className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href={APPLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white font-medium text-xs hover:bg-white/25 transition-colors cursor-pointer"
                  >
                    <span>Apple Maps</span>
                  </a>
                </div>
              </div>

              {/* Responsive Embedded Map Iframe */}
              <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] bg-neutral-900">
                <iframe
                  title="Interactive Map of Nettle Regenerative Farm in Baolala, Kilifi County"
                  src={embedMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />

                {/* Floating GPS Indicator Pill docked on bottom-right of map */}
                <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091E14]/85 backdrop-blur-md border border-white/20 text-[11px] text-white pointer-events-none shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#84C135] animate-pulse" />
                  <span>GPS: {FARM_COORDINATES.decimalString}</span>
                </div>
              </div>
            </div>

            {/* Travel & Route Guide (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 rounded-3xl bg-[#F7F9F6] border border-[#113B27]/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E4EDE8] text-[#113B27] flex items-center justify-center mb-3">
                  <FaCar className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#113B27]">From Malindi Town (~45 mins)</h4>
                <p className="text-xs text-[#52665B] leading-relaxed">
                  Drive ~45 km west via C103 Malindi-Salagate Road passing Ganda and Kakuyuni. The tarmac road leads
                  directly to Baolala trading centre, followed by a short 5-minute farm access track.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#F7F9F6] border border-[#113B27]/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E4EDE8] text-[#113B27] flex items-center justify-center mb-3">
                  <FaCar className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#113B27]">From Kilifi & Mombasa (~1.5–2.5 hrs)</h4>
                <p className="text-xs text-[#52665B] leading-relaxed">
                  Head north along the B8 Coastal Highway towards Malindi, then connect westward onto the
                  Malindi-Salagate corridor toward Tsavo East/Baolala. Alternatively, take the scenic Kilifi-Ganze inland route.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#F7F9F6] border border-[#113B27]/10 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#E4EDE8] text-[#113B27] flex items-center justify-center mb-3">
                  <FaBus className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#113B27]">Public Transit & Local Boda-Boda</h4>
                <p className="text-xs text-[#52665B] leading-relaxed">
                  Frequent matatus depart Malindi town stage directly for Baolala. From the Baolala trading centre, local
                  boda-bodas are readily available to drop you right at the Nettle Farm gates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            5. FREQUENTLY ASKED QUESTIONS (ACCORDION)
        ────────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F7F9F6] border-b border-[#113B27]/10">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-12 sm:mb-16">
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#113B27] bg-[#E4EDE8] px-4 py-1.5 rounded-full inline-block mb-3">
                Visitor Information
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#113B27] leading-tight mb-4">
                Frequently Asked Inquiries
              </h2>
              <p className="text-sm sm:text-base text-[#52665B] max-w-xl mx-auto leading-relaxed">
                Clear answers to common questions about visiting our demonstration farm, ordering nursery seedlings, and
                joining workshops.
              </p>
            </FadeIn>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl sm:rounded-3xl bg-white border border-[#113B27]/10 overflow-hidden shadow-xs transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F2F7F4]/50 transition-colors"
                    >
                      <span className="text-base sm:text-lg font-bold text-[#113B27] leading-snug">
                        {faq.question}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen ? "bg-[#113B27] text-[#84C135] rotate-180" : "bg-[#F7F9F6] text-[#113B27]"
                        }`}
                      >
                        <FaChevronDown className="w-3 h-3" />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#52665B] leading-relaxed border-t border-[#113B27]/5">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer Section */}
      <FooterSection />
    </div>
  );
}
