"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"

interface NavbarProps {
  activeTab: string
  setActiveTab: (value: string) => void
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [setActiveTab]);

  const navItems = [
    { label: "Projects", value: "projects" },
    { label: "Experience", value: "experience" },
    { label: "Achievements", value: "achievements" },
    { label: "Contact", value: "hire-me" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b-2 border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-3 sm:px-6 py-3">
        {/* Retro wordmark */}
        <div className="font-mono text-xs sm:text-sm font-bold tracking-[0.16em] sm:tracking-widest uppercase text-foreground select-none">
          <span className="text-accent">Saswat</span>
          <span className="text-muted-foreground"> Barai</span>
        </div>

        {/* Desktop nav — retro tab style */}
        <nav className="hidden md:flex items-center gap-0 border border-border">
          {navItems.map((item, idx) => (
            <button
              key={item.value}
              onClick={() => document.getElementById(item.value)?.scrollIntoView({ behavior: "smooth" })}
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
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden border-t-2 border-border bg-background">
          <nav className="flex flex-col">
            {navItems.map((item, idx) => (
              <button
                key={item.value}
                onClick={() => {
                  document.getElementById(item.value)?.scrollIntoView({ behavior: "smooth" });
                  setIsOpen(false);
                }}
                className={`px-6 py-3 text-xs font-mono uppercase tracking-widest text-left border-b border-border transition-colors ${
                  activeTab === item.value
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {String(idx + 1).padStart(2, "0")}. {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
