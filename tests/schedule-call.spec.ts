import { test, expect, request as playwrightRequest, type APIRequestContext } from "@playwright/test";
import { format } from "date-fns";
import { loadEnvLocal } from "./helpers/env";

loadEnvLocal();

/**
 * End-to-end smoke test for the schedule-call flow — the highest-risk path
 * in this app (DB write + live Resend email on submit). It logs in as admin
 * to create a throwaway availability slot, books it through the real public
 * UI, then cleans up (rejects the request, deletes the slot).
 *
 * This hits real MongoDB + Resend using whatever is in .env.local, so it's
 * opt-in only: run with `RUN_LIVE_SMOKE_TEST=1 npx playwright test`.
 */
test.skip(
  process.env.RUN_LIVE_SMOKE_TEST !== "1",
  "Live smoke test — set RUN_LIVE_SMOKE_TEST=1 to run (writes to real DB, sends real email)"
);

const TEST_EMAIL = "playwright-smoke-test@example.com";
const TEST_NAME = "Playwright Smoke Test";

function tomorrowDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
}

async function loginAsAdmin(api: APIRequestContext) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local to run the live smoke test"
    );
  }
  const res = await api.post("/api/auth/login", { data: { email, password } });
  if (!res.ok()) {
    throw new Error(`Admin login failed: ${res.status()} ${await res.text()}`);
  }
}

test("visitor can request a call and it shows up for admin approval", async ({ page, baseURL }) => {
  test.setTimeout(60_000);
  const api = await playwrightRequest.newContext({ baseURL });
  await loginAsAdmin(api);

  const dateObj = tomorrowDate();
  const date = format(dateObj, "yyyy-MM-dd");

  // Idempotent setup: a prior run that crashed/timed out before its cleanup
  // ran can leave a same-day slot behind, which would 409 on create below.
  const existingRes = await api.get("/api/schedule/slots");
  const { slots: existingSlots } = await existingRes.json();
  for (const s of existingSlots as { _id: string; date: string; startTime: string }[]) {
    if (s.date === date && s.startTime === "09:00") {
      await api.delete(`/api/schedule/slots?id=${s._id}`);
    }
  }

  // Create a throwaway availability window for tomorrow.
  const slotRes = await api.post("/api/schedule/slots", {
    data: { date, startTime: "09:00", endTime: "17:00" },
  });
  expect(slotRes.ok(), await slotRes.text()).toBeTruthy();
  const { slot } = await slotRes.json();

  try {
    // ── Public booking flow, driven through the real UI ──
    await page.goto("/");
    await page.getByRole("button", { name: /schedule a call/i }).first().click();

    // react-day-picker's day buttons use the full spoken date as their
    // accessible name (e.g. "Friday, July 3rd, 2026"), not the bare day number.
    const dayAriaLabel = format(dateObj, "EEEE, MMMM do, yyyy");
    await page.getByRole("button", { name: dayAriaLabel, exact: true }).click();

    // Availability window auto-selects when there's only one; otherwise pick it.
    const windowButton = page.getByRole("button", { name: /available/i }).first();
    if (await windowButton.isVisible().catch(() => false)) {
      await windowButton.click();
    }

    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel("name").fill(TEST_NAME);
    await page.getByLabel("email").fill(TEST_EMAIL);
    await page.getByRole("button", { name: /request call/i }).click();

    await expect(page.getByText(/request queued/i)).toBeVisible({ timeout: 15_000 });

    // ── Verify it landed in the admin queue ──
    const requestsRes = await api.get("/api/schedule/requests");
    expect(requestsRes.ok()).toBeTruthy();
    const { requests } = await requestsRes.json();
    const created = requests.find(
      (r: { email: string; date: string }) => r.email === TEST_EMAIL && r.date === date
    );
    expect(created, "booked request should appear in the admin queue").toBeTruthy();

    // ── Cleanup: reject the test request so it doesn't linger as "pending" ──
    if (created) {
      const rejectRes = await api.post(`/api/schedule/reject/${created._id}`);
      expect(rejectRes.ok()).toBeTruthy();
    }
  } finally {
    // Always clean up the throwaway slot, even if an assertion above failed.
    await api.delete(`/api/schedule/slots?id=${slot._id}`);
    await api.dispose();
  }
});
