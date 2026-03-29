import { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-lg">
            Dashboard
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/dashboard/tickets" className="hover:text-foreground text-muted-foreground transition-colors">
              Tickets
            </Link>
            <Link href="/dashboard/availability" className="hover:text-foreground text-muted-foreground transition-colors">
              Availability
            </Link>
            <Link href="/dashboard/settings" className="hover:text-foreground text-muted-foreground transition-colors">
              Settings
            </Link>
            <Link href="/" className="hover:text-foreground text-muted-foreground transition-colors">
              ← Portfolio
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
