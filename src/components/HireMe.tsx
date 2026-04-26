"use client";

import { useState } from "react";

export const HireMe = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="hire-me" className="py-10">
      {/* Terminal-style hire-me block */}
      <div className="border-2 border-border bg-card">
        {/* Terminal titlebar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-border bg-muted">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">hire_me.sh</span>
          <span className="ml-auto font-mono text-[10px] text-accent">● running</span>
        </div>

        <div className="p-5 sm:p-8">
          {/* Output lines */}
          <div className="font-mono text-xs text-muted-foreground space-y-1 mb-6">
            <p><span className="text-accent">$</span> status --available</p>
            <p className="pl-4">→ open to freelance &amp; contract work</p>
            <p className="pl-4">→ backend systems, APIs, microservices</p>
            <p className="pl-4">→ response time: &lt; 24h</p>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Want to hire me as a freelancer?
          </h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Drop your email below and I&apos;ll get back to you as soon as possible.
            Let&apos;s discuss how we can turn your ideas into reality.
          </p>

          {sent ? (
            <div className="border border-accent bg-accent/10 px-4 py-3 font-mono text-xs text-accent">
              → Message queued. Will respond within 24h.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-background border-2 border-border px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors sm:border-r-0"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors border-2 border-foreground"
              >
                Send →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
