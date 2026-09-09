"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, AnimatePresence, type Variants } from "framer-motion";
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

export const MENU_SLIDE_ANIMATION: Variants = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
  },
};

export const navItemVariants: Variants = {
  initial: {
    x: 60,
    opacity: 0,
  },
  enter: (index: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: [0.76, 0, 0.24, 1] as const,
      delay: 0.2 + index * 0.09,
    },
  }),
  exit: (index: number) => ({
    x: 50,
    opacity: 0,
    transition: {
      duration: 0.35,
      ease: [0.76, 0, 0.24, 1] as const,
      delay: Math.max(0, 0.15 - index * 0.03),
    },
  }),
};

export const indexVariants: Variants = {
  initial: {
    opacity: 0,
    x: -12,
  },
  enter: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1] as const,
      delay: 0.2 + index * 0.09,
    },
  }),
};

export const letterContainerVariants: Variants = {
  initial: {},
  enter: (index: number) => ({
    transition: {
      delayChildren: 0.25 + index * 0.09,
      staggerChildren: 0.03,
    },
  }),
};

export const letterVariants: Variants = {
  initial: {
    y: "115%",
    opacity: 0,
  },
  enter: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.33, 1, 0.68, 1] as const,
    },
  },
};

export const subheadingVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  enter: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1] as const,
      delay: 0.35 + index * 0.09,
    },
  }),
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
  const itemIndex = index - 1;

  const handleClick = () => {
    setIsActive(false);
  };

  const isExternalLink = href.startsWith("http");
  const linkProps = isExternalLink
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      custom={itemIndex}
      variants={navItemVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      whileHover={{ x: 6 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      onClick={handleClick}
      className="group relative flex items-center justify-between border-b border-black/15 py-3 sm:py-4 transition-colors duration-300 uppercase cursor-pointer"
    >
      <Link
        href={href}
        className="w-full flex flex-col"
        {...linkProps}
      >
        <div className="relative flex items-baseline">
          {/* Animated Index Number */}
          <motion.span
            custom={itemIndex}
            variants={indexVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="text-black/40 group-hover:text-[#84C135] transition-colors duration-300 text-2xl sm:text-3xl font-light mr-3 select-none"
          >
            0{index}.
          </motion.span>

          {/* Staggered Letter Reveal on Entrance */}
          <div className="overflow-hidden">
            <motion.span
              custom={itemIndex}
              variants={letterContainerVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="relative z-10 inline-flex flex-wrap text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-black group-hover:text-[#113B27] transition-colors duration-300"
            >
              {heading.split("").map((letter, i) => (
                <span key={i} className="overflow-hidden inline-block leading-tight">
                  <motion.span
                    variants={letterVariants}
                    className="inline-block transform-gpu group-hover:text-[#84C135] transition-colors duration-200"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                </span>
              ))}
            </motion.span>
          </div>
        </div>

        {/* Staggered Subheading Reveal */}
        {subheading && (
          <motion.span
            custom={itemIndex}
            variants={subheadingVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="text-[11px] normal-case text-black/50 font-medium pl-9 -mt-0.5 tracking-normal group-hover:text-black/70 transition-colors"
          >
            {subheading}
          </motion.span>
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
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12, ease: [0.33, 1, 0.68, 1] as const }}
              className="flex items-center justify-between border-b border-black/15 pb-4 mb-4"
            >
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
            </motion.div>

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
