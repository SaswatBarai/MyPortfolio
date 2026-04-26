"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import Image from 'next/image'

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
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    },
    { threshold: 0.5 }
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
    <header className="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left side - site name */}
        <div className="text-sm font-medium tracking-tight">
             <Image
      src="/logo.svg"
    height={20}
    width={20}
      alt="Picture of the author"
    />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.value}
             onClick={() => {
  document.getElementById(item.value)?.scrollIntoView({ behavior: "smooth" });
}}
              className={`text-sm ${
                activeTab === item.value
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-foreground hover:text-muted-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card/80 backdrop-blur-sm">
          <nav className="flex flex-col gap-2 px-6 py-4 text-sm">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  setActiveTab(item.value)
                  setIsOpen(false)
                }}
                className={`text-left ${
                  activeTab === item.value
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
