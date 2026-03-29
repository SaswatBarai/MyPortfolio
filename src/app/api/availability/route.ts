import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlockedSlot from "@/lib/models/BlockedSlot";
import OwnerSettings from "@/lib/models/OwnerSettings";
import Ticket from "@/lib/models/Ticket";
import {
  addDays,
  format,
  startOfDay,
  endOfDay,
  getDay,
} from "date-fns";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number): string {
  const hh = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function isDateBlockedByRecurrence(
  date: Date,
  slot: { recurrence?: string; date?: Date }
): boolean {
  const dow = getDay(date);
  switch (slot.recurrence) {
    case "daily":
      return true;
    case "weekdays":
      return dow >= 1 && dow <= 5;
    case "weekends":
      return dow === 0 || dow === 6;
    case "weekly":
      if (!slot.date) return false;
      return getDay(new Date(slot.date)) === dow;
    default:
      return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const monthStr = searchParams.get("month"); // "YYYY-MM"
    const today = startOfDay(new Date());

    // Determine range: next 60 days or specific month
    let rangeStart = today;
    let rangeEnd = addDays(today, 60);

    if (monthStr) {
      const [year, month] = monthStr.split("-").map(Number);
      rangeStart = startOfDay(new Date(year, month - 1, 1));
      rangeEnd = endOfDay(new Date(year, month, 0));
    }

    const [settings, blockedSlots, confirmedTickets] = await Promise.all([
      OwnerSettings.findOne().lean(),
      BlockedSlot.find().lean(),
      Ticket.find({
        status: "confirmed",
        preferredDate: { $gte: rangeStart, $lte: rangeEnd },
      }).lean(),
    ]);

    const workingHours = settings?.workingHours ?? [
      { day: "Monday", start: "10:00", end: "18:00" },
      { day: "Tuesday", start: "10:00", end: "18:00" },
      { day: "Wednesday", start: "10:00", end: "18:00" },
      { day: "Thursday", start: "10:00", end: "18:00" },
      { day: "Friday", start: "10:00", end: "18:00" },
    ];

    const slotDuration = 30; // minutes

    const availability: Record<string, string[]> = {};
    const disabledDates: string[] = [];

    let cursor = rangeStart;
    while (cursor <= rangeEnd) {
      const dateKey = format(cursor, "yyyy-MM-dd");
      const dayName = DAY_NAMES[getDay(cursor)];
      const wh = workingHours.find((w) => w.day === dayName);

      if (!wh) {
        disabledDates.push(dateKey);
        cursor = addDays(cursor, 1);
        continue;
      }

      // Check full_day blocked slots
      const isFullDayBlocked = blockedSlots.some((bs) => {
        if (bs.type === "full_day") {
          if (bs.recurrence && bs.recurrence !== "none") {
            return isDateBlockedByRecurrence(cursor, bs);
          }
          if (bs.date) {
            return format(new Date(bs.date), "yyyy-MM-dd") === dateKey;
          }
        }
        return false;
      });

      if (isFullDayBlocked) {
        disabledDates.push(dateKey);
        cursor = addDays(cursor, 1);
        continue;
      }

      // Generate slots
      const startMin = timeToMinutes(wh.start);
      const endMin = timeToMinutes(wh.end);
      const slots: string[] = [];

      for (let t = startMin; t + slotDuration <= endMin; t += slotDuration) {
        const slotTime = minutesToTime(t);

        // Check time_range blocked slots
        const isTimeBlocked = blockedSlots.some((bs) => {
          if (bs.type === "time_range" && bs.startTime && bs.endTime) {
            const blocked =
              t >= timeToMinutes(bs.startTime) &&
              t < timeToMinutes(bs.endTime);
            if (!blocked) return false;

            if (bs.recurrence && bs.recurrence !== "none") {
              return isDateBlockedByRecurrence(cursor, bs);
            }
            if (bs.date) {
              return format(new Date(bs.date), "yyyy-MM-dd") === dateKey;
            }
            return true;
          }
          return false;
        });

        if (isTimeBlocked) continue;

        // Check confirmed tickets
        const isBooked = confirmedTickets.some((ticket) => {
          const tDate = format(new Date(ticket.preferredDate), "yyyy-MM-dd");
          if (tDate !== dateKey) return false;
          const ticketStart = timeToMinutes(ticket.preferredTime);
          const ticketEnd =
            ticketStart + (ticket.confirmedDuration ?? ticket.requestedDuration);
          return t >= ticketStart && t < ticketEnd;
        });

        if (!isBooked) {
          slots.push(slotTime);
        }
      }

      if (slots.length === 0) {
        disabledDates.push(dateKey);
      } else {
        availability[dateKey] = slots;
      }

      cursor = addDays(cursor, 1);
    }

    return NextResponse.json({ availability, disabledDates });
  } catch (err) {
    console.error("[availability] error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
