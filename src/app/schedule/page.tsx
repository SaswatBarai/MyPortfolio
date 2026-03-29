import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video } from "lucide-react";

export const metadata = {
  title: "Schedule a Call — Saswat Barai",
  description: "Book a call with Saswat to discuss projects, ideas, or opportunities.",
};

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Available for calls
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Let&apos;s have a conversation
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Want to discuss a project, explore collaboration, or just say hi?
            Pick a time that works for you and I&apos;ll be there.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/schedule/book">Book a Call →</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <Link href="/schedule/manage">Manage My Booking</Link>
            </Button>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-20 grid sm:grid-cols-3 gap-8 max-w-3xl w-full">
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border bg-card text-card-foreground">
            <Calendar className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Pick a Date</h3>
            <p className="text-sm text-muted-foreground text-center">
              Choose from available dates that fit your schedule.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border bg-card text-card-foreground">
            <Clock className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Select a Time</h3>
            <p className="text-sm text-muted-foreground text-center">
              Browse open time slots and reserve the one that suits you.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border bg-card text-card-foreground">
            <Video className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Google Meet</h3>
            <p className="text-sm text-muted-foreground text-center">
              Receive a Google Meet link once your call is confirmed.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
