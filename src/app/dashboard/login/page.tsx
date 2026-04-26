"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed"); return; }
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Terminal window */}
        <div className="border-2 border-border">
          {/* Titlebar */}
          <div className="border-b-2 border-border bg-muted px-4 py-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              admin_login.sh
            </span>
            <span className="font-mono text-[10px] text-accent">● secure</span>
          </div>

          <div className="p-6">
            <div className="font-mono text-xs text-muted-foreground space-y-1 mb-6">
              <p><span className="text-accent">$</span> auth --admin</p>
              <p className="pl-4 text-muted-foreground/60">→ saswat portfolio dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  email
                </label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="bg-card border-2 border-border px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-card border-2 border-border px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                />
              </div>

              {error && (
                <p className="font-mono text-xs text-destructive">→ error: {error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors border-2 border-foreground disabled:opacity-50 mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-3.5 w-3.5" />
                    authenticating...
                  </span>
                ) : (
                  "→ Sign In"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="font-mono text-[10px] text-muted-foreground text-center mt-4">
          saswat portfolio · admin access only
        </p>
      </div>
    </div>
  );
}
