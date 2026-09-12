"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

export interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  // Find currently matching item based on current route
  const getActiveTab = () => {
    if (!pathname) return items[0]?.name || ""
    
    // Exact match first
    const exact = items.find((item) => item.url === pathname)
    if (exact) return exact.name

    // Prefix match for non-root routes
    const prefix = items.find(
      (item) => item.url !== "/" && pathname.startsWith(item.url)
    )
    if (prefix) return prefix.name

    return items[0]?.name || ""
  }

  const [activeTab, setActiveTab] = useState(getActiveTab)

  // Sync activeTab whenever pathname changes
  useEffect(() => {
    setActiveTab(getActiveTab())
  }, [pathname, items])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 bg-[#091E14]/75 border border-white/20 backdrop-blur-xl py-1 px-1.5 rounded-full shadow-2xl">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-full transition-colors",
                isActive
                  ? "text-[#84C135]"
                  : "text-white/80 hover:text-white hover:bg-white/10",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-white/10 rounded-full -z-10 border border-[#84C135]/40"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#84C135] rounded-t-full">
                    <div className="absolute w-10 h-4 bg-[#84C135]/30 rounded-full blur-md -top-1.5 -left-1" />
                    <div className="absolute w-6 h-4 bg-[#84C135]/30 rounded-full blur-sm -top-1" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
