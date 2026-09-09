"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import {
  FaLinkedinIn as Linkedin,
  FaGithub as Github,
  FaDribbble as Dribbble,
  FaFigma as Figma,
} from "react-icons/fa6";
import { cn } from "@/lib/utils";

export interface iNavItem {
  heading: string;
  href: string;
  subheading?: string;
  imgSrc?: string;
}

export interface iNavLinkProps extends iNavItem {
  setIsActive: (isActive: boolean) => void;
  index: number;
}

export interface iCurvedNavbarProps {
  setIsActive: (isActive: boolean) => void;
  navItems: iNavItem[];
  footer?: React.ReactNode;
  className?: string;
  curveFill?: string;
}

export interface iHeaderProps {
  navItems?: iNavItem[];
  footer?: React.ReactNode;
  className?: string;
}

export const MENU_SLIDE_ANIMATION = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
  },
};

export const defaultNavItems: iNavItem[] = [
  {
    heading: "Home",
    href: "/",
    subheading: "Welcome to our website",
    imgSrc: "/images/home.jpg",
  },
  {
    heading: "Components",
    href: "/components",
    subheading: "View our components",
    imgSrc: "/images/about.jpg",
  },
  {
    heading: "Services",
    href: "/services",
    subheading: "What we offer",
    imgSrc: "/images/services.jpg",
  },
  {
    heading: "Contact",
    href: "/contact",
    subheading: "Get in touch with us",
    imgSrc: "/images/contact.jpg",
  },
];

export const CustomFooter: React.FC = () => {
  return (
    <div className="flex w-full text-sm justify-between text-black px-8 md:px-16 py-6 border-t border-black/10">
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="text-black/70 hover:text-[#84C135] transition-colors"
      >
        <Linkedin size={22} />
      </a>
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="text-black/70 hover:text-[#84C135] transition-colors"
      >
        <Github size={22} />
      </a>
      <a
        href="https://dribbble.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Dribbble"
        className="text-black/70 hover:text-[#84C135] transition-colors"
      >
        <Dribbble size={22} />
      </a>
      <a
        href="https://www.figma.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Figma"
        className="text-black/70 hover:text-[#84C135] transition-colors"
      >
        <Figma size={22} />
      </a>
    </div>
  );
};

export const NavLink: React.FC<iNavLinkProps> = ({
  heading,
  href,
  subheading,
  setIsActive,
  index,
}) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleClick = () => {
    setIsActive(false);
  };

  const isExternalLink = href.startsWith("http");
  const linkProps = isExternalLink
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      onClick={handleClick}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b border-black/15 py-3 sm:py-4 transition-colors duration-300 uppercase cursor-pointer"
    >
      <Link
        ref={ref}
        onMouseMove={handleMouseMove}
        href={href}
        className="w-full flex flex-col"
        {...linkProps}
      >
        <div className="relative flex items-baseline">
          <span className="text-black/40 group-hover:text-[#84C135] transition-colors duration-300 text-2xl sm:text-3xl font-light mr-3">
            0{index}.
          </span>
          <div className="flex flex-row gap-0.5 overflow-hidden">
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: -8 },
              }}
              transition={{
                type: "spring",
                staggerChildren: 0.04,
                delayChildren: 0.1,
              }}
              className="relative z-10 block text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-black group-hover:text-[#113B27] transition-colors duration-300"
            >
              {heading.split("").map((letter, i) => {
                return (
                  <motion.span
                    key={i}
                    variants={{
                      initial: { y: 0 },
                      whileHover: { y: -3, color: "#84C135" },
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="inline-block"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                );
              })}
            </motion.span>
          </div>
        </div>
        {subheading && (
          <span className="text-[11px] normal-case text-black/50 font-medium pl-9 -mt-0.5 tracking-normal">
            {subheading}
          </span>
        )}
      </Link>
    </motion.div>
  );
};

export const Curve: React.FC<{ fill?: string }> = ({ fill = "#ffffff" }) => {
  const [height, setHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 800);

  useEffect(() => {
    setHeight(window.innerHeight);
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q-100 ${height / 2} 100 0`;
  const targetPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q100 ${height / 2} 100 0`;

  const curve = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  return (
    <svg
      className="absolute top-0 -left-[99px] w-[100px] stroke-none h-full pointer-events-none"
      style={{ fill }}
      aria-hidden="true"
    >
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
};

export const CurvedNavbar: React.FC<iCurvedNavbarProps> = ({
  setIsActive,
  navItems,
  footer,
  className,
  curveFill = "#ffffff",
}) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => setIsActive(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        aria-hidden="true"
      />

      {/* Curved Sidebar Drawer */}
      <motion.div
        variants={MENU_SLIDE_ANIMATION}
        initial="initial"
        animate="enter"
        exit="exit"
        className={cn(
          "h-[100dvh] w-[88vw] sm:w-[420px] max-w-screen-sm fixed right-0 top-0 z-50 bg-white shadow-2xl flex flex-col justify-between overflow-y-auto",
          className,
        )}
      >
        <div className="pt-8 px-6 sm:px-10 flex flex-col justify-between min-h-[calc(100%-80px)]">
          <div>
            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between border-b border-black/15 pb-4 mb-4">
              <span className="text-xs uppercase tracking-widest font-semibold text-black/60">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setIsActive(false)}
                className="w-9 h-9 rounded-full bg-black/5 hover:bg-[#84C135]/20 flex items-center justify-center text-black/70 hover:text-black transition-colors focus:outline-none"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav Items Section */}
            <section className="bg-transparent mt-2">
              <div className="mx-auto max-w-full">
                {navItems.map((item, index) => {
                  return (
                    <NavLink
                      key={item.href}
                      {...item}
                      setIsActive={setIsActive}
                      index={index + 1}
                    />
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        {footer}

        {/* Animated SVG Curve */}
        <Curve fill={curveFill} />
      </motion.div>
    </>
  );
};

export const Header: React.FC<iHeaderProps> = ({
  navItems = defaultNavItems,
  footer = <CustomFooter />,
  className,
}) => {
  const [isActive, setIsActive] = useState(false);
  const openAudioRef = useRef<HTMLAudioElement | null>(null);
  const closeAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = () => {
    if (isActive) {
      closeAudioRef.current?.play().catch(() => {});
    } else {
      openAudioRef.current?.play().catch(() => {});
    }
    setIsActive(!isActive);
  };

  return (
    <>
      <div className={cn("relative", className)}>
        <button
          type="button"
          onClick={handleClick}
          className="fixed -right-1 top-0 md:-right-1 m-5 z-50 w-12 h-12 rounded-none flex items-center justify-center cursor-pointer bg-white shadow-lg focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <div className="relative w-8 h-6 flex flex-col justify-between items-center">
            <span
              className={`block h-1 w-7 bg-black transition-transform duration-300 ${
                isActive ? "rotate-45 translate-y-2.5" : ""
              }`}
            />
            <span
              className={`block h-1 w-7 bg-black transition-opacity duration-300 ${
                isActive ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-1 w-7 bg-black transition-transform duration-300 ${
                isActive ? "-rotate-45 -translate-y-2.5" : ""
              }`}
            />
          </div>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isActive && (
          <CurvedNavbar
            setIsActive={setIsActive}
            navItems={navItems}
            footer={footer}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
