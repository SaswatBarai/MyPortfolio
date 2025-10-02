"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";

export const NewsletterSubscribe = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    setEmail("");
  };

  return (
    <section id="newsletter" className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground/90 tracking-tight mb-2">
          Subscribe to My Newsletter
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mb-6">
          Get insights on <span className="font-medium">web dev, UI/UX, and AI</span> — 
          straight to your inbox. No spam, just good stuff.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
        >
          <Input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 text-sm sm:text-base"
          />
          <Button type="submit" className="px-4 sm:px-6 w-full sm:w-auto">
            <Mail className="h-4 w-4 mr-2" />
            Subscribe
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-3">
          ✦ Join 500+ developers already subscribed
        </p>
      </div>
    </section>
  );
};
