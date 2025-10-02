"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const HireMe = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Hook this with backend / email API
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <section id="hire-me" className="py-16">
      <Card className="max-w-2xl mx-auto p-8 text-center border border-border bg-card shadow-md">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-foreground mb-3">
          Want to hire me as a freelancer?
        </h2>
        <p className="text-muted-foreground mb-8 text-sm sm:text-base leading-relaxed">
          Drop your email ID below and I&apos;ll get back to you as soon as possible.  
          Let&apos;s discuss how we can turn your ideas into reality 🚀
        </p>

        {/* Email form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-2"
          />
          <Button
            type="submit"
            className="px-6 py-2 w-full sm:w-auto"
          >
            Send
          </Button>
        </form>
      </Card>
    </section>
  );
};
