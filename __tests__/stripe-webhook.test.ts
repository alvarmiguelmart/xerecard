import { beforeEach, describe, expect, it, vi } from "vitest";

const constructEvent = vi.fn();
const subscriptionRetrieve = vi.fn();
const userFindUnique = vi.fn();
const userFindFirst = vi.fn();
const userUpdate = vi.fn();
const createNotification = vi.fn();

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    webhooks: {
      constructEvent
    },
    subscriptions: {
      retrieve: subscriptionRetrieve
    }
  })
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: userFindUnique,
      findFirst: userFindFirst,
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
    subscriptionRetrieve.mockReset();
    userFindUnique.mockReset();
    userFindFirst.mockReset();
    userUpdate.mockReset();
    createNotification.mockReset();
  });

  it("updates the user plan for completed checkout sessions", async () => {
    userFindUnique.mockResolvedValue({ id: "user-1", plan: "FREE", stripeCustomerId: "cus_123" });
    subscriptionRetrieve.mockResolvedValue({ status: "active" });
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
        stripeSubscriptionId: "sub_123",
        stripeSubscriptionStatus: "active"
      })
    });
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientId: "user-1",
        type: "SUBSCRIPTION"
      })
    );
  });

  it("activates access when a subscription starts in trial", async () => {
    userFindUnique.mockResolvedValue({ id: "user-1", plan: "FREE", stripeCustomerId: "cus_123" });
    subscriptionRetrieve.mockResolvedValue({ status: "trialing" });
    constructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          mode: "subscription",
          payment_status: "no_payment_required",
          customer: "cus_123",
          subscription: "sub_trial",
          metadata: {
            userId: "user-1",
            plan: "ESSENTIAL"
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
        plan: "ESSENTIAL",
        stripeSubscriptionId: "sub_trial",
        stripeSubscriptionStatus: "trialing"
      })
    });
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Teste grátis ativado"
      })
    );
  });

  it("activates Pix access after async payment succeeds", async () => {
    userFindUnique.mockResolvedValue({ id: "user-1", plan: "FREE", stripeCustomerId: "cus_123" });
    constructEvent.mockReturnValue({
      type: "checkout.session.async_payment_succeeded",
      data: {
        object: {
          mode: "payment",
          payment_status: "paid",
          customer: "cus_123",
          subscription: null,
          metadata: {
            userId: "user-1",
            plan: "ESSENTIAL"
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
        plan: "ESSENTIAL",
        planExpiresAt: expect.any(Date),
        stripeCustomerId: "cus_123",
        stripeSubscriptionId: null
      })
    });
  });

  it("pauses access when subscription becomes past due", async () => {
    userFindUnique.mockResolvedValue(null);
    userFindFirst.mockResolvedValue({ id: "user-1", plan: "ESSENTIAL", stripeCustomerId: "cus_123" });
    constructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_123",
          status: "past_due",
          customer: "cus_123",
          metadata: {
            userId: null,
            plan: "ESSENTIAL"
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
        plan: "FREE",
        stripeSubscriptionId: "sub_123",
        stripeSubscriptionStatus: "past_due"
      })
    });
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Assinatura pausada"
      })
    );
  });

  it("ignores checkout sessions with mismatched customer", async () => {
    userFindUnique.mockResolvedValue({ id: "user-1", plan: "FREE", stripeCustomerId: "cus_real" });
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
