import { beforeEach, describe, expect, it, vi } from "vitest";

const constructEvent = vi.fn();
const userFindUnique = vi.fn();
const userUpdate = vi.fn();
const createNotification = vi.fn();

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    webhooks: {
      constructEvent
    }
  })
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: userFindUnique,
      update: userUpdate
    }
  }
}));

vi.mock("@/lib/marketplace-db", () => ({
  createNotification
}));

describe("Stripe webhook", () => {
  beforeEach(() => {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    constructEvent.mockReset();
    userFindUnique.mockReset();
    userUpdate.mockReset();
    createNotification.mockReset();
  });

  it("updates the user plan for completed checkout sessions", async () => {
    userFindUnique.mockResolvedValue({ stripeCustomerId: "cus_123" });
    constructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          mode: "subscription",
          payment_status: "paid",
          customer: "cus_123",
          subscription: "sub_123",
          metadata: {
            userId: "user-1",
            plan: "PROFESSIONAL"
          }
        }
      }
    });
    const { POST } = await import("@/app/api/stripe/webhook/route");

    const response = await POST(new Request("http://test.local/api/stripe/webhook", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "{}"
    }));

    expect(response.status).toBe(200);
    expect(userUpdate).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: expect.objectContaining({
        plan: "PROFESSIONAL",
        stripeCustomerId: "cus_123",
        stripeSubscriptionId: "sub_123"
      })
    });
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientId: "user-1",
        type: "SUBSCRIPTION"
      })
    );
  });

  it("ignores checkout sessions with mismatched customer", async () => {
    userFindUnique.mockResolvedValue({ stripeCustomerId: "cus_real" });
    constructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          mode: "subscription",
          payment_status: "paid",
          customer: "cus_other",
          subscription: "sub_123",
          metadata: {
            userId: "user-1",
            plan: "PROFESSIONAL"
          }
        }
      }
    });
    const { POST } = await import("@/app/api/stripe/webhook/route");

    const response = await POST(new Request("http://test.local/api/stripe/webhook", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "{}"
    }));

    expect(response.status).toBe(200);
    expect(userUpdate).not.toHaveBeenCalled();
    expect(createNotification).not.toHaveBeenCalled();
  });
});
