import { describe, expect, it } from "vitest";
import { hasActiveContactAccess } from "@/lib/billing";

const now = new Date("2026-04-29T12:00:00.000Z");

describe("hasActiveContactAccess", () => {
  it("denies free users", () => {
    expect(hasActiveContactAccess({ plan: "FREE" }, now)).toBe(false);
  });

  it("allows active card subscriptions", () => {
    expect(
      hasActiveContactAccess(
        {
          plan: "ESSENTIAL",
          planExpiresAt: null,
          stripeSubscriptionId: "sub_123",
          stripeSubscriptionStatus: "trialing"
        },
        now
      )
    ).toBe(true);
  });

  it("denies failed card subscriptions", () => {
    expect(
      hasActiveContactAccess(
        {
          plan: "PROFESSIONAL",
          planExpiresAt: null,
          stripeSubscriptionId: "sub_123",
          stripeSubscriptionStatus: "past_due"
        },
        now
      )
    ).toBe(false);
  });

  it("allows unexpired Pix access and denies expired Pix access", () => {
    expect(
      hasActiveContactAccess(
        {
          plan: "ESSENTIAL",
          planExpiresAt: new Date("2026-05-29T12:00:00.000Z")
        },
        now
      )
    ).toBe(true);

    expect(
      hasActiveContactAccess(
        {
          plan: "ESSENTIAL",
          planExpiresAt: new Date("2026-04-01T12:00:00.000Z")
        },
        now
      )
    ).toBe(false);
  });
});
