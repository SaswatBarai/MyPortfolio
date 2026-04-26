"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

interface NavbarProps {
  activeTab: string
  setActiveTab: (value: string) => void
}

const NAV_ITEMS = [
  { label: "Projects",     value: "projects"     },
  { label: "Experience",   value: "experience"   },
  { label: "Achievements", value: "achievements" },
  { label: "Contact",      value: "hire-me"      },
]

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const NAVBAR_H = 64 // height of sticky nav in px

    function getActiveSection(): string | null {
      // Walk sections top→bottom; return the last one whose top is above midscreen
      const sections = NAV_ITEMS.map(({ value }) =>
        document.getElementById(value)
      ).filter(Boolean) as HTMLElement[]

      const scrollY = window.scrollY
      const viewH   = window.innerHeight

      // If near the very bottom of the page, force last section active
      if (scrollY + viewH >= document.documentElement.scrollHeight - 4) {
        return sections[sections.length - 1]?.id ?? null
      }

      let current: string | null = null
      for (const section of sections) {
        const top = section.getBoundingClientRect().top + scrollY
        // Section top is at or above the midpoint of the viewport
        if (top - NAVBAR_H <= scrollY + viewH * 0.4) {
          current = section.id
        }
      }
      return current
    }

    function onScroll() {
      const active = getActiveSection()
      if (active) setActiveTab(active)
    }

    // Throttle scroll handler with rAF for performance
    let ticking = false
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    onScroll() // set on mount

    return () => window.removeEventListener("scroll", handleScroll)
  }, [setActiveTab])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const navH = 64
    const top  = el.getBoundingClientRect().top + window.scrollY - navH
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="sticky top-0 z-50 border-b-2 border-border bg-background/95 backdrop-blur-sm"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-3 sm:px-6 py-3">
        {/* Wordmark */}
        <div className="font-mono text-xs sm:text-sm font-bold tracking-[0.16em] sm:tracking-widest uppercase text-foreground select-none">
          <span className="text-accent">Saswat</span>
          <span className="text-muted-foreground"> Barai</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0 border border-border">
          {NAV_ITEMS.map((item, idx) => (
            <button
              key={item.value}
              onClick={() => scrollTo(item.value)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors border-r border-border last:border-r-0 ${
                activeTab === item.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {String(idx + 1).padStart(2, "0")}. {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground border border-border p-1.5"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t-2 border-border bg-background"
          >
            <nav className="flex flex-col">
              {NAV_ITEMS.map((item, idx) => (
                <button
                  key={item.value}
                  onClick={() => {
                    scrollTo(item.value)
                    setIsOpen(false)
                  }}
                  className={`px-6 py-3.5 text-xs font-mono uppercase tracking-widest text-left border-b border-border transition-colors ${
                    activeTab === item.value
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")}. {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
